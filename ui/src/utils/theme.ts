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
 */
export const DARK_SURFACE_TOKENS: Record<string, string> = {
  '--app-layout-bg-color': '#16171A',
  '--app-header-bg-color': '#1B1C1F',
  '--dialog-bg-gradient-color': '#1B1C1F',
  '--app-view-bg-color': '#202225',
  '--el-text-color-primary': '#F5F5F5',
  '--app-text-color-secondary': '#A6ADBB',
  '--el-border-color': 'rgba(255,255,255,.08)',
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
function mixColors(color1: string, color2: string, ratio: number): string {
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
export function generateColorRamp(baseHex: string): Record<string, string> {
  return {
    '--el-color-primary': baseHex,
    '--el-color-primary-light-3': mixColors(baseHex, '#ffffff', 0.3),
    '--el-color-primary-light-5': mixColors(baseHex, '#ffffff', 0.5),
    '--el-color-primary-light-6': mixColors(baseHex, '#ffffff', 0.6),
    '--el-color-primary-light-06': hexToRgba(baseHex, 0.04),
    '--el-color-primary-light-7': mixColors(baseHex, '#ffffff', 0.7),
    '--el-color-primary-light-8': mixColors(baseHex, '#ffffff', 0.8),
    '--el-color-primary-light-9': mixColors(baseHex, '#ffffff', 0.9),
    '--el-color-primary-dark-2': mixColors(baseHex, '#000000', 0.2),
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

  // Apply primary color ramp
  for (const [varName, value] of Object.entries(ramp)) {
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
  const ramp = generateColorRamp(preset.base)

  // Apply primary color ramp
  for (const [varName, value] of Object.entries(ramp)) {
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
