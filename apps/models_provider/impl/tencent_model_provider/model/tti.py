# coding=utf-8

import json
import logging
from typing import Dict

from django.utils.translation import gettext as _
from tencentcloud.common import credential
from tencentcloud.common.exception.tencent_cloud_sdk_exception import TencentCloudSDKException
from tencentcloud.common.profile.client_profile import ClientProfile
from tencentcloud.common.profile.http_profile import HttpProfile
from tencentcloud.hunyuan.v20230901 import hunyuan_client, models

from common.utils.logger import maxkb_logger
from models_provider.base_model_provider import MaxKBBaseModel
from models_provider.impl.base_tti import BaseTextToImage
from models_provider.impl.tencent_model_provider.model.hunyuan import ChatHunyuan


class TencentTextToImageModel(MaxKBBaseModel, BaseTextToImage):
    hunyuan_secret_id: str
    hunyuan_secret_key: str
    model: str
    params: dict

    @staticmethod
    def is_cache_model():
        return False

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.hunyuan_secret_id = kwargs.get('hunyuan_secret_id')
        self.hunyuan_secret_key = kwargs.get('hunyuan_secret_key')
        self.model = kwargs.get('model_name')
        self.params = kwargs.get('params')

    @staticmethod
    def new_instance(model_type: str, model_name: str, model_credential: Dict[str, object],
                     **model_kwargs) -> 'TencentTextToImageModel':
        optional_params = {'params': {'Style': '201', 'Resolution': '768:768'}}
        for key, value in model_kwargs.items():
            if key not in ['model_id', 'use_local', 'streaming']:
                optional_params['params'][key] = value
        return TencentTextToImageModel(
            model=model_name,
            hunyuan_secret_id=model_credential.get('hunyuan_secret_id'),
            hunyuan_secret_key=model_credential.get('hunyuan_secret_key'),
            **optional_params
        )

    def check_auth(self):
        chat = ChatHunyuan(hunyuan_app_id='111111',
                           hunyuan_secret_id=self.hunyuan_secret_id,
                           hunyuan_secret_key=self.hunyuan_secret_key,
                           model="hunyuan-standard")
        res = chat.invoke(_('Hello'))
        # print(res)

    def generate_image(self, prompt: str, negative_prompt: str = None):
        try:
            # Instance化OneAuthenticationObject，入参NeedsPass in腾讯云账户 SecretId 和 SecretKey，此处还需注意Secret key对的保密
            # Code泄露Possible会导致 SecretId 和 SecretKey 泄露, and威胁Account下AllResource的安全性。BelowCode示例仅供参考，建议采用更安全的Method来UseSecret key, please参见：https://cloud.tencent.com/document/product/1278/85305
            # Secret key可前往官网控制台 https://console.cloud.tencent.com/cam/capi PerformGet
            cred = credential.Credential(self.hunyuan_secret_id, self.hunyuan_secret_key)
            # Instance化OnehttpOptions, optional; Nonespecial needs; can skip
            httpProfile = HttpProfile()
            httpProfile.endpoint = "hunyuan.tencentcloudapi.com"

            # Instance化OneclientOptions, optional; Nonespecial needs; can skip
            clientProfile = ClientProfile()
            clientProfile.httpProfile = httpProfile
            # Instance化要Request产品的clientObject,clientProfile是可选的
            client = hunyuan_client.HunyuanClient(cred, "ap-guangzhou", clientProfile)

            # Instance化OneRequestObject,EachInterface都会对应OnerequestObject
            req = models.TextToImageLiteRequest()
            params = {
                "Prompt": prompt,
                "NegativePrompt": negative_prompt,
                "RspImgType": "url",
                **self.params
            }
            req.from_json_string(json.dumps(params))

            # Return的resp是OneTextToImageLiteResponse的Instance，与RequestObject对应
            resp = client.TextToImageLite(req)
            file_urls = []

            file_urls.append(resp.ResultImage)
            return file_urls
        except TencentCloudSDKException as err:
            maxkb_logger.error(f"Tencent Text to Image API call failed: {err}")
            raise RuntimeError(f"Tencent Text to Image API call failed: {err}") from err
