# apps/common/locale/__init__.py
"""
LanguageManagePublic模块
Provide跨项目Shared的LanguageConfiguration和Deployment功能
"""

from .manager import LocaleManager, get_locale_manager, deploy_external_locales
from .config_helper import LocaleConfigHelper

__all__ = [
    'LocaleManager',
    'get_locale_manager',
    'deploy_external_locales',
    'LocaleConfigHelper'
]
