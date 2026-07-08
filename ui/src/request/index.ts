import axios, { type InternalAxiosRequestConfig, AxiosHeaders } from 'axios'
import { MsgError } from '@/utils/message'
import type { NProgress } from 'nprogress'
import type { Ref } from 'vue'
import type { Result } from '@/request/Result'
import useStore from '@/stores'
import router from '@/router'

import { ref, type WritableComputedRef } from 'vue'

const axiosConfig = {
  baseURL: (window.MaxKB?.prefix ? window.MaxKB?.prefix : '/admin') + '/api',
  withCredentials: false,
  timeout: 1800000, // 30Minutes timeout
  headers: {},
}

const instance = axios.create(axiosConfig)

/* SettingsRequestInterceptor */
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.headers === undefined) {
      config.headers = new AxiosHeaders()
    }
    if (config.url && config.url.startsWith('http')) {
      return config
    }
    const { user, login } = useStore()
    const token = login.getToken()
    const language = user.getLanguage()
    config.headers['Accept-Language'] = `${language}`
    if (token) {
      config.headers['AUTHORIZATION'] = `Bearer ${token}`
    }
    return config
  },
  (err: any) => {
    return Promise.reject(err)
  },
)

//SettingsResponseInterceptor
instance.interceptors.response.use(
  (response: any) => {
    if (response.data) {
      if (response.data.code !== 200 && !(response.data instanceof Blob)) {
        if (response.config.url.includes('/application/authentication')) {
          return Promise.reject(response.data)
        }
        if (
          !response.config.url.includes('/valid') &&
          !response.config.url.includes('/tool/debug')
        ) {
          MsgError(response.data.message)
          return Promise.reject(response.data)
        }
      }
    }
    return response
  },
  (err: any) => {
    if (err.code === 'ECONNABORTED') {
      MsgError(err.message)
      console.error(err)
    }
    if (err.response?.status === 404) {
      if (!err.response.config.url.includes('/application/authentication')) {
        router.push('/404 ')
      }
    }
    if (err.response?.status === 401) {
      if (
        !err.response.config.url.includes('chat/open') &&
        !err.response.config.url.includes('application/profile')
      ) {
        router.push({ name: 'login' })
      }
    }

    if (err.response?.status === 403 && !err.response.config.url.includes('chat/open')) {
      MsgError(
        err.response.data && err.response.data.message
          ? err.response.data.message
          : 'No permission to access',
      )
    }
    return Promise.reject(err)
  },
)

export const request = instance

/* SimplifyRequestMethod，UnifiedProcessReturn result, andIncreaseloadingProcess, here taking{success,data,message}FormatReturnValueExample, SpecificProjectBased onActualRequirementsModification */
const promise: (
  request: Promise<any>,
  loading?: NProgress | Ref<boolean> | WritableComputedRef<boolean>,
) => Promise<Result<any>> = (request, loading = ref(false)) => {
  return new Promise((resolve, reject) => {
    if ((loading as NProgress).start) {
      ;(loading as NProgress).start()
    } else {
      ;(loading as Ref).value = true
    }
    request
      .then((response) => {
        // blobTypeReturnStatusIsresponse.status
        if (response.status === 200) {
          resolve(response?.data || response)
        } else {
          reject(response?.data || response)
        }
      })
      .catch((error) => {
        reject(error)
      })
      .finally(() => {
        if ((loading as NProgress).start) {
          ;(loading as NProgress).done()
        } else {
          ;(loading as Ref).value = false
        }
      })
  })
}

/**
 * SendgetRequest   Generally used forRequestResource
 * @param url    Resourceurl
 * @param params Parameters
 * @param loading loading
 * @returns AsyncpromiseObject
 */
export const get: (
  url: string,
  params?: unknown,
  loading?: NProgress | Ref<boolean>,
  timeout?: number,
) => Promise<Result<any>> = (
  url: string,
  params: unknown,
  loading?: NProgress | Ref<boolean>,
  timeout?: number,
) => {
  return promise(request({ url: url, method: 'get', params, timeout: timeout }), loading)
}

/**
 * faso postRequest Generally used forAddResource
 * @param url    Resourceurl
 * @param params Parameters
 * @param data   AddData
 * @param loading loading
 * @returns AsyncpromiseObject
 */
export const post: (
  url: string,
  data?: unknown,
  params?: unknown,
  loading?: NProgress | Ref<boolean>,
  timeout?: number,
) => Promise<Result<any> | any> = (url, data, params, loading, timeout) => {
  return promise(request({ url: url, method: 'post', data, params, timeout }), loading)
}

/**
 * UploadFile post Request, supportsUploadProgressCallbackandInterrupt
 * @param url        Resourceurl
 * @param data       UploadData(Generally FormData）
 * @param onProgress UploadProgressCallback，ParametersAs percentage(0-100)
 * @param params     QueryParameters
 * @param loading    loading
 * @param timeout    Timeout
 * @returns Returns { request, abort }, request is an async promise object, abort is used to interrupt upload
 */
export const postUpload: (
  url: string,
  data?: unknown,
  onProgress?: (percent: number, event: any) => void,
  params?: unknown,
  loading?: NProgress | Ref<boolean>,
  timeout?: number,
) => { request: Promise<Result<any> | any>; abort: () => void } = (
  url,
  data,
  onProgress,
  params,
  loading,
  timeout,
) => {
  const controller = new AbortController()
  const request = promise(
    instance({
      url: url,
      method: 'post',
      data,
      params,
      timeout,
      signal: controller.signal,
      onUploadProgress: (event) => {
        if (onProgress) {
          const percent = event.total ? Math.round((event.loaded * 100) / event.total) : 0
          onProgress(percent, event)
        }
      },
    }),
    loading,
  )
  return {
    request,
    abort: () => controller.abort(),
  }
}

/**|
 * SendputRequest Used forModificationServiceRendererResource
 * @param url     ResourceAddress
 * @param params  paramsParametersAddress
 * @param data    NeedsModificationData
 * @param loading Progress bar
 * @returns
 */
export const put: (
  url: string,
  data?: unknown,
  params?: unknown,
  loading?: NProgress | Ref<boolean>,
  timeout?: number,
) => Promise<Result<any>> = (url, data, params, loading, timeout) => {
  return promise(request({ url: url, method: 'put', data, params, timeout }), loading)
}

/**
 * Deletion
 * @param url     Deletionurl
 * @param params  paramsParameters
 * @param loading Progress bar
 * @returns
 */
export const del: (
  url: string,
  params?: unknown,
  data?: unknown,
  loading?: NProgress | Ref<boolean>,
  timeout?: number,
) => Promise<Result<any>> = (url, params, data, loading, timeout) => {
  return promise(request({ url: url, method: 'delete', params, data, timeout }), loading)
}

/**
 * StreamProcess
 * @param url  urlAddress
 * @param data Requestbody
 * @returns
 */
export const postStream: (url: string, data?: unknown) => Promise<Result<any> | any> = (
  url,
  data,
) => {
  const { user, login } = useStore()
  const token = login.getToken()
  const language = user.getLanguage()
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (token) {
    headers['AUTHORIZATION'] = `Bearer ${token}`
  }
  headers['Accept-Language'] = `${language}`
  return fetch(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
    headers: headers,
  })
}

export const exportExcel: (
  fileName: string,
  url: string,
  params: any,
  loading?: NProgress | Ref<boolean>,
) => Promise<any> = (
  fileName: string,
  url: string,
  params: any,
  loading?: NProgress | Ref<boolean>,
) => {
  return promise(request({ url: url, method: 'get', params, responseType: 'blob' }), loading).then(
    (res: any) => {
      if (res) {
        const blob = new Blob([res], {
          type: 'application/vnd.ms-excel',
        })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = fileName
        link.click()
        //Release memory
        window.URL.revokeObjectURL(link.href)
      }
      return true
    },
  )
}

function extractFilename(contentDisposition: string) {
  if (!contentDisposition) return null

  // Process URL EncodingFileName
  const urlEncodedMatch =
    contentDisposition.match(/filename=([^;]*)/i) ||
    contentDisposition.match(/filename\*=UTF-8''([^;]*)/i)
  if (urlEncodedMatch && urlEncodedMatch[1]) {
    try {
      return decodeURIComponent(urlEncodedMatch[1].replace(/"/g, ''))
    } catch (e) {
      console.error('DecodeURLEncodingFileNameFailure:', e)
    }
  }

  // Process Base64 EncodingFileName
  const base64Part = contentDisposition.match(/=\?utf-8\?b\?(.*?)\?=/i)?.[1]
  if (base64Part) {
    try {
      const decoded = decodeURIComponent(escape(atob(base64Part)))
      const filenameMatch = decoded.match(/filename="(.*?)"/i)
      return filenameMatch ? filenameMatch[1] : null
    } catch (e) {
      console.error('DecodeBase64FileNameFailure:', e)
    }
  }

  return null
}

export const exportFile: (
  fileName: string,
  url: string,
  params: any,
  loading?: NProgress | Ref<boolean>,
) => Promise<any> = (
  fileName: string,
  url: string,
  params: any,
  loading?: NProgress | Ref<boolean>,
) => {
  return promise(
    request({
      url: url,
      method: 'get',
      params,
      responseType: 'blob',
      transformResponse: [
        function (data, headers) {
          // HereCanAccess headers
          if (data.type === 'application/json') {
            data.text().then((text: string) => {
              try {
                const json = JSON.parse(text)
                MsgError(json.message || text)
              } catch {
                MsgError(text)
              }
            })
            throw new Error('Response is not a valid file')
          }
          // const contentType = headers['content-type'];
          const contentDisposition = headers['content-disposition']
          // console.log('Content-Type:', contentType);
          // console.log('Content-Disposition:', contentDisposition);
          // IfNoneProvideFileName, thenUseDefaultName
          fileName = extractFilename(contentDisposition) || fileName
          return data // MustReturn data
        },
      ],
    }),
    loading,
  )
    .then((res: any) => {
      if (res) {
        const blob = new Blob([res], {
          type: 'application/octet-stream',
        })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = fileName
        link.click()
        //Release memory
        window.URL.revokeObjectURL(link.href)
      }
      return true
    })
    .catch(() => {})
}

export const exportExcelPost: (
  fileName: string,
  url: string,
  params: any,
  data: any,
  loading?: NProgress | Ref<boolean>,
) => Promise<any> = (
  fileName: string,
  url: string,
  params: any,
  data: any,
  loading?: NProgress | Ref<boolean>,
) => {
  return promise(
    request({
      url: url,
      method: 'post',
      params, // QueryStringParameters
      data, // RequestBodyData
      responseType: 'blob',
    }),
    loading,
  ).then((res: any) => {
    if (res) {
      const blob = new Blob([res], {
        type: 'application/vnd.ms-excel',
      })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName
      link.click()
      // Release memory
      window.URL.revokeObjectURL(link.href)
    }
    return true
  })
}

export const exportFilePost: (
  fileName: string,
  url: string,
  params: any,
  data: any,
  loading?: NProgress | Ref<boolean>,
) => Promise<any> = (
  fileName: string,
  url: string,
  params: any,
  data: any,
  loading?: NProgress | Ref<boolean>,
) => {
  return promise(
    request({
      url: url,
      method: 'post',
      params,
      data,
      responseType: 'blob',
      transformResponse: [
        function (data, headers) {
          // HereCanAccess headers
          if (data.type === 'application/json') {
            data.text().then((text: string) => {
              try {
                const json = JSON.parse(text)
                MsgError(json.message || text)
              } catch {
                MsgError(text)
              }
            })
            throw new Error('Response is not a valid file')
          }
          // const contentType = headers['content-type'];
          const contentDisposition = headers['content-disposition']
          // console.log('Content-Type:', contentType);
          // console.log('Content-Disposition:', contentDisposition);
          // IfNoneProvideFileName, thenUseDefaultName
          fileName = extractFilename(contentDisposition) || fileName
          return data // MustReturn data
        },
      ],
    }),
    loading,
  )
    .then((res: any) => {
      if (res) {
        const blob = new Blob([res], {
          type: 'application/octet-stream',
        })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = fileName
        link.click()
        //Release memory
        window.URL.revokeObjectURL(link.href)
      }
      return true
    })
    .catch(() => {})
}

export const download: (
  url: string,
  method: string,
  data?: any,
  params?: any,
  loading?: NProgress | Ref<boolean>,
) => Promise<any> = (
  url: string,
  method: string,
  data?: any,
  params?: any,
  loading?: NProgress | Ref<boolean>,
) => {
  return promise(request({ url: url, method: method, data, params, responseType: 'blob' }), loading)
}

/**
 * andServiceEstablishwsLink
 * @param url websocketPath
 * @returns  ReturnOnewebsocketInstance
 */
export const socket = (url: string) => {
  let protocol = 'ws://'
  if (window.location.protocol === 'https:') {
    protocol = 'wss://'
  }
  let uri = protocol + window.location.host + url
  if (!import.meta.env.DEV) {
    uri = protocol + window.location.host + import.meta.env.VITE_BASE_PATH + url
  }
  return new WebSocket(uri)
}
export default instance
