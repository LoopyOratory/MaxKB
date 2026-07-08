# coding=utf-8
"""
    @project: qabot
    @Author: Tiger
    @file: lock.py
    @date：2023/9/11 11:45
    @desc:
"""
from functools import wraps

import uuid_utils.compat as uuid
from django.core.cache import caches
from django_redis import get_redis_connection

memory_cache = caches['default']

class RedisLock():
    def __init__(self):
        self.lock_value = None

    def try_lock(self, key: str, timeout=None):
        """
        Get锁
        :param key:    Get锁 key
        :param timeout Timeout
        :return: WhetherGet到锁
        """
        redis_client = get_redis_connection("default")
        if timeout is None:
            timeout = 3600  # DefaultTimeout为3600秒
        self.lock_value = str(uuid.uuid7())
        return redis_client.set(key, self.lock_value, nx=True, ex=timeout)


    def un_lock(self, key: str):
        """
        解锁
        :param key: 解锁 key
        :return: Whether解锁Success
        """
        redis_client = get_redis_connection("default")
        unlock_script = """
            if redis.call("get", KEYS[1]) == ARGV[1] then
                return redis.call("del", KEYS[1])
            else
                return 0
            end
            """
        redis_client.eval(unlock_script, 1, key, self.lock_value)


def lock(lock_key, timeout=None):
    """
    给OneFunction上锁
    @param lock_key: 上锁key String|Function  FunctionReturn值为String
    @param timeout:  Timeout
    :return: 装饰器Function Current装饰器主要LimitOnekey只能One线程去Call Samekey只能阻塞Wait上OneTaskExecute完毕 Differentkey不NeedsWait

    """

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            key = lock_key(*args, **kwargs) if callable(lock_key) else lock_key
            rlock = RedisLock()
            if not rlock.try_lock(key, timeout):
                # Get锁Failure，可CustomException或Return
                return None
            try:
                return func(*args, **kwargs)
            finally:
                rlock.un_lock(key)

        return wrapper

    return decorator
