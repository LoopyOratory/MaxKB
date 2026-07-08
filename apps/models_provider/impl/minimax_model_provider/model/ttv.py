
import time
from typing import Dict

import requests

from common.utils.logger import maxkb_logger
from models_provider.base_model_provider import MaxKBBaseModel
from models_provider.base_ttv import BaseGenerationVideo


class GenerationVideoModel(MaxKBBaseModel, BaseGenerationVideo):
    api_key: str
    api_base: str
    model_name: str
    params: dict
    max_retries: int = 3
    retry_delay: int = 10  # seconds

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.api_key = kwargs.get('api_key')
        self.api_base = kwargs.get('api_base', 'https://api.minimaxi.com/v1')
        self.model_name = kwargs.get('model_name')
        self.params = kwargs.get('params', {})
        self.max_retries = kwargs.get('max_retries', 3)
        self.retry_delay = 10

    @staticmethod
    def is_cache_model():
        return False

    @staticmethod
    def new_instance(model_type, model_name, model_credential: Dict[str, object], **model_kwargs):
        optional_params = {'params': {}}
        for key, value in model_kwargs.items():
            if key not in ['model_id', 'use_local', 'streaming']:
                optional_params['params'][key] = value

        api_base = model_credential.get('api_base','https://api.minimaxi.com/v1')

        return GenerationVideoModel(
            model_name=model_name,
            api_key=model_credential.get('api_key'),
            api_base=api_base,
            **optional_params,
        )

    def check_auth(self):
        return True

    def _safe_call(self, method, url, **kwargs):
        """带重试的Request封装"""
        headers = {"Authorization": f"Bearer {self.api_key}"}

        for attempt in range(self.max_retries):
            try:
                if method.upper() == 'POST':
                    response = requests.post(url, headers=headers, **kwargs)
                elif method.upper() == 'GET':
                    response = requests.get(url, headers=headers, **kwargs)
                else:
                    raise ValueError(f"Unsupported HTTP method: {method}")

                response.raise_for_status()
                return response.json()
            except (requests.exceptions.ProxyError,
                    requests.exceptions.ConnectionError,
                    requests.exceptions.Timeout) as e:
                maxkb_logger.error(f"⚠️ 网络Error: {e}，正在重试 {attempt + 1}/{self.max_retries}...")
                time.sleep(self.retry_delay)
            except requests.exceptions.HTTPError as e:
                maxkb_logger.error(f"HTTP Error: {e}")
                raise RuntimeError(f"HTTP RequestFailure: {e.response.text if hasattr(e, 'response') else str(e)}")

        raise RuntimeError("多次重试后仍无法Connect到 MiniMax API, pleaseCheck代理或网络Configuration")

    def generate_video(self, prompt, negative_prompt=None, first_frame_url=None, last_frame_url=None, **kwargs):
        """
        GenerateVideo
        prompt: TextDescription
        negative_prompt: ReverseTextDescription（MiniMax 暂不支持，RetainParameters以CompatibleInterface）
        first_frame_url: 起始关键帧Image URL (Image toVideo或Start/end framesMode)
        last_frame_url: End关键帧Image URL (Start/end framesMode)

        Return: VideoDownload URL
        """
        base_url = f"{self.api_base}/video_generation"

        # BuildBasicParameters
        payload = {
            "prompt": prompt,
            "model": self.model_name,
        }

        # Based onProvide的ParametersDetermineGenerateMode
        if first_frame_url and last_frame_url:
            # Mode三：Start/end framesGenerateVideo
            payload["first_frame_image"] = first_frame_url
            payload["last_frame_image"] = last_frame_url
            maxkb_logger.info("UseStart/end framesModeGenerateVideo")
        elif first_frame_url:
            # Mode二：Image toVideo
            payload["first_frame_image"] = first_frame_url
            maxkb_logger.info("UseImage toVideoMode")
        else:
            # Mode一：文生Video
            maxkb_logger.info("Use文生VideoMode")

        # MergeExtraParameters（duration, resolution 等）
        payload.update(self.params)

        # --- Step 1: SubmitTask ---
        maxkb_logger.info(f"SubmitVideoGenerateTask，Model: {self.model_name}")
        response_data = self._safe_call('POST', base_url, json=payload)

        task_id = response_data.get("task_id")
        if not task_id:
            raise RuntimeError(f"SubmitTaskFailure，未Get到 task_id: {response_data}")

        maxkb_logger.info(f"Task已Submit，task_id: {task_id}")

        # --- Step 2: PollQueryTaskStatus ---
        query_url = f"{self.api_base}/query/video_generation"
        file_id = self._poll_task_status(query_url, task_id)

        # --- Step 3: GetVideoDownloadLink ---
        video_url = self._get_video_download_url(file_id)

        maxkb_logger.info(f"VideoGenerateComplete！Video URL: {video_url}")
        return video_url

    def _poll_task_status(self, query_url: str, task_id: str) -> str:
        """PollTaskStatus，直至Success或Failure"""
        params = {"task_id": task_id}
        max_attempts = 60  # At mostPoll 60 次（约 10 Minutes）

        for attempt in range(max_attempts):
            response_data = self._safe_call('GET', query_url, params=params)
            status = response_data.get("status")

            maxkb_logger.info(f"CurrentTaskStatus (尝试 {attempt + 1}/{max_attempts}): {status}")

            if status == "Success":
                file_id = response_data.get("file_id")
                if not file_id:
                    raise RuntimeError(f"TaskSuccess但未Get到 file_id: {response_data}")
                maxkb_logger.info(f"TaskProcessSuccess，file_id: {file_id}")
                return file_id
            elif status == "Fail":
                error_msg = response_data.get("error_message", "UnknownError")
                maxkb_logger.error(f"VideoGenerateFailure: {error_msg}")
                raise RuntimeError(f"VideoGenerateFailure: {error_msg}")
            else:
                # Task仍在Process中，Wait后继续Poll
                time.sleep(self.retry_delay)

        raise RuntimeError(f"Task超时：经过 {max_attempts} 次Poll后仍未Complete")

    def _get_video_download_url(self, file_id: str) -> str:
        """Based on file_id GetVideoDownloadLink"""
        retrieve_url = f"{self.api_base}/files/retrieve"
        params = {"file_id": file_id}

        response_data = self._safe_call('GET', retrieve_url, params=params)

        file_info = response_data.get("file", {})
        download_url = file_info.get("download_url")

        if not download_url:
            raise RuntimeError(f"GetDownloadLinkFailure: {response_data}")

        return download_url
