<template>
  <div class="fill_content">
    <el-container direction="vertical">
      <el-header class="header" height="30px"
        >角色管理=>维护角色与用户、角色与权限的关系</el-header
      >
      <el-container>
        <el-aside class="role_list" width="321px">
          <el-button
            icon="el-icon-plus"
            type="danger"
            @click="handleRoleAdd()"
            circle
          ></el-button>
          <el-table
            :data="roleList"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border
            default-expand-all
            highlight-current-row
            @current-change="handleCurrentRoleChange"
          >
            <el-table-column prop="id" label="ID" sortable width="70">
            </el-table-column>
            <el-table-column prop="name" label="角色名称" width="100">
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  @click="handleRoleEdit(scope.$index, scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleRoleDelete(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-aside>
        <el-main>
          <el-tabs type="border-card">
            <el-tab-pane label="角色与权限">
              <el-tree
                :data="aclTree"
                show-checkbox
                node-key="id"
                :default-expanded-keys="checkedIds"
                :default-checked-keys="checkedIds"
                :props="treeProps"
                ref="roleAclTree"
              >
              </el-tree>
              <el-button
                icon="el-icon-check"
                type="primary"
                @click="updateAclCheck()"
                round
              >
                提交权限点更改</el-button
              >
            </el-tab-pane>
            <el-tab-pane label="角色与用户">角色与用户</el-tab-pane>
          </el-tabs></el-main
        ></el-container
      ></el-container
    >
    <RoleDialog
      :role_dialog="role_dialog"
      :add_role="add_role"
      @updateData="getRoleList"
      :status_enum="statusEnum"
      :type_enum="typeEnum"
    ></RoleDialog>
  </div>
</template>

<script>
import RoleDialog from '../components/RoleDialog'

export default {
  data() {
    return {
      statusEnum: {
        1: '正常',
        0: '冻结',
        2: '删除',
      },
      typeEnum: {
        1: '管理员',
        2: '其他',
      },
      role_dialog: {
        show: false,
        title: '',
        option: '',
      },
      curRoleId: 0,
      checkedIds: [],
      roleList: [],
      aclTree: [],
      modulePrefix: 'm_',
      aclPrefix: 'a_',
      treeProps: {
        label: 'name',
        children: 'children',
      },
      add_role: {
        id: '',
        name: '',
        type: '',
        status: '',
        seq: '',
        memo: '',
      },
    }
  },
  computed: {
    newTableData: {
      //getter
      get: function() {
        return this.roleList
      },
    },
  },
  created() {
    this.getRoleList()
  },
  methods: {
    getRoleList() {
      this.$axios.get('/api/sys/role/list').then((res) => {
        let result = res.data
        console.log(result)
        if (result.code > 0) {
          this.roleList = result.data
        }
      })
    },
    handleRoleEdit(index, row) {
      this.role_dialog = { show: true, title: '修改角色信息', option: 'edit' }
      this.add_role = {
        id: row.id,
        name: row.name,
        status: String(row.status),
        type: String(row.type), //由于object的key为String而不是number类型,所以如果不转化将无法匹配默认key的lable,只显示value
        seq: row.seq,
        memo: row.memo,
      }
    },
    handleRoleDelete(index, row) {
      this.$axios.delete(`/api/sys/role/delete/${row.id}`).then((res) => {
        console.log('delete:', res)
        if (res.data.code == 200) {
          this.$message('删除成功！')
        }
        this.getRoleList()
      })
    },
    handleRoleAdd() {
      this.role_dialog = { show: true, title: '添加角色信息', option: 'add' }
      this.add_role = {
        id: '',
        name: '',
        status: String(1),
        type: '',
        seq: '',
        memo: '',
      }
    },
    handleCurrentRoleChange(curRow) {
      this.curRoleId = curRow.id
      this.aclTree = []
      this.checkedIds = []
      this.getTreeData()
    },
    getTreeData() {
      let params = { roleId: this.curRoleId }
      this.$axios.get(`/api/sys/role/roleTree`, { params }).then((res) => {
        let result = res.data
        // console.log('aclTree', result)
        if (result.code > 0) {
          this.renderTree(result.data, this.aclTree)
          // 由于tree控件dom没有加载,setCheckedKeys是不存在的，
          // 所以我们需要使用this.$nextTick(callback)方法,该方法会在dom加载完毕之后,执行回调函数
          this.$nextTick(() => {
            this.$refs.roleAclTree.setCheckedKeys(this.checkedIds)
          })
          //此时依然为[]
          //console.log(this.$refs.roleAclTree.getCheckedKeys())
        }
      })
    },
    renderTree(moduleList, parentArray) {
      for (let i = 0; i < moduleList.length; i++) {
        let module = moduleList[i]
        //复制权限节点list到acls(若aclList为空，而moduleList不为空，先将空acl赋值给children,
        //再在递归中用moduleList中的aclpush进父级的空children)
        if (module.aclDTOList.length > 0 || module.aclModuleList.length > 0) {
          let acls = []
          module.aclDTOList.forEach((aclDTO) => {
            let aclObj = {}
            aclObj.id = this.aclPrefix + aclDTO.id
            aclObj.name = aclDTO.name
            //遍历的同时顺便取得选中的节点id
            if (aclDTO.checked) {
              this.checkedIds.push(aclObj.id)
            }
            acls.push(aclObj)
          })
          let moduleObj = {}
          moduleObj.id = this.modulePrefix + module.id
          moduleObj.name = module.name
          moduleObj.children = acls
          parentArray.push(moduleObj)
          if (module.aclModuleList.length > 0) {
            this.renderTree(module.aclModuleList, moduleObj.children)
          }
        } else {
          return
        }
      }
    },
    updateAclCheck() {
      let checkedIds = this.$refs.roleAclTree.getCheckedKeys()
      let aclCheckIds = []
      checkedIds.forEach((item) => {
        if (item.startsWith(this.aclPrefix)) {
          aclCheckIds.push(parseInt(item.substring(this.aclPrefix.length)))
        }
      })
      aclCheckIds.sort(function(m, n) {
        if (m < n) return -1
        else if (m > n) return 1
        else return 0
      })
      let params = { roleId: this.curRoleId, aclIds: aclCheckIds.toString() }
      this.$axios.get(`/api/sys/role/changeAcls`, { params }).then((res) => {
        let result = res.data
        console.log('changeAcls', result)
        if (result.code > 0) {
          this.$message({
            message: '更新权限成功',
            type: 'success',
          })
        }
      })
    },
  },

  components: {
    RoleDialog,
  },
}
</script>
<style scoped>
.role_list {
  margin-right: 2%;
}
.header {
  margin: 1%;
}
</style>
