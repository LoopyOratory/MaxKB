<template>
  <div class="authentication-setting__main main-calc-height">
    <el-scrollbar>
      <div class="form-container p-24" v-loading="loading">
        <el-form
          ref="authFormRef"
          :model="form"
          label-position="top"
          require-asterisk-position="right"
          @submit.prevent
        >
          <!-- LoginMethodSelectDialog -->
          <el-form-item
            :label="$t('views.system.login_method')"
            :rules="[
              {
                required: true,
                message: $t('views.applicationOverview.appInfo.LimitDialog.loginMethodRequired'),
                trigger: 'change',
              },
            ]"
            prop="login_methods"
            style="padding-top: 16px"
          >
            <el-checkbox-group v-model="form.login_methods" @change="handleLoginMethodsChange">
              <template v-for="t in systemLoginMethods" :key="t.value">
                <el-checkbox :label="t.label" :value="t.value"/>
              </template>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item
            :label="$t('views.system.default_login')"
            :rules="[
              {
                required: true,
                message: $t('views.applicationOverview.appInfo.LimitDialog.loginMethodRequired'),
                trigger: 'change',
              },
            ]"
            prop="default_value"
          >
            <el-radio-group
              v-model="form.default_value"
              class="radio-group"
              style="margin-left: 10px"
            >
              <el-radio
                v-for="method in loginMethods"
                :key="method.value"
                :label="method.value"
                class="radio-item"
              >
                {{ method.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            :label="$t('views.system.display_code')"
            :rules="[
              {
                required: true,
                message: $t('views.applicationOverview.appInfo.LimitDialog.displayCodeRequired'),
                trigger: 'change',
              },
            ]"
            prop="max_attempts"
          >
            <el-row :gutter="16" style="margin-left: 10px">
              <el-col :span="24">
                <span style="font-size: 13px">
                  {{ $t('views.system.loginFailed') }}
                </span>
                <el-input-number
                  style="margin-left: 8px"
                  v-model="form.max_attempts"
                  :min="-1"
                  :max="10"
                  :step="1"
                  controls-position="right"
                />
                <span class="ml-8" style="font-size: 13px">
                  {{ $t('views.system.loginFailedMessage') }}
                </span>
                <span class="ml-8 font-small" style="color: #909399">
                  ({{ $t('views.system.display_codeTip') }})
                </span>
              </el-col>

              <el-col :span="24" style="margin-top: 8px">
                <span style="font-size: 13px">
                  {{ $t('views.system.loginFailed') }}
                </span>
                <el-input-number
                  style="margin-left: 8px"
                  v-model="form.failed_attempts"
                  :min="-1"
                  :max="10"
                  :step="1"
                  controls-position="right"
                  @change="onFailedAttemptsChange"
                />
                <span style="margin-left: 8px; font-size: 13px">
                  {{ $t('views.system.failedTip') }}
                </span>
                <el-input-number
                  style="margin-left: 8px"
                  v-model="form.lock_time"
                  :min="1"
                  :step="1"
                  controls-position="right"
                />
                <span style="margin-left: 8px; font-size: 13px">
                  {{ $t('views.system.minute') }}
                </span>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item
            :label="$t('views.system.third_party_user_default_role')"
            :rules="[
              {
                required: true,
                message: $t('views.system.thirdPartyUserDefaultRoleRequired'),
                trigger: 'change',
              },
            ]"
          >
            <el-row :gutter="16" style="margin-left: 10px">
              <el-col :span="24">
                <div class="flex">
                  <span
                    style="font-size: 13px; white-space: nowrap; width: 50px"
                    class="text-right mr-8"
                  >
                    {{ $t('views.role.member.role') }}
                  </span>
                  <el-select
                    filterable
                    clearable
                    v-model="form.role_id"
                    :placeholder="`${$t('common.selectPlaceholder')}${$t('views.role.member.role')}`"
                    @change="handleRoleChange"
                    class="w-240"
                  >
                    <el-option
                      v-for="role in roleOptions"
                      :key="role.id"
                      :label="role.name"
                      :value="role.id"
                    />
                  </el-select>
                </div>
              </el-col>
              <el-col :span="24" v-if="user.isEE() && showWorkspaceSelector" class="mt-16">
                <div class="flex">
                  <span
                    style="font-size: 13px; white-space: nowrap; width: 50px"
                    class="text-right mr-8"
                  >
                    {{ $t('views.role.member.workspace') }}
                  </span>
                  <el-select
                    filterable
                    clearable
                    v-model="form.workspace_id"
                    :placeholder="`${$t('common.selectPlaceholder')}${$t('views.role.member.workspace')}`"
                    class="w-240"
                  >
                    <el-option
                      v-for="workspace in workspaceOptions"
                      :key="workspace.id"
                      :label="workspace.name"
                      :value="workspace.id"
                    />
                  </el-select>
                </div>
              </el-col>
              <el-col
                :span="24"
                v-if="(user.isEE() || user.isPE()) && showPermissionSelector"
                class="mt-16"
              >
                <div class="flex">
                  <span
                    style="font-size: 13px; white-space: nowrap; width: 50px"
                    class="text-right mr-8"
                  >
                    {{ $t('views.system.resourceAuthorization.title') }}
                  </span>
                  <el-select
                    filterable
                    clearable
                    v-model="form.permission"
                    :placeholder="`${$t('common.selectPlaceholder')}${$t('views.system.resourceAuthorization.title')}`"
                    class="w-240"
                  >
                    <el-option
                      v-for="permission in permissionOptions"
                      :key="permission.value"
                      :label="permission.label"
                      :value="permission.value"
                    />
                  </el-select>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <div style="margin-top: 16px">
          <span
            v-hasPermission="
              new ComplexPermission([RoleConst.ADMIN], [PermissionConst.LOGIN_AUTH_EDIT], [], 'OR')
            "
            class="mr-12"
          >
            <!-- DirectCall submit, notParameter -->
            <el-button @click="submit" type="primary" :disabled="loading">
              {{ $t('common.save') }}
            </el-button>
          </span>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue'
import {ComplexPermission} from '@/utils/permission/type'
import {EditionConst, PermissionConst, RoleConst} from '@/utils/permission/data'
import type {FormInstance} from 'element-plus'
import {t} from '@/locales'
import authApi from '@/api/system-settings/auth-setting.ts'
import {MsgSuccess} from '@/utils/message.ts'
import WorkspaceApi from '@/api/workspace/workspace.ts'
import useStore from '@/stores'
import {AuthorizationEnum} from '@/enums/system.ts'
import {hasPermission} from '@/utils/permission'

const loginMethods = ref<Array<{ label: string; value: string }>>([])
const systemLoginMethods = ref<Array<{ label: string; value: string }>>([])
const loading = ref(false)
// Explicitly allow null, avoid when unmountedAccessError
const authFormRef = ref<FormInstance | null>(null)

const form = ref<any>({
  default_value: 'LOCAL',
  max_attempts: 1,
  failed_attempts: 5,
  lock_time: 10,
  role_id: 'USER',
  workspace_id: 'default',
  permission: 'NOT_AUTH',
  login_methods: ['LOCAL'],
})

const normalizeInputValue = (val: number | null): number => {
  // If input is empty or cannot be transformed to a valid number, default to 1
  let normalizedVal = typeof val === 'number' ? Math.trunc(val) : NaN
  if (!Number.isFinite(normalizedVal)) {
    normalizedVal = 1
  }

  if (normalizedVal === 0) {
    normalizedVal = 1
  } else if (normalizedVal < -1) {
    normalizedVal = -1
  }

  return normalizedVal
}

const onFailedAttemptsChange = (val: number | null) => {
  form.value.failed_attempts = normalizeInputValue(val)
}

const onMaxAttemptsChange = (val: number | null) => {
  form.value.max_attempts = normalizeInputValue(val)
}

// Submit: use authFormRef.value.validate() promise style, and ensure loading is restored in finally
const submit = async () => {
  const formRef = authFormRef.value
  if (!formRef) return
  try {
    await formRef.validate()
    loading.value = true
    const params = {
      default_value: form.value.default_value,
      max_attempts: form.value.max_attempts,
      failed_attempts: form.value.failed_attempts,
      lock_time: form.value.lock_time,
      role_id: form.value.role_id,
      workspace_id: form.value.workspace_id,
      permission: form.value.permission,
      login_methods: form.value.login_methods,
    }
    await authApi.putLoginSetting(params)
    MsgSuccess(t('common.saveSuccess'))
  } catch (err) {
    // VerifyorRequestFailure: On-demandProcess, avoid uncapturedException
    // console.error(err);
  } finally {
    loading.value = false
  }
}

const roleOptions = ref<Array<{ id: string; name: string; type?: string }>>([])
const workspaceOptions = ref<Array<{ id: string; name: string }>>([])
const {user} = useStore()
const selectedRoleType = ref<string>('') // StorageSelectRoleType，Used forControl workspace Show
const showWorkspaceSelector = computed(() => selectedRoleType.value !== 'ADMIN')
const showPermissionSelector = computed(() => selectedRoleType.value === 'USER')
const permissionOptions = computed(() => {
  const baseOptions = [
    {
      label: t('views.system.resourceAuthorization.setting.check'),
      value: AuthorizationEnum.VIEW,
      desc: t('views.system.resourceAuthorization.setting.checkDesc'),
    },
    {
      label: t('views.system.resourceAuthorization.setting.management'),
      value: AuthorizationEnum.MANAGE,
      desc: t('views.system.resourceAuthorization.setting.managementDesc'),
    },
    {
      label: t('views.system.resourceAuthorization.setting.notAuthorized'),
      value: AuthorizationEnum.NOT_AUTH,
      desc: '',
    },
  ]

  if (hasPermission([EditionConst.IS_EE, EditionConst.IS_PE], 'OR')) {
    baseOptions.splice(2, 0, {
      label: t('views.system.resourceAuthorization.setting.role'),
      value: AuthorizationEnum.ROLE,
      desc: t('views.system.resourceAuthorization.setting.roleDesc'),
    })
  }

  return baseOptions
})
// When role changes, update selectedRoleType
const handleRoleChange = (roleId: string) => {
  const selectedRole = roleOptions.value.find((role) => role.id === roleId)
  selectedRoleType.value = selectedRole?.type || ''
  if (form.value.workspace_id === 'None' && showWorkspaceSelector) {
    form.value.workspace_id = 'default'
  }
}
const handleLoginMethodsChange = (values: string[]) => {
  // Based onSelected in LoginMethodFilter systemLoginMethods
  loginMethods.value = systemLoginMethods.value.filter(method =>
    values.includes(method.value)
  )

  // If current default login method is not in selection range, reset to the selected method
  if (values.length > 0 && !values.includes(form.value.default_value)) {
    form.value.default_value = values[0]
  }

  // IfNoneAny selected in LoginMethod, clearDefaultLoginMethod
  if (values.length === 0) {
    form.value.default_value = ''
    // Re-TriggerVerify
    setTimeout(() => {
      authFormRef.value?.validateField('login_methods')
    }, 0)
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const isEE = typeof user?.isEE === 'function' ? user.isEE() : false

    // ParallelRequest：RoleList + LoginSettings; if EE SimultaneouslyRequest workspace List
    const roleP = WorkspaceApi.getWorkspaceRoleList()
      .then((r) => r)
      .catch(() => ({data: []}))
    const settingP = authApi
      .getLoginSetting()
      .then((r) => r)
      .catch(() => ({data: {}}))
    const tasks: Promise<any>[] = [roleP, settingP]
    if (isEE) {
      tasks.push(
        WorkspaceApi.getWorkspaceList()
          .then((r) => r)
          .catch(() => ({data: []})),
      )
    }

    const results = await Promise.all(tasks)
    const roleRes = results[0] ?? {data: []}
    const settingRes = results[1] ?? {data: {}}
    const workspaceRes = isEE ? (results[2] ?? {data: []}) : null

    // ProcessRoleList(Early echo)
    const rolesData = Array.isArray(roleRes?.data) ? roleRes.data : []
    roleOptions.value = rolesData.map((item: any) => ({
      id: item.id,
      name: item.name,
      type: item.type,
    }))

    // Process settings (merge default values, avoid accessing undefined)
    const data = settingRes?.data ?? {}
    form.value = {
      ...form.value,
      ...data,
      failed_attempts: data.failed_attempts ?? form.value.failed_attempts ?? 5,
      lock_time: data.lock_time ?? form.value.lock_time ?? 10,
      role_id: data.role_id ?? form.value.role_id ?? 'USER',
      workspace_id: data.workspace_id ?? form.value.workspace_id ?? 'default',
      permission: data.permission ?? form.value.permission ?? 'NOT_AUTH',
    }
    loginMethods.value = Array.isArray(data.auth_types) ? data.auth_types : []
    systemLoginMethods.value = Array.isArray(data.system_options) ? data.system_options : []

    // Process workspace List（IfNeeds）
    if (isEE && workspaceRes) {
      const wks = Array.isArray(workspaceRes.data) ? workspaceRes.data : []
      workspaceOptions.value = wks.map((item: any) => ({id: item.id, name: item.name}))
    }

    // Initialize selectedRoleType(Based onCurrentEchoed role_id With existingLoad roleOptions）
    const initRole = roleOptions.value.find((r) => r.id === form.value.role_id)
    selectedRoleType.value = initRole?.type || ''
  } catch (e) {
    // overall error, MaintainDefaultEcho
    // console.error(e);
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.radio-group {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
</style>
