# coding=utf-8
"""
    @project: maxkb
    @file: image.py
    @desc: MiMo Vision model — image understanding via omni-modal mimo-v2.5
"""
from typing import Dict

from models_provider.base_model_provider import MaxKBBaseModel
from models_provider.impl.base_chat_open_ai import BaseChatOpenAI


class MiMoVisionModel(MaxKBBaseModel, BaseChatOpenAI):

    @staticmethod
    def is_cache_model():
        return False

    @staticmethod
    def new_instance(model_type, model_name, model_credential: Dict[str, object], **model_kwargs):
        optional_params = MaxKBBaseModel.filter_optional_params(model_kwargs)
        return MiMoVisionModel(
            model_name=model_name,
            openai_api_base=model_credential.get('api_base', 'https://api.xiaomimimo.com/v1'),
            openai_api_key=model_credential.get('api_key'),
            streaming=True,
            stream_usage=True,
            **optional_params,
        )
