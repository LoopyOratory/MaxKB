# coding=utf-8
"""
    @project: maxkb
    @Author: Tiger
    @file: authentication_type.py
    @date：2023/11/14 20:03
    @desc:
"""
from enum import Enum


class AuthenticationType(Enum):
    # SystemUser
    SYSTEM_USER = "SYSTEM_USER"
    # ConversationUser
    CHAT_USER = "CHAT_USER"
    # ConversationAnonymousUser
    CHAT_ANONYMOUS_USER = "CHAT_ANONYMOUS_USER"
    # APIKEY
    API_KEY = "API_KEY"
