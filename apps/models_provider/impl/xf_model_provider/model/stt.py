# -*- coding:utf-8 -*-
#
#  Error码Link：https://www.xfyun.cn/document/error-code （codeReturnErrorMust-read when coding)
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
import asyncio
import base64
import datetime
import hashlib
import hmac
import json
import logging
import os
import ssl
from datetime import datetime, UTC
from typing import Dict
from urllib.parse import urlencode, urlparse

import websockets

from models_provider.base_model_provider import MaxKBBaseModel
from models_provider.impl.base_stt import BaseSpeechToText

STATUS_FIRST_FRAME = 0  # 第一帧的标识
STATUS_CONTINUE_FRAME = 1  # 中间帧标识
STATUS_LAST_FRAME = 2  # Last一帧的标识

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE


class XFSparkSpeechToText(MaxKBBaseModel, BaseSpeechToText):
    spark_app_id: str
    spark_api_key: str
    spark_api_secret: str
    spark_api_url: str
    params: dict
    model_name: str

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.spark_api_url = kwargs.get('spark_api_url')
        self.spark_app_id = kwargs.get('spark_app_id')
        self.spark_api_key = kwargs.get('spark_api_key')
        self.spark_api_secret = kwargs.get('spark_api_secret')
        self.params = kwargs.get('params')
        self.model_name = kwargs.get('model_name')

    @staticmethod
    def is_cache_model():
        return False

    @staticmethod
    def new_instance(model_type, model_name, model_credential: Dict[str, object], **model_kwargs):
        optional_params = {}
        if 'max_tokens' in model_kwargs and model_kwargs['max_tokens'] is not None:
            optional_params['max_tokens'] = model_kwargs['max_tokens']
        if 'temperature' in model_kwargs and model_kwargs['temperature'] is not None:
            optional_params['temperature'] = model_kwargs['temperature']
        return XFSparkSpeechToText(
            spark_app_id=model_credential.get('spark_app_id'),
            spark_api_key=model_credential.get('spark_api_key'),
            spark_api_secret=model_credential.get('spark_api_secret'),
            spark_api_url=model_credential.get('spark_api_url'),
            params=model_kwargs,
            model_name=model_name,
            **optional_params
        )

    # Generateurl
    def create_url(self):
        url = self.spark_api_url
        host = urlparse(url).hostname
        # GenerateRFC1123Format的Time戳
        gmt_format = '%a, %d %b %Y %H:%M:%S GMT'
        date = datetime.now(UTC).strftime(gmt_format)

        # ConcatenateString
        signature_origin = "host: " + host + "\n"
        signature_origin += "date: " + date + "\n"
        signature_origin += "GET " + "/v2/iat " + "HTTP/1.1"
        # Performhmac-sha256PerformEncrypt
        signature_sha = hmac.new(self.spark_api_secret.encode('utf-8'), signature_origin.encode('utf-8'),
                                 digestmod=hashlib.sha256).digest()
        signature_sha = base64.b64encode(signature_sha).decode(encoding='utf-8')

        authorization_origin = "api_key=\"%s\", algorithm=\"%s\", headers=\"%s\", signature=\"%s\"" % (
            self.spark_api_key, "hmac-sha256", "host date request-line", signature_sha)
        authorization = base64.b64encode(authorization_origin.encode('utf-8')).decode(encoding='utf-8')
        # 将Request的鉴权ParametersCombine为Dict
        v = {
            "authorization": authorization,
            "date": date,
            "host": host
        }
        # Concatenate鉴权Parameters，Generateurl
        url = url + '?' + urlencode(v)
        # print("date: ",date)
        # print("v: ",v)
        # 此处打印出建立Connect时候的url,参考本demo的时候可Cancel上方打印的注释，比对SameParameters时Generate的url与自己CodeGenerate的urlWhetherConsistent
        # print('websocket url :', url)
        return url

    def check_auth(self):
        cwd = os.path.dirname(os.path.abspath(__file__))
        with open(f'{cwd}/iat_mp3_16k.mp3', 'rb') as f:
            self.speech_to_text(f)

    def speech_to_text(self, file):
        async def handle():
            async with websockets.connect(self.create_url(), max_size=1000000000, ssl=ssl_context) as ws:
                # Send full client request
                await self.send(ws, file)
                return await self.handle_message(ws)

        return asyncio.run(handle())

    @staticmethod
    async def handle_message(ws):
        res = await ws.recv()
        message = json.loads(res)
        code = message["code"]
        sid = message["sid"]
        if code != 0:
            errMsg = message["message"]
            raise Exception(f"sid: {sid} call error: {errMsg} code is: {code}")
        else:
            data = message["data"]["result"]["ws"]
            result = ""
            for i in data:
                for w in i["cw"]:
                    result += w["w"]
            # print("sid:%s call success!,data is:%s" % (sid, json.dumps(data, ensure_ascii=False)))
            return result

    # 收到websocketConnect建立的Process
    async def send(self, ws, file):
        frameSize = 8000  # 每一帧的AudioSize
        status = STATUS_FIRST_FRAME  # Audio的StatusInfo，标识Audio是第一帧，Or中间帧、Last一帧

        allowed_params = {'language', 'domain', 'accent', 'vad_eos', 'dwa', 'pd', 'ptt',
                          'pcm', 'ltc', 'rlang', 'vinfo', 'nunum', 'speex_size', 'nbest', 'wbest'}

        business_params = {k: v for k, v in self.params.items() if k in allowed_params}
        if not business_params:
            business_params = {
                "domain": f'{self.model_name}',
                "language": "zh_cn",
                "accent": "mandarin",
                "vinfo": 1,
                "vad_eos": 10000
            }
        while True:
            buf = file.read(frameSize)
            # FileEnd
            if not buf:
                status = STATUS_LAST_FRAME
            # 第一帧Process
            # Send第一帧Audio，带business Parameters
            # appid Must带上，只需第一帧Send
            if status == STATUS_FIRST_FRAME:
                d = {
                    "common": {"app_id": self.spark_app_id},
                    "business": {
                        **business_params
                    },
                    "data": {
                        "status": 0, "format": "audio/L16;rate=16000",
                        "audio": str(base64.b64encode(buf), 'utf-8'),
                        "encoding": "lame"}
                }
                d = json.dumps(d)
                await ws.send(d)
                status = STATUS_CONTINUE_FRAME
            # 中间帧Process
            elif status == STATUS_CONTINUE_FRAME:
                d = {"data": {"status": 1, "format": "audio/L16;rate=16000",
                              "audio": str(base64.b64encode(buf), 'utf-8'),
                              "encoding": "lame"}}
                await ws.send(json.dumps(d))
            # Last一帧Process
            elif status == STATUS_LAST_FRAME:
                d = {"data": {"status": 2, "format": "audio/L16;rate=16000",
                              "audio": str(base64.b64encode(buf), 'utf-8'),
                              "encoding": "lame"}}
                await ws.send(json.dumps(d))
                break
