# coding=utf-8
"""
    @project: maxkb
    @file: stt.py
    @desc: MiMo ASR model — Xiaomi MiMo Speech Recognition v2.5
           API docs: https://mimo.mi.com/docs/en-US/quick-start/usage-guide/audio/Speech-Recognition
"""
import base64
from typing import Dict

import requests

from common.config.tokenizer_manage_config import TokenizerManage
from models_provider.base_model_provider import MaxKBBaseModel
from models_provider.impl.base_stt import BaseSpeechToText


def custom_get_token_ids(text: str):
    tokenizer = TokenizerManage.get_tokenizer()
    return tokenizer.encode(text)


class MiMoSpeechToText(MaxKBBaseModel, BaseSpeechToText):
    api_base: str
    api_key: str
    model: str
    params: dict

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.api_key = kwargs.get('api_key')
        self.api_base = kwargs.get('api_base')
        self.model = kwargs.get('model')
        self.params = kwargs.get('params')

    @staticmethod
    def is_cache_model():
        return False

    @staticmethod
    def new_instance(model_type, model_name, model_credential: Dict[str, object], **model_kwargs):
        optional_params = {}
        for key, value in model_kwargs.items():
            if key not in ['model_id', 'use_local', 'streaming']:
                optional_params[key] = value
        return MiMoSpeechToText(
            model=model_name,
            api_base=model_credential.get('api_base', 'https://api.xiaomimimo.com/v1'),
            api_key=model_credential.get('api_key'),
            params=optional_params,
        )

    def check_auth(self):
        # Verify API key by listing models (lightweight auth check)
        headers = {
            'api-key': self.api_key,
            'Content-Type': 'application/json',
        }
        # A simple GET to check credentials
        response = requests.get(
            self.api_base.rstrip('/'),
            headers=headers,
            timeout=10,
        )
        # Any non-5xx response means the API key is valid (even 404 is fine)
        if response.status_code >= 500:
            response.raise_for_status()

    def speech_to_text(self, audio_file):
        # Read audio bytes and base64-encode
        audio_bytes = audio_file.read()
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')

        # Detect format from file name/extension, default to wav
        file_name = getattr(audio_file, 'name', 'audio.wav')
        mime_type = 'audio/wav'
        if file_name and file_name.lower().endswith('.mp3'):
            mime_type = 'audio/mpeg'

        data_uri = f'data:{mime_type};base64,{audio_base64}'

        language = self.params.get('language', 'auto')

        payload = {
            'model': self.model,
            'messages': [
                {
                    'role': 'user',
                    'content': [
                        {
                            'type': 'input_audio',
                            'input_audio': {
                                'data': data_uri,
                            },
                        },
                    ],
                },
            ],
            'asr_options': {
                'language': language,
            },
        }

        headers = {
            'api-key': self.api_key,
            'Content-Type': 'application/json',
        }

        response = requests.post(
            f'{self.api_base.rstrip("/")}/chat/completions',
            json=payload,
            headers=headers,
            timeout=120,
        )
        response.raise_for_status()

        result = response.json()
        choices = result.get('choices', [])
        if not choices:
            return ''

        content = choices[0].get('message', {}).get('content', '')
        return content or ''
