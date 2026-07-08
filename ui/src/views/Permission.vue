<template>
  <div>Note: v-hasPermission IsUsev-show EssentiallyComponentIsRender v-if="hasPermission('xxxx')"</div>
  <div>This kindMethodComponentWill notRender(Used forFor exampleComponentMountWhenNeedsCallInterface,Do not want toComponentRender)</div>
  <div>For exampleWorkspaceDropdownListComponentUsev-if Example:  EnterpriseComponent:</div>

  <button v-if="hasPermission(EditionConst.IS_CE, 'OR')">I amCommunity editionComponent</button>

  <button v-hasPermission="EditionConst.IS_CE">I amCommunity editionComponent</button>
  <!-- ================I amEnterpriseComponent================== -->
  <button v-if="hasPermission(EditionConst.IS_EE, 'OR')">I amEnterpriseComponent</button>
  <button v-hasPermission="EditionConst.IS_EE">I amEnterpriseComponent</button>

  <!-- ================EnterpriseComponent And isADMINRole================== -->
  <button v-if="hasPermission([EditionConst.IS_EE, RoleConst.ADMIN], 'AND')">
    I amEnterpriseAnd isADMINRole
  </button>
  <button
    v-hasPermission="new ComplexPermission([RoleConst.ADMIN], [], [EditionConst.IS_EE], 'AND')"
  >
    I amEnterpriseAnd isADMINRole
  </button>
  <!-- ================EnterpriseComponent And isCurrentWorkspaceAdmin================== -->
  <button
    v-if="hasPermission([EditionConst.IS_EE, RoleConst.WORKSPACE_MANAGE.getWorkspaceRole], 'AND')"
  >
    I amEnterpriseAndHasCurrentWorkspaceAdminRole
  </button>
  <button
    v-hasPermission="
      new ComplexPermission(
        [RoleConst.WORKSPACE_MANAGE.getWorkspaceRole],
        [],
        [EditionConst.IS_EE],
        'OR',
      )
    "
  >
    I amEnterpriseAndHasCurrentWorkspaceAdminRole
  </button>
  <!-- ================Enterprise component (and is current workspace admin or has user read-only)================== -->
  <button
    v-if="
      hasPermission(
        new ComplexPermission(
          [RoleConst.WORKSPACE_MANAGE.getWorkspaceRole],
          [PermissionConst.USER_READ],
          [EditionConst.IS_EE],
          'OR',
        ),
        'OR',
      )
    "
  >
    I am enterprise component (and is current workspace admin or has user read-only)
  </button>
  <button
    v-hasPermission="
      new ComplexPermission(
        [RoleConst.WORKSPACE_MANAGE.getWorkspaceRole],
        [PermissionConst.USER_READ],
        [EditionConst.IS_EE],
        'OR',
      )
    "
  >
    I am enterprise component (and is current workspace admin or has user read-only)
  </button>
</template>
<script setup lang="ts">
import { PermissionConst, EditionConst, RoleConst } from '@/utils/permission/data'
import { hasPermission } from '@/utils/permission/index'
import { ComplexPermission } from '@/utils/permission/type'
</script>
<style lang="scss" scoped></style>
