import type { Dict } from './common'
interface modelRequest {
  name: string
  model_type: string
  model_name: string
}

interface Provider {
  /**
   * ProviderCode name
   */
  provider: string
  /**
   * ProviderName
   */
  name: string
  /**
   * Providericon
   */
  icon: string
}

interface ListModelRequest {
  /**
   * ModelName
   */
  name?: string
  /**
   * Model type
   */
  model_type?: string
  /**
   * BasicModelName
   */
  model_name?: string
  /**
   * Provider
   */
  provider?: string

  workspace_id?: string
}

interface Model {
  /**
   * Primary keyid
   */
  id: string
  /**
   * Model name
   */
  name: string
  /**
   * Model type
   */
  model_type: string
  user_id: string
  username: string
  nick_name: string
  /**
   * BasicModel
   */
  model_name: string
  /**
   * AuthenticationInfo
   */
  credential: any
  /**
   * Provider
   */
  provider: string
  /**
   * Status
   */
  status: 'SUCCESS' | 'DOWNLOAD' | 'ERROR' | 'PAUSE_DOWNLOAD'
  /**
   * Metadata
   */
  meta: Dict<any>
  /**
   * ModelParametersConfiguration
   */
  model_params_form: Dict<any>[]
  resource_count: number
  create_time?: any
}
interface CreateModelRequest {
  /**
   * Model name
   */
  name: string
  /**
   * Model type
   */
  model_type: string
  /**
   * BasicModel
   */
  model_name: string
  /**
   * AuthenticationInfo
   */
  credential: any
  /**
   * Provider
   */
  provider: string
}

interface EditModelRequest {
  /**
   * Model name
   */
  name: string
  /**
   * Model type
   */
  model_type: string
  /**
   * BasicModel
   */
  model_name: string
  /**
   * AuthenticationInfo
   */
  credential: any
}

interface BaseModel {
  /**
   * BasicModelName
   */
  name: string
  /**
   * BasicModelDescription
   */
  desc: string
  /**
   * BasicModel type
   */
  model_type: string
}
export type {
  modelRequest,
  Provider,
  ListModelRequest,
  Model,
  BaseModel,
  CreateModelRequest,
  EditModelRequest
}
