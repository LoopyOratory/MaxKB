# coding=utf-8
"""
    @project: maxkb
    @file: opencode_go_model_provider.py
    @desc: OpenCode Go provider — subscription AI gateway for coding models
           https://opencode.ai/docs/go/

           $10/month subscription with 13 curated models. Models using the
           OpenAI-compatible /zen/go/v1/chat/completions endpoint are listed.
           MiniMax and Qwen use /zen/go/v1/messages (Anthropic-compatible)
           and are not included here.
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
from models_provider.impl.opencode_go_model_provider.credential.llm import OpenCodeGoLLMModelCredential
from models_provider.impl.opencode_go_model_provider.model.llm import OpenCodeGoChatModel
from maxkb.conf import PROJECT_DIR
from django.utils.translation import gettext_lazy as _

opencode_go_credential = OpenCodeGoLLMModelCredential()

model_info_list = [
    # -- GLM / ZhiPu --
    ModelInfo('glm-5.2', '', ModelTypeConst.LLM, opencode_go_credential, OpenCodeGoChatModel),
    ModelInfo('glm-5.1', '', ModelTypeConst.LLM, opencode_go_credential, OpenCodeGoChatModel),
    # -- Kimi / Moonshot --
    ModelInfo('kimi-k2.7-code', '', ModelTypeConst.LLM, opencode_go_credential, OpenCodeGoChatModel),
    ModelInfo('kimi-k2.6', '', ModelTypeConst.LLM, opencode_go_credential, OpenCodeGoChatModel),
    # -- DeepSeek --
    ModelInfo('deepseek-v4-pro', '', ModelTypeConst.LLM, opencode_go_credential, OpenCodeGoChatModel),
    ModelInfo('deepseek-v4-flash', '', ModelTypeConst.LLM, opencode_go_credential, OpenCodeGoChatModel),
    # -- MiMo --
    ModelInfo('mimo-v2.5', '', ModelTypeConst.LLM, opencode_go_credential, OpenCodeGoChatModel),
    ModelInfo('mimo-v2.5-pro', '', ModelTypeConst.LLM, opencode_go_credential, OpenCodeGoChatModel),
]

model_info_manage = (
    ModelInfoManage.builder()
    .append_model_info_list(model_info_list)
    .append_default_model_info(model_info_list[0])
    .build()
)


class OpenCodeGoModelProvider(IModelProvider):

    def get_model_info_manage(self):
        return model_info_manage

    def get_model_provide_info(self):
        return ModelProvideInfo(
            provider='model_opencode_go_provider',
            name='OpenCode Go',
            icon=get_file_content(
                os.path.join(
                    PROJECT_DIR, 'apps', 'models_provider', 'impl',
                    'opencode_go_model_provider', 'icon', 'opencode_go_icon_svg'
                )
            ),
        )
