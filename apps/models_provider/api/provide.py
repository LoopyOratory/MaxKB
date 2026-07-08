# coding=utf-8
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter

from common.mixins.api_mixin import APIMixin
from common.result import ResultSerializer
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _


class ProvideResponse(ResultSerializer):
    def get_data(self):
        return ProvideSerializer()


class ProvideSerializer(serializers.Serializer):
    name = serializers.CharField(required=True, max_length=64, label=_("model name"))
    provider = serializers.CharField(required=True, label=_("provider"))
    icon = serializers.CharField(required=True, label=_("icon"))


class ProvideListSerializer(serializers.Serializer):
    key = serializers.CharField(required=True, max_length=64, label=_("model name"))
    value = serializers.CharField(required=True, label=_("value"))


class ModelListSerializer(serializers.Serializer):
    name = serializers.CharField(required=True, label=_("model name"))
    model_type = serializers.CharField(required=True, label=_("model type"))
    desc = serializers.CharField(required=True, label=_("model name"))


class ModelParamsFormSerializer(serializers.Serializer):
    input_type = serializers.CharField(required=False, label=_("input type"))
    label = serializers.CharField(required=False, label=_("label"))
    text_field = serializers.CharField(required=False, label=_("text field"))
    value_field = serializers.CharField(required=False, label=_("value field"))
    provider = serializers.CharField(required=False, label=_("provider"))
    method = serializers.CharField(required=False, label=_("method"))
    required = serializers.BooleanField(required=False, label=_("required"))
    default_value = serializers.CharField(required=False, label=_("default value"))
    relation_show_field_dict = serializers.DictField(required=False, label=_("relation show field dict"))
    relation_trigger_field_dict = serializers.DictField(required=False, label=_("relation trigger field dict"))
    trigger_type = serializers.CharField(required=False, label=_("trigger type"))
    attrs = serializers.DictField(required=False, label=_("attrs"))
    props_info = serializers.DictField(required=False, label=_("props info"))


class ModelParamsFormResponse(ResultSerializer):
    def get_data(self):
        return ModelParamsFormSerializer(many=True)


class ModelListResponse(ResultSerializer):
    def get_data(self):
        return ModelListSerializer(many=True)


class ProvideListResponse(ResultSerializer):
    def get_data(self):
        return ProvideListSerializer(many=True)


class ProvideApi(APIMixin):
    class ModelParamsForm(APIMixin):
        @staticmethod
        def get_query_params_api():
            return [OpenApiParameter(
                name="model_type",
                description=_("model type"),
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                required=True,
            ), OpenApiParameter(
                name="provider",
                description=_("provider"),
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                required=True,
            ), OpenApiParameter(
                name="model_name",
                description=_("model name"),
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                required=True,
            )
            ]

        @staticmethod
        def get_response():
            return ModelParamsFormResponse

    class ModelList(APIMixin):
        @staticmethod
        def get_query_params_api():
            return [OpenApiParameter(
                name="model_type",
                description=_("model type"),
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                required=True,
            ), OpenApiParameter(
                name="provider",
                description=_("provider"),
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                required=True,
            )
            ]

        @staticmethod
        def get_response():
            return ModelListResponse

    @staticmethod
    def get_response():
        return ProvideResponse

    class ModelTypeList(APIMixin):
        @staticmethod
        def get_query_params_api():
            return [OpenApiParameter(
                # Parameters的Name是done
                name="provider",
                # 对Parameters的Remark
                description=_("provider"),
                # SpecifyParameters的Type
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                # SpecifyMust给
                required=True,
            )]

        @staticmethod
        def get_response():
            return ProvideListResponse
