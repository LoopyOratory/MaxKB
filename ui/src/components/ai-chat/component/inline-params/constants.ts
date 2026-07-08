/**
 * User input parameter inline whitelist
 *
 * Only fields with these input_types can be set as inline parameters (displayed inline in the chat box).
 * Changes here affect 3 consumers; keep semantics in sync:
 * - UserInputTitleDialog.vue —— Disabled state check for select options in the gear popup
 * - inline-params/index.vue  —— Fallback filter during rendering to prevent whitelist bypass
 * - base-node/UserInputFieldTable.vue —— Clean up stale data when field type changes or is deleted
 */
export const ALLOWED_EXPOSED_TYPES = [
  'Model',
  'Knowledge',
  'SwitchInput',
  'DatePicker',
  'TreeSelect',
  'SingleSelect',
  'MultiSelect',
] as const
