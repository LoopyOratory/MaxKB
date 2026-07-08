# coding=utf-8
"""
    @project: maxkb
    @Author: Tiger
    @file: search.py
    @date：2023/10/7 18:20
    @desc:
"""
import hashlib
from typing import Dict, Any

from django.db import DEFAULT_DB_ALIAS, models, connections
from django.db.models import QuerySet

from common.db.compiler import AppSQLCompiler
from common.db.sql_execute import select_one, select_list, update_execute
from common.result import Page

# AddModelCache
_model_cache = {}


def get_dynamics_model(attr: dict, table_name='dynamics'):
    """
    GetOneDynamic的djangoModel
    :param attr:       ModelField
    :param table_name: Table name
    :return: django Model
    """
    # CreationCache键，基于属性和Table name
    cache_key = hashlib.md5(f"{table_name}_{str(sorted(attr.items()))}".encode()).hexdigest()
    # print(f'cache_key: {cache_key}')

    # IfModel已Exists，DirectReturnCache的Model
    if cache_key in _model_cache:
        return _model_cache[cache_key]

    attributes = {
        "__module__": "knowledge.models",
        "Meta": type("Meta", (), {'db_table': table_name}),
        **attr
    }

    # UseUnique的类名避免冲突
    class_name = f'Dynamics_{cache_key[:8]}'
    model_class = type(class_name, (models.Model,), attributes)

    # CacheModel
    _model_cache[cache_key] = model_class

    return model_class


def generate_sql_by_query_dict(queryset_dict: Dict[str, QuerySet], select_string: str,
                               field_replace_dict: None | Dict[str, Dict[str, str]] = None, with_table_name=False):
    """
    Generate Querysql
    :param with_table_name:
    :param queryset_dict: 多Condition QueryCondition
    :param select_string: Querysql
    :param field_replace_dict:  NeedsReplace的QueryField,Generally notNeedsPass inIfHas specialNeedsPass in
    :return: sql:NeedsQuery的sql params: sql Parameters
    """

    params_dict: Dict[int, Any] = {}
    result_params = []
    for key in queryset_dict.keys():
        value = queryset_dict.get(key)
        sql, params = compiler_queryset(value, None if field_replace_dict is None else field_replace_dict.get(key),
                                        with_table_name)
        params_dict = {**params_dict, select_string.index("${" + key + "}"): params}
        select_string = select_string.replace("${" + key + "}", sql)

    for key in sorted(list(params_dict.keys())):
        result_params = [*result_params, *params_dict.get(key)]
    return select_string, result_params


def generate_sql_by_query(queryset: QuerySet, select_string: str,
                          field_replace_dict: None | Dict[str, str] = None, with_table_name=False):
    """
    Generate Querysql
    :param queryset:            QueryCondition
    :param select_string:       Originalsql
    :param field_replace_dict:  NeedsReplace的QueryField,Generally notNeedsPass inIfHas specialNeedsPass in
    :return:  sql:NeedsQuery的sql params: sql Parameters
    """
    sql, params = compiler_queryset(queryset, field_replace_dict, with_table_name)
    return select_string + " " + sql, params


def compiler_queryset(queryset: QuerySet, field_replace_dict: None | Dict[str, str] = None, with_table_name=False):
    """
    Parse querysetQueryObject
    :param with_table_name:
    :param queryset:            QueryObject
    :param field_replace_dict:  NeedsReplace的QueryField,Generally notNeedsPass inIfHas specialNeedsPass in
    :return: sql:NeedsQuery的sql params: sql Parameters
    """
    q = queryset.query
    compiler = q.get_compiler(DEFAULT_DB_ALIAS)
    if field_replace_dict is None:
        field_replace_dict = get_field_replace_dict(queryset)
    app_sql_compiler = AppSQLCompiler(q, using=DEFAULT_DB_ALIAS, connection=compiler.connection,
                                      field_replace_dict=field_replace_dict)
    sql, params = app_sql_compiler.get_query_str(with_table_name=with_table_name)
    return sql, params


def native_search(queryset: QuerySet | Dict[str, QuerySet], select_string: str,
                  field_replace_dict: None | Dict[str, Dict[str, str]] | Dict[str, str] = None,
                  with_search_one=False, with_table_name=False):
    """
    ComplexQuery
    :param with_table_name:     GeneratesqlWhetherContainsTable name
    :param queryset:            QueryCondition构造器
    :param select_string:       QueryPrefix Exclude where limit 等Info
    :param field_replace_dict:  NeedsReplace的Field
    :param with_search_one:     Query
    :return: QueryResult
    """
    if isinstance(queryset, Dict):
        exec_sql, exec_params = generate_sql_by_query_dict(queryset, select_string, field_replace_dict, with_table_name)
    else:
        exec_sql, exec_params = generate_sql_by_query(queryset, select_string, field_replace_dict, with_table_name)
    if with_search_one:
        return select_one(exec_sql, exec_params)
    else:
        return select_list(exec_sql, exec_params)


def native_update(queryset: QuerySet | Dict[str, QuerySet], select_string: str,
                  field_replace_dict: None | Dict[str, Dict[str, str]] | Dict[str, str] = None,
                  with_table_name=False):
    """
    ComplexQuery
    :param with_table_name:     GeneratesqlWhetherContainsTable name
    :param queryset:            QueryCondition构造器
    :param select_string:       QueryPrefix Exclude where limit 等Info
    :param field_replace_dict:  NeedsReplace的Field
    :return: QueryResult
    """
    if isinstance(queryset, Dict):
        exec_sql, exec_params = generate_sql_by_query_dict(queryset, select_string, field_replace_dict, with_table_name)
    else:
        exec_sql, exec_params = generate_sql_by_query(queryset, select_string, field_replace_dict, with_table_name)
    return update_execute(exec_sql, exec_params)


def page_search(current_page: int, page_size: int, queryset: QuerySet, post_records_handler):
    """
    PaginationQuery
    :param current_page:         Current页
    :param page_size:            Per pageSize
    :param queryset:             QueryCondition
    :param post_records_handler: DataProcess器
    :return:  PaginationResult
    """
    total = QuerySet(query=queryset.query.clone(), model=queryset.model).count()
    result = queryset.all()[((current_page - 1) * page_size):(current_page * page_size)]
    return Page(total, list(map(post_records_handler, result)), current_page, page_size)


def native_page_search(current_page: int, page_size: int, queryset: QuerySet | Dict[str, QuerySet], select_string: str,
                       field_replace_dict=None,
                       post_records_handler=lambda r: r,
                       with_table_name=False):
    """
    ComplexPaginationQuery
    :param with_table_name:
    :param current_page:          Current页
    :param page_size:             Per pageSize
    :param queryset:              QueryCondition
    :param select_string:         Query
    :param field_replace_dict:    特殊FieldReplace
    :param post_records_handler:  DatarowProcess器
    :return: PaginationResult
    """
    if isinstance(queryset, Dict):
        exec_sql, exec_params = generate_sql_by_query_dict(queryset, select_string, field_replace_dict, with_table_name)
    else:
        exec_sql, exec_params = generate_sql_by_query(queryset, select_string, field_replace_dict, with_table_name)
    total_sql = "SELECT \"count\"(*) FROM (%s) temp" % exec_sql
    total = select_one(total_sql, exec_params)
    limit_sql = connections[DEFAULT_DB_ALIAS].ops.limit_offset_sql(
        ((current_page - 1) * page_size), (current_page * page_size)
    )
    page_sql = exec_sql + " " + limit_sql
    result = select_list(page_sql, exec_params)
    return Page(total.get("count"), list(map(post_records_handler, result)), current_page, page_size)


def native_page_handler(page_size: int,
                        queryset: QuerySet | Dict[str, QuerySet],
                        select_string: str,
                        field_replace_dict=None,
                        with_table_name=False,
                        primary_key=None,
                        get_primary_value=None,
                        primary_queryset: str = None,
                        ):
    if isinstance(queryset, Dict):
        exec_sql, exec_params = generate_sql_by_query_dict({**queryset,
            primary_queryset: queryset[primary_queryset].order_by(
                primary_key)}, select_string, field_replace_dict, with_table_name)
    else:
        exec_sql, exec_params = generate_sql_by_query(queryset.order_by(
            primary_key), select_string, field_replace_dict, with_table_name)
    total_sql = "SELECT \"count\"(*) FROM (%s) temp" % exec_sql
    total = select_one(total_sql, exec_params)
    processed_count = 0
    last_id = None
    while processed_count < total.get("count"):
        if last_id is not None:
            if isinstance(queryset, Dict):
                exec_sql, exec_params = generate_sql_by_query_dict({**queryset,
                    primary_queryset: queryset[primary_queryset].filter(
                        **{f"{primary_key}__gt": last_id}).order_by(
                        primary_key)},
                    select_string, field_replace_dict,
                    with_table_name)
            else:
                exec_sql, exec_params = generate_sql_by_query(
                    queryset.filter(**{f"{primary_key}__gt": last_id}).order_by(
                        primary_key),
                    select_string, field_replace_dict,
                    with_table_name)
        limit_sql = connections[DEFAULT_DB_ALIAS].ops.limit_offset_sql(
            0, page_size
        )
        page_sql = exec_sql + " " + limit_sql
        result = select_list(page_sql, exec_params)
        yield result
        processed_count += page_size
        last_id = get_primary_value(result[-1])


def get_field_replace_dict(queryset: QuerySet):
    """
    GetNeedsReplace的Field Default “xxx.xxx”Needs被Replace成 “xxx”."xxx"
    :param queryset: QueryObject
    :return: NeedsReplace的Dict
    """
    result = {}
    for field in queryset.model._meta.local_fields:
        if field.attname.__contains__("."):
            replace_field = to_replace_field(field.attname)
            result.__setitem__('"' + field.attname + '"', replace_field)
    return result


def to_replace_field(field: str):
    """
    将field Transform为 NeedsReplace的field  “xxx.xxx”Needs被Replace成 “xxx”."xxx" 只Replace fieldContains.的Field
    :param field: django fieldField
    :return: ReplaceField
    """
    split_field = field.split(".")
    return ".".join(list(map(lambda sf: '"' + sf + '"', split_field)))
