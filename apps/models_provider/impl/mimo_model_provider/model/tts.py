# coding=utf-8
"""
    @project: maxkb
    @file: tts.py
    @desc: MiMo TTS model — Xiaomi MiMo Speech Synthesis v2.5
           Supports 3 variants:
             - mimo-v2.5-tts            built-in voices + singing
             - mimo-v2.5-tts-voicedesign  custom voice from text description
             - mimo-v2.5-tts-voiceclone   clone voice from audio sample
           API docs: https://mimo.mi.com/docs/en-US/quick-start/usage-guide/audio/speech-synthesis-v2.5
"""
import base64
from typing import Dict

import requests

from django.utils.translation import gettext as _

from common.utils.common import _remove_empty_lines
from models_provider.base_model_provider import MaxKBBaseModel
from models_provider.impl.base_tts import BaseTextToSpeech


class MiMoTextToSpeech(MaxKBBaseModel, BaseTextToSpeech):
    api_key: str
    model: str
    params: dict
    api_base: str

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.api_key = kwargs.get('api_key')
        self.model = kwargs.get('model')
        self.params = kwargs.get('params')
        self.api_base = kwargs.get('api_base') or 'https://api.xiaomimimo.com/v1'

    @staticmethod
    def is_cache_model():
        return False

    @staticmethod
    def new_instance(model_type, model_name, model_credential: Dict[str, object], **model_kwargs):
        optional_params = {'params': {}}
        for key, value in model_kwargs.items():
            if key not in ['model_id', 'use_local', 'streaming']:
                optional_params['params'][key] = value
        return MiMoTextToSpeech(
            model=model_name,
            api_base=model_credential.get('api_base', 'https://api.xiaomimimo.com/v1'),
            api_key=model_credential.get('api_key'),
            **optional_params,
        )

    def check_auth(self):
        self.text_to_speech(_('Hello'))

    def text_to_speech(self, text):
        text = _remove_empty_lines(text)

        messages = []
        audio = {'format': 'wav'}

        if 'voicedesign' in self.model:
            # Voice design: user message is required (the voice description)
            voice_prompt = self.params.get('voice_prompt', '')
            if voice_prompt:
                messages.append({'role': 'user', 'content': voice_prompt})
            messages.append({'role': 'assistant', 'content': text})

        elif 'voiceclone' in self.model:
            # Voice cloning: voice field is a data URI of the sample audio
            voice_data_uri = self.params.get('voice_data_uri', '')
            if voice_data_uri:
                audio['voice'] = voice_data_uri
            messages.append({'role': 'assistant', 'content': text})

        else:
            # Built-in voices (mimo-v2.5-tts): the API requires a user-turn
            # style instruction alongside the assistant-turn text to synthesize.
            voice = self.params.get('voice', 'Chloe')
            style_instruction = self.params.get(
                'style_instruction', 'Natural, clear, conversational tone at a moderate pace.'
            )
            audio['voice'] = voice
            messages.append({'role': 'user', 'content': style_instruction})
            messages.append({'role': 'assistant', 'content': text})

        payload = {
            'model': self.model,
            'messages': messages,
            'audio': audio,
        }

        headers = {
            'api-key': self.api_key,
            'Content-Type': 'application/json',
        }

        response = requests.post(
            f'{self.api_base}/chat/completions',
            json=payload,
            headers=headers,
            timeout=120,
        )
        if not response.ok:
            try:
                error_message = response.json().get('error', {}).get('message', response.text)
            except ValueError:
                error_message = response.text
            raise Exception(f'MiMo TTS API error ({response.status_code}): {error_message}')

        result = response.json()
        choices = result.get('choices', [])
        if not choices:
            raise Exception(_('MiMo TTS API returned no choices in response'))

        audio_data = choices[0].get('message', {}).get('audio', {}).get('data', '')
        if not audio_data:
            raise Exception(_('MiMo TTS API returned empty audio data'))

        return base64.b64decode(audio_data)
