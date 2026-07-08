import { PermissionConst, EditionConst, RoleConst } from '@/utils/permission/data'
const ModelRouter = {
  path: '/knowledge',
  name: 'knowledge',
  meta: {
    title: 'views.knowledge.title',
    menu: true,
    permission: [
      RoleConst.USER.getWorkspaceRole,
      RoleConst.WORKSPACE_MANAGE.getWorkspaceRole,
      PermissionConst.KNOWLEDGE_READ.getWorkspacePermission,
      PermissionConst.KNOWLEDGE_READ.getWorkspacePermissionWorkspaceManageRole,
    ],
    icon: 'app-knowledge',
    iconActive: 'app-knowledge-active',
    group: 'workspace',
    order: 3,
  },
  redirect: '/knowledge',
  component: () => import('@/layout/layout-template/SimpleLayout.vue'),
  children: [
    {
      path: '/knowledge',
      name: 'knowledge-index',
      meta: { title: 'Knowledge baseHomepage', activeMenu: '/knowledge', sameRoute: 'knowledge' },
      component: () => import('@/views/knowledge/index.vue'),
    },

    // UploadDocument
    {
      path: '/knowledge/document/upload/:folderId/:type',
      name: 'UploadDocument',
      meta: { activeMenu: '/knowledge' },
      component: () => import('@/views/document/UploadDocument.vue'),
      hidden: true,
    },
    // UploadDocument - FeishuDocument
    {
      path: '/knowledge/import/lark/:folderId',
      name: 'ImportLarkDocument',
      meta: { activeMenu: '/knowledge' },
      component: () => import('@/views/document/ImportLarkDocument.vue'),
      hidden: true,
    },
    // UploadDocument - Workflow
    {
      path: '/knowledge/import/workflow/:folderId',
      name: 'ImportWorkflowDocument',
      meta: { activeMenu: '/knowledge' },
      component: () => import('@/views/document/ImportWorkflowDocument.vue'),
      hidden: true,
    },
  ],
}

export default ModelRouter
