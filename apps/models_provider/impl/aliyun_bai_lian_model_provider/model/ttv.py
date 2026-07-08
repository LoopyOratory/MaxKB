import time
from http import HTTPStatus
from typing import Dict

import requests
from dashscope import VideoSynthesis

from common.utils.logger import maxkb_logger
from models_provider.base_model_provider import MaxKBBaseModel
from models_provider.base_ttv import BaseGenerationVideo


class GenerationVideoModel(MaxKBBaseModel, BaseGenerationVideo):
    api_key: str
    api_base: str
    model_name: str
    params: dict
    max_retries: int = 3
    retry_delay: int = 5  # seconds

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.api_key = kwargs.get('api_key')
        self.api_base = kwargs.get('api_base')
        self.model_name = kwargs.get('model_name')
        self.params = kwargs.get('params', {})
        self.max_retries = kwargs.get('max_retries', 3)
        self.retry_delay = 5

    @staticmethod
    def is_cache_model():
        return False

    @staticmethod
    def new_instance(model_type, model_name, model_credential: Dict[str, object], **model_kwargs):
        optional_params = {'params': {}}
        for key, value in model_kwargs.items():
            if key not in ['model_id', 'use_local', 'streaming']:
                optional_params['params'][key] = value
        api_base = model_credential.get('api_base')
        if api_base is None:
            api_base = 'https://dashscope.aliyuncs.com/api/v1'
        return GenerationVideoModel(
            model_name=model_name,
            api_key=model_credential.get('api_key'),
            api_base=api_base,
            **optional_params,
        )

    def check_auth(self):
        return True

    def _safe_call(self, func, **kwargs):
        """带重试的Request封装"""
        for attempt in range(self.max_retries):
            try:
                rsp = func(**kwargs)
                return rsp
            except (requests.exceptions.ProxyError,
                    requests.exceptions.ConnectionError,
                    requests.exceptions.Timeout) as e:
                maxkb_logger.error(f"⚠️ 网络Error: {e}，正在重试 {attempt + 1}/{self.max_retries}...")
                time.sleep(self.retry_delay)
        raise RuntimeError("多次重试后仍无法Connect到 DashScope API, pleaseCheck代理或网络Configuration")

    # --- GeneralAsyncGenerateFunction ---
    def generate_video(self, prompt, negative_prompt=None, first_frame_url=None, last_frame_url=None, **kwargs):
        """
            prompt: TextDescription
            negative_prompt: ReverseTextDescription
            first_frame_url: 起始关键帧Image URL (KF2V Required)
            last_frame_url: End关键帧Image URL (KF2V Required)
            IfNoneProvidelast_frame_url, then表示只Provide了first_frame_url，Generate is单关键帧Video（KFV） Parameters是img_url
            """
        import dashscope
        dashscope.base_http_api_url = self.api_base

        is_kf2v_model = 'kf2v' in self.model_name.lower()

        is_wan27_model = 'wan2.7' in self.model_name.lower()

        if is_wan27_model:
            # wan2.7 ModelUse特殊的 media Parameters结构
            media = []

            # Add首帧Image
            if first_frame_url:
                media.append({
                    "type": "first_frame",
                    "url": first_frame_url
                })

            # Add尾帧Image（IfExists）
            if last_frame_url:
                media.append({
                    "type": "last_frame",
                    "url": last_frame_url
                })
            params = {
                "api_key": self.api_key,
                "model": self.model_name,
                "prompt": prompt,
                "media": media,
                "negative_prompt": negative_prompt
            }
        else:
            # BuildBasicParameters
            params = {"api_key": self.api_key, "prompt": prompt, "model": self.model_name,
                      "negative_prompt": negative_prompt}

            if is_kf2v_model:
                params['first_frame_url'] = first_frame_url
                params['last_frame_url'] = last_frame_url
            elif first_frame_url:
                params['img_url'] = first_frame_url

        # MergeAllExtraParameters
        params.update(self.params)

        # --- AsyncSubmitTask ---
        rsp = self._safe_call(VideoSynthesis.async_call, **params)
        if rsp.status_code != HTTPStatus.OK:
            maxkb_logger.info(f'SubmitTaskFailure，status_code: {rsp.status_code}, code: {rsp.code}, message: {rsp.message}')
            raise RuntimeError(f'SubmitTaskFailure，status_code: {rsp.status_code}, code: {rsp.code}, message: {rsp.message}')

        maxkb_logger.info("task_id:", rsp.output.task_id)

        # --- QueryTaskStatus ---
        status = self._safe_call(VideoSynthesis.fetch, task=rsp, api_key=self.api_key)
        if status.status_code == HTTPStatus.OK:
            maxkb_logger.info("CurrentTaskStatus:", status.output.task_status)
        else:
            maxkb_logger.error(
                f'GetTaskStatusFailure，status_code: {status.status_code}, code: {status.code}, message: {status.message}')
            raise RuntimeError(
                f'GetTaskStatusFailure，status_code: {status.status_code}, code: {status.code}, message: {status.message}')

        # --- WaitTaskComplete ---
        rsp = self._safe_call(VideoSynthesis.wait, task=rsp, api_key=self.api_key)
        if rsp.status_code == HTTPStatus.OK:
            if rsp.output.task_status == "SUCCEEDED":
                maxkb_logger.info(f'VideoGenerateComplete！Video URL: {rsp.output.video_url}')
                return rsp.output.video_url
            else:
                maxkb_logger.error(f'VideoGenerateFailure: {rsp.output.message}')
                raise RuntimeError(f'VideoGenerateFailure, message: {rsp.output.message}')
        else:
            maxkb_logger.error(f'GenerateFailure，status_code: {rsp.status_code}, code: {rsp.code}, message: {rsp.message}')
            raise RuntimeError(f'GenerateFailure，status_code: {rsp.status_code}, code: {rsp.code}, message: {rsp.message}')
