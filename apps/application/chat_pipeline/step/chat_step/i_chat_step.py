# coding=utf-8
"""
    @project: maxkb
    @Author: Tiger
    @file: i_chat_step.py
    @date：2024/1/9 18:17
    @desc: Conversation
"""
from abc import abstractmethod
from typing import Type, List

from django.utils.translation import gettext_lazy as _
from langchain.chat_models.base import BaseChatModel
from langchain_core.messages import BaseMessage
from rest_framework import serializers

from application.chat_pipeline.I_base_chat_pipeline import IBaseChatPipelineStep, ParagraphPipelineModel
from application.chat_pipeline.pipeline_manage import PipelineManage
from application.serializers.application import NoReferencesSetting
from common.field.common import InstanceField


class ModelField(serializers.Field):
    def to_internal_value(self, data):
        if not isinstance(data, BaseChatModel):
            self.fail(_('Model type error'), value=data)
        return data

    def to_representation(self, value):
        return value


class MessageField(serializers.Field):
    def to_internal_value(self, data):
        if not isinstance(data, BaseMessage):
            self.fail(_('Message type error'), value=data)
        return data

    def to_representation(self, value):
        return value


class PostResponseHandler:
    @abstractmethod
    def handler(self, chat_id, chat_record_id, paragraph_list: List[ParagraphPipelineModel], problem_text: str,
                answer_text,
                manage, step, padding_problem_text: str = None, **kwargs):
        pass


class IChatStep(IBaseChatPipelineStep):
    class InstanceSerializer(serializers.Serializer):
        # ConversationList
        message_list = serializers.ListField(required=True, child=MessageField(required=True),
                                             label=_("Conversation list"))
        model_id = serializers.UUIDField(required=False, allow_null=True, label=_("Model id"))
        # ParagraphList
        paragraph_list = serializers.ListField(label=_("Paragraph List"))
        # Conversationid
        chat_id = serializers.UUIDField(required=True, label=_("Conversation ID"))
        # UserQuestion
        problem_text = serializers.CharField(required=True, label=_("User Questions"))
        # PostProcess器
        post_response_handler = InstanceField(model_type=PostResponseHandler,
                                              label=_("Post-processor"))
        # CompletionQuestion
        padding_problem_text = serializers.CharField(required=False,
                                                     label=_("Completion Question"))
        # WhetherUse流的形式Output
        stream = serializers.BooleanField(required=False, label=_("Streaming Output"))
        chat_user_id = serializers.CharField(required=True, label=_("Chat user id"))
        chat_record_id = serializers.CharField(required=False, label=_("Chat record id"))

        chat_user_type = serializers.CharField(required=True, label=_("Chat user Type"))
        # 未Query到ReferenceSegment
        no_references_setting = NoReferencesSetting(required=True,
                                                    label=_("No reference segment settings"))

        workspace_id = serializers.CharField(required=True, label=_("Workspace ID"))

        model_setting = serializers.DictField(required=True, allow_null=True,
                                              label=_("Model settings"))

        model_params_setting = serializers.DictField(required=False, allow_null=True,
                                                     label=_("Model parameter settings"))
        mcp_tool_ids = serializers.JSONField(label="MCPToolIDList", required=False, default=list)
        mcp_servers = serializers.JSONField(label="MCPServiceList", required=False, default=dict)
        mcp_source = serializers.CharField(label="MCP Source", required=False, default="referencing")
        tool_ids = serializers.JSONField(label="ToolIDList", required=False, default=list)
        application_ids = serializers.JSONField(label="ApplicationIDList", required=False, default=list)
        skill_tool_ids = serializers.JSONField(label="SkillsIDList", required=False, default=list)
        mcp_output_enable = serializers.BooleanField(label="MCPOutputIs enabled", required=False, default=True)

        def is_valid(self, *, raise_exception=False):
            super().is_valid(raise_exception=True)
            message_list: List = self.initial_data.get('message_list')
            for message in message_list:
                if not isinstance(message, BaseMessage):
                    raise Exception(_("message type error"))

    def get_step_serializer(self, manage: PipelineManage) -> Type[serializers.Serializer]:
        return self.InstanceSerializer

    def _run(self, manage: PipelineManage):
        chat_result = self.execute(**self.context['step_args'], manage=manage)
        manage.context['chat_result'] = chat_result

    @abstractmethod
    def execute(self, message_list: List[BaseMessage],
                chat_id, problem_text,
                post_response_handler: PostResponseHandler,
                model_id: str = None,
                workspace_id: str = None,
                paragraph_list=None,
                manage: PipelineManage = None,
                padding_problem_text: str = None, stream: bool = True, chat_user_id=None, chat_user_type=None,
                no_references_setting=None, model_params_setting=None, model_setting=None,
                mcp_tool_ids=None, mcp_servers='', mcp_source="referencing",
                tool_ids=None, application_ids=None, skill_tool_ids=None, mcp_output_enable=True,
                **kwargs):
        pass
