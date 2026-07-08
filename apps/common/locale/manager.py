# apps/common/locale_manager.py
"""
Language包Manage器
负责ExternalLanguage包的Deployment、编译和Manage
"""

import os
import json
import shutil
import zipfile
import subprocess
import filecmp


from common.utils.logger import maxkb_logger as logger


class LocaleManager:
    """Language包Manage器"""

    def __init__(self, external_locale_path: str = None):
        """
        InitializeLanguage包Manage器

        Args:
            external_locale_path: ExternalLanguage包Path，Default从ConfigurationRead
        """
        from maxkb.const import CONFIG, PROJECT_DIR

        self.PROJECT_DIR = PROJECT_DIR
        self.external_locale_path = external_locale_path or CONFIG.get(
            "EXTERNAL_LOCALE_PATH", "/opt/maxkb/local/locales"
        )

        # DirectoryPath
        self.internal_locales_dir = os.path.join(self.PROJECT_DIR, "apps", "locales")
        self.static_locales_dirs = [
            os.path.join(self.PROJECT_DIR, "apps", "static", "admin", "locales"),
            os.path.join(self.PROJECT_DIR, "apps", "static", "chat", "locales"),
        ]

    def deploy_all(self) -> bool:
        """
        DeploymentAllExternalLanguage包

        Returns:
            bool: WhetherSuccessDeployment
        """
        if not self.external_locale_path or not os.path.exists(self.external_locale_path):
            logger.debug(f"External locale path not found: {self.external_locale_path}")
            return False

        # EnsureDirectoryExists
        os.makedirs(self.internal_locales_dir, exist_ok=True)
        for static_dir in self.static_locales_dirs:
            os.makedirs(static_dir, exist_ok=True)

        logger.info(f"Scanning external locales from: {self.external_locale_path}")

        deployed_count = 0
        for item in os.listdir(self.external_locale_path):
            if item.startswith("."):
                continue

            item_path = os.path.join(self.external_locale_path, item)

            try:
                if item.endswith(".zip"):
                    if self._deploy_zip(item_path, item):
                        deployed_count += 1
                elif os.path.isdir(item_path):
                    if self._deploy_folder(item_path, item):
                        deployed_count += 1

                # EachLanguage包Deployment后UpdateIndex
                self._write_static_index()

            except Exception as e:
                logger.error(f"Failed to deploy locale {item}: {str(e)}", exc_info=True)
                continue

        logger.info(f"External locale deployment completed. Deployed {deployed_count} locales.")
        return deployed_count > 0

    def _deploy_zip(self, zip_path: str, zip_name: str) -> bool:
        """Deployment ZIP Format的Language包"""
        lang_code = zip_name[:-4].replace("-", "_")
        logger.info(f"Processing zip locale: {zip_name}")

        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            file_list = zip_ref.namelist()
            po_files = [f for f in file_list if f.endswith(".po")]
            json_files = [f for f in file_list if f.endswith(".json")]

            if not po_files or not json_files:
                logger.warning(f"Zip {zip_name} missing required files (.po and .json)")
                return False

            po_content = zip_ref.read(po_files[0])
            json_content = zip_ref.read(json_files[0])

            return self._deploy_files(lang_code, po_content=po_content, json_content=json_content)

    def _deploy_folder(self, folder_path: str, folder_name: str) -> bool:
        """DeploymentFolderFormat的Language包"""
        lang_code = folder_name.replace("-", "_")
        logger.info(f"Processing folder locale: {folder_name}")

        po_file = None
        json_file = None

        for root, _, files in os.walk(folder_path):
            for file in files:
                if file.endswith(".po") and po_file is None:
                    po_file = os.path.join(root, file)
                elif file.endswith(".json") and json_file is None:
                    json_file = os.path.join(root, file)
            if po_file and json_file:
                break

        if not po_file or not json_file:
            logger.warning(f"Folder {folder_name} missing required files (.po and .json)")
            return False

        return self._deploy_files(lang_code, po_src=po_file, json_src=json_file)

    def _deploy_files(self, lang_code: str, po_content=None, json_content=None, po_src=None, json_src=None) -> bool:
        """
        Deployment单个Language包的File

        Returns:
            bool: PO FileWhether发生变化
        """
        po_changed = False

        # Deployment PO File
        lang_dir = os.path.join(self.internal_locales_dir, lang_code)
        lc_messages_dir = os.path.join(lang_dir, "LC_MESSAGES")
        os.makedirs(lc_messages_dir, exist_ok=True)

        po_dest = os.path.join(lc_messages_dir, "django.po")

        if po_content is not None:
            old_content = None
            if os.path.exists(po_dest):
                with open(po_dest, "rb") as f:
                    old_content = f.read()
            if old_content != po_content:
                with open(po_dest, "wb") as f:
                    f.write(po_content)
                po_changed = True
        elif po_src:
            if not os.path.exists(po_dest) or not filecmp.cmp(po_src, po_dest, shallow=False):
                shutil.copy2(po_src, po_dest)
                po_changed = True

        # If PO File变化，编译 MO File
        if po_changed:
            self._compile_po_to_mo(po_dest)
            self._reload_django_mo(lang_code)
            logger.info(f"Compiled MO file for {lang_code}")

        # Deployment JSON File
        self._deploy_json_files(lang_code, json_content=json_content, json_src=json_src)

        return po_changed

    def _deploy_json_files(self, lang_code: str, json_content=None, json_src=None):
        """Deployment JSON File到静态Directory（只Write admin，然后Copy到 chat）"""
        file_name = f"{lang_code.replace('_', '-')}.json"

        if json_content is None and json_src and os.path.isfile(json_src):
            with open(json_src, "rb") as f:
                json_content = f.read()

        if json_content is None:
            logger.warning(f"Skip JSON deploy for {lang_code}: no valid source")
            return

        # 只Write admin Directory
        admin_static_dir = self.static_locales_dirs[0]
        os.makedirs(admin_static_dir, exist_ok=True)
        static_json_dest = os.path.join(admin_static_dir, file_name)

        with open(static_json_dest, "wb") as f:
            f.write(json_content)
        logger.info(f"Deployed JSON file to: {static_json_dest}")

    def _write_static_index(self):
        """Generate静态Directory的 index.json 并Sync到 chat Directory"""
        admin_static_dir = self.static_locales_dirs[0]

        if not os.path.exists(admin_static_dir):
            return

        json_files = [f for f in os.listdir(admin_static_dir) if f.endswith(".json") and f != "index.json"]

        # 为 admin DirectoryGenerate index.json
        index_file = os.path.join(admin_static_dir, "index.json")
        with open(index_file, "w", encoding="utf-8") as f:
            json.dump(
                {"locales": [f[:-5] for f in json_files]},
                f,
                ensure_ascii=False,
                indent=2,
            )
        logger.info(f"Updated locale index file: {index_file}")

        # 将 admin Directory的AllFileCopy到 chat Directory
        chat_static_dir = self.static_locales_dirs[1]
        os.makedirs(chat_static_dir, exist_ok=True)

        for filename in os.listdir(admin_static_dir):
            src_file = os.path.join(admin_static_dir, filename)
            dst_file = os.path.join(chat_static_dir, filename)
            if os.path.isfile(src_file):
                shutil.copy2(src_file, dst_file)

        logger.info("Copied all locale files from admin to chat directory")

    @staticmethod
    def _compile_po_to_mo(po_file: str):
        """编译 PO File为 MO File"""
        mo_file = po_file[:-3] + ".mo"
        os.makedirs(os.path.dirname(mo_file), exist_ok=True)

        try:
            subprocess.run(["msgfmt", po_file, "-o", mo_file], check=True)
        except FileNotFoundError:
            import polib
            po = polib.pofile(po_file)
            po.save_as_mofile(mo_file)
            logger.info(f"Compiled {po_file} to {mo_file} using polib")

    @staticmethod
    def _reload_django_mo(lang_code: str = None):
        """Re-Load Django Translation"""
        import gettext
        from django.apps import apps
        from django.utils import translation
        from django.utils.translation import trans_real

        gettext._translations.clear()

        if lang_code:
            trans_real._translations.pop(lang_code, None)
        else:
            trans_real._translations.clear()

        trans_real._default = None

        if not apps.ready:
            return

        try:
            translation.deactivate_all()
            translation.activate(lang_code)
        except Exception:
            translation.deactivate_all()


# 单例Instance
_locale_manager = None


def get_locale_manager() -> LocaleManager:
    """GetLanguage包Manage器单例"""
    global _locale_manager
    if _locale_manager is None:
        _locale_manager = LocaleManager()
    return _locale_manager


def deploy_external_locales():
    """便捷Function：DeploymentExternalLanguage包"""
    return get_locale_manager().deploy_all()
