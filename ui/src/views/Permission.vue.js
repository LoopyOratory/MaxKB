/// <reference types="../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { PermissionConst, EditionConst, RoleConst } from '@/utils/permission/data';
import { hasPermission } from '@/utils/permission/index';
import { ComplexPermission } from '@/utils/permission/type';
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
if (__VLS_ctx.hasPermission(__VLS_ctx.EditionConst.IS_CE, 'OR')) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({});
}
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({});
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.EditionConst.IS_CE) }, null, null);
if (__VLS_ctx.hasPermission(__VLS_ctx.EditionConst.IS_EE, 'OR')) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({});
}
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({});
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.EditionConst.IS_EE) }, null, null);
if (__VLS_ctx.hasPermission([__VLS_ctx.EditionConst.IS_EE, __VLS_ctx.RoleConst.ADMIN], 'AND')) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({});
}
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({});
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN], [], [__VLS_ctx.EditionConst.IS_EE], 'AND')) }, null, null);
if (__VLS_ctx.hasPermission([__VLS_ctx.EditionConst.IS_EE, __VLS_ctx.RoleConst.WORKSPACE_MANAGE.getWorkspaceRole], 'AND')) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({});
}
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({});
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.WORKSPACE_MANAGE.getWorkspaceRole], [], [__VLS_ctx.EditionConst.IS_EE], 'OR')) }, null, null);
if (__VLS_ctx.hasPermission(new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.WORKSPACE_MANAGE.getWorkspaceRole], [__VLS_ctx.PermissionConst.USER_READ], [__VLS_ctx.EditionConst.IS_EE], 'OR'), 'OR')) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({});
}
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({});
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.WORKSPACE_MANAGE.getWorkspaceRole], [__VLS_ctx.PermissionConst.USER_READ], [__VLS_ctx.EditionConst.IS_EE], 'OR')) }, null, null);
// @ts-ignore
[hasPermission, hasPermission, hasPermission, hasPermission, hasPermission, EditionConst, EditionConst, EditionConst, EditionConst, EditionConst, EditionConst, EditionConst, EditionConst, EditionConst, EditionConst, vHasPermission, vHasPermission, vHasPermission, vHasPermission, vHasPermission, RoleConst, RoleConst, RoleConst, RoleConst, RoleConst, RoleConst, ComplexPermission, ComplexPermission, ComplexPermission, ComplexPermission, PermissionConst, PermissionConst,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
