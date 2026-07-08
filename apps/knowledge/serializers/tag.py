# coding=utf-8
"""
    @project: maxkb
    @Author：AI Assistant
    @file: tag.py
    @date：2025/10/13
    @desc: TagSystemRelated序列化器
"""
from collections import defaultdict
from typing import Dict

import uuid_utils.compat as uuid
from django.db import transaction
from django.db.models import QuerySet
from django.db.models.aggregates import Count
from django.db.models.query_utils import Q
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from common.exception.app_exception import AppApiException
from knowledge.models import Tag, Knowledge, DocumentTag


class TagModelSerializer(serializers.ModelSerializer):
    """TagModel序列化器"""

    class Meta:
        model = Tag
        fields = ['id', 'knowledge_id', 'key', 'value', 'create_time', 'update_time']
        read_only_fields = ['id', 'create_time', 'update_time']


class TagCreateSerializer(serializers.Serializer):
    """CreationTag序列化器"""
    key = serializers.CharField(required=True, max_length=64, label=_('Tag Key'))
    value = serializers.CharField(required=True, max_length=128, label=_('Tag Value'))


class TagEditSerializer(serializers.Serializer):
    key = serializers.CharField(required=False, max_length=64, label=_('Tag Key'))
    value = serializers.CharField(required=False, max_length=128, label=_('Tag Value'))


class TagSerializers(serializers.Serializer):
    class Create(serializers.Serializer):
        workspace_id = serializers.CharField(required=True, label=_('Workspace ID'))
        knowledge_id = serializers.UUIDField(required=True, label=_('Knowledge ID'))
        tags = serializers.ListField(required=True, label=_('Tags'), child=TagCreateSerializer())

        def is_valid(self, *, raise_exception=False):
            super().is_valid(raise_exception=True)
            workspace_id = self.data.get('workspace_id')
            query_set = QuerySet(Knowledge).filter(id=self.data.get('knowledge_id'))
            if workspace_id and workspace_id != 'None':
                query_set = query_set.filter(workspace_id=workspace_id)
            if not query_set.exists():
                raise AppApiException(500, _('Knowledge id does not exist'))

        def insert(self):
            self.is_valid(raise_exception=True)

            knowledge_id = self.data.get('knowledge_id')

            # GetData库中已Existingkey-valueCombine
            existing_tags = set(
                QuerySet(Tag).filter(knowledge_id=knowledge_id)
                .values_list('key', 'value', named=False)
            )

            # Filter掉已ExistingTag
            tag_objects = []
            for tag_data in self.data.get('tags', []):
                key = tag_data.get('key')
                value = tag_data.get('value')

                # Checkkey-valueCombineWhether已Exists
                if (key, value) not in existing_tags:
                    tag = Tag(
                        id=uuid.uuid7(),
                        knowledge_id=knowledge_id,
                        key=key,
                        value=value
                    )
                    tag_objects.append(tag)
                    # 将新TagAdd到已Exists集合中，避免本次BatchInsert in 重复
                    existing_tags.add((key, value))

            # BatchInsert未重复的Tag
            if tag_objects:
                Tag.objects.bulk_create(tag_objects)

    class Operate(serializers.Serializer):
        workspace_id = serializers.CharField(required=True, label=_('Workspace ID'))
        knowledge_id = serializers.UUIDField(required=True, label=_('Knowledge ID'))
        tag_id = serializers.UUIDField(required=True, label=_('Tag ID'))

        def is_valid(self, *, raise_exception=False):
            super().is_valid(raise_exception=True)
            workspace_id = self.data.get('workspace_id')
            query_set = QuerySet(Knowledge).filter(id=self.data.get('knowledge_id'))
            if workspace_id and workspace_id != 'None':
                query_set = query_set.filter(workspace_id=workspace_id)
            if not query_set.exists():
                raise AppApiException(500, _('Knowledge id does not exist'))

        @transaction.atomic
        def edit(self, instance: Dict):
            self.is_valid(raise_exception=True)
            tag = QuerySet(Tag).get(id=self.data.get('tag_id'))
            if tag is None:
                raise AppApiException(500, _('Tag id does not exist'))

            # Ifkey发生变化，UpdateAllSamekey的Tag
            if instance.get('key') and instance.get('key') != tag.key:
                old_key = tag.key
                new_key = instance.get('key')

                # Check新keyWhether已Exists于同Oneknowledge中
                existing_key_exists = QuerySet(Tag).filter(
                    knowledge_id=tag.knowledge_id,
                    key=new_key
                ).exists()

                if existing_key_exists:
                    raise AppApiException(500, _('Tag key already exists'))

                # BatchUpdateAll具有Sameold_key的Tag
                QuerySet(Tag).filter(
                    knowledge_id=tag.knowledge_id,
                    key=old_key
                ).update(key=new_key)

            # If只是value变化，只UpdateCurrentTag
            if instance.get('value') and instance.get('value') != tag.value:
                # Check新keyWhether已Exists于同Oneknowledge中
                existing_value_exists = QuerySet(Tag).filter(
                    knowledge_id=tag.knowledge_id,
                    key=instance.get('key'),
                    value=instance.get('value')
                ).exists()

                if existing_value_exists:
                    raise AppApiException(500, _('Tag value already exists'))
                QuerySet(Tag).filter(
                    id=tag.id
                ).update(value=instance.get('value'))

        @transaction.atomic
        def delete(self, delete_type: str):
            self.is_valid(raise_exception=True)
            if delete_type == 'key':
                # Deletion同一knowledge_id下Samekey的AllTag
                tag = QuerySet(Tag).get(id=self.data.get('tag_id'))
                if tag is None:
                    raise AppApiException(500, _('Tag id does not exist'))
                QuerySet(Tag).filter(
                    knowledge_id=tag.knowledge_id,
                    key=tag.key
                ).delete()
                QuerySet(DocumentTag).filter(tag_id=tag.id).delete()
            else:
                # 仅DeletionCurrentTag
                QuerySet(Tag).filter(id=self.data.get('tag_id')).delete()
                QuerySet(DocumentTag).filter(tag_id=self.data.get('tag_id')).delete()

    class BatchDelete(serializers.Serializer):
        workspace_id = serializers.CharField(required=True, label=_('Workspace ID'))
        knowledge_id = serializers.UUIDField(required=True, label=_('Knowledge ID'))
        tag_ids = serializers.ListField(required=True, label=_('Tag IDs'), child=serializers.UUIDField())

        def is_valid(self, *, raise_exception=False):
            super().is_valid(raise_exception=True)
            workspace_id = self.data.get('workspace_id')
            query_set = QuerySet(Knowledge).filter(id=self.data.get('knowledge_id'))
            if workspace_id and workspace_id != 'None':
                query_set = query_set.filter(workspace_id=workspace_id)
            if not query_set.exists():
                raise AppApiException(500, _('Knowledge id does not exist'))

        @transaction.atomic
        def batch_delete(self):
            self.is_valid(raise_exception=True)
            tag_ids = self.data.get('tag_ids', [])
            if not tag_ids:
                return

            # Get要Deletion的Tag的key
            tags_to_delete = QuerySet(Tag).filter(id__in=tag_ids)
            keys_to_delete = set(tags_to_delete.values_list('key', flat=True))

            # Deletion具有Samekey的AllTag
            QuerySet(Tag).filter(
                knowledge_id=self.data.get('knowledge_id'),
                key__in=keys_to_delete
            ).delete()

            # DeletionAssociation的DocumentTag
            QuerySet(DocumentTag).filter(tag_id__in=tag_ids).delete()

    class Query(serializers.Serializer):
        workspace_id = serializers.CharField(required=True, label=_('Workspace ID'))
        knowledge_id = serializers.UUIDField(required=True, label=_('Knowledge ID'))
        name = serializers.CharField(required=False, allow_null=True, allow_blank=True, label=_('search value'))

        def is_valid(self, *, raise_exception=False):
            super().is_valid(raise_exception=True)
            workspace_id = self.data.get('workspace_id')
            query_set = QuerySet(Knowledge).filter(id=self.data.get('knowledge_id'))
            if workspace_id and workspace_id != 'None':
                query_set = query_set.filter(workspace_id=workspace_id)
            if not query_set.exists():
                raise AppApiException(500, _('Knowledge id does not exist'))

        def list(self):
            self.is_valid(raise_exception=True)
            if self.data.get('name'):
                name = self.data.get('name')
                tags = QuerySet(Tag).filter(
                    knowledge_id=self.data.get('knowledge_id')
                ).filter(
                    Q(key__icontains=name) | Q(value__icontains=name)
                ).values('key', 'value', 'id', 'create_time', 'update_time').order_by('create_time', 'key', 'value')
            else:
                # GetAllTag, byCreation timeSortMaintain stable order
                tags = QuerySet(Tag).filter(
                    knowledge_id=self.data.get('knowledge_id')
                ).values('key', 'value', 'id', 'create_time', 'update_time').order_by('create_time', 'key', 'value')

            tag_ids = [tag['id'] for tag in tags]

            tag_doc_count_map = {row['tag_id']: row['doc_count'] for row in
                                 QuerySet(DocumentTag).filter(tag_id__in=tag_ids)
                                 .values('tag_id').annotate(doc_count=Count('document_id'))
                                 }

            # 按keyGroup
            grouped_tags = defaultdict(list)
            for tag in tags:
                grouped_tags[tag['key']].append({
                    'id': tag['id'],
                    'value': tag['value'],
                    'doc_count': tag_doc_count_map.get(tag['id'],0),
                    'create_time': tag['create_time'],
                    'update_time': tag['update_time']
                })

            # Transform为期望的Format，保持key order
            result = []
            # 按keySort以EnsureResultConsistent order
            for key in sorted(grouped_tags.keys()):
                values = grouped_tags[key]
                # 按Creation time对valuesPerformSort
                values.sort(key=lambda x: x['create_time'])
                result.append({
                    'key': key,
                    'values': values,
                })

            return result
