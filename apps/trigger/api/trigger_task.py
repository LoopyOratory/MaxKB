# coding=utf-8
"""
    @project: MaxKB
    @Author: Tiger
    @file: trigger_task.py
    @date：2026/1/28 16:37
    @desc:
"""
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from common.mixins.api_mixin import APIMixin
from common.result import ResultSerializer
from trigger.serializers.trigger_task import ChatRecordSerializerModel, TriggerTaskResponse


class TriggerTaskRecordResultSerializer(serializers.Serializer):
    id = serializers.UUIDField(required=True, help_text="TaskRecordid", label='TaskRecordid')
    state = serializers.CharField(required=True, help_text="TaskRecordStatus", label='TaskRecordStatus')
    source_type = serializers.CharField(required=True, help_text="Resource type", label='Resource type')
    source_name = serializers.CharField(required=True, help_text="ResourceName", label="ResourceName")
    source_id = serializers.CharField(required=True, help_text="Resourceid", label="Resourceid")
    task_record_id = serializers.CharField(required=True, help_text="ResourceTaskRecordid", label="ResourceTaskRecordid")
    trigger_id = serializers.CharField(required=True, help_text="Triggerid", label="Triggerid")
    type = serializers.CharField(required=True, help_text="Resource type", label="Resource type")
    create_time = serializers.CharField(required=True, help_text="Creation time", label="Creation time")
    update_time = serializers.CharField(required=True, help_text="ModificationTime", label="ModificationTime")


class TriggerTaskRecordResponse(ResultSerializer):
    def get_data(self):
        return TriggerTaskRecordResultSerializer(many=True)


class TriggerTaskRecordExecutionDetailsResponse(ResultSerializer):
    def get_data(self):
        return ChatRecordSerializerModel()


class TriggerTaskResultSerializer(ResultSerializer):
    def get_data(self):
        return TriggerTaskResponse(many=True)


class TriggerTaskAPI(APIMixin):
    @staticmethod
    def get_system_parameters():
        return [parameter for parameter in TriggerTaskRecordExecutionDetailsAPI.get_parameters() if
                not parameter.name == 'workspace_id']

    @staticmethod
    def get_parameters():
        return [
            OpenApiParameter(
                name="workspace_id",
                description="Workspace id",
                type=OpenApiTypes.STR,
                location='path',
                required=True,
            ),
            OpenApiParameter(
                name="trigger_id",
                description="Triggerid",
                type=OpenApiTypes.STR,
                location='path',
                required=True,
            ),
        ]

    @staticmethod
    def get_response():
        return TriggerTaskResultSerializer


class TriggerTaskRecordPageAPI(APIMixin):
    @staticmethod
    def get_system_parameters():
        return [parameter for parameter in TriggerTaskRecordExecutionDetailsAPI.get_parameters() if
                not parameter.name == 'workspace_id']

    @staticmethod
    def get_parameters():
        return [
            OpenApiParameter(
                name="workspace_id",
                description="Workspace id",
                type=OpenApiTypes.STR,
                location='path',
                required=True,
            ),
            OpenApiParameter(
                name="trigger_id",
                description="Triggerid",
                type=OpenApiTypes.STR,
                location='path',
                required=True,
            ),
            OpenApiParameter(
                name="current_page",
                description=_("Current page"),
                type=OpenApiTypes.INT,
                location='path',
                required=True,
            ),
            OpenApiParameter(
                name="page_size",
                description=_("Page size"),
                type=OpenApiTypes.INT,
                location='path',
                required=True,
            ),
            OpenApiParameter(
                name="name",
                description="TaskName",
                type=OpenApiTypes.STR,
                location='query',
                required=True,
            ),
            OpenApiParameter(
                name="state",
                description="Status",
                type=OpenApiTypes.STR,
                location='query',
                required=True,
            ),
            OpenApiParameter(
                name="order",
                description="SortField",
                type=OpenApiTypes.STR,
                location='query',
                required=True,
            ),
        ]

    @staticmethod
    def get_response():
        return TriggerTaskRecordResponse


class TriggerTaskRecordExecutionDetailsAPI(APIMixin):
    @staticmethod
    def get_system_parameters():
        return [parameter for parameter in TriggerTaskRecordExecutionDetailsAPI.get_parameters() if
                not parameter.name == 'workspace_id']

    @staticmethod
    def get_parameters():
        return [
            OpenApiParameter(
                name="workspace_id",
                description="Workspace id",
                type=OpenApiTypes.STR,
                location='path',
                required=True,
            ),
            OpenApiParameter(
                name="trigger_id",
                description="Triggerid",
                type=OpenApiTypes.STR,
                location='path',
                required=True,
            ),
            OpenApiParameter(
                name="trigger_task_id",
                description="TriggerTaskid",
                type=OpenApiTypes.STR,
                location='path',
                required=True,
            ),
        ]

    @staticmethod
    def get_response():
        return TriggerTaskRecordExecutionDetailsResponse
