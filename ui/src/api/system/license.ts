import { Result } from '@/request/Result'
import { get, post, del, put } from '@/request/index'
import { type Ref } from 'vue'

const prefix = '/license'

/**
 * GetlicenseInfo
 */
const getLicense: (loading?: Ref<boolean>) => Promise<Result<any>> = (loading) => {
  return get(`${prefix}/profile`, undefined, loading)
}
/**
 * UpdatelicenseInfo
 * @param Parameters  license_file:file
 */
const putLicense: (data: any, loading?: Ref<boolean>) => Promise<Result<any>> = (data, loading) => {
  return put(`${prefix}/profile`, data, undefined, loading)
}

export default {
  getLicense,
  putLicense
}
