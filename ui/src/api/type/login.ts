interface LoginRequest {
  /**
   * Username
   */
  username: string
  /**
   * Password
   */
  password: string
  /**
   * VerifyCode
   */
  captcha: string
  /**
   * EncryptData
   */
  encryptedData?: string
}
export type { LoginRequest }
