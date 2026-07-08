# coding=utf-8
"""
    @project: MaxKB
    @Author: Tiger
    @file: simple_task.py
    @date：2026/1/14 19:18
    @desc:
"""
from threading import Thread

from trigger.handler.impl.task.application_task import ApplicationTask
from trigger.handler.impl.task.tool_task import ToolTask
from trigger.handler.impl.trigger.event_trigger import EventTrigger
from trigger.handler.impl.trigger.scheduled_trigger import ScheduledTrigger

simple_task_handlers = [ApplicationTask(), ToolTask()]

simple_trigger_handlers = [ScheduledTrigger(), EventTrigger()]


def execute(trigger_task, **kwargs):
    """
    ExecuteTriggerTask
    @param trigger_task:  TriggerTaskData
    @param kwargs:        ExtraData
    @return:
    """
    for simple_task_handler in simple_task_handlers:
        if simple_task_handler.support(trigger_task, **kwargs):
            Thread(target=simple_task_handler.execute, args=(trigger_task,), kwargs=kwargs).start()
            return
    raise Exception("不SupportedProcess器Type")


def deploy(trigger, **kwargs):
    """
    DeploymentTrigger
    @param trigger: TriggerDictData
    @param kwargs:  ExtraData
    @return:
    """
    for simple_trigger_handler in simple_trigger_handlers:
        if simple_trigger_handler.support(trigger, **kwargs):
            return simple_trigger_handler.deploy(trigger, **kwargs)
    raise Exception("不SupportedTriggerType")


def undeploy(trigger, **kwargs):
    """
    CancelDeploymentTrigger
    @param trigger: TriggerDictData
    @param kwargs:  ExtraData
    @return:
    """
    for simple_trigger_handler in simple_trigger_handlers:
        return simple_trigger_handler.undeploy(trigger, **kwargs)
    raise Exception("不SupportedTriggerType")
