# apps/common/locale/cache.py
"""
LanguageConfigurationCacheManage
避免重复扫描FileSystem，提升性能
"""

import time
from typing import Optional, List, Tuple


class LocaleCache:
    """LanguageConfigurationCache"""

    def __init__(self, ttl: int = 300):
        """
        InitializeCache

        Args:
            ttl: Cache有效期（秒），Default 5 Minutes
        """
        self._cache: Optional[List[Tuple[str, str]]] = None
        self._timestamp: float = 0
        self._ttl = ttl

    def get(self) -> Optional[List[Tuple[str, str]]]:
        """GetCache的LanguageList"""
        if self._cache is not None and (time.time() - self._timestamp) < self._ttl:
            return self._cache
        return None

    def set(self, languages: List[Tuple[str, str]]):
        """SettingsCache的LanguageList"""
        self._cache = languages
        self._timestamp = time.time()

    def invalidate(self):
        """ClearCache"""
        self._cache = None
        self._timestamp = 0

    @property
    def is_valid(self) -> bool:
        """CheckCacheWhether有效"""
        return self._cache is not None and (time.time() - self._timestamp) < self._ttl


# GlobalCacheInstance
_locale_cache = LocaleCache(ttl=300)


def get_locale_cache() -> LocaleCache:
    """GetGlobalLanguageCacheInstance"""
    return _locale_cache
