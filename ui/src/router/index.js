import { hasPermission, set_next_route } from '@/utils/permission/index';
import { getChildRouteList } from '@/router/common';
import NProgress from 'nprogress';
import { getPermissionRoute } from '@/router/common';
import { createRouter, createWebHistory, } from 'vue-router';
import useStore from '@/stores';
import { routes } from '@/router/routes';
NProgress.configure({ showSpinner: false, speed: 500, minimum: 0.3 });
const router = createRouter({
    history: createWebHistory(window.MaxKB?.prefix ? window.MaxKB?.prefix : import.meta.env.BASE_URL),
    routes: routes,
});
// Route prefixInterceptor
router.beforeEach(async (to, from, next) => {
    NProgress.start();
    if (to.name === '404') {
        next();
        return;
    }
    const { user, login } = useStore();
    const notAuthRouteNameList = ['login', 'ForgotPassword', 'ResetPassword', 'Chat', 'UserLogin'];
    if (!notAuthRouteNameList.includes(to.name ? to.name.toString() : '')) {
        if (to.query && to.query.token) {
            localStorage.setItem('token', to.query.token.toString());
        }
        const token = login.getToken();
        if (!token) {
            next({
                path: '/login',
            });
            return;
        }
        if (!user.userInfo) {
            await user.profile();
        }
    }
    set_next_route(to);
    // Determine whether there is menu permission
    if (to.meta.permission ? hasPermission(to.meta.permission, 'OR') : true) {
        if (to.name == 'noPermissionD') {
            const n = getPermissionRoute(routes, to);
            if (n.name == 'noPermission') {
                next();
                return;
            }
            else {
                next(n);
                return;
            }
        }
        else {
            next();
        }
    }
    else {
        const n = getPermissionRoute(routes, to);
        next(n);
    }
});
router.afterEach(() => {
    NProgress.done();
});
export const getChildRouteListByPathAndName = (path, name) => {
    return getChildRouteList(routes, path, name);
};
export default router;
