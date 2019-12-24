<template>
  <div class="fill_content">
    <el-button
      icon="el-icon-plus"
      type="danger"
      @click="handleAdd()"
      circle
    ></el-button>
    <div class="dept_tree">
      <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'deptList', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="id" label="ID" sortable width="70">
        </el-table-column>
        <el-table-column prop="name" label="部门名称" width="100">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="user_list"></div>
    <Dialog
      :dept_dialog="dept_dialog"
      :add_depart="add_depart"
      @updateData="getDeptTree"
      :option_list="tableData"
    ></Dialog>
  </div>
</template>
<script>
import Dialog from '../components/DeptDialog'

export default {
  data() {
    return {
      tableData: [],
      dept_dialog: {
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
      this.$axios.post('/api/sys/dept/tree.json', this.loginUser).then(res => {
        let result = res.data
        console.log(result)
        if (result.code > 0) {
          this.tableData = result.data
        }
      })
    },
    handleEdit(index, row) {
      this.dept_dialog = { show: true, title: '修改部门信息', option: 'edit' }
      this.add_depart = {
        id: row.id,
        name: row.name,
        parentId: row.parentId,
        seq: row.seq,
        memo: row.memo
      }
    },
    handleDelete(index, row) {
      this.$axios.delete(`/api/sys/dept/delete/${row.id}`).then(res => {
        console.log('delete:', res)
        if (res.data.code == 200) {
          this.$message('删除成功！')
        }
        this.getDeptTree()
      })
    },
    handleAdd() {
      this.dept_dialog = { show: true, title: '添加部门信息', option: 'add' }
      this.add_depart = {
        id: '',
        name: '',
        parentId: '',
        seq: '',
        memo: ''
      }
    }
  },
  components: {
    Dialog
  }
}
</script>
