import base64
import json
import os
import traceback
from typing import Dict

from tencentcloud.asr.v20190614 import asr_client, models
from tencentcloud.common import credential
from tencentcloud.common.exception import TencentCloudSDKException
from tencentcloud.common.profile.client_profile import ClientProfile
from tencentcloud.common.profile.http_profile import HttpProfile

from common.utils.logger import maxkb_logger
from models_provider.base_model_provider import MaxKBBaseModel
from models_provider.impl.base_stt import BaseSpeechToText


class TencentSpeechToText(MaxKBBaseModel, BaseSpeechToText):
    hunyuan_secret_id: str
    hunyuan_secret_key: str
    model: str
    params: dict

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.hunyuan_secret_id = kwargs.get('hunyuan_secret_id')
        self.hunyuan_secret_key = kwargs.get('hunyuan_secret_key')
        self.model = kwargs.get('model')
        self.params = kwargs.get('params')

    @staticmethod
    def is_cache_model():
        return False

    @staticmethod
    def new_instance(model_type, model_name, model_credential: Dict[str, object], **model_kwargs):
        return TencentSpeechToText(
            hunyuan_secret_id=model_credential.get('SecretId'),
            hunyuan_secret_key=model_credential.get('SecretKey'),
            model=model_name,
            params=model_kwargs,
            **model_kwargs
        )

    def check_auth(self):
        cwd = os.path.dirname(os.path.abspath(__file__))
        with open(f'{cwd}/iat_mp3_16k.mp3', 'rb') as f:
            self.speech_to_text(f)

    def speech_to_text(self, audio_file):
        try:
            cred = credential.Credential(self.hunyuan_secret_id, self.hunyuan_secret_key)
            # Instance化OnehttpOptions, optional; Nonespecial needs; can skip
            httpProfile = HttpProfile()
            httpProfile.endpoint = "asr.tencentcloudapi.com"

            # Instance化OneclientOptions, optional; Nonespecial needs; can skip
            clientProfile = ClientProfile()
            clientProfile.httpProfile = httpProfile
            # Instance化要Request产品的clientObject,clientProfile是可选的
            client = asr_client.AsrClient(cred, "", clientProfile)
            buf = audio_file.read()
            _v = base64.b64encode(buf)

            # Instance化OneRequestObject,EachInterface都会对应OnerequestObject
            req = models.SentenceRecognitionRequest()
            params = {
                "EngSerViceType": self.params.get('EngSerViceType'),
                "SourceType": 1,
                "VoiceFormat": "mp3",
                "Data": _v.decode(),
                **self.params
            }
            req.from_json_string(json.dumps(params))

            # Return的resp是OneSentenceRecognitionResponse的Instance，与RequestObject对应
            resp = client.SentenceRecognition(req)
            # OutputjsonFormat的String回包
            return resp.Result


        except TencentCloudSDKException as err:
            maxkb_logger.error(f":Error: {str(err)}: {traceback.format_exc()}")
            raise err
