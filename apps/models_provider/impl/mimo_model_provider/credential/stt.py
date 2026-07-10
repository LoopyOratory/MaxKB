# coding=utf-8
"""
    @project: maxkb
    @file: stt.py
    @desc: MiMo ASR credential — Speech Recognition v2.5
"""
from typing import Dict

from django.utils.translation import gettext_lazy as _, gettext

from common import forms
from common.exception.app_exception import AppApiException
from common.forms import BaseForm, TooltipLabel
from models_provider.base_model_provider import BaseModelCredential, ValidCode
from common.utils.logger import maxkb_logger


class MiMoASRModelParams(BaseForm):
    language = forms.SingleSelect(
        TooltipLabel(_('Language'),
                     _('Set the recognition language. Use "auto" for automatic detection, '
                       'or specify a language for better accuracy.')),
        required=True,
        default_value='auto',
        text_field='value',
        value_field='value',
        option_list=[
            {'text': _('Auto-detect'), 'value': 'auto'},
            {'text': _('Chinese (zh)'), 'value': 'zh'},
            {'text': _('English (en)'), 'value': 'en'},
        ])


class MiMoASRModelCredential(BaseForm, BaseModelCredential):
    api_base = forms.TextInputField(
        'API URL', required=True,
        default_value='https://api.xiaomimimo.com/v1',
    )
    api_key = forms.PasswordInputField('API Key', required=True)

    def is_valid(self, model_type: str, model_name, model_credential: Dict[str, object], model_params, provider,
                 raise_exception=False):
        model_type_list = provider.get_model_type_list()
        if not any(list(filter(lambda mt: mt.get('value') == model_type, model_type_list))):
            raise AppApiException(ValidCode.valid_error.value,
                                  gettext('{model_type} Model type is not supported').format(model_type=model_type))

        for key in ['api_base', 'api_key']:
            if key not in model_credential:
                if raise_exception:
                    raise AppApiException(ValidCode.valid_error.value, gettext('{key}  is required').format(key=key))
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
        return MiMoASRModelParams()
