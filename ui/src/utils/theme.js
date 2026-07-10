import { t } from '@/locales';
export const themeList = [
    {
        label: t('theme.default'),
        value: '#3370FF',
        loginBackground: 'default',
    },
    {
        label: t('theme.orange'),
        value: '#FF8800',
        loginBackground: 'orange',
    },
    {
        label: t('theme.green'),
        value: '#00B69D',
        loginBackground: 'green',
    },
    {
        label: t('theme.purple'),
        value: '#7F3BF5',
        loginBackground: 'purple',
    },
    {
        label: t('theme.red'),
        value: '#F01D94',
        loginBackground: 'red',
    },
];
export function getThemeImg(val) {
    if (!val)
        return 'default';
    return themeList.filter((v) => v.value === val)?.[0]?.loginBackground || 'default';
}
export const defaultSetting = {
    icon: '',
    loginLogo: '',
    loginImage: '',
    title: 'MaxKB',
    slogan: t('theme.defaultSlogan'),
};
export const defaultPlatformSetting = {
    showUserManual: true,
    userManualUrl: t('layout.userManualUrl'),
    showForum: true,
    forumUrl: t('layout.forumUrl'),
    showProject: true,
    projectUrl: 'https://github.com/1Panel-dev/MaxKB',
};
export function hexToRgba(hex, alpha) {
    // Transform hex color value (two characters together) to decimal
    if (!hex) {
        return '';
    }
    else {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        // ReturnRGBAFormatString
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}
