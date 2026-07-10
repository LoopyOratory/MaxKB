import { defineStore } from 'pinia';
import UserApi from '@/api/user/user';
import LoginApi from '@/api/user/login';
import { useLocalStorage } from '@vueuse/core';
import { localeConfigKey, getBrowserLang } from '@/locales/index';
import useThemeStore from './theme';
import { defaultPlatformSetting } from '@/utils/theme';
const useUserStore = defineStore('user', {
    state: () => ({
        userInfo: null,
        version: '',
        license_is_valid: false,
        edition: 'CE',
        workspace_id: '',
        workspace_list: [],
        rsaKey: '',
    }),
    actions: {
        getLanguage() {
            return localStorage.getItem('MaxKB-locale') || getBrowserLang();
        },
        setWorkspaceId(workspace_id) {
            this.workspace_id = workspace_id;
            localStorage.setItem('workspace_id', workspace_id);
        },
        getWorkspaceId() {
            this.workspace_id = this.workspace_id || localStorage.getItem('workspace_id') || 'default';
            return this.workspace_id;
        },
        getPermissions() {
            if (this.userInfo) {
                if (this.isEE()) {
                    return [...this.userInfo?.permissions, 'X-PACK-EE'];
                }
                else if (this.isPE()) {
                    return [...this.userInfo?.permissions, 'X-PACK-PE'];
                }
                return this.userInfo?.permissions;
            }
            else {
                return [];
            }
        },
        getEdition() {
            if (this.userInfo) {
                if (this.isEE()) {
                    return 'X-PACK-EE';
                }
                else if (this.isPE()) {
                    return 'X-PACK-PE';
                }
                else {
                    return 'X-PACK-CE';
                }
            }
            return 'X-PACK-CE';
        },
        getRole() {
            if (this.userInfo) {
                return this.userInfo?.role;
            }
            else {
                return [];
            }
        },
        is_admin() {
            return this.userInfo?.role.includes('ADMIN');
        },
        showXpack() {
            return this.edition != 'CE';
        },
        isEnterprise() {
            return this.edition != 'CE' && !this.license_is_valid;
        },
        isExpire() {
            return this.edition != 'CE' && !this.license_is_valid;
        },
        isCE() {
            return this.edition == 'CE';
        },
        isPE() {
            return this.edition == 'PE' && this.license_is_valid;
        },
        isEE() {
            return this.edition == 'EE' && this.license_is_valid;
        },
        getHasPermissionWorkspaceManage() {
            const workspaceManagePermissions = this.userInfo?.role
                .filter((permission) => permission.startsWith('WORKSPACE_MANAGE'))
                .map((permission) => {
                const parts = permission.split('/WORKSPACE/');
                return parts.length > 1 ? parts[1] : null; // ExtractWorkspaceID
            })
                .filter((id) => id !== null); // FilterRemove invalidID
            if (workspaceManagePermissions && workspaceManagePermissions.length > 0) {
                if (workspaceManagePermissions.includes(localStorage.getItem('workspace_id') || 'default')) {
                    return;
                }
                this.setWorkspaceId(workspaceManagePermissions[0]);
            }
        },
        getEditionName() {
            return this.edition;
        },
        async profile(loading) {
            return UserApi.getUserProfile(loading).then((ok) => {
                this.userInfo = ok.data;
                const workspace_list = ok.data.workspace_list && ok.data.workspace_list.length > 0
                    ? ok.data.workspace_list
                    : [{ id: 'default', name: 'default' }];
                const workspace_id = this.getWorkspaceId();
                if (!workspace_id || !workspace_list.some((w) => w.id == workspace_id)) {
                    this.setWorkspaceId(workspace_list[0].id);
                }
                this.workspace_list = workspace_list;
                useLocalStorage(localeConfigKey, 'en-US').value =
                    ok?.data?.language || this.getLanguage();
                const theme = useThemeStore();
                theme.setTheme();
                return this.asyncGetProfile();
            });
        },
        async asyncGetProfile() {
            return new Promise((resolve, reject) => {
                UserApi.getProfile()
                    .then(async (ok) => {
                    // this.version = ok.data?.version || '-'
                    this.license_is_valid = ok.data.license_is_valid;
                    this.edition = ok.data.edition;
                    this.version = ok.data.version;
                    this.rsaKey = ok.data.rsa;
                    const theme = useThemeStore();
                    if (this.isEE() || this.isPE()) {
                        await theme.theme();
                    }
                    else {
                        theme.setTheme();
                        theme.themeInfo = {
                            ...defaultPlatformSetting,
                        };
                    }
                    resolve(ok);
                })
                    .catch((error) => {
                    reject(error);
                });
            });
        },
        async postUserLanguage(lang, loading) {
            return new Promise((resolve, reject) => {
                LoginApi.postLanguage({ language: lang }, loading)
                    .then(async (ok) => {
                    useLocalStorage(localeConfigKey, 'en-US').value = lang;
                    window.location.reload();
                    resolve(ok);
                })
                    .catch((error) => {
                    reject(error);
                });
            });
        },
    },
});
export default useUserStore;
