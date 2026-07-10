import { get, post, postUpload, postStream, del, put, download, } from '@/request/chat/index';
import useStore from '@/stores';
const prefix = { _value: '/workspace/' };
Object.defineProperty(prefix, 'value', {
    get: function () {
        const { user } = useStore();
        return this._value + user.getWorkspaceId() + '/application';
    },
});
/**
 * OpenDebugConversationid
 * @param application_id Applicationid
 * @param loading Loader
 * @returns
 */
const open = (loading) => {
    return get('/open', {}, loading);
};
/**
 * Conversation
 * @param Parameters
 * chat_id: string
 * data
 */
const chat = (chat_id, data) => {
    const prefix = (window.MaxKB?.prefix ? window.MaxKB?.prefix : '/chat') + '/api';
    return postStream(`${prefix}/chat_message/${chat_id}`, data);
};
/**
 * ApplicationAuthenticationInfo
 */
const chatProfile = (assessToken, loading) => {
    return get('/profile', { access_token: assessToken }, loading);
};
/**
 * AnonymousAuthentication
 * @param assessToken
 * @param loading
 * @returns
 */
const anonymousAuthentication = (assessToken, loading) => {
    return post('/auth/anonymous', { access_token: assessToken }, {}, loading);
};
/**
 * PasswordAuthentication
 * @param assessToken
 * @param password
 * @param loading
 * @returns
 */
const passwordAuthentication = (assessToken, password, loading) => {
    return post('auth/password', { access_token: assessToken, password: password }, {}, loading);
};
/**
 * GetApplicationRelatedInfo
 * @param loading
 * @returns
 */
const applicationProfile = (loading) => {
    return get('/application/profile', {}, loading);
};
/**
 * Login
 * @param request LoginInterfaceRequestForm
 * @param loading InterfaceLoader
 * @returns AuthenticationData
 */
const login = (accessToken, request, loading) => {
    return post('/auth/login/' + accessToken, request, undefined, loading);
};
const ldapLogin = (accessToken, request, loading) => {
    return post('/auth/ldap/login/' + accessToken, request, undefined, loading);
};
/**
 * GetVerifyCode
 * @param username
 * @param loading InterfaceLoader
 */
const getCaptcha = (username, accessToken, loading) => {
    return get('/captcha', { username: username, accessToken: accessToken }, loading);
};
/**
 * GetQR codeType
 */
const getQrType = (loading) => {
    return get('auth/qr_type', undefined, loading);
};
const getQrSource = (loading) => {
    return get('auth/qr_type/source', undefined, loading);
};
const getDingCallback = (code, accessToken, loading) => {
    return get('auth/dingtalk', { code, accessToken: accessToken }, loading);
};
const getDingOauth2Callback = (code, accessToken, loading) => {
    return get('auth/dingtalk/oauth2', { code, accessToken: accessToken }, loading);
};
const getWecomCallback = (code, accessToken, loading) => {
    return get('auth/wecom', { code, accessToken: accessToken }, loading);
};
const getLarkCallback = (code, accessToken, loading) => {
    return get('auth/lark/oauth2', { code, accessToken: accessToken }, loading);
};
/**
 * GetAuthenticationSettings
 */
const getAuthSetting = (auth_type, loading) => {
    return get(`/chat_user/${auth_type}/detail`, undefined, loading);
};
/**
 * LikeDislike
 * @param chat_id         Conversationid
 * @param chat_record_id  ConversationRecordid
 * @param vote_status     LikeStatus
 * @param loading         Loader
 * @returns
 */
const vote = (chat_id, chat_record_id, vote_status, vote_reason, vote_other_content, loading) => {
    const data = {
        vote_status,
        ...(vote_reason !== undefined && { vote_reason }),
        ...(vote_other_content !== undefined && { vote_other_content }),
    };
    return put(`/vote/chat/${chat_id}/chat_record/${chat_record_id}`, data, undefined, loading);
};
const pageChat = (current_page, page_size, loading) => {
    return get(`/historical_conversation/${current_page}/${page_size}`, undefined, loading);
};
const pageChatRecord = (chat_id, current_page, page_size, loading) => {
    return get(`/historical_conversation_record/${chat_id}/${current_page}/${page_size}`, undefined, loading);
};
/**
 * Logout
 */
const logout = (loading) => {
    return post('/auth/logout', undefined, undefined, loading);
};
/**
 * ResetPassword
 */
const resetCurrentPassword = (data, loading) => {
    return post('/chat_user/current/reset_password', data, undefined, loading);
};
/**
 * GetCurrentUserInfo
 */
const getChatUserProfile = (loading) => {
    return get('/chat_user/profile', {}, loading);
};
/**
 * GetConversationDetails
 * @param chat_id         Conversationid
 * @param chat_record_id  ConversationRecordid
 * @param loading         Loader
 * @returns
 */
const getChatRecord = (chat_id, chat_record_id, loading) => {
    return get(`historical_conversation/${chat_id}/record/${chat_record_id}`, {}, loading);
};
/**
 * TextTo speech
 */
const textToSpeech = (data, loading) => {
    return download(`text_to_speech`, 'post', data, undefined, loading);
};
/**
 * Speech toText
 */
const speechToText = (data, loading) => {
    return post(`speech_to_text`, data, undefined, loading);
};
/**
 *
 * @param chat_id  ConversationID
 * @param loading
 * @returns
 */
const deleteChat = (chat_id, loading) => {
    return del(`historical_conversation/${chat_id}`, undefined, undefined, loading);
};
/**
 *
 * @param loading
 * @returns
 */
const clearChat = (loading) => {
    return del(`historical_conversation/clear`, undefined, undefined, loading);
};
/**
 *
 * @param chat_id Conversationid
 * @param data    ConversationIntroduction
 * @param loading
 * @returns
 */
const modifyChat = (chat_id, data, loading) => {
    return put(`historical_conversation/${chat_id}`, data, undefined, loading);
};
/**
 * UploadFile
 * @param file      File
 * @param sourceId  Resourceid
 * @param resourceType  Resource type
 * @returns
 */
const postUploadFile = (file, sourceId, sourceType, loading) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('source_id', sourceId);
    fd.append('source_type', sourceType);
    return post(`/oss/file`, fd, undefined, loading);
};
/**
 * Upload file (supports upload progress callback and interrupt)
 * @param file
 * @param sourceId  Resourceid
 * @param resourceType  Resource type
 * @param onProgress  UploadProgressCallback，ParametersAs percentage(0-100)
 * @param loading
 * @returns Returns { request, abort }, request is an async promise object, abort is used to interrupt upload
 */
const postUploadFileProgress = (file, sourceId, sourceType, onProgress, loading) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('source_id', sourceId);
    fd.append('source_type', sourceType);
    return postUpload(`/oss/file`, fd, onProgress, undefined, loading);
};
const getFile = (application_id, params) => {
    return get(`/oss/get_url/${application_id}`, params);
};
/**
 * GenerateShareLink
 * @param Parameters
 * chat_id: string
 * data
 */
const postShareChat = (application_id, chat_id, data, loading) => {
    return post(`/${application_id}/chat/${chat_id}/share_chat`, data, undefined, loading);
};
const getShareLink = (link) => {
    return get(`/share/${link}`, undefined);
};
export default {
    open,
    chat,
    chatProfile,
    anonymousAuthentication,
    applicationProfile,
    login,
    getCaptcha,
    getDingCallback,
    getQrType,
    getWecomCallback,
    getDingOauth2Callback,
    getLarkCallback,
    getQrSource,
    ldapLogin,
    getAuthSetting,
    passwordAuthentication,
    vote,
    pageChat,
    pageChatRecord,
    logout,
    resetCurrentPassword,
    getChatUserProfile,
    getChatRecord,
    textToSpeech,
    speechToText,
    deleteChat,
    clearChat,
    modifyChat,
    postUploadFile,
    postUploadFileProgress,
    getFile,
    postShareChat,
    getShareLink,
};
