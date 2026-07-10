# coding=utf-8
"""
    @project: maxkb
    @file: mimo_model_provider.py
    @desc: Xiaomi MiMo model provider — full platform support
           https://mimo.mi.com

           Models:
             LLM:  mimo-v2.5-pro, mimo-v2.5-pro-ultraspeed, mimo-v2.5
             IMAGE (Vision): mimo-v2.5 (omni-modal)
             TTS:  mimo-v2.5-tts, mimo-v2.5-tts-voicedesign, mimo-v2.5-tts-voiceclone
             STT:  mimo-v2.5-asr
"""
import os

from common.utils.common import get_file_content
from models_provider.base_model_provider import (
    IModelProvider,
    ModelProvideInfo,
    ModelInfo,
    ModelTypeConst,
    ModelInfoManage,
)
from models_provider.impl.mimo_model_provider.credential.llm import MiMoLLMModelCredential
from models_provider.impl.mimo_model_provider.credential.image import MiMoImageModelCredential
from models_provider.impl.mimo_model_provider.credential.tts import MiMoTTSModelCredential
from models_provider.impl.mimo_model_provider.credential.stt import MiMoASRModelCredential
from models_provider.impl.mimo_model_provider.model.llm import MiMoChatModel
from models_provider.impl.mimo_model_provider.model.image import MiMoVisionModel
from models_provider.impl.mimo_model_provider.model.tts import MiMoTextToSpeech
from models_provider.impl.mimo_model_provider.model.stt import MiMoSpeechToText
from maxkb.conf import PROJECT_DIR
from django.utils.translation import gettext_lazy as _

# -- Credential singletons --
mimo_llm_model_credential = MiMoLLMModelCredential()
mimo_image_model_credential = MiMoImageModelCredential()
mimo_tts_model_credential = MiMoTTSModelCredential()
mimo_asr_model_credential = MiMoASRModelCredential()

# -- LLM models --
mimo_v2_5_pro = ModelInfo(
    'mimo-v2.5-pro',
    _('Flagship model: 1T total params, 42B active, 1M context window. '
      'Rivals Claude Opus 4.6 in demanding agentic workloads.'),
    ModelTypeConst.LLM,
    mimo_llm_model_credential,
    MiMoChatModel,
)

mimo_v2_5_pro_ultraspeed = ModelInfo(
    'mimo-v2.5-pro-ultraspeed',
    _('High-throughput variant of V2.5-Pro with FP4 quantization and DFlash '
      'parallel decoding. Peak speed ~1,000 tokens/s.'),
    ModelTypeConst.LLM,
    mimo_llm_model_credential,
    MiMoChatModel,
)

mimo_v2_5 = ModelInfo(
    'mimo-v2.5',
    _('Native omni-modal model: processes images, video, audio, and text '
      'with cross-modal perception and long-range reasoning. 1M context.'),
    ModelTypeConst.LLM,
    mimo_llm_model_credential,
    MiMoChatModel,
)

# -- Vision / Image Understanding model --
mimo_v2_5_vision = ModelInfo(
    'mimo-v2.5',
    _('Omni-modal vision understanding: analyze images with native multimodal '
      'perception. Supports JPEG, PNG, GIF, WebP, BMP up to 50 MB.'),
    ModelTypeConst.IMAGE,
    mimo_image_model_credential,
    MiMoVisionModel,
)

# -- TTS models --
mimo_tts = ModelInfo(
    'mimo-v2.5-tts',
    _('High-quality TTS with 9 built-in voices (Chinese & English), '
      'fine-grained style control, and singing mode.'),
    ModelTypeConst.TTS,
    mimo_tts_model_credential,
    MiMoTextToSpeech,
)

mimo_tts_voicedesign = ModelInfo(
    'mimo-v2.5-tts-voicedesign',
    _('Custom voice from text description. Describe the voice you want '
      '(1–4 sentences) and MiMo generates it. No built-in voices.'),
    ModelTypeConst.TTS,
    mimo_tts_model_credential,
    MiMoTextToSpeech,
)

mimo_tts_voiceclone = ModelInfo(
    'mimo-v2.5-tts-voiceclone',
    _('Clone a voice from a short audio sample. Provide a base64 data URI '
      'of the sample audio (MP3/WAV, max 10 MB encoded). No built-in voices.'),
    ModelTypeConst.TTS,
    mimo_tts_model_credential,
    MiMoTextToSpeech,
)

# -- STT / Speech Recognition model --
mimo_asr = ModelInfo(
    'mimo-v2.5-asr',
    _('Bilingual Chinese-English speech recognition with dialect support '
      '(Cantonese, Wu, Minnan, Sichuan). Handles noisy environments, '
      'far-field pickup, and multi-speaker overlap. Supports MP3 & WAV, '
      'max 10 MB.'),
    ModelTypeConst.STT,
    mimo_asr_model_credential,
    MiMoSpeechToText,
)

# -- Build the registry --
model_info_manage = (
    ModelInfoManage.builder()
    # LLM
    .append_model_info(mimo_v2_5_pro)
    .append_model_info(mimo_v2_5_pro_ultraspeed)
    .append_model_info(mimo_v2_5)
    .append_default_model_info(mimo_v2_5_pro)
    # Vision
    .append_model_info(mimo_v2_5_vision)
    .append_default_model_info(mimo_v2_5_vision)
    # TTS
    .append_model_info(mimo_tts)
    .append_model_info(mimo_tts_voicedesign)
    .append_model_info(mimo_tts_voiceclone)
    .append_default_model_info(mimo_tts)
    # STT
    .append_model_info(mimo_asr)
    .append_default_model_info(mimo_asr)
    .build()
)


class MiMoModelProvider(IModelProvider):

    def get_model_info_manage(self):
        return model_info_manage

    def get_model_provide_info(self):
        return ModelProvideInfo(
            provider='model_mimo_provider',
            name='Xiaomi MiMo',
            icon=get_file_content(
                os.path.join(
                    PROJECT_DIR, 'apps', 'models_provider', 'impl',
                    'mimo_model_provider', 'icon', 'mimo_icon_svg'
                )
            ),
        )
