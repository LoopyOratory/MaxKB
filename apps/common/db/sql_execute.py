# coding=utf-8
"""
    @project: maxkb
    @Author: Tiger
    @file: sql_execute.py
    @date：2023/9/25 20:05
    @desc:
"""
from typing import List

from django.db import connection


def sql_execute(sql: str, params):
    """
    ExecuteOnesql
    :param sql:     NeedsExecute的sql
    :param params:  sqlParameters
    :return:        ExecuteResult
    """
    with connection.cursor() as cursor:
        cursor.execute(sql, params)
        columns = list(map(lambda d: d.name, cursor.description))
        res = cursor.fetchall()
        result = list(map(lambda row: dict(list(zip(columns, row))), res))
        cursor.close()
        return result


def update_execute(sql: str, params):
    """
      ExecuteOnesql
      :param sql:     NeedsExecute的sql
      :param params:  sqlParameters
      :return:        ExecuteResult
      """
    with connection.cursor() as cursor:
        cursor.execute(sql, params)
        affected_rows = cursor.rowcount
        cursor.close()
        return affected_rows


def select_list(sql: str, params: List):
    """
    Executesql QueryListData
    :param sql:     NeedsExecute的sql
    :param params:  sql的Parameters
    :return: QueryResult
    """
    result_list = sql_execute(sql, params)
    if result_list is None:
        return []
    return result_list


def select_one(sql: str, params: List):
    """
    Executesql QueryOneData
    :param sql:     NeedsExecute的sql
    :param params:  Parameters
    :return: QueryResult
    """
    result_list = sql_execute(sql, params)
    if result_list is None or len(result_list) == 0:
        return None
    return result_list[0]
