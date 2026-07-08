# coding=utf-8
"""
    @project: MaxKB
    @Author: Tiger
    @file: knowledge_action.py
    @date：2025/11/18 17:59
    @desc:
"""
import uuid_utils.compat as uuid

from django.db import models

from common.encoder.encoder import SystemEncoder
from common.mixins.app_model_mixin import AppModelMixin
from knowledge.models import Knowledge


class State(models.TextChoices):
    # Wait
    PENDING = 'PENDING'
    # Execute中
    STARTED = 'STARTED'
    # Success
    SUCCESS = 'SUCCESS'
    # Failure
    FAILURE = 'FAILURE'
    # CancelTask
    REVOKE = 'REVOKE'
    # CancelSuccess
    REVOKED = 'REVOKED'


class KnowledgeAction(AppModelMixin):
    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")

    knowledge = models.ForeignKey(Knowledge, on_delete=models.DO_NOTHING, verbose_name="Knowledge base", db_constraint=False)

    state = models.CharField(verbose_name='Status', max_length=20,
                             choices=State.choices,
                             default=State.STARTED)

    details = models.JSONField(verbose_name="ExecuteDetails", default=dict, encoder=SystemEncoder)

    run_time = models.FloatField(verbose_name="Runtime duration", default=0)

    meta = models.JSONField(verbose_name="元Data", default=dict)

    class Meta:
        db_table = "knowledge_action"
