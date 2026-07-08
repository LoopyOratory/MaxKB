# coding=utf-8

'''
requires Python 3.6 or later

pip install asyncio
pip install websockets

'''
from typing import Dict
from models_provider.base_model_provider import MaxKBBaseModel
from models_provider.impl.base_tti import BaseTextToImage

from volcenginesdkarkruntime import Ark


class VolcanicEngineTextToImage(MaxKBBaseModel, BaseTextToImage):
    api_key: str
    api_base: str
    model_version: str
    params: dict

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.api_key = kwargs.get('api_key')
        self.api_base = kwargs.get('api_base')
        self.model_version = kwargs.get('model_version')
        self.params = kwargs.get('params')

    @staticmethod
    def is_cache_model():
        return False

    @staticmethod
    def new_instance(model_type, model_name, model_credential: Dict[str, object], **model_kwargs):
        optional_params = {'params': {}}
        for key, value in model_kwargs.items():
            if key not in ['model_id', 'use_local', 'streaming']:
                optional_params['params'][key] = value
        return VolcanicEngineTextToImage(
            model_version=model_name,
            api_key=model_credential.get('api_key'),
            api_base=model_credential.get('volcanic_api_url') or 'https://ark-api.volcengine.com',
            **optional_params
        )

    def check_auth(self):
        return True

    def generate_image(self, prompt: str, negative_prompt: str = None):
        client = Ark(
            # 此为DefaultPath，您可Based on业务所在地域PerformConfiguration
            base_url=self.api_base,
            # 从EnvironmentVariable中Get您的 API Key。此为DefaultMethod，您可Based onNeedsPerformModification
            api_key=self.api_key,
        )
        file_urls = []
        imagesResponse = client.images.generate(
            model=self.model_version,
            prompt=prompt,
            **self.params
        )
        # If data 是List，TraverseAllImage
        if isinstance(imagesResponse.data, list):
            for item in imagesResponse.data:
                # 优先Use URL，其次Use base64
                if hasattr(item, 'url') and item.url:
                    file_urls.append(item.url)
                elif hasattr(item, 'b64_json') and item.b64_json:
                    file_urls.append(item.b64_json)
        else:
            # If data 是单个Object
            item = imagesResponse.data
            if hasattr(item, 'url') and item.url:
                file_urls.append(item.url)
            elif hasattr(item, 'b64_json') and item.b64_json:
                file_urls.append(item.b64_json)

        return file_urls
