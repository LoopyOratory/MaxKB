import { t } from '@/locales'

export const themeList = [
  {
    label: t('theme.default'),
    value: '#3370FF',
    loginBackground: 'default',
  },
  {
    label: t('theme.orange'),
    value: '#FF8800',
    loginBackground: 'orange',
  },
  {
    label: t('theme.green'),
    value: '#00B69D',
    loginBackground: 'green',
  },
  {
    label: t('theme.purple'),
    value: '#7F3BF5',
    loginBackground: 'purple',
  },
  {
    label: t('theme.red'),
    value: '#F01D94',
    loginBackground: 'red',
  },
]

export function getThemeImg(val: string) {
  if (!val) return 'default'
  return themeList.filter((v) => v.value === val)?.[0]?.loginBackground || 'default'
}

export const defaultSetting = {
  icon: '',
  loginLogo: '',
  loginImage: '',
  title: 'MaxKB',
  slogan: t('theme.defaultSlogan'),
}

export const defaultPlatformSetting = {
  showUserManual: true,
  userManualUrl: t('layout.userManualUrl'),
  showForum: true,
  forumUrl: t('layout.forumUrl'),
  showProject: true,
  projectUrl: 'https://github.com/1Panel-dev/MaxKB',
}

export function hexToRgba(hex?: string, alpha?: number) {
  // Transform hex color value (two characters together) to decimal
  if (!hex) {
    return ''
  } else {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)

    // ReturnRGBAFormatString
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
}

// ============================================================
// Agent Embed & Chat UI Theming (community edition preset system)
// ============================================================

export interface AgentThemePreset {
  key: string
  base: string // base hex color
  isDark: boolean
}

/**
 * 8 mutually-exclusive presets: 7 hues + 1 neutral dark.
 * Blue is the default, matching MaxKB's existing brand color.
 */
export const AGENT_THEME_PRESETS: Record<string, AgentThemePreset> = {
  red: { key: 'red', base: '#DC2626', isDark: false },
  orange: { key: 'orange', base: '#EA580C', isDark: false },
  yellow: { key: 'yellow', base: '#CA8A04', isDark: false },
  green: { key: 'green', base: '#16A34A', isDark: false },
  blue: { key: 'blue', base: '#3370FF', isDark: false },
  indigo: { key: 'indigo', base: '#4F46E5', isDark: false },
  violet: { key: 'violet', base: '#7C3AED', isDark: false },
  dark: { key: 'dark', base: '#8B93A7', isDark: true },
}

/**
 * Dark-mode surface tokens — applied when the "dark" preset is selected.
 * Scoped to chat surfaces only, not the admin dashboard.
 *
 * Includes Element Plus's own core design tokens (--el-bg-color,
 * --el-fill-color-*, etc.) so every el-card / el-button / el-input inside
 * the dark chat widget picks up dark surfaces automatically — without this,
 * anything that doesn't go through our custom --chat-* tokens (the "thinking
 * process" card, the stop-response button, quick-question chip cards, url
 * upload popups...) silently falls back to Element Plus's white defaults.
 */
export const DARK_SURFACE_TOKENS: Record<string, string> = {
  '--app-layout-bg-color': '#16171A',
  '--app-header-bg-color': '#1B1C1F',
  '--dialog-bg-gradient-color': '#1B1C1F',
  '--app-view-bg-color': '#202225',
  '--el-text-color-primary': '#F5F5F5',
  '--el-text-color-regular': '#D6D9DE',
  '--el-text-color-secondary': '#A6ADBB',
  '--app-text-color-secondary': '#A6ADBB',
  '--el-border-color': 'rgba(255, 255, 255, 0.08)',
  '--el-border-color-light': 'rgba(255, 255, 255, 0.08)',
  '--el-border-color-lighter': 'rgba(255, 255, 255, 0.06)',
  '--el-bg-color': '#202225',
  '--el-bg-color-overlay': '#2A2B30',
  '--el-fill-color-blank': '#1B1C1F',
  '--el-fill-color': '#26272B',
  '--el-fill-color-light': '#2A2B30',
  '--el-fill-color-lighter': '#26272B',
  '--el-fill-color-extra-light': '#202225',
  '--el-mask-color': 'rgba(0, 0, 0, 0.6)',
  '--el-menu-text-color': '#D6D9DE',
  '--el-menu-hover-text-color': '#F5F5F5',
  '--el-menu-bg-color': 'transparent',
  '--el-menu-hover-bg-color': 'rgba(255, 255, 255, 0.06)',
}

/**
 * Compute relative luminance of a hex color.
 * Returns a value between 0 (dark) and 1 (light).
 */
export function getRelativeLuminance(hex: string): number {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16) / 255
  const g = parseInt(h.substring(2, 4), 16) / 255
  const b = parseInt(h.substring(4, 6), 16) / 255

  const linearize = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

/**
 * Return contrast text color (white or dark) based on background luminance.
 * Uses a ~0.4 luminance threshold as specified in the plan.
 */
export function getContrastText(hex: string): string {
  return getRelativeLuminance(hex) > 0.4 ? '#1F2329' : '#ffffff'
}

/**
 * Mix two hex colors by a given ratio (0..1).
 * ratio=0 → pure color1, ratio=1 → pure color2.
 */
export function mixColors(color1: string, color2: string, ratio: number): string {
  const c1 = color1.replace('#', '')
  const c2 = color2.replace('#', '')
  const r = Math.round(parseInt(c1.substring(0, 2), 16) * (1 - ratio) + parseInt(c2.substring(0, 2), 16) * ratio)
  const g = Math.round(parseInt(c1.substring(2, 4), 16) * (1 - ratio) + parseInt(c2.substring(2, 4), 16) * ratio)
  const b = Math.round(parseInt(c1.substring(4, 6), 16) * (1 - ratio) + parseInt(c2.substring(4, 6), 16) * ratio)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/**
 * Generate the full Element Plus color ramp from a single base hex.
 * Returns CSS variable assignments for primary and all light/dark variants.
 *
 * The ramp mimics useElementPlusTheme's generation:
 *   light-3: mix 30% white
 *   light-5: mix 50% white
 *   light-7: mix 70% white
 *   light-8: mix 80% white
 *   light-9: mix 90% white
 *   dark-2:  mix 20% black
 */
export function generateColorRamp(baseHex: string, isDark = false): Record<string, string> {
  // In dark mode, "light" tints mix toward black (a subtle highlight on a dark
  // surface) instead of white — otherwise every hover/tag/tint state (e.g.
  // .problem-button:hover, default-tag) flashes near-white against the dark
  // chat background.
  const tintTarget = isDark ? '#000000' : '#ffffff'
  const shadeTarget = isDark ? '#ffffff' : '#000000'
  return {
    '--el-color-primary': baseHex,
    '--el-color-primary-light-3': mixColors(baseHex, tintTarget, 0.3),
    '--el-color-primary-light-5': mixColors(baseHex, tintTarget, 0.5),
    '--el-color-primary-light-6': mixColors(baseHex, tintTarget, 0.6),
    '--el-color-primary-light-06': hexToRgba(baseHex, isDark ? 0.14 : 0.04),
    '--el-color-primary-light-7': mixColors(baseHex, tintTarget, 0.7),
    '--el-color-primary-light-8': mixColors(baseHex, tintTarget, 0.8),
    '--el-color-primary-light-9': mixColors(baseHex, tintTarget, isDark ? 0.82 : 0.9),
    '--el-color-primary-dark-2': mixColors(baseHex, shadeTarget, 0.2),
  }
}

/**
 * Chat surface tokens power the modern look of the embedded widget: a diagonal
 * gradient header, gradient-filled outgoing bubbles, and frosted-glass
 * (backdrop-blur) incoming bubbles / input bar. Generated per preset so every
 * hue gets a cohesive, professional look without hand-tuning each one.
 */
export function generateChatSurfaceTokens(base: string, isDark: boolean): Record<string, string> {
  if (isDark) {
    return {
      '--chat-header-gradient': 'linear-gradient(135deg, #24262B 0%, #17181B 100%)',
      '--chat-header-text': '#F5F5F5',
      '--chat-header-shadow': '0 8px 24px rgba(0, 0, 0, 0.35)',
      '--chat-question-bubble-bg': `linear-gradient(135deg, ${mixColors(base, '#ffffff', 0.15)} 0%, ${base} 100%)`,
      '--chat-question-bubble-text': '#ffffff',
      '--chat-answer-bubble-bg': 'rgba(42, 43, 48, 0.6)',
      '--chat-answer-bubble-border': 'rgba(255, 255, 255, 0.08)',
      '--chat-glass-blur': 'blur(20px) saturate(180%)',
      '--chat-input-bg': 'rgba(27, 28, 31, 0.6)',
      '--chat-input-border': 'rgba(255, 255, 255, 0.1)',
      '--chat-accent-glow': hexToRgba(base, 0.3),
    }
  }

  return {
    '--chat-header-gradient': `linear-gradient(135deg, ${base} 0%, ${mixColors(base, '#000000', 0.24)} 100%)`,
    '--chat-header-text': getContrastText(base),
    '--chat-header-shadow': `0 8px 24px ${hexToRgba(base, 0.28)}`,
    '--chat-question-bubble-bg': `linear-gradient(135deg, ${base} 0%, ${mixColors(base, '#000000', 0.16)} 100%)`,
    '--chat-question-bubble-text': getContrastText(base),
    '--chat-answer-bubble-bg': 'rgba(255, 255, 255, 0.6)',
    '--chat-answer-bubble-border': 'rgba(255, 255, 255, 0.7)',
    '--chat-glass-blur': 'blur(20px) saturate(180%)',
    '--chat-input-bg': 'rgba(255, 255, 255, 0.6)',
    '--chat-input-border': 'rgba(255, 255, 255, 0.8)',
    '--chat-accent-glow': hexToRgba(base, 0.3),
    '--app-layout-bg-color': mixColors(base, '#ffffff', 0.94),
  }
}

/**
 * Apply a raw hex color ramp to a chat root element.
 *
 * Used when EE custom_theme.theme_color is set (arbitrary hex wins over preset).
 * Clears any dark-mode class since EE handles its own theme.
 *
 * @param el   The root DOM element of the chat view
 * @param hex  Raw hex color (e.g. "#FF0000")
 */
export function applyThemeColor(el: HTMLElement | null, hex: string): void {
  if (!el) return

  const ramp = generateColorRamp(hex)
  const surfaceTokens = generateChatSurfaceTokens(hex, false)

  // Apply primary color ramp + gradient/glass surface tokens
  for (const [varName, value] of Object.entries({ ...ramp, ...surfaceTokens })) {
    el.style.setProperty(varName, value)
  }

  // Clear dark mode (EE handles its own theme)
  el.classList.remove('chat-embed--dark')
  for (const varName of Object.keys(DARK_SURFACE_TOKENS)) {
    el.style.removeProperty(varName)
  }
}

/**
 * Apply an agent theme preset to a chat root element.
 *
 * Sets the full Element Plus color ramp on the element's inline style.
 * For the "dark" preset, also applies scoped surface tokens
 * and adds the .chat-embed--dark CSS class.
 *
 * @param el    The root DOM element of the chat view
 * @param presetKey  One of the AGENT_THEME_PRESETS keys (e.g. "blue", "dark")
 */
export function applyAgentTheme(el: HTMLElement | null, presetKey: string): void {
  if (!el) return

  const preset = AGENT_THEME_PRESETS[presetKey] || AGENT_THEME_PRESETS['blue']
  const ramp = generateColorRamp(preset.base, preset.isDark)
  const surfaceTokens = generateChatSurfaceTokens(preset.base, preset.isDark)

  // Apply primary color ramp + gradient/glass surface tokens
  for (const [varName, value] of Object.entries({ ...ramp, ...surfaceTokens })) {
    el.style.setProperty(varName, value)
  }

  // Toggle dark class and surface tokens
  if (preset.isDark) {
    el.classList.add('chat-embed--dark')
    for (const [varName, value] of Object.entries(DARK_SURFACE_TOKENS)) {
      el.style.setProperty(varName, value)
    }
  } else {
    el.classList.remove('chat-embed--dark')
    // Remove dark surface tokens to revert to light defaults
    for (const varName of Object.keys(DARK_SURFACE_TOKENS)) {
      el.style.removeProperty(varName)
    }
  }
}

/**
 * Determine the effective theme color from application detail data.
 * EE custom_theme.theme_color (arbitrary hex) wins over community preset.
 * Falls back to blue (#3370FF).
 */
export function getEffectiveThemeColor(applicationDetail: any): string {
  const eeColor = applicationDetail?.custom_theme?.theme_color
  if (eeColor) return eeColor
  const presetKey = applicationDetail?.theme || 'blue'
  const preset = AGENT_THEME_PRESETS[presetKey]
  return preset ? preset.base : '#3370FF'
}

/**
 * Determine whether dark mode is active for the application.
 */
export function isDarkTheme(applicationDetail: any): boolean {
  // If EE custom_theme is set, it's not a dark preset (EE handles its own theme)
  if (applicationDetail?.custom_theme?.theme_color) return false
  const presetKey = applicationDetail?.theme || 'blue'
  return AGENT_THEME_PRESETS[presetKey]?.isDark || false
}
