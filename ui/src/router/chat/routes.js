export const routes = [
    // Conversation
    {
        path: '/:accessToken',
        name: 'chat',
        component: () => import('@/views/chat/index.vue'),
    },
    // ConversationUserLogin
    {
        path: '/login/:accessToken',
        name: 'login',
        component: () => import('@/views/chat/user-login/index.vue'),
    },
    // ConversationUserLogin
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/error/404.vue'),
    },
    {
        path: '/no-service',
        name: 'NoService',
        component: () => import('@/views/error/NoService.vue'),
    },
    // Conversation
    {
        path: '/share/:link',
        name: 'Share',
        component: () => import('@/views/chat/Share.vue'),
    },
];
