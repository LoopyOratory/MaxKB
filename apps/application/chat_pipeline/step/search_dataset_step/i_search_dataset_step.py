# coding=utf-8
"""
    @project: maxkb
    @Author: Tiger
    @file: i_search_dataset_step.py
    @date：2024/1/9 18:10
    @desc: SearchKnowledge base
"""
import re
from abc import abstractmethod
from typing import List, Type

from django.core import validators
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from application.chat_pipeline.I_base_chat_pipeline import IBaseChatPipelineStep, ParagraphPipelineModel
from application.chat_pipeline.pipeline_manage import PipelineManage


class ISearchDatasetStep(IBaseChatPipelineStep):
    class InstanceSerializer(serializers.Serializer):
        # OriginalQuestionText
        problem_text = serializers.CharField(required=True, label=_("question"))
        # SystemCompletionQuestionText
        padding_problem_text = serializers.CharField(required=False,
                                                     label=_("System completes question text"))
        # NeedsQuery的DatasetidList
        knowledge_id_list = serializers.ListField(required=True, child=serializers.UUIDField(required=True),
                                                  label=_("Dataset id list"))
        # NeedsExcludedDocumentid
        exclude_document_id_list = serializers.ListField(required=True, child=serializers.UUIDField(required=True),
                                                         label=_("List of document ids to exclude"))
        # NeedsExcludeVectorid
        exclude_paragraph_id_list = serializers.ListField(required=True, child=serializers.UUIDField(required=True),
                                                          label=_("List of exclusion vector ids"))
        # NeedsQueryCount of
        top_n = serializers.IntegerField(required=True,
                                         label=_("Reference segment number"))
        # Similarity 0-1Between
        similarity = serializers.FloatField(required=True, max_value=1, min_value=0,
                                            label=_("Similarity"))
        search_mode = serializers.CharField(required=True, validators=[
            validators.RegexValidator(regex=re.compile("^embedding|keywords|blend$"),
                                      message=_("The type only supports embedding|keywords|blend"), code=500)
        ], label=_("Retrieval Mode"))
        workspace_id = serializers.CharField(required=True, label=_("Workspace ID"))

    def get_step_serializer(self, manage: PipelineManage) -> Type[InstanceSerializer]:
        return self.InstanceSerializer

    def _run(self, manage: PipelineManage):
        paragraph_list = self.execute(**self.context['step_args'], manage=manage)
        manage.context['paragraph_list'] = paragraph_list
        self.context['paragraph_list'] = paragraph_list

    @abstractmethod
    def execute(self, problem_text: str, knowledge_id_list: list[str], exclude_document_id_list: list[str],
                exclude_paragraph_id_list: list[str], top_n: int, similarity: float, padding_problem_text: str = None,
                search_mode: str = None,
                workspace_id=None,
                manage: PipelineManage = None,
                **kwargs) -> List[ParagraphPipelineModel]:
        """
        关于 User和CompletionQuestion 说明: CompletionQuestionIf有就UseCompletionQuestion去Query 反之就用UserOriginalQuestionQuery
        :param similarity:                         Related性
        :param top_n:                              Query多少条
        :param problem_text:                       UserQuestion
        :param knowledge_id_list:                  NeedsQuery的DatasetidList
        :param exclude_document_id_list:           NeedsExcludedDocumentid
        :param exclude_paragraph_id_list:          NeedsExcludeParagraphid
        :param padding_problem_text                CompletionQuestion
        :param search_mode                         SearchMode
        :param workspace_id                        Workspace id
        :return: ParagraphList
        """
        pass
