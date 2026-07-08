# coding=utf-8
"""
    @project: MaxKB
    @Author: Tiger
    @file: resource_mapping.py
    @date：2025/12/26 14:07
    @desc:
"""
from django.utils.translation import gettext_lazy as _
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter
from rest_framework import serializers

from common.mixins.api_mixin import APIMixin


class ResourceMappingResponse(serializers.Serializer):
    id = serializers.UUIDField(required=True, label="Primary keyid")
    target_id = serializers.CharField(required=True, label="被AssociationResourceName")
    target_type = serializers.CharField(required=True, label="被AssociationResource type")
    source_id = serializers.CharField(required=True, label="AssociationResourceId")
    source_type = serializers.CharField(required=True, label="AssociationResource type")
    name = serializers.CharField(required=True, label="Name")
    desc = serializers.CharField(required=False, label="Description")
    user_id = serializers.UUIDField(required=True, label="Primary keyid")


class ResourceMappingAPI(APIMixin):

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
                name="source",
                description="Resource type",
                type=OpenApiTypes.STR,
                location='path',
                required=True,
            ),
            OpenApiParameter(
                name="source_id",
                description="Resourceid",
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
                name="resource_name",
                description="Name",
                type=OpenApiTypes.STR,
                location='query',
                required=False
            ),

        ]

    @staticmethod
    def get_response():
        return ResourceMappingResponse(many=True)
