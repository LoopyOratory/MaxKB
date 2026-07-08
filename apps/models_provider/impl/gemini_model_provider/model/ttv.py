import base64
import time
from typing import Dict
import requests

from common.utils.logger import maxkb_logger
from models_provider.base_model_provider import MaxKBBaseModel
from models_provider.base_ttv import BaseGenerationVideo


class GenerationVideoModel(MaxKBBaseModel, BaseGenerationVideo):
    base_url: str
    api_key: str
    model: str
    params: dict

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.api_key = kwargs.get("api_key")
        self.base_url = kwargs.get("base_url")
        self.model = kwargs.get("model")
        self.params = kwargs.get("params")

    @staticmethod
    def is_cache_model():
        return False

    @staticmethod
    def new_instance(model_type, model_name, model_credential: Dict[str, object], **model_kwargs):
        optional_params = {"params": {}}
        for key, value in model_kwargs.items():
            if key not in ["model_id", "use_local", "streaming"]:
                optional_params["params"][key] = value
        return GenerationVideoModel(
            model=model_name,
            base_url=model_credential.get("base_url", "https://generativelanguage.googleapis.com"),
            api_key=model_credential.get("api_key"),
            **optional_params,
        )

    def check_auth(self):
        return True

    def generate_video(self, prompt, negative_prompt=None, first_frame_url=None, last_frame_url=None, **kwargs):
        from google import genai
        from google.genai import types
        client = genai.Client(api_key=self.api_key, http_options={"base_url": self.base_url})

        # 1. DynamicBuild Config ParametersDict
        config_params = {}
        if self.params.get("aspect_ratio"):
            config_params["aspect_ratio"] = self.params["aspect_ratio"]
        if self.params.get("resolution"):
            config_params["resolution"] = self.params["resolution"]

        try:
            # 2. Initialize核心RequestParameters（文生Video的Basic）
            operation_args = {
                "model": self.model,
                "prompt": prompt,
            }

            # 3. Process首帧（Image toVideo）
            if first_frame_url:
                maxkb_logger.info("Processing first frame...")
                operation_args["image"] = self._load_image_as_sdk_type(first_frame_url)

            # 4. Process尾帧（Image toVideo）
            if last_frame_url:
                maxkb_logger.info("Processing last frame...")
                config_params["last_frame"] = self._load_image_as_sdk_type(last_frame_url)

            # 5. Unified组装VideoConfiguration(None论是宽高比Or尾帧，都Unified在这里安全Instance化）
            if config_params:
                operation_args["config"] = types.GenerateVideosConfig(**config_params)

            # 6. 发起AsyncGenerateTask
            maxkb_logger.info(f"Starting video generation with model: {operation_args['model']}")
            operation = client.models.generate_videos(**operation_args)

            # 7. 安全PollTaskStatus
            max_retries = 120
            retry_count = 0
            wait_time = 10

            while not operation.done and retry_count < max_retries:
                maxkb_logger.info(f"Waiting for video generation to complete... ({retry_count * wait_time}s)")
                time.sleep(wait_time)
                operation = client.operations.get(operation)
                retry_count += 1

            if not operation.done:
                raise TimeoutError("Video generation timed out after 20 minutes")

            # 8. Exception与ResultCheck
            if operation.error:
                raise Exception(f"Video generation failed from Google Side: {operation.error}")

            if not operation.result or not operation.result.generated_videos:
                raise Exception("Google API returned empty result.")

            generated_video_obj = operation.result.generated_videos[0]
            video_file_ref = generated_video_obj.video

            # 9. DownloadVideoByte stream
            maxkb_logger.info("Downloading video bytes...")
            video_bytes = client.files.download(file=video_file_ref)

            return video_bytes

        except Exception as e:
            maxkb_logger.error(f"Video generation error: {str(e)}")
            raise

    def _load_image_as_sdk_type(self, image_url: str):
        """
        Unified从 URL 或 base64 LoadImage并构造为Contains bytes 的 types.Image Object。
        """
        from google.genai import types

        if image_url.startswith("data:"):
            header, encoded = image_url.split(",", 1)
            mime_type = header.split(";")[0].split(":")[1]
            image_bytes = base64.b64decode(encoded)
        else:
            response = requests.get(image_url, timeout=15)
            response.raise_for_status()
            mime_type = response.headers.get("Content-Type", "image/jpeg")
            image_bytes = response.content

        # 注意：新 SDK 允许你不显式传 mime_type，但Pass in会更稳妥
        return types.Image(image_bytes=image_bytes, mime_type=mime_type)
