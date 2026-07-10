import { nanoid } from 'nanoid';
import { t } from '@/locales';
/**
 * NumberProcess
 */
export function toThousands(num) {
    return num?.toString().replace(/\d+/, function (n) {
        return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    });
}
export function numberFormat(num) {
    return num < 1000 ? toThousands(num) : toThousands((num / 1000).toFixed(1)) + 'k';
}
export function filesize(size) {
    if (!size)
        return '';
    /* byte */
    const num = 1024.0;
    if (size < num)
        return size + 'B';
    if (size < Math.pow(num, 2))
        return (size / num).toFixed(2) + 'K'; //kb
    if (size < Math.pow(num, 3))
        return (size / Math.pow(num, 2)).toFixed(2) + 'M'; //M
    if (size < Math.pow(num, 4))
        return (size / Math.pow(num, 3)).toFixed(2) + 'G'; //G
    return (size / Math.pow(num, 4)).toFixed(2) + 'T'; //T
}
// Avatar
export const defaultIcon = '/${window.MaxKB.prefix}/favicon.ico';
export function isAppIcon(url) {
    return url === defaultIcon ? '' : url;
}
export function isFunction(fn) {
    return typeof fn === 'function';
}
/*
  Randomid
*/
export const randomId = function () {
    return nanoid();
};
/*
  GetFileSuffix
*/
export function fileType(name) {
    const suffix = name.split('.');
    return suffix[suffix.length - 1];
}
/*
  GetFileCorrespondImage
*/
const typeList = {
    txt: ['txt', 'pdf', 'docx', 'md', 'html', 'zip', 'xlsx', 'xls', 'csv'],
    table: ['xlsx', 'xls', 'csv'],
    QA: ['xlsx', 'csv', 'xls', 'zip'],
};
export function getImgUrl(name) {
    const list = Object.values(typeList).flat();
    const type = list.includes(fileType(name).toLowerCase())
        ? fileType(name).toLowerCase()
        : 'unknown';
    return new URL(`../assets/fileType/${type}-icon.svg`, import.meta.url).href;
}
// WhetherIs whitelist suffix
export function isRightType(name, type) {
    return typeList[type].includes(fileType(name).toLowerCase());
}
// Download
export function downloadByURL(url, name) {
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('target', '_blank');
    a.setAttribute('download', name);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
// ReplaceFixedDataInternationalization
const i18n_default_name_map = {
    "SystemAdmin": 'layout.about.inner_admin',
    "WorkspaceAdmin": 'layout.about.inner_wsm',
    "NormalUser": 'layout.about.inner_user',
    "Root Directory": 'layout.about.root',
    "DefaultWorkspace": 'layout.about.default_workspace',
    "DefaultUserGroup": 'layout.about.default_user_group',
};
export function i18n_name(name) {
    const key = i18n_default_name_map[name];
    return key ? t(key) : name;
}
// CaptureFileName
export function cutFilename(filename, num) {
    const lastIndex = filename.lastIndexOf('.');
    const suffix = lastIndex === -1 ? '' : filename.substring(lastIndex + 1);
    return filename.substring(0, num - suffix.length - 1) + '.' + suffix;
}
export const loadScript = (url, options = {}) => {
    const { jsId, forceReload = false } = options;
    const scriptId = jsId || `script-${btoa(url).slice(0, 12)}`;
    const cleanupScript = (script) => {
        if (script && script.parentElement) {
            script.parentElement.removeChild(script);
        }
    };
    return new Promise((resolve, reject) => {
        if (typeof document === 'undefined') {
            reject(new Error('Cannot load script in non-browser environment'));
            return;
        }
        const existingScript = document.getElementById(scriptId);
        if (existingScript && !forceReload) {
            if (existingScript.src === url) {
                console.log(`[loadScript] Reuse existing script: ${url}`);
                resolve();
                return;
            }
            existingScript.remove();
        }
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = url;
        script.async = true;
        script.onload = () => {
            console.log(`[loadScript] Script loaded: ${url}`);
            resolve();
        };
        script.onerror = () => {
            console.error(`[loadScript] Failed to load: ${url}`);
            cleanupScript(script);
            reject(new Error(`Failed to load script: ${url}`));
        };
        document.head.appendChild(script);
    });
};
// CleanupScript (optional)
const cleanupScript = (script) => {
    script.onload = null;
    script.onerror = null;
    script.parentElement?.removeChild(script);
};
export function getNormalizedUrl(url) {
    if (url && !url.endsWith('/') && !/\.[^/]+$/.test(url)) {
        return url + '/';
    }
    return url;
}
export function getFileUrl(fileId) {
    if (fileId) {
        return `${window.MaxKB.prefix}/oss/file/${fileId}`;
    }
    return '';
}
export const resetUrl = (url, defaultUrl) => {
    if (url && url.startsWith('./')) {
        return `${window.MaxKB.prefix}/${url.substring(2)}`;
    }
    return url ? url : defaultUrl ? defaultUrl : '';
};
