# coding=utf-8
"""
    @project: maxkb
    @Author: Tiger
    @file: i_generate_human_message_step.py
    @date：2024/1/9 18:15
    @desc: GenerateConversationTemplate
"""
from abc import abstractmethod
from typing import Type, List

from django.utils.translation import gettext_lazy as _
from langchain_core.messages import BaseMessage
from rest_framework import serializers

from application.chat_pipeline.I_base_chat_pipeline import IBaseChatPipelineStep, ParagraphPipelineModel
from application.chat_pipeline.pipeline_manage import PipelineManage
from application.models import ChatRecord
from application.serializers.application import NoReferencesSetting
from common.field.common import InstanceField


class IGenerateHumanMessageStep(IBaseChatPipelineStep):
    class InstanceSerializer(serializers.Serializer):
        # Question
        problem_text = serializers.CharField(required=True, label=_("question"))
        # ParagraphList
        paragraph_list = serializers.ListField(child=InstanceField(model_type=ParagraphPipelineModel, required=True),
                                               label=_("Paragraph List"))
        # Conversation history
        history_chat_record = serializers.ListField(child=InstanceField(model_type=ChatRecord, required=True),
                                                    label=_("History Questions"))
        # 多轮ConversationCount
        dialogue_number = serializers.IntegerField(required=True, label=_("Number of multi-round conversations"))
        # Maximum携带Knowledge baseParagraphLength
        max_paragraph_char_number = serializers.IntegerField(required=True,
                                                             label=_("Maximum length of the knowledge base paragraph"))
        # Template
        prompt = serializers.CharField(required=True, label=_("Prompt word"))
        system = serializers.CharField(required=False, allow_null=True, allow_blank=True,
                                       label=_("System prompt words (role)"))
        # 补齐Question
        padding_problem_text = serializers.CharField(required=False,
                                                     label=_("Completion problem"))
        # 未Query到ReferenceSegment
        no_references_setting = NoReferencesSetting(required=True,
                                                    label=_("No reference segment settings"))

    def get_step_serializer(self, manage: PipelineManage) -> Type[serializers.Serializer]:
        return self.InstanceSerializer

    def _run(self, manage: PipelineManage):
        message_list = self.execute(**self.context['step_args'])
        manage.context['message_list'] = message_list

    @abstractmethod
    def execute(self,
                problem_text: str,
                paragraph_list: List[ParagraphPipelineModel],
                history_chat_record: List[ChatRecord],
                dialogue_number: int,
                max_paragraph_char_number: int,
                prompt: str,
                padding_problem_text: str = None,
                no_references_setting=None,
                system=None,
                **kwargs) -> List[BaseMessage]:
        """

        :param problem_text:               OriginalQuestionText
        :param paragraph_list:             ParagraphList
        :param history_chat_record:        HistoryConversationRecord
        :param dialogue_number:            多轮ConversationCount
        :param max_paragraph_char_number:  MaximumParagraphLength
        :param prompt:                     Template
        :param padding_problem_text        UserModificationText
        :param kwargs:                     OtherParameters
        :param no_references_setting:     无ReferenceSegmentSettings
        :param system                     SystemTip称
        :return:
        """
        pass
