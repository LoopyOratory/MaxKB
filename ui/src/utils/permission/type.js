import useStore from '@/stores';
import { useRoute } from 'vue-router';
/**
 * RoleObject
 */
export class Role {
    role;
    constructor(role) {
        this.role = role;
    }
    getWorkspaceRole = () => {
        const { user } = useStore();
        return new Role(`${this.role}:/WORKSPACE/${user.getWorkspaceId()}`);
    };
    getWorkspaceRoleString = () => {
        const { user } = useStore();
        return `${this.role}:/WORKSPACE/${user.getWorkspaceId()}`;
    };
    toString() {
        return this.role;
    }
}
/**
 * PermissionObject
 */
export class Permission {
    permission;
    constructor(permission) {
        this.permission = permission;
    }
    /**
     * WorkspacePermission
     * @param workspace_id Workspace id
     * @returns WorkspacePermission
     */
    getWorkspacePermission = () => {
        const { user } = useStore();
        return `${this.permission}:/WORKSPACE/${user.getWorkspaceId()}`;
    };
    /**
     * CustomWorkspaceAdminPermission
     * @returns
     */
    getWorkspacePermissionWorkspaceManageRole = () => {
        const { user } = useStore();
        return `${this.permission}:/WORKSPACE/${user.getWorkspaceId()}:ROLE/WORKSPACE_MANAGE`;
    };
    /**
     * WorkspaceResourcePermission
     * @param workspace_id Workspace id
     * @param resource     Resource
     * @param resource_id  Resourceid
     * @returns  WorkspaceResourcePermission
     */
    getWorkspaceResourcePermission = (resource, resource_id) => {
        const { user } = useStore();
        return `${this.permission}:/WORKSPACE/${user.getWorkspaceId()}/${resource}/${resource_id}`;
    };
    /**
     *
     * @param resource_id Resourceid
     * @returns Workspace under Knowledge baseResourcePermission
     */
    getKnowledgeWorkspaceResourcePermission = (resource_id) => {
        return this.getWorkspaceResourcePermission('KNOWLEDGE', resource_id);
    };
    getTest = () => {
        const route = useRoute();
        debugger;
        console.log(route);
        return "";
    };
    /**
     *
     * @param resource_id  Resourceid
     * @returns Workspace under ApplicationResourcePermission
     */
    getApplicationWorkspaceResourcePermission = (resource_id) => {
        return this.getWorkspaceResourcePermission('APPLICATION', resource_id);
    };
    /**
     *
     * @param resource_id Resourceid
     * @returns Workspace under ModelResourcePermission
     */
    getModelWorkspaceResourcePermission = (resource_id) => {
        return this.getWorkspaceResourcePermission('MODEL', resource_id);
    };
    /**
     *
     * @param resource_id
     * @returns Workspace under ToolResourcePermission
     */
    getToolWorkspaceResourcePermission = (resource_id) => {
        return this.getWorkspaceResourcePermission('TOOL', resource_id);
    };
    toString() {
        return this.permission;
    }
}
/**
 * ComplexPermissionObject
 */
export class ComplexPermission {
    roleList;
    permissionList;
    editionList;
    compare;
    constructor(roleList, permissionList, editionList, compare) {
        this.roleList = roleList;
        this.permissionList = permissionList;
        this.editionList = editionList;
        this.compare = compare;
    }
}
/**
 * Version
 */
export class Edition {
    edition;
    constructor(edition) {
        this.edition = edition;
    }
    toString() {
        return this.edition;
    }
}
