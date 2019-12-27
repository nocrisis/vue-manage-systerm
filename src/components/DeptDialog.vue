<template>
  <el-dialog
    :title="dept_dialog.title"
    :modal-append-to-body="false"
    :visible.sync="dept_dialog.show"
    :close-on-click-modal="false"
  >
    <el-form ref="deptFormRef" :rules="dept_rules" :model="add_depart">
      <el-form-item prop="name" label="部门名称">
        <el-input
          autocomplete="off"
          v-model="add_depart.name"
          maxlength="10"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="上级部门">
        <el-select placeholder="请选择上级部门">
          <el-option
            v-for="dept in list"
            :key="dept.id"
            :label="dept.name"
            :value="dept.id"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item prop="parentId" label="上级部门">
        <SelectTree
          :props="tree_props"
          :options="option_list"
          :value="valueId"
          :clearable="isClearable"
          :accordion="isAccordion"
          :placeholder="placeholderContent"
          @getValue="getValue($event)"
        />
      </el-form-item>
      <el-form-item prop="seq" label="显示顺序序号">
        <el-input-number
          v-model="add_depart.seq"
          :min="1"
          :max="10"
          :value="add_depart.seq"
        ></el-input-number>
      </el-form-item>
      <el-form-item prop="memo" label="备注">
        <el-input
          type="textarea"
          v-model="add_depart.memo"
          maxlength="150"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dept_dialog.show = false">取 消</el-button>
      <el-button type="primary" @click="submitDept('deptFormRef')"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import SelectTree from '../components/treeSelect'
export default {
  name: 'dept_dialog',
  components: {
    SelectTree
  },
  props: {
    dept_dialog: Object,
    option_list: Array,
    add_depart: Object
  },
  data() {
    return {
      placeholderContent: '请选择上级部门',
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      valueId: null, // 初始显示ID（可选）
      tree_props: {
        // 配置项（必选）
        value: 'id',
        label: 'name',
        children: 'deptList'
        // disabled:true
      },
      dept_rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    // valueId(newv, oldv) {
    //   console.log('Dialog tree valueId changed', oldv + ' to ' + newv)
    // },
    //由于自己写的不像其他input有el封装的双向绑定填充数据变化而变化功能，
    //select-tree组件需要在父组件监听每次dialog弹出并传递给子组件重新赋值当前value
    dept_dialog(d) {
      if (d.show) {
        this.valueId =
          d.option == 'edit'
            ? this.add_depart.parentId == 0
              ? null
              : this.add_depart.parentId
            : null
      }
    }
  },
  methods: {
    // SelectTree取选择中的option值
    getValue(value) {
      this.valueId = value
      this.add_depart.parentId = this.valueId
    },
    submitDept(formRef) {
      this.$refs[formRef].validate(valid => {
        if (valid) {
          console.log(this.add_depart)
          const url =
            this.dept_dialog.option == 'add' ? 'save.json' : 'update.json'
          const op = this.dept_dialog.option == 'add' ? '添加' : '编辑'
          this.$axios
            .post(`api/sys/dept/${url}`, this.add_depart)
            .then(res => {
              let result = res.data
              if (result.code == 200) {
                this.$message({
                  message: op + '部门成功',
                  type: 'success'
                })
                this.dept_dialog.show = false
                //通知父组件刷新列表
                this.$emit('updateData')
              } else {
                this.$message({
                  message: op + '部门失败' + result.msg,
                  type: 'fail'
                })
              }
            })
            .catch(error => {
              this.$message({
                message: error,
                type: 'fail'
              })
            })
        }
      })
    }
  }
}
</script>
<style scoped></style>
