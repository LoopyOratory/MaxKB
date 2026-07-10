# coding=utf-8
"""
    @project: maxkb
    @file: opencode_model_provider.py
    @desc: OpenCode Zen provider — AI gateway to curated models
           https://opencode.ai/docs/

           OpenCode Zen is an AI gateway that aggregates models from multiple
           providers behind a single API. Models accessible through the
           OpenAI-compatible /zen/v1/chat/completions endpoint are listed here.

           GPT models use /zen/v1/responses, Claude/Qwen use /zen/v1/messages,
           and Gemini uses /zen/v1/models/{id} — those endpoints are not
           compatible with BaseChatOpenAI and are not included here.
"""
import os

from common.utils.common import get_file_content
from models_provider.base_model_provider import (
    IModelProvider,
    ModelProvideInfo,
    ModelInfo,
    ModelTypeConst,
    ModelInfoManage,
)
from models_provider.impl.opencode_model_provider.credential.llm import OpenCodeLLMModelCredential
from models_provider.impl.opencode_model_provider.model.llm import OpenCodeChatModel
from maxkb.conf import PROJECT_DIR
from django.utils.translation import gettext_lazy as _

opencode_llm_credential = OpenCodeLLMModelCredential()

# Models available through /zen/v1/chat/completions (OpenAI-compatible).
# Full catalog: https://opencode.ai/zen/v1/models

model_info_list = [
    # -- Free tier (no cost, via OpenCode Zen) --
    ModelInfo(
        'big-pickle', _('Free tier model — no cost.'),
        ModelTypeConst.LLM, opencode_llm_credential, OpenCodeChatModel,
    ),
    ModelInfo(
        'deepseek-v4-flash-free', _('Free tier model — no cost.'),
        ModelTypeConst.LLM, opencode_llm_credential, OpenCodeChatModel,
    ),
    ModelInfo(
        'mimo-v2.5-free', _('Free tier model — no cost.'),
        ModelTypeConst.LLM, opencode_llm_credential, OpenCodeChatModel,
    ),
    ModelInfo(
        'north-mini-code-free', _('Free tier model — no cost.'),
        ModelTypeConst.LLM, opencode_llm_credential, OpenCodeChatModel,
    ),
    ModelInfo(
        'nemotron-3-ultra-free', _('Free tier model — no cost.'),
        ModelTypeConst.LLM, opencode_llm_credential, OpenCodeChatModel,
    ),
    # -- DeepSeek (via OpenCode Zen) --
    ModelInfo(
        'deepseek-v4-pro', '',
        ModelTypeConst.LLM, opencode_llm_credential, OpenCodeChatModel,
    ),
    ModelInfo(
        'deepseek-v4-flash', '',
        ModelTypeConst.LLM, opencode_llm_credential, OpenCodeChatModel,
    ),
    # -- MiniMax (via OpenCode Zen) --
    ModelInfo(
        'minimax-m3', '',
        ModelTypeConst.LLM, opencode_llm_credential, OpenCodeChatModel,
    ),
    ModelInfo(
        'minimax-m2.7', '',
        ModelTypeConst.LLM, opencode_llm_credential, OpenCodeChatModel,
    ),
    ModelInfo(
        'minimax-m2.5', '',
        ModelTypeConst.LLM, opencode_llm_credential, OpenCodeChatModel,
    ),
    # -- GLM / ZhiPu (via OpenCode Zen) --
    ModelInfo(
        'glm-5.2', '',
        ModelTypeConst.LLM, opencode_llm_credential, OpenCodeChatModel,
    ),
    ModelInfo(
        'glm-5.1', '',
        ModelTypeConst.LLM, opencode_llm_credential, OpenCodeChatModel,
    ),
    ModelInfo(
        'glm-5', '',
        ModelTypeConst.LLM, opencode_llm_credential, OpenCodeChatModel,
    ),
    # -- Kimi / Moonshot (via OpenCode Zen) --
    ModelInfo(
        'kimi-k2.7-code', '',
        ModelTypeConst.LLM, opencode_llm_credential, OpenCodeChatModel,
    ),
    ModelInfo(
        'kimi-k2.6', '',
        ModelTypeConst.LLM, opencode_llm_credential, OpenCodeChatModel,
    ),
    ModelInfo(
        'kimi-k2.5', '',
        ModelTypeConst.LLM, opencode_llm_credential, OpenCodeChatModel,
    ),
    # -- Grok / xAI (via OpenCode Zen) --
    ModelInfo(
        'grok-4.5', '',
        ModelTypeConst.LLM, opencode_llm_credential, OpenCodeChatModel,
    ),
    ModelInfo(
        'grok-build-0.1', '',
        ModelTypeConst.LLM, opencode_llm_credential, OpenCodeChatModel,
    ),
]

model_info_manage = (
    ModelInfoManage.builder()
    .append_model_info_list(model_info_list)
    .append_default_model_info(model_info_list[0])
    .build()
)


class OpenCodeModelProvider(IModelProvider):

    def get_model_info_manage(self):
        return model_info_manage

    def get_model_provide_info(self):
        return ModelProvideInfo(
            provider='model_opencode_provider',
            name='OpenCode Zen',
            icon=get_file_content(
                os.path.join(
                    PROJECT_DIR, 'apps', 'models_provider', 'impl',
                    'opencode_model_provider', 'icon', 'opencode_icon_svg'
                )
            ),
        )
