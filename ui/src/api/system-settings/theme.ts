import {Result} from '@/request/Result'
import {get, post, del, put} from '@/request/index'
import type {Ref} from 'vue'

const prefix = '/display'

/**
 * View appearanceSettings
 */
const getThemeInfo: (loading?: Ref<boolean>) => Promise<Result<any>> = (loading) => {
  return get(`${prefix}/info`, undefined, loading)
}

/**
 * UpdateAppearanceSettings
 * @param Parameters
 * * formData {
 *   theme
 *   icon
 *   loginLogo
 *   loginImage
 *   title
 *   slogan
 * }
 */
const postThemeInfo: (data: any, loading?: Ref<boolean>) => Promise<Result<boolean>> = (
  data,
  loading
) => {
  return put(`${prefix}/update`, data, undefined, loading)
}

export default {
  getThemeInfo,
  postThemeInfo
}
