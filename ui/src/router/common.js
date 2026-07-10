import { hasPermission } from '@/utils/permission/index';
export const getChildRouteList = (routeList, path, name) => {
    for (let index = 0; index < routeList.length; index++) {
        const route = routeList[index];
        if (name === route.name && path === route.path) {
            return route.children || [];
        }
        if (route.children && route.children.length > 0) {
            const result = getChildRouteList(route.children, path, name);
            if (result && result?.length > 0) {
                return result;
            }
        }
    }
    return [];
};
/**
 * GetSibling route
 * @param routeList
 * @param name
 * @returns
 */
export const getSameRouteList = (routeList, name) => {
    for (let index = 0; index < routeList.length; index++) {
        const route = routeList[index];
        if (name === route.name) {
            return routeList;
        }
        if (route.children && route.children.length > 0) {
            const result = getSameRouteList(route.children, name);
            if (result && result?.length > 0) {
                return result;
            }
        }
    }
    return [];
};
/**
 * Get routes with permission
 * @param routes
 * @param to
 * @returns
 */
export const getPermissionRoute = (routes, to) => {
    const routeName = to.meta
        ? to.meta.sameRoute
            ? to.meta.sameRoute
            : to.name
        : to.name;
    const routeList = getSameRouteList(routes, routeName);
    const route = routeList.find((route) => {
        return ((to.meta.group ? to.meta.group == route.meta.group : true) &&
            (route.meta.permission ? hasPermission(route.meta.permission, 'OR') : true));
    });
    const finalRoute = route?.children && route.children.length > 0
        ? findAccessibleRoute(route.children) || route
        : route;
    if (finalRoute?.name && finalRoute.name !== to.name) {
        return { name: finalRoute.name, params: to.params };
    }
    const globalRoute = findAccessibleRoute(routes);
    if (globalRoute && globalRoute.name !== to.name) {
        return { name: globalRoute.name, params: to.params };
    }
    return { name: 'noPermission' };
};
// Find availablePermission route
const findAccessibleRoute = (routes) => {
    for (const route of routes) {
        const permission = route.meta?.permission;
        if (permission && !hasPermission(permission, 'OR')) {
            continue;
        }
        if (route.path.includes(':')) {
            continue;
        }
        if (route.children && route.children.length > 0) {
            const child = findAccessibleRoute(route.children);
            if (child)
                return child;
        }
        if (!route.children || route.children.length === 0) {
            return route;
        }
    }
    return null;
};
