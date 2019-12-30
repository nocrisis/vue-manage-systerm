<template>
  <div class="fill_content">
    <div class="dept_tree">
      <el-button
        icon="el-icon-plus"
        type="danger"
        @click="handleDeptAdd()"
        circle
      ></el-button>
      <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
        highlight-current-row
        @current-change="handleCurrentDeptChange"
        :tree-props="{ children: 'deptList', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="id" label="ID" sortable width="70">
        </el-table-column>
        <el-table-column prop="name" label="部门名称" width="100">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleDeptEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDeptDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="user_list">
      <el-button
        icon="el-icon-plus"
        type="danger"
        @click="handleUserAdd()"
        circle
      ></el-button>
      <el-table
        :data="userList"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
      >
        <el-table-column prop="id" label="ID" sortable width="40">
        </el-table-column>
        <el-table-column prop="username" label="用户名称" width="100">
        </el-table-column>
        <el-table-column prop="telephone" label="手机号" width="120">
        </el-table-column>
        <el-table-column prop="password" label="密码" width="100">
        </el-table-column>
        <el-table-column prop="mail" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="memo" label="备注" width="100">
        </el-table-column>
        <el-table-column label="状态" width="50">
          <template slot-scope="scope">
            {{ statusEnum[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUserEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleUserDelete(scope.$index, scope.row)"
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
        :total="userTotal"
      >
      </el-pagination>
    </div>
    <DeptDialog
      :dept_dialog="dept_dialog"
      :add_depart="add_depart"
      @updateData="getDeptTree"
      :option_list="tableData"
    ></DeptDialog>
    <UserDialog
      :user_dialog="user_dialog"
      :add_user="add_user"
      @updateUser="getUserList"
      :dept_id="queryParam.deptId"
      :option_list="tableData"
      :status_enum="statusEnum"
    ></UserDialog>
  </div>
</template>
<script>
import DeptDialog from '../components/DeptDialog'
import UserDialog from '../components/UserDialog'
export default {
  data() {
    return {
      statusEnum: {
        1: '正常',
        0: '冻结',
        2: '删除'
      },
      queryParam: {
        pageSize: 2,
        pageNo: 1,
        deptId: 0
      },
      tableData: [],
      userList: [],
      userTotal: 0,
      dept_dialog: {
        show: false,
        title: '',
        option: ''
      },
      user_dialog: {
        show: false,
        title: '',
        option: ''
      },
      add_depart: {
        id: '',
        name: '',
        parentId: '',
        seq: '',
        memo: ''
      },
      add_user: {
        id: '',
        username: '',
        password: '',
        mail: '',
        telephone: '',
        deptId: '',
        status: '',
        // deptId: this.queryParam.deptId,
        // status: 1, data定义的时候不能return间互相引用，不清楚初始化的顺序,用computed,或return内引用return前的
        memo: ''
      }
    }
  },
  computed: {
    newTableData: {
      //getter
      get: function() {
        return this.tableData
      }
    }
  },
  created() {
    this.getDeptTree()
  },
  methods: {
    getDeptTree() {
      this.$axios.get('/api/sys/dept/tree.json').then(res => {
        let result = res.data
        console.log(result)
        if (result.code > 0) {
          this.tableData = result.data
        }
      })
    },
    handleDeptEdit(index, row) {
      this.dept_dialog = { show: true, title: '修改部门信息', option: 'edit' }
      this.add_depart = {
        id: row.id,
        name: row.name,
        parentId: row.parentId,
        seq: row.seq,
        memo: row.memo
      }
    },
    handleDeptDelete(index, row) {
      this.$axios.delete(`/api/sys/dept/delete/${row.id}`).then(res => {
        console.log('delete:', res)
        if (res.data.code == 200) {
          this.$message('删除成功！')
        }
        this.getDeptTree()
      })
    },
    handleDeptAdd() {
      this.dept_dialog = { show: true, title: '添加部门信息', option: 'add' }
      this.add_depart = {
        id: '',
        name: '',
        parentId: '',
        seq: '',
        memo: ''
      }
    },
    handleCurrentDeptChange(curRow) {
      this.queryParam.deptId = curRow.id
      this.getUserList()
    },
    getUserList() {
      console.log('queryparam', this.queryParam)
      this.$axios.post('/api/sys/user/list', this.queryParam).then(res => {
        console.log('listUser', res)
        let result = res.data
        if (result.code == 200) {
          let data = result.data
          if (data.total > 0) {
            this.userList = data.data
            this.userTotal = data.total
          } else {
            this.userList = []
            this.userTotal = 0
            //必须设置为0,否则有页码的到0的判断total没变，依然显示页码
          }
        } else {
          this.$message(result.msg)
        }
      })
    },
    handleUserAdd() {
      this.user_dialog = { show: true, title: '添加用户信息', option: 'add' }
      this.add_user = {
        id: '',
        username: '',
        password: '',
        mail: '',
        telephone: '',
        deptId: this.queryParam.deptId,
        status: 1,
        memo: ''
      }
    },
    handleUserEdit(index, row) {
      this.user_dialog = { show: true, title: '修改用户信息', option: 'edit' }
      this.add_user = {
        id: row.id,
        username: row.username,
        password: row.password,
        mail: row.mail,
        telephone: row.telephone,
        deptId: row.deptId,
        status: row.status,
        memo: row.memo
      }
    },
    handleSizeChange(val) {
      console.log(`change to 每页 ${val} 条`)
      this.getUserList()
    },
    handleCurrentPageChange(val) {
      console.log(`change to 当前页: ${val}`)
      this.getUserList()
    },
    handleUserDelete(index, row) {
      this.$axios.delete(`/api/sys/user/delete/${row.id}`).then(res => {
        console.log('delete:', res)
        if (res.data.code == 200) {
          this.$message('删除成功！')
        }
        this.getUserList()
      })
    }
  },

  components: {
    DeptDialog,
    UserDialog
  }
}
</script>
<style scoped>
.dept_tree {
  margin-right: 3%;
}
.user-list {
  flex-grow: 1;
}
</style>
