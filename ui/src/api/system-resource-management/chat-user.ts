import type {Ref} from 'vue'
import {Result} from '@/request/Result'
import {get, put } from '@/request/index'
import type { ChatUserGroupItem, ChatUserGroupUserItem, putUserGroupUserParams } from '@/api/type/workspaceChatUser'
import type { pageRequest, PageList } from '@/api/type/common'


const prefix = '/system/resource/knowledge'
/**
 * GetSharedKnowledge baseUser group list
 */
const getUserGroupList: (resource: any, loading?: Ref<boolean>) =>
    Promise<Result<ChatUserGroupItem[]>> = (resource, loading) => {
        return get(`${prefix}/${resource.resource_type}/${resource.resource_id}/user_group`, undefined, loading)
    }

/*
 * ModificationSharedKnowledge baseUser group listAuthorization
 */
const editUserGroupList: (resource: any, data: { user_group_id: string, is_auth: boolean }[], loading?: Ref<boolean>) =>
    Promise<Result<any>> = (resource, data, loading) => {
        return put(`${prefix}/${resource.resource_type}/${resource.resource_id}/user_group`, data, undefined, loading)
    }

/**
 * Get shared knowledge base user group user list
 */
const getUserGroupUserList: (
    resource: any,
    user_group_id: string,
    page: pageRequest,
    param?: any,
    loading?: Ref<boolean>,
) => Promise<Result<PageList<ChatUserGroupUserItem[]>>> = (resource, user_group_id, page, param, loading) => {
    return get(
        `${prefix}/${resource.resource_type}/${resource.resource_id}/user_group_id/${user_group_id}/${page.current_page}/${page.page_size}`,
        param,
        loading,
    )
}

/**
 * UpdateSharedKnowledge baseUserGroupUserList
 */
const putUserGroupUser: (
    resource: any,
    user_group_id:string,
    data: putUserGroupUserParams[],
    loading?: Ref<boolean>,
) => Promise<Result<boolean>> = (resource, user_group_id, data, loading) => {
    return put(`${prefix}/${resource.resource_type}/${resource.resource_id}/user_group_id/${user_group_id}`, data, undefined, loading)
}

export default {
    getUserGroupList,
    editUserGroupList,
    getUserGroupUserList,
    putUserGroupUser
}
