interface User {
  /**
   * Userid
   */
  id: string
  /**
   * Username
   */
  username: string
  nick_name: string
  /**
   * Email
   */
  email: string
  /**
   * UserRole
   */
  role: Array<string>
  /**
   * UserPermission
   */
  permissions: Array<string>
  /**
   * WhetherNeedsModificationPassword
   */
  is_edit_password?: boolean
  IS_XPACK?: boolean
  XPACK_LICENSE_IS_VALID?: boolean
  language?: string
  workspace_list?: Array<any>
  role_name?: Array<any>
  source?: string
}

interface LoginRequest {
  /**
   * Username
   */
  username: string
  /**
   * Password
   */
  password: string
}

interface RegisterRequest {
  /**
   * Username
   */
  username: string
  /**
   * Password
   */
  password: string
  /**
   * ConfirmPassword
   */
  re_password: string
  /**
   * Email
   */
  email: string
  /**
   * VerifyCode
   */
  code: string
}

interface CheckCodeRequest {
  /**
   * Email
   */
  email: string
  /**
   *VerifyCode
   */
  code: string
  /**
   * Type
   */
  type: 'register' | 'reset_password'
}

interface ResetCurrentUserPasswordRequest {
  /**
   * VerifyCode
   */
  code?: string
  /**
   *Password
   */
  password: string
  /**
   * ConfirmPassword
   */
  re_password: string
}

interface ResetPasswordRequest {
  /**
   * Email
   */
  email?: string
  /**
   * VerifyCode
   */
  code?: string
  /**
   * Password
   */
  password: string
  /**
   * ConfirmPassword
   */
  re_password: string
  encrypted?: boolean
}

export type {
  LoginRequest,
  RegisterRequest,
  CheckCodeRequest,
  ResetPasswordRequest,
  User,
  ResetCurrentUserPasswordRequest,
}
