# coding=utf-8
"""
    @project: MaxKB
    @Author: Tiger
    @file: cache_version.py
    @date：2025/4/14 19:09
    @desc:
"""
from enum import Enum


class Cache_Version(Enum):
    # Token
    TOKEN = "TOKEN", lambda token: token
    # WorkspaceList
    WORKSPACE_LIST = "WORKSPACE:LIST", lambda user_id: user_id
    # UserData
    USER = "USER", lambda user_id: user_id
    # CurrentUserAll的Role
    ROLE_LIST = "ROLE:LIST", lambda user_id: user_id
    # CurrentUserAllPermission
    PERMISSION_LIST = "PERMISSION:LIST", lambda user_id: user_id
    # Verify码
    CAPTCHA = "CAPTCHA", lambda captcha: captcha
    # System
    SYSTEM = "SYSTEM", lambda key: key
    # Application对接三方Application的Cache
    APPLICATION_THIRD_PARTY = "APPLICATION:THIRD_PARTY", lambda key: key
    KNOWLEDGE_WORKFLOW_INTERRUPTED = "KNOWLEDGE_WORKFLOW_INTERRUPTED", lambda action_id: action_id
    # Conversation
    CHAT = "CHAT", lambda key: key

    CHAT_INFO = "CHAT_INFO", lambda key: key

    CHAT_VARIABLE = "CHAT_VARIABLE", lambda key: key

    # ApplicationAPI KEY
    APPLICATION_API_KEY = "APPLICATION_API_KEY", lambda secret_key, use_get_data: secret_key

    CHAT_USER_TOKEN = "CHAT_USER_TOKEN", lambda token: token

    TOOL_WORKFLOW_EXECUTE = "TOOL_WORKFLOW_EXECUTE", lambda key: key

    def get_version(self):
        return self.value[0]

    def get_key_func(self):
        return self.value[1]

    def get_key(self, **kwargs):
        return self.value[1](**kwargs)
