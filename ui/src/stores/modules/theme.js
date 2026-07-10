import { defineStore } from 'pinia';
import { cloneDeep } from 'lodash';
import { useElementPlusTheme } from 'use-element-plus-theme';
import ThemeApi from '@/api/system-settings/theme';
const defalueColor = '#3370FF';
const useThemeStore = defineStore('theme', {
    state: () => ({
        themeInfo: null,
    }),
    actions: {
        isDefaultTheme() {
            return !this.themeInfo?.theme || this.themeInfo?.theme === defalueColor;
        },
        setTheme(data) {
            const { changeTheme } = useElementPlusTheme(this.themeInfo?.theme || defalueColor);
            changeTheme(data?.['theme'] || defalueColor);
            this.themeInfo = cloneDeep(data);
        },
        async theme(loading) {
            return await ThemeApi.getThemeInfo(loading).then((ok) => {
                this.setTheme(ok.data);
            });
        },
    },
});
export default useThemeStore;
