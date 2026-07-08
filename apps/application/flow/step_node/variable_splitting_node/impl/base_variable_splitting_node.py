# coding=utf-8
"""
    @project: MaxKB
    @Author: Tiger
    @file: base_variable_splitting_node.py
    @date：2025/10/13 15:02
    @desc:
"""
import json
from jsonpath_ng.ext import parse
from common.cache.mem_cache import MemCache

from application.flow.i_step_node import NodeResult
from application.flow.step_node.variable_splitting_node.i_variable_splitting_node import IVariableSplittingNode

jsonpath_expr_cache = MemCache('parse_path', {
    'TIMEOUT': 3600, # CacheValid for 1 Hours
    'OPTIONS': {
        'MAX_ENTRIES': 1000, # At mostCache 1000  entries
        'CULL_FREQUENCY': 10, # When limit is reached, Deletion约 1/10 的Cache
    },
})

def parse_and_cache(path):
    jsonpath_expr = jsonpath_expr_cache.get(path)
    if not jsonpath_expr:
        jsonpath_expr = parse(path)
        jsonpath_expr_cache.set(path, jsonpath_expr)
    return jsonpath_expr

def smart_jsonpath_search(data: dict, path: str):
    """
    智能JSON PathSearch
    Return:
    - 单个Match: DirectReturn值
    - 多个Match: ReturnValueList
    - 无Match: ReturnNone
    """
    jsonpath_expr = parse_and_cache(path)
    matches = jsonpath_expr.find(data)

    if not matches:
        return None
    elif len(matches) == 1:
        return matches[0].value
    else:
        return [match.value for match in matches]


class BaseVariableSplittingNode(IVariableSplittingNode):
    def save_context(self, details, workflow_manage):
        for key, value in details.get('result').items():
            self.context[key] = value
        self.context['result'] = details.get('result')
        self.context['request'] = details.get('request')
        self.context['exception_message'] = details.get('err_message')

    def execute(self, input_variable, variable_list, **kwargs) -> NodeResult:
        if isinstance(input_variable, str):
            try:
                input_variable = json.loads(input_variable)
            except Exception:
                pass

        self.context['request'] = input_variable
        response = {v['field']: smart_jsonpath_search(input_variable, v['expression']) for v in variable_list}
        return NodeResult({'result': response, **response}, {})

    def get_details(self, index: int, **kwargs):
        return {
            'name': self.node.properties.get('stepName'),
            "index": index,
            'run_time': self.context.get('run_time'),
            'type': self.node.type,
            'request': self.context.get('request'),
            'result': self.context.get('result'),
            'status': self.status,
            'err_message': self.err_message,
            'enableException': self.node.properties.get('enableException'),
        }
