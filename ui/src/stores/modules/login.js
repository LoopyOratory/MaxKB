import { defineStore } from 'pinia';
import LoginApi from '@/api/user/login';
import useUserStore from './user';
const useLoginStore = defineStore('login', {
    state: () => ({
        token: '',
    }),
    actions: {
        getToken() {
            if (this.token) {
                return this.token;
            }
            return localStorage.getItem('token');
        },
        async asyncLogin(data, loading) {
            return LoginApi.login(data).then((ok) => {
                this.token = ok?.data?.token;
                localStorage.setItem('token', ok?.data?.token);
                const user = useUserStore();
                return user.profile(loading);
            });
        },
        async asyncLdapLogin(data, loading) {
            return LoginApi.ldapLogin(data).then((ok) => {
                this.token = ok?.data?.token;
                localStorage.setItem('token', ok?.data?.token);
                const user = useUserStore();
                return user.profile(loading);
            });
        },
        async dingCallback(code) {
            return LoginApi.getDingCallback(code).then((ok) => {
                this.token = ok?.data?.token;
                localStorage.setItem('token', ok?.data?.token);
                const user = useUserStore();
                return user.profile();
            });
        },
        async dingOauth2Callback(code) {
            return LoginApi.getDingOauth2Callback(code).then((ok) => {
                this.token = ok?.data?.token;
                localStorage.setItem('token', ok?.data?.token);
                const user = useUserStore();
                return user.profile();
            });
        },
        async wecomCallback(code) {
            return LoginApi.getWecomCallback(code).then((ok) => {
                this.token = ok?.data?.token;
                localStorage.setItem('token', ok?.data?.token);
                const user = useUserStore();
                return user.profile();
            });
        },
        async larkCallback(code) {
            return LoginApi.getLarkCallback(code).then((ok) => {
                this.token = ok?.data?.token;
                localStorage.setItem('token', ok?.data?.token);
                const user = useUserStore();
                return user.profile();
            });
        },
        async logout() {
            return LoginApi.logout().then(() => {
                localStorage.removeItem('token');
                return true;
            });
        },
        async getAuthType() {
            return LoginApi.getAuthType().then((ok) => {
                return ok.data;
            });
        },
        async getQrType() {
            return LoginApi.getQrType().then((ok) => {
                return ok.data;
            });
        },
        async getQrSource() {
            return LoginApi.getQrSource().then((ok) => {
                return ok.data;
            });
        },
        async samlLogin() {
            return LoginApi.samlLogin().then((ok) => {
            });
        }
    },
});
export default useLoginStore;
