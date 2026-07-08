from django.utils.translation import gettext_lazy as _
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter
from rest_framework import serializers

from common.mixins.api_mixin import APIMixin
from common.result import DefaultResultSerializer
from knowledge.serializers.problem import BatchAssociation, ProblemEditSerializer


class ProblemReadAPI(APIMixin):
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
                name="knowledge_id",
                description="Knowledge baseid",
                type=OpenApiTypes.STR,
                location='path',
                required=True,
            ),
        ]

    @staticmethod
    def get_response():
        return DefaultResultSerializer


class ProblemBatchCreateAPI(ProblemReadAPI):
    @staticmethod
    def get_request():
        return serializers.ListField(required=True, label=_('problem list'),
                                     child=serializers.UUIDField(required=True, label=_('problem')))


class BatchAssociationAPI(ProblemReadAPI):
    @staticmethod
    def get_request():
        return BatchAssociation


class BatchDeleteAPI(ProblemReadAPI):
    @staticmethod
    def get_request():
        return serializers.ListField(required=True, label=_('problem list'),
                                     child=serializers.UUIDField(required=True, label=_('problem')))


class ProblemPageAPI(APIMixin):
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
                name="knowledge_id",
                description="Knowledge baseid",
                type=OpenApiTypes.STR,
                location='path',
                required=True,
            ),
            OpenApiParameter(
                name="current_page",
                description="CurrentPage number",
                type=OpenApiTypes.INT,
                location='path',
                required=True,
            ),
            OpenApiParameter(
                name="page_size",
                description="Per page count",
                type=OpenApiTypes.INT,
                location='path',
                required=True,
            ),
        ]

    @staticmethod
    def get_response():
        return DefaultResultSerializer


class ProblemDeleteAPI(APIMixin):
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
                name="knowledge_id",
                description="Knowledge baseid",
                type=OpenApiTypes.STR,
                location='path',
                required=True,
            ),
            OpenApiParameter(
                name="problem_id",
                description="Questionid",
                type=OpenApiTypes.STR,
                location='path',
                required=True,
            )
        ]

    @staticmethod
    def get_response():
        return DefaultResultSerializer


class ProblemEditAPI(ProblemDeleteAPI):
    @staticmethod
    def get_request():
        return ProblemEditSerializer


class ProblemParagraphAPI(ProblemDeleteAPI):
    pass
