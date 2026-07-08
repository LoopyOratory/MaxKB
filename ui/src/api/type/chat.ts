interface ChatProfile {
  // WhetherEnableAuthentication
  authentication: boolean
  // icon
  icon?: string
  // ApplicationName
  application_name?: string
  // Background image
  bg_icon?: string
  // AuthenticationType
  authentication_type?: 'password' | 'login'
  // LoginType
  login_value?: Array<string>
  max_attempts?: number
  rsaKey?: string
}

interface ChatUserProfile {
  email: string
  id: string
  nick_name: string
  username: string
  source: string
}
export { type ChatProfile, type ChatUserProfile }
