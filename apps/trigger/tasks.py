# apps/trigger/tasks.py
# coding=utf-8
from __future__ import annotations

# As Celery autodiscover 的入口，EnsureTask模块被Import从而CompleteRegister
from trigger.handler.impl.trigger.scheduled_trigger import deploy_scheduled_trigger  # noqa: F401
