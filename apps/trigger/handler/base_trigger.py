# coding=utf-8
"""
    @project: MaxKB
    @Author: Tiger
    @file: Trigger.py
    @date：2026/1/14 18:45
    @desc:
"""

from abc import ABC, abstractmethod


class BaseTrigger(ABC):
    """
    Trigger抽象
    """

    @abstractmethod
    def support(self, trigger, **kwargs):
        pass

    @abstractmethod
    def deploy(self, trigger, **kwargs):
        pass

    @abstractmethod
    def undeploy(self, trigger, **kwargs):
        pass

    @staticmethod
    @abstractmethod
    def execute(trigger, **kwargs):
        pass
