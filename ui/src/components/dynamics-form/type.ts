import type { Dict } from '@/api/type/common'

interface ViewCardItem {
  /**
   * Type
   */
  type: 'eval' | 'default'
  /**
   * Title
   */
  title: string
  /**
   * Value differs based on type; default = row[value_field] eval `${parseFloat(row.number).toLocaleString("en-US",{style: "decimal",maximumFractionDigits:1})}%&nbsp;&nbsp;&nbsp;`
   */
  value_field: string
}

interface TableColumn {
  /**
   * Field|ComponentName|canCalculateTemplateString
   */
  property: string
  /**
   *Header
   */
  label: string
  /**
   * Table data field
   */
  value_field?: string

  attrs?: Attrs
  /**
   * Type
   */
  type: 'eval' | 'component' | 'default'

  props_info?: PropsInfo
}
interface ColorItem {
  /**
   * Color#f56c6c
   */
  color: string
  /**
   * Progress
   */
  percentage: number
}
interface Attrs {
  /**
   * Tip text
   */
  placeholder?: string
  /**
   * TagLength, for example '50px'。 As Form DirectSub-Element form-item Will inherit thisValue。 CanUse auto。
   */
  labelWidth?: string
  /**
   * Form field tag suffix
   */
  labelSuffix?: string
  /**
   * AsteriskPosition。
   */
  requireAsteriskPosition?: 'left' | 'right'

  color?: Array<ColorItem>

  [propName: string]: any
}
interface PropsInfo {
  /**
   * TableSelectcard
   */
  view_card?: Array<ViewCardItem>
  /**
   * TableSelect
   */
  table_columns?: Array<TableColumn>
  /**
   * Select message
   */
  active_msg?: string

  /**
   * ComponentStyle
   */
  style?: Dict<any>

  /**
   * el-form-item Style
   */
  item_style?: Dict<any>
  /**
   * FormValidate This andelementValidateSame
   */
  rules?: Dict<any>
  /**
   * Default Not emptyValidateTip
   */
  err_msg?: string
  /**
   *tabsWhenUse
   */
  tabs_label?: string

  [propName: string]: any
}

interface FormField {
  field: string
  /**
   * InputDialogType
   */
  input_type: string
  /**
   * Tip
   */
  label?: string | any
  /**
   * Whether Required
   */
  required?: boolean
  /**
   * DefaultValue
   */
  default_value?: any
  /**
   * WhetherShowDefaultValue
   */
  show_default_value?: boolean
  /**
   *  {field:field_value_list} Indicates in fieldHas value ,And value is infield_value_listOnly inShow
   */
  relation_show_field_dict?: Dict<Array<any>>
  /**
   * {field:field_value_list} Indicates in fieldHas value ,And value is infield_value_listOnly in ExecuteFunctionGet Data
   */
  relation_trigger_field_dict?: Dict<any>
  /**
   * ExecuteRendererType  OPTION_LISTRequestOption_listData CHILD_FORMSRequestSub-Form
   */
  trigger_type?: 'OPTION_LIST' | 'CHILD_FORMS'
  /**
   * FrontendattrData
   */
  attrs?: Attrs
  /**
   * OtherExtraInfo
   */
  props_info?: PropsInfo
  /**
   * DropdownSelectedFieldfield
   */
  text_field?: string
  /**
   * DropdownSelected value
   */
  value_field?: string
  /**
   * DropdownSelectedData
   */
  option_list?: Array<any>
  /**
   * Provider
   */
  provider?: string
  /**
   * ExecuteFunction
   */
  method?: string

  children?: Array<FormField>
  required_asterisk?: boolean
  [propName: string]: any
}
export type { FormField }
