# coding=utf-8
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter

from common.mixins.api_mixin import APIMixin
from common.result import ResultSerializer, DefaultResultSerializer
from folders.models.folder import FolderCreateRequest, FolderEditRequest
from folders.serializers.folder import FolderSerializer


class FolderCreateResponse(ResultSerializer):
    def get_data(self):
        return FolderSerializer()


class FolderCreateAPI(APIMixin):
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
                description="Menu",
                type=OpenApiTypes.STR,
                enum=["APPLICATION", "KNOWLEDGE", "TOOL"],
                location='path',
                required=True,
            )
        ]

    @staticmethod
    def get_request():
        return FolderCreateRequest

    @staticmethod
    def get_response():
        return FolderCreateResponse


class FolderReadAPI(APIMixin):
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
                description="Menu",
                type=OpenApiTypes.STR,
                enum=["APPLICATION", "KNOWLEDGE", "TOOL"],
                location='path',
                required=True,
            ),
            OpenApiParameter(
                name="folder_id",
                description="Folderid",
                type=OpenApiTypes.STR,
                location='path',
                required=True,
            )
        ]

    @staticmethod
    def get_response():
        return FolderCreateResponse


class FolderEditAPI(FolderReadAPI):

    @staticmethod
    def get_request():
        return FolderEditRequest


class FolderDeleteAPI(FolderReadAPI):
    @staticmethod
    def get_response():
        return DefaultResultSerializer


class FolderTreeReadAPI(APIMixin):
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
                description="Menu",
                type=OpenApiTypes.STR,
                enum=["APPLICATION", "KNOWLEDGE", "TOOL"],
                location='path',
                required=True,
            ),
            OpenApiParameter(
                name="name",
                description="Name",
                type=OpenApiTypes.STR,
                location='query',
                required=False,
            ),
        ]
