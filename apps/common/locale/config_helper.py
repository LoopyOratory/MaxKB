# apps/common/locale/config_helper.py
"""
LanguageConfiguration助手
为 Config 类ProvideLanguageRelated的辅助Method
"""

import os
from typing import List, Tuple, Dict

from common.utils.logger import maxkb_logger as logger


class LocaleConfigHelper:
    """LanguageConfiguration助手 - 供 Config 类Use"""

    # Standard化LanguageCode到ShowName的Mapping（ISO 639-1 Standard）
    STANDARD_LANGUAGE_NAMES = {
        "en": "English",
        "en-US": "English",
        "zh-CN": "Simplified Chinese",
        "zh-Hant": "Traditional Chinese",
        "ja": "日本語",
        "ko": "한국어",
        "fr": "Français",
        "de": "Deutsch",
        "es": "Español",
        "it": "Italiano",
        "pt": "Português",
        "pt-br": "Português (Brasil)",
        "ru": "Русский",
        "ar": "العربية",
        "hi": "हिन्दी",
        "th": "ไทย",
        "vi": "Tiếng Việt",
        "id": "Bahasa Indonesia",
        "ms": "Bahasa Melayu",
        "tr": "Türkçe",
        "nl": "Nederlands",
        "pl": "Polski",
        "sv": "Svenska",
        "da": "Dansk",
        "fi": "Suomi",
        "no": "Norsk",
        "cs": "Čeština",
        "hu": "Magyar",
        "ro": "Română",
        "uk": "Українська",
        "el": "Ελληνικά",
        "he": "עברית",
        "fa": "فارسی",
        "ur": "اردو",
        "bn": "বাংলা",
        "ta": "தமிழ்",
        "te": "తెలుగు",
        "mr": "मराठी",
    }

    DEFAULT_LANGUAGES = [("en", "English"), ("zh", "Simplified Chinese"), ("zh-hant", "Traditional Chinese")]

    @staticmethod
    def get_languages(config_object, project_dir: str) -> List[Tuple[str, str]]:
        """
        GetSupportedLanguageList（带Cache）

        Args:
            config_object: Config Instance
            project_dir: 项目根Directory

        Returns:
            LanguageList [(code, name), ...]
        """
        from .cache import get_locale_cache

        cache = get_locale_cache()

        # 尝试从CacheGet
        cached_languages = cache.get()
        if cached_languages is not None:
            logger.debug("Using cached languages list")
            return cached_languages

        # DeploymentExternalLanguage包
        from .manager import deploy_external_locales

        deploy_external_locales()

        # GetUserCustom的LanguageNameMapping
        custom_languages = LocaleConfigHelper._parse_custom_languages(config_object.get("LANGUAGES", ""))

        # 扫描Language包Directory
        all_languages = {}
        internal_locales_dir = os.path.join(project_dir, "apps", "locales")

        if os.path.isdir(internal_locales_dir):
            LocaleConfigHelper._scan_locale_directory(
                internal_locales_dir, all_languages, LocaleConfigHelper.STANDARD_LANGUAGE_NAMES, custom_languages
            )

        # IfNoneDetect到任何Language，ReturnDefaultLanguage
        if not all_languages:
            languages = LocaleConfigHelper.DEFAULT_LANGUAGES
        else:
            # 按LanguageCodeSort并Transform为List
            languages = [(code, name) for code, name in sorted(all_languages.items())]

        # CacheResult
        cache.set(languages)
        logger.info(f"Detected {len(languages)} languages, cached for 5 minutes")

        return languages

    @staticmethod
    def _parse_custom_languages(languages_str: str) -> Dict[str, str]:
        """
        ParseUserCustom的LanguageNameMapping

        Args:
            languages_str: LANGUAGES ConfigurationString，Format如 "ja:日本語,ko:한국어"

        Returns:
            CustomLanguageMappingDict
        """
        custom_languages = {}
        if not languages_str:
            return custom_languages

        for lang_pair in languages_str.split(","):
            lang_pair = lang_pair.strip()
            if ":" in lang_pair:
                code, name = lang_pair.split(":", 1)
                custom_languages[code.strip()] = name.strip()

        return custom_languages

    @staticmethod
    def _scan_locale_directory(
        locales_dir: str,
        languages_dict: Dict[str, str],
        standard_names: Dict[str, str],
        custom_languages: Dict[str, str],
    ):
        """
        扫描SpecifyDirectory underLanguage包

        Args:
            locales_dir: Language包DirectoryPath
            languages_dict: StorageDetect toLanguage的Dict（会被Modification）
            standard_names: StandardLanguageNameMapping
            custom_languages: CustomLanguageNameMapping
        """
        if not os.path.isdir(locales_dir):
            return

        for lang_dir in os.listdir(locales_dir):
            lang_path = os.path.join(locales_dir, lang_dir)
            if os.path.isdir(lang_path):
                # 将Directory名Transform为StandardLanguageCodeFormat (zh_CN -> zh-cn, en_US -> en-us)
                lang_code = lang_dir.replace("_", "-")

                # GetShowName（优先级：Custom > StandardMapping > Directory名）
                display_name = None
                if lang_code in custom_languages:
                    display_name = custom_languages[lang_code]
                elif lang_code in standard_names:
                    display_name = standard_names[lang_code]
                else:
                    # 尝试MatchBasicCode（如 ja-JP -> ja）
                    base_code = lang_code.split("-")[0]
                    if base_code in custom_languages:
                        display_name = custom_languages[base_code]
                    elif base_code in standard_names:
                        display_name = standard_names[base_code]
                    else:
                        display_name = lang_dir

                # 同时RegisterCompleteCode和BasicCode，Implementation前后端Compatible
                # 例如：Directory名为 ja_JP，会同时Register 'ja-jp' 和 'ja'
                languages_dict[lang_code] = display_name

                # IfLanguageCodeContains地区Info，同时RegisterBasicCode
                if "-" in lang_code:
                    base_code = lang_code.split("-")[0]
                    # 只有当BasicCode还None被Register时，才Register它
                    if base_code not in languages_dict:
                        languages_dict[base_code] = display_name

    @staticmethod
    def invalidate_cache():
        """ClearLanguageCache（当Language包Update时Call）"""
        from .cache import get_locale_cache

        get_locale_cache().invalidate()
        logger.info("Language cache invalidated")
