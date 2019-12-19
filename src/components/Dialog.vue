<template>
  <el-dialog
    title="添加部门"
    :modal-append-to-body="false"
    :visible.sync="dept_dialog.show"
    :close-on-click-modal="false"
  >
    <el-form ref="deptFormRef" :rules="dept_rules" :model="addDepart">
      <el-form-item prop="name" label="部门名称">
        <el-input
          autocomplete="off"
          v-model="addDepart.name"
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
          :props="props"
          :options="list"
          :value="valueId"
          :clearable="isClearable"
          :accordion="isAccordion"
          @getValue="getValue($event)"
        />
      </el-form-item>
      <el-form-item prop="seq" label="显示顺序序号">
        <el-input-number
          v-model="addDepart.seq"
          :min="1"
          :max="10"
        ></el-input-number>
      </el-form-item>
      <el-form-item prop="memo" label="备注">
        <el-input
          type="textarea"
          v-model="addDepart.memo"
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
import SelectTree from '../components/treeSelect.vue'
export default {
  name: 'dept_dialog',
  components: {
    SelectTree
  },
  props: {
    dept_dialog: Object,
    list: Array
  },
  data() {
    return {
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      valueId: 1, // 初始ID（可选）
      props: {
        // 配置项（必选）
        value: 'id',
        label: 'name',
        children: 'deptList'
        // disabled:true
      },
      addDepart: {
        name: '',
        parentId: '',
        seq: '',
        memo: ''
      },
      dept_rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 取值
    getValue(value) {
      this.valueId = value
      this.addDepart.parentId = this.valueId
    },
    submitDept(formRef) {
      this.$refs[formRef].validate(valid => {
        if (valid) {
          console.log(this.addDepart)
          this.$axios
            .post('api/sys/dept/save.json', this.addDepart)
            .then(res => {
              let result = res.data
              if (result.code == 200) {
                this.$message({
                  message: '添加部门成功',
                  type: 'success'
                })
                this.dept_dialog.show = false
                //通知父组件刷新列表
                this.$emit('updateData')
              } else {
                this.$message({
                  message: '添加部门失败' + result.msg,
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
