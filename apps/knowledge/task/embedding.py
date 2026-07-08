# coding=utf-8

import traceback
from typing import List

from celery_once import QueueOnce
from common.config.embedding_config import ModelManage
from common.event.listener_manage import (
    ListenerManagement,
    UpdateEmbeddingDocumentIdArgs,
    UpdateEmbeddingKnowledgeIdArgs,
    UpdateProblemArgs,
)
from common.utils.logger import maxkb_logger
from django.db.models import QuerySet
from django.utils.translation import gettext_lazy as _
from models_provider.models import Model
from models_provider.tools import get_model, get_model_default_params
from ops import celery_app

from knowledge.models import Document, State, TaskType
from knowledge.serializers.common import drop_knowledge_index


def get_embedding_model(
    model_id,
    exception_handler=lambda e: maxkb_logger.error(
        _("Failed to obtain vector model: {error} {traceback}").format(error=str(e), traceback=traceback.format_exc())
    ),
):
    try:
        model = QuerySet(Model).filter(id=model_id).first()

        default_params = get_model_default_params(model)

        embedding_model = ModelManage.get_model(model_id, lambda _id: get_model(model, **{**default_params}))
    except Exception as e:
        exception_handler(e)
        raise e
    return embedding_model


@celery_app.task(base=QueueOnce, once={"keys": ["paragraph_id"]}, name="celery:embedding_by_paragraph")
def embedding_by_paragraph(paragraph_id, model_id):
    embedding_model = get_embedding_model(model_id)
    ListenerManagement.embedding_by_paragraph(paragraph_id, embedding_model)


@celery_app.task(base=QueueOnce, once={"keys": ["paragraph_id_list"]}, name="celery:embedding_by_paragraph_data_list")
def embedding_by_paragraph_data_list(data_list, paragraph_id_list, model_id):
    embedding_model = get_embedding_model(model_id)
    ListenerManagement.embedding_by_paragraph_data_list(data_list, paragraph_id_list, embedding_model)


@celery_app.task(base=QueueOnce, once={"keys": ["paragraph_id_list"]}, name="celery:embedding_by_paragraph_list")
def embedding_by_paragraph_list(paragraph_id_list, model_id):
    embedding_model = get_embedding_model(model_id)
    ListenerManagement.embedding_by_paragraph_list(paragraph_id_list, embedding_model)


@celery_app.task(base=QueueOnce, once={"keys": ["document_id"]}, name="celery:embedding_by_document")
def embedding_by_document(document_id, model_id, state_list=None):
    """
    VectorizationDocument
    @param state_list:
    @param document_id: Documentid
    @param model_id VectorModel
    :return: None
    """

    if state_list is None:
        state_list = [
            State.PENDING.value,
            State.STARTED.value,
            State.SUCCESS.value,
            State.FAILURE.value,
            State.REVOKE.value,
            State.REVOKED.value,
            State.IGNORED.value,
        ]

    def exception_handler(e):
        ListenerManagement.update_status(QuerySet(Document).filter(id=document_id), TaskType.EMBEDDING, State.FAILURE)
        maxkb_logger.error(
            _("Failed to obtain vector model: {error} {traceback}").format(
                error=str(e), traceback=traceback.format_exc()
            )
        )

    embedding_model = get_embedding_model(model_id, exception_handler)
    #
    ListenerManagement.embedding_by_document(document_id, embedding_model, state_list)


@celery_app.task(name="celery:embedding_by_document_list")
def embedding_by_document_list(document_id_list, model_id):
    """
    VectorizationDocument
    @param document_id_list: DocumentidList
    @param model_id VectorModel
    :return: None
    """
    for document_id in document_id_list:
        embedding_by_document.delay(document_id, model_id)


@celery_app.task(base=QueueOnce, once={"keys": ["knowledge_id"]}, name="celery:embedding_by_knowledge")
def embedding_by_knowledge(knowledge_id, model_id):
    """
    VectorizationKnowledge base
    @param knowledge_id: Knowledge baseid
    @param model_id VectorModel
    :return: None
    """
    maxkb_logger.info(_("Start--->Vectorized knowledge: {knowledge_id}").format(knowledge_id=knowledge_id))
    try:
        ListenerManagement.delete_embedding_by_knowledge(knowledge_id)
        drop_knowledge_index(knowledge_id=knowledge_id)
        document_list = QuerySet(Document).filter(knowledge_id=knowledge_id)
        maxkb_logger.info(
            _("Knowledge documentation: {document_names}").format(
                document_names=", ".join([d.name for d in document_list])
            )
        )
        for document in document_list:
            try:
                embedding_by_document.delay(document.id, model_id)
            except Exception as e:
                pass
    except Exception as e:
        maxkb_logger.error(
            _("Vectorized knowledge: {knowledge_id} error {error} {traceback}").format(
                knowledge_id=knowledge_id, error=str(e), traceback=traceback.format_exc()
            )
        )
    finally:
        maxkb_logger.info(_("End--->Vectorized knowledge: {knowledge_id}").format(knowledge_id=knowledge_id))


def embedding_by_problem(args, model_id):
    """
    Vector话Question
    @param args:    QuestionObject
    @param model_id: Modelid
    @return:
    """
    embedding_model = get_embedding_model(model_id)
    ListenerManagement.embedding_by_problem(args, embedding_model)


def embedding_by_data_list(args: List, model_id):
    embedding_model = get_embedding_model(model_id)
    ListenerManagement.embedding_by_data_list(args, embedding_model)


@celery_app.task(base=QueueOnce, once={"keys": ["document_id"]}, name="celery:tokenize_by_document")
def tokenize_by_document(document_id, state_list):
    ListenerManagement.tokenize_by_document(document_id, state_list)


def delete_embedding_by_document(document_id):
    """
    DeletionSpecifyDocumentid的Vector
    @param document_id: Documentid
    @return: None
    """

    ListenerManagement.delete_embedding_by_document(document_id)


def delete_embedding_by_document_list(document_id_list: List[str]):
    """
    DeletionSpecifyDocumentList的VectorData
    @param document_id_list: DocumentidList
    @return: None
    """
    ListenerManagement.delete_embedding_by_document_list(document_id_list)


def delete_embedding_by_knowledge(knowledge_id):
    """
    DeletionSpecifyDatasetVectorData
    @param knowledge_id: Datasetid
    @return: None
    """
    ListenerManagement.delete_embedding_by_knowledge(knowledge_id)


def delete_embedding_by_paragraph(paragraph_id):
    """
    DeletionSpecifyParagraph的VectorData
    @param paragraph_id: Paragraphid
    @return: None
    """
    ListenerManagement.delete_embedding_by_paragraph(paragraph_id)


def delete_embedding_by_source(source_id):
    """
    DeletionSpecifyResourceid的VectorData
    @param source_id: Resourceid
    @return: None
    """
    ListenerManagement.delete_embedding_by_source(source_id)


def disable_embedding_by_paragraph(paragraph_id):
    """
    Disable某个Paragraphid的Vector
    @param paragraph_id: Paragraphid
    @return: None
    """
    ListenerManagement.disable_embedding_by_paragraph(paragraph_id)


def enable_embedding_by_paragraph(paragraph_id):
    """
    Enable某个Paragraphid的VectorData
    @param paragraph_id: Paragraphid
    @return: None
    """
    ListenerManagement.enable_embedding_by_paragraph(paragraph_id)


def delete_embedding_by_source_ids(source_ids: List[str]):
    """
    DeletionVectorBased onsource_id_list
    @param source_ids:
    @return:
    """
    ListenerManagement.delete_embedding_by_source_ids(source_ids)


def update_problem_embedding(problem_id: str, problem_content: str, model_id):
    """
    UpdateQuestion
    @param problem_id:
    @param problem_content:
    @param model_id:
    @return:
    """
    model = get_embedding_model(model_id)
    ListenerManagement.update_problem(UpdateProblemArgs(problem_id, problem_content, model))


def update_embedding_knowledge_id(paragraph_id_list, target_knowledge_id):
    """
    ModificationVectorData到SpecifyKnowledge base
    @param paragraph_id_list: SpecifyParagraph的VectorData
    @param target_knowledge_id: Knowledge baseid
    @return:
    """

    ListenerManagement.update_embedding_knowledge_id(
        UpdateEmbeddingKnowledgeIdArgs(paragraph_id_list, target_knowledge_id)
    )


def delete_embedding_by_paragraph_ids(paragraph_ids: List[str]):
    """
    DeletionSpecifyParagraphList的VectorData
    @param paragraph_ids: ParagraphList
    @return: None
    """
    ListenerManagement.delete_embedding_by_paragraph_ids(paragraph_ids)


def update_embedding_document_id(
    paragraph_id_list, target_document_id, target_knowledge_id, target_embedding_model_id=None
):
    target_embedding_model = (
        get_embedding_model(target_embedding_model_id) if target_embedding_model_id is not None else None
    )
    ListenerManagement.update_embedding_document_id(
        UpdateEmbeddingDocumentIdArgs(
            paragraph_id_list, target_document_id, target_knowledge_id, target_embedding_model
        )
    )


def delete_embedding_by_knowledge_id_list(knowledge_id_list):
    ListenerManagement.delete_embedding_by_knowledge_id_list(knowledge_id_list)
