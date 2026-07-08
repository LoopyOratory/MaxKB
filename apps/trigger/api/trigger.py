# coding=utf-8
"""
    @project: MaxKB
    @Author: Niu
    @file: trigger.py
    @date：2026/1/14 15:49
    @desc:
"""
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from common.mixins.api_mixin import APIMixin
from common.result import ResultSerializer
from knowledge.serializers.common import BatchSerializer
from trigger.serializers.task_source_trigger import TaskSourceTriggerEditRequest
from trigger.serializers.trigger import TriggerCreateRequest, TriggerResponse, BatchActiveSerializer


class TriggerQueryResponseSerializer(serializers.Serializer):
    id = serializers.UUIDField(required=True, help_text="Triggerid", label='Triggerid')
    workspace_id = serializers.CharField(required=True, help_text="TriggerWorkspace", label='TriggerWorkspace')
    name = serializers.CharField(required=True, help_text="TriggerName", label='TriggerName')
    desc = serializers.CharField(required=True, help_text="TriggerDescription", label="TriggerDescription")
    trigger_type = serializers.CharField(required=True, help_text="TriggerType", label="TriggerType")
    type = serializers.CharField(required=True, help_text="Resource type", label="Resource type")
    is_active = serializers.BooleanField(required=True, help_text="Whether激活", label="Whether激活")
    source_name = serializers.CharField(required=True, help_text="Resource type", label="Resource type")
    source_icon = serializers.CharField(required=True, help_text="ResourceIcon", label="ResourceIcon")
    create_time = serializers.CharField(required=True, help_text="Creation time", label="Creation time")
    update_time = serializers.CharField(required=True, help_text="ModificationTime", label="ModificationTime")


class TriggerTaskRecordResponse(ResultSerializer):
    def get_data(self):
        return TriggerQueryResponseSerializer(many=True)


class TriggerQueryAPI(APIMixin):
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
                name="name",
                description="TriggerName",
                type=OpenApiTypes.STR,
                required=True,
            ),
            OpenApiParameter(
                name="type",
                description="TriggerType",
                type=OpenApiTypes.STR,
                required=True,
            ),
            OpenApiParameter(
                name="task",
                description="TaskName",
                type=OpenApiTypes.STR,
                required=True,
            ),
            OpenApiParameter(
                name="is_active",
                description="EnableStatus",
                type=OpenApiTypes.STR,
                required=True,
            ),
            OpenApiParameter(
                name="create_user",
                description="Creation者",
                type=OpenApiTypes.STR,
                required=True,
            ),
        ]

    @staticmethod
    def get_response():
        return TriggerTaskRecordResponse


class TriggerQueryPageAPI(APIMixin):
    @staticmethod
    def get_parameters():
        return [TriggerQueryAPI.get_parameters(),
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
                )]

    @staticmethod
    def get_response():
        return TriggerQueryAPI.get_response()


class TriggerCreateAPI(APIMixin):
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
        ]

    @staticmethod
    def get_request():
        return TriggerCreateRequest

    @staticmethod
    def get_response():
        return TriggerResponse


class TaskSourceTriggerCreateAPI(APIMixin):
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
                name="source_id",
                description="Resourceid",
                type=OpenApiTypes.STR,
                location='path',
                required=True,
            ),
            OpenApiParameter(
                name="source_type",
                description="Resource type",
                type=OpenApiTypes.STR,
                location='path',
                required=True,
            ),
        ]

    @staticmethod
    def get_request():
        return TriggerCreateRequest

    @staticmethod
    def get_response():
        return TriggerResponse


class TriggerBatchDeleteAPI(APIMixin):
    @staticmethod
    def get_parameters():
        return [
            OpenApiParameter(
                name="workspace_id",
                description="Workspace id",
                type=OpenApiTypes.STR,
                location='path',
                required=True,
            )
        ]

    @staticmethod
    def get_request():
        return BatchSerializer


class TriggerBatchActiveAPI(APIMixin):
    @staticmethod
    def get_request():
        return BatchActiveSerializer


class TriggerOperateAPI(APIMixin):
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
    def get_request():
        return TriggerCreateRequest

    @staticmethod
    def get_response():
        return TriggerResponse


class RequestSE(serializers.Serializer):
    pass


class TriggerEditAPI(APIMixin):
    @staticmethod
    def get_request():
        return TriggerCreateRequest


class TaskSourceTriggerAPI(APIMixin):
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
                name="source_id",
                description="Resourceid",
                type=OpenApiTypes.STR,
                location='path',
                required=True,
            ),
            OpenApiParameter(
                name="source_type",
                description="Resource type",
                type=OpenApiTypes.STR,
                location='path',
                required=True,
            ),
        ]

    @staticmethod
    def get_response():
        return TriggerResponse


class TaskSourceTriggerOperateAPI(APIMixin):
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
                name="source_id",
                description="Resourceid",
                type=OpenApiTypes.STR,
                location='path',
                required=True,
            ),
            OpenApiParameter(
                name="source_type",
                description="Resource type",
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
    def get_request():
        return TaskSourceTriggerEditRequest
