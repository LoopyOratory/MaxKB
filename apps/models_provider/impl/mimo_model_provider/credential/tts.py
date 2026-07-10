# coding=utf-8
"""
    @project: maxkb
    @file: tts.py
    @desc: MiMo TTS credential — supports built-in voices, voice design, and voice cloning
"""
from typing import Dict

from django.utils.translation import gettext_lazy as _, gettext

from common import forms
from common.exception.app_exception import AppApiException
from common.forms import BaseForm, TooltipLabel
from models_provider.base_model_provider import BaseModelCredential, ValidCode
from common.utils.logger import maxkb_logger


class MiMoTTSModelGeneralParams(BaseForm):
    """Params for mimo-v2.5-tts (built-in voices)."""
    voice = forms.SingleSelect(
        TooltipLabel(_('Voice'),
                     _('Select the voice for speech synthesis. '
                       'Voices marked CN are Chinese, EN are English.')),
        required=True,
        default_value='Chloe',
        text_field='value',
        value_field='value',
        option_list=[
            {'text': _('MiMo Default'), 'value': 'mimo_default'},
            {'text': _('冰糖 (Bingtang) - CN Female'), 'value': '冰糖'},
            {'text': _('茉莉 (Moli) - CN Female'), 'value': '茉莉'},
            {'text': _('苏打 (Suda) - CN Male'), 'value': '苏打'},
            {'text': _('白桦 (Baihua) - CN Male'), 'value': '白桦'},
            {'text': _('Mia - EN Female'), 'value': 'Mia'},
            {'text': _('Chloe - EN Female'), 'value': 'Chloe'},
            {'text': _('Milo - EN Male'), 'value': 'Milo'},
            {'text': _('Dean - EN Male'), 'value': 'Dean'},
        ])


class MiMoTTSVoicedesignParams(BaseForm):
    """Params for mimo-v2.5-tts-voicedesign (custom voice from text description)."""
    voice_prompt = forms.TextInputField(
        TooltipLabel(_('Voice Description'),
                     _('Describe the voice you want to create. '
                       '1–4 sentences recommended. Avoid post-processing terms '
                       '(reverb, echo, EQ, compression) and vague descriptors. '
                       'Example: "A warm, gentle female voice with a slight smile, '
                       'speaking at a moderate pace"')),
        required=True,
        default_value='',
    )


class MiMoTTSVoicecloneParams(BaseForm):
    """Params for mimo-v2.5-tts-voiceclone (clone voice from audio sample)."""
    voice_data_uri = forms.TextInputField(
        TooltipLabel(_('Voice Sample (data URI)'),
                     _('Base64-encoded audio sample as a data URI. '
                       'Format: data:audio/mpeg;base64,<base64> '
                       'Max 10 MB after encoding. Supported: MP3, WAV.')),
        required=True,
        default_value='',
    )


class MiMoTTSModelCredential(BaseForm, BaseModelCredential):
    api_key = forms.PasswordInputField('API Key', required=True)

    def is_valid(self, model_type: str, model_name, model_credential: Dict[str, object], model_params, provider,
                 raise_exception=False):
        model_type_list = provider.get_model_type_list()
        if not any(list(filter(lambda mt: mt.get('value') == model_type, model_type_list))):
            raise AppApiException(ValidCode.valid_error.value,
                                  gettext('{model_type} Model type is not supported').format(model_type=model_type))

        if 'api_key' not in model_credential:
            if raise_exception:
                raise AppApiException(ValidCode.valid_error.value, gettext('{key}  is required').format(key='api_key'))
            else:
                return False
        try:
            model = provider.get_model(model_type, model_name, model_credential, **model_params)
            model.check_auth()
        except Exception as e:
            maxkb_logger.error(f'Exception: {e}', exc_info=True)
            if isinstance(e, AppApiException):
                raise e
            if raise_exception:
                raise AppApiException(ValidCode.valid_error.value,
                                      gettext(
                                          'Verification failed, please check whether the parameters are correct: {error}').format(
                                          error=str(e)))
            else:
                return False
        return True

    def encryption_dict(self, model: Dict[str, object]):
        return {**model, 'api_key': super().encryption(model.get('api_key', ''))}

    def get_model_params_setting_form(self, model_name):
        if 'voicedesign' in (model_name or ''):
            return MiMoTTSVoicedesignParams()
        elif 'voiceclone' in (model_name or ''):
            return MiMoTTSVoicecloneParams()
        return MiMoTTSModelGeneralParams()
