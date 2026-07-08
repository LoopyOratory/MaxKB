# coding=utf-8
"""
    @project: MaxKB
    @Author: Tiger
    @file: tools.py
    @date：2024/7/22 11:18
    @desc:
"""
from django.db import connection
from django.db.models import QuerySet

from common.config.embedding_config import ModelManage
from common.database_model_manage.database_model_manage import DatabaseModelManage
from models_provider.base_model_provider import ModelTypeConst
from models_provider.models import Model
from django.utils.translation import gettext_lazy as _

import json
from typing import Dict

from common.utils.rsa_util import rsa_long_decrypt
from models_provider.constants.model_provider_constants import ModelProvideConstants


def get_model_(provider, model_type, model_name, credential, model_id, use_local=False, **kwargs):
    """
    GetModelInstance
    @param provider:   Provider
    @param model_type: Model type
    @param model_name: ModelName
    @param credential: AuthenticationInfo
    @param model_id:   Modelid
    @param use_local:  WhetherCallLocalModel 只适Used forLocalProvider
    @return: ModelInstance
    """
    model = get_provider(provider).get_model(model_type, model_name,
                                             json.loads(
                                                 rsa_long_decrypt(credential)),
                                             model_id=model_id,
                                             use_local=use_local,
                                             streaming=True, **kwargs)
    return model


def get_model(model, **kwargs):
    """
    GetModelInstance
    @param model: model Data库ModelInstanceObject
    @return: ModelInstance
    """
    return get_model_(model.provider, model.model_type, model.model_name, model.credential, str(model.id), **kwargs)


def get_provider(provider):
    """
    GetProviderInstance
    @param provider: ProviderString
    @return: ProviderInstance
    """
    return ModelProvideConstants[provider].value


def get_model_list(provider, model_type):
    """
    GetModelList
    @param provider:   ProviderString
    @param model_type: Model type
    @return:  ModelList
    """
    return get_provider(provider).get_model_list(model_type)


def get_model_credential(provider, model_type, model_name):
    """
    GetModelAuthenticationInstance
    @param provider:   ProviderString
    @param model_type: Model type
    @param model_name: ModelName
    @return:  AuthenticationInstanceObject
    """
    return get_provider(provider).get_model_credential(model_type, model_name)


def get_model_type_list(provider):
    """
    GetModel typeList
    @param provider:  ProviderString
    @return:  Model typeList
    """
    return get_provider(provider).get_model_type_list()


def is_valid_credential(provider, model_type, model_name, model_credential: Dict[str, object], model_params,
                        raise_exception=False):
    """
    ValidateModelAuthenticationParameters
    @param provider:         ProviderString
    @param model_type:       Model type
    @param model_name:       ModelName
    @param model_credential: ModelAuthenticationData
    @param raise_exception:  Whether抛出Error
    @return: True|False
    """
    return get_provider(provider).is_valid_credential(model_type, model_name, model_credential, model_params,
                                                      raise_exception)


def get_model_by_id(_id, workspace_id):
    model = QuerySet(Model).filter(id=_id).first()
    # 归还Link到Connect池
    connection.close()
    get_authorized_model = DatabaseModelManage.get_model("get_authorized_model")
    if model and model.workspace_id != workspace_id and get_authorized_model is not None:
        model = get_authorized_model(QuerySet(Model).filter(id=_id), workspace_id).first()
    if model is None:
        raise Exception(_("Model does not exist"))
    return model


def get_model_default_params(model):
    def convert_to_int(value):
        if isinstance(value, str):
            try:
                return int(value)
            except ValueError:
                return value
        return value

    return {
        p.get('field'): convert_to_int(p.get('default_value'))
        for p in model.model_params_form
    }


def reset_model_params(default_model_params, **kwargs):
    result = {}
    for key, value in default_model_params.items():
        _value = kwargs.get(key) if kwargs.get(key) is not None else default_model_params.get(key)
        if _value is not None:
            result[key] = _value
    return result


def get_model_instance_by_model_workspace_id(model_id, workspace_id, **kwargs):
    """
    GetModelInstance,Based onModelRelatedData
    @param model_id:        Modelid
    @param workspace_id:    Workspace id
    @return:                ModelInstance
    """
    model = get_model_by_id(model_id, workspace_id)
    default_model_params = get_model_default_params(model)
    if model.model_type == ModelTypeConst.RERANKER.name:
        default_model_params.setdefault('top_n', 3)
    model_params = reset_model_params(default_model_params, **kwargs)
    return ModelManage.get_model(model_id, lambda _id: get_model(model, **model_params))
