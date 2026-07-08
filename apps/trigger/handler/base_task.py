# coding=utf-8
"""
    @project: MaxKB
    @Author: Tiger
    @file: base_task.py
    @date：2026/1/14 19:03
    @desc:
"""
from abc import ABC, abstractmethod


class BaseTriggerTask(ABC):
    """
    TaskExecute器抽象
    """

    @abstractmethod
    def support(self, trigger_task, **kwargs):
        pass

    @abstractmethod
    def execute(self, trigger_task, **kwargs):
        pass
