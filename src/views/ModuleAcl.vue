<template>
  <div class="fill_content">
    <div class="module_tree">
      <el-button
        icon="el-icon-plus"
        type="danger"
        @click="handleModuleAdd()"
        circle
      ></el-button>
      <el-table
        :data="aclModuleList"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
        highlight-current-row
        @current-change="handleCurrentModuleChange"
        :tree-props="{ children: 'aclModuleList', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="id" label="ID" sortable width="70">
        </el-table-column>
        <el-table-column prop="name" label="权限模块名称" width="120">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleModuleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleModuleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="acl_list">
      <el-button
        icon="el-icon-plus"
        type="danger"
        @click="handleAclAdd()"
        circle
      ></el-button>
      <el-table
        :data="aclList"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
      >
        <el-table-column prop="id" label="ID" sortable width="40">
        </el-table-column>
        <el-table-column prop="name" label="权限点名称" width="150">
        </el-table-column>
        <el-table-column label="权限模块" width="100">
          <template slot-scope="scope">
            {{
              aclModuleList.find(item => item.id == scope.row.aclModuleId).name
            }}
          </template>
        </el-table-column>
        <el-table-column prop="url" label="页面地址" width="170">
        </el-table-column>
        <el-table-column label="类型" width="50">
          <template slot-scope="scope">
            {{ typeEnum[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="seq" label="顺序" width="50"> </el-table-column>
        <el-table-column prop="memo" label="备注" width="50"> </el-table-column>
        <el-table-column label="状态" width="50">
          <template slot-scope="scope">
            <span
              :style="{ color: scope.row.status === 1 ? '#8bc34a' : '#ED3F14' }"
              >{{ statusEnum[scope.row.status] }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleAclEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleAclDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :hide-on-single-page="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentPageChange"
        :current-page.sync="queryParam.pageNo"
        :page-size="queryParam.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="aclTotal"
      >
      </el-pagination>
    </div>
    <ModuleDialog
      :module_dialog="module_dialog"
      :add_module="add_module"
      @updateData="getModuleTree"
      :option_list="aclModuleList"
      :status_enum="statusEnum"
    ></ModuleDialog>
    <AclDialog
      :acl_dialog="acl_dialog"
      :add_acl="add_acl"
      @updateAcl="getAclList"
      :module_id="queryParam.aclModuleId"
      :option_list="aclModuleList"
      :status_enum="statusEnum"
      :type_enum="typeEnum"
    ></AclDialog>
  </div>
</template>
<script>
import ModuleDialog from '../components/ModuleDialog'
import AclDialog from '../components/AclDialog'
export default {
  data() {
    return {
      statusEnum: {
        1: '正常',
        0: '冻结',
        2: '删除'
      },
      typeEnum: {
        1: '菜单',
        2: '按钮',
        3: '其他'
      },
      queryParam: {
        pageSize: 5,
        pageNo: 1,
        aclModuleId: 0
      },
      aclModuleList: [],
      aclList: [],
      aclTotal: 0,
      module_dialog: {
        show: false,
        title: '',
        option: ''
      },
      acl_dialog: {
        show: false,
        title: '',
        option: ''
      },
      add_module: {
        id: '',
        name: '',
        parentId: '',
        seq: '',
        status: '',
        memo: ''
      },
      add_acl: {
        id: '',
        name: '',
        aclModuleId: '',
        url: '',
        type: '',
        status: '',
        seq: '',
        // aclModuleId: this.queryParam.aclModuleId,
        // status: 1, data定义的时候不能return间互相引用，不清楚初始化的顺序,用computed,或return内引用return前的
        memo: ''
      }
    }
  },
  computed: {
    newTableData: {
      //getter
      get: function() {
        return this.aclModuleList
      }
    }
  },
  created() {
    this.getModuleTree()
  },
  methods: {
    getModuleTree() {
      this.$axios.get('/api/sys/aclModule/tree').then(res => {
        let result = res.data
        console.log(result)
        if (result.code > 0) {
          this.aclModuleList = result.data
        }
      })
    },
    handleModuleEdit(index, row) {
      this.module_dialog = {
        show: true,
        title: '修改权限模块信息',
        option: 'edit'
      }
      this.add_module = {
        id: row.id,
        name: row.name,
        parentId: row.parentId,
        status: row.status,
        seq: row.seq,
        memo: row.memo
      }
    },
    handleModuleDelete(index, row) {
      this.$axios.delete(`/api/sys/aclModule/delete/${row.id}`).then(res => {
        console.log('delete:', res)
        if (res.data.code == 200) {
          this.$message('删除成功！')
        }
        this.getModuleTree()
      })
    },
    handleModuleAdd() {
      this.module_dialog = {
        show: true,
        title: '添加权限模块信息',
        option: 'add'
      }
      this.add_module = {
        id: '',
        name: '',
        parentId: '',
        seq: '',
        status: String(1),
        memo: ''
      }
    },
    handleCurrentModuleChange(curRow) {
      this.queryParam.aclModuleId = curRow.id
      this.getAclList()
    },
    getAclList() {
      console.log('queryparam', this.queryParam)
      this.$axios.post('/api/sys/acl/list', this.queryParam).then(res => {
        console.log('listAcl', res)
        let result = res.data
        if (result.code == 200) {
          let data = result.data
          if (data.total > 0) {
            this.aclList = data.data
            this.aclTotal = data.total
          } else {
            this.aclList = []
            this.aclTotal = 0
            //必须设置为0,否则有页码的到0的判断total没变，依然显示页码
          }
        } else {
          this.$message(result.msg)
        }
      })
    },
    handleAclAdd() {
      this.acl_dialog = { show: true, title: '添加权限点信息', option: 'add' }
      this.add_acl = {
        id: '',
        name: '',
        aclModuleId: this.queryParam.aclModuleId,
        url: '',
        type: '',
        seq: '',
        status: String(1),
        memo: ''
      }
    },
    handleAclEdit(index, row) {
      this.acl_dialog = { show: true, title: '修改权限点信息', option: 'edit' }
      this.add_acl = {
        id: row.id,
        name: row.name,
        url: row.url,
        type: String(row.type), //由于object的key为String而不是number类型,所以如果不转化将无法匹配默认key的lable,只显示value
        aclModuleId: row.aclModuleId,
        seq: row.seq,
        status: String(row.status),
        memo: row.memo
      }
    },
    handleSizeChange(val) {
      console.log(`change to 每页 ${val} 条`)
      this.getAclList()
    },
    handleCurrentPageChange(val) {
      console.log(`change to 当前页: ${val}`)
      this.getAclList()
    },
    handleAclDelete(index, row) {
      this.$axios.delete(`/api/sys/acl/delete/${row.id}`).then(res => {
        console.log('delete:', res)
        if (res.data.code == 200) {
          this.$message('删除成功！')
        }
        this.getAclList()
      })
    }
  },

  components: {
    ModuleDialog,
    AclDialog
  }
}
</script>
<style scoped>
.module_tree {
  margin-right: 3%;
}
.acl-list {
  flex-grow: 1;
}
</style>
