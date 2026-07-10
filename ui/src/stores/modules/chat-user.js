import { defineStore } from 'pinia';
import ChatAPI from '@/api/chat/chat';
import { getBrowserLang } from '@/locales/index';
const useChatUserStore = defineStore('chat-user', {
    state: () => ({
        chat_profile: undefined,
        application: undefined,
        accessToken: undefined,
    }),
    actions: {
        getLanguage() {
            return localStorage.getItem(`${this.accessToken}-locale`) || getBrowserLang();
        },
        setAccessToken(accessToken) {
            this.accessToken = accessToken;
        },
        getChatProfile() {
            return ChatAPI.chatProfile(this.accessToken).then((ok) => {
                this.chat_profile = ok.data;
                return this.chat_profile;
            });
        },
        async getChatUserProfile() {
            const res = await ChatAPI.getChatUserProfile();
            this.chatUserProfile = res.data;
            return res.data;
        },
        applicationProfile() {
            return ChatAPI.applicationProfile().then((ok) => {
                this.application = ok.data;
                localStorage.setItem(`${this.accessToken}-locale`, ok.data?.language || this.getLanguage());
            });
        },
        isAuthentication() {
            if (this.chat_profile) {
                return Promise.resolve(this.chat_profile.authentication);
            }
            else {
                return this.getChatProfile().then((ok) => {
                    return ok.authentication;
                });
            }
        },
        getToken() {
            if (this.token) {
                return this.token;
            }
            const token = sessionStorage.getItem(`${this.accessToken}-accessToken`);
            if (token) {
                this.token = token;
                return token;
            }
            const local_token = localStorage.getItem(`${this.accessToken}-accessToken`);
            if (local_token) {
                this.token = local_token;
                return local_token;
            }
            return localStorage.getItem(`accessToken`);
        },
        setToken(token) {
            this.token = token;
            sessionStorage.setItem(`${this.accessToken}-accessToken`, token);
            localStorage.setItem(`${this.accessToken}-accessToken`, token);
        },
        /**
         *AnonymousAuthentication
         */
        anonymousAuthentication() {
            return ChatAPI.anonymousAuthentication(this.accessToken).then((ok) => {
                this.setToken(ok.data);
                return this.token;
            });
        },
        passwordAuthentication(password) {
            return ChatAPI.passwordAuthentication(this.accessToken, password).then((ok) => {
                this.setToken(ok.data);
                return this.token;
            });
        },
        login(request, loading) {
            return ChatAPI.login(this.accessToken, request, loading).then((ok) => {
                this.setToken(ok.data.token);
                return this.token;
            });
        },
        ldapLogin(request, loading) {
            return ChatAPI.ldapLogin(this.accessToken, request, loading).then((ok) => {
                this.setToken(ok.data.token);
                return this.token;
            });
        },
        logout() {
            return ChatAPI.logout().then(() => {
                sessionStorage.removeItem(`${this.accessToken}-accessToken`);
                localStorage.removeItem(`${this.accessToken}-accessToken`);
                this.token = undefined;
                return true;
            });
        },
        async dingCallback(code, accessToken) {
            return ChatAPI.getDingCallback(code, accessToken).then((ok) => {
                this.setToken(ok.data.token);
                return this.token;
            });
        },
        async dingOauth2Callback(code, accessToken) {
            return ChatAPI.getDingOauth2Callback(code, accessToken).then((ok) => {
                this.setToken(ok.data.token);
                return this.token;
            });
        },
        async wecomCallback(code, accessToken) {
            return ChatAPI.getWecomCallback(code, accessToken).then((ok) => {
                this.setToken(ok.data.token);
                return this.token;
            });
        },
        async larkCallback(code, accessToken) {
            return ChatAPI.getLarkCallback(code, accessToken).then((ok) => {
                this.setToken(ok.data.token);
                return this.token;
            });
        },
        async getQrType() {
            return ChatAPI.getQrType().then((ok) => {
                return ok.data;
            });
        },
        async getQrSource() {
            return ChatAPI.getQrSource().then((ok) => {
                return ok.data;
            });
        },
    },
});
export default useChatUserStore;
