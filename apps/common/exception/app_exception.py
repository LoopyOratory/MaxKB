# coding=utf-8
"""
    @project: qabot
    @Author: Tiger
    @file: app_exception.py
    @date：2023/9/4 14:04
    @desc:
"""
from rest_framework import status


class AppApiException(Exception):
    """
    项目内Exception
    """
    status_code = status.HTTP_200_OK

    def __init__(self, code, message):
        self.code = code
        self.message = message


class NotFound404(AppApiException):
    """
       未Authentication(未Login)Exception
       """
    status_code = status.HTTP_404_NOT_FOUND

    def __init__(self, code, message):
        self.code = code
        self.message = message


class AppAuthenticationFailed(AppApiException):
    """
    未Authentication(未Login)Exception
    """
    status_code = status.HTTP_401_UNAUTHORIZED

    def __init__(self, code, message):
        self.code = code
        self.message = message


class AppUnauthorizedFailed(AppApiException):
    """
    未Authorization(NonePermission)Exception
    """
    status_code = status.HTTP_403_FORBIDDEN

    def __init__(self, code, message):
        self.code = code
        self.message = message


class AppEmbedIdentityFailed(AppApiException):
    """
    EmbeddingcookieException
    """
    status_code = 460

    def __init__(self, code, message):
        self.code = code
        self.message = message


class AppChatNumOutOfBoundsFailed(AppApiException):
    """
      AccessCount超过今日Access量
    """
    status_code = 461

    def __init__(self, code, message):
        self.code = code
        self.message = message


class ChatException(AppApiException):
    status_code = 500

    def __init__(self, code, message):
        self.code = code
        self.message = message
