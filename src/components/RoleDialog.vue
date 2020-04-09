<template>
  <el-dialog
    :title="role_dialog.title"
    :modal-append-to-body="false"
    :visible.sync="role_dialog.show"
    :close-on-click-modal="false"
  >
    <el-form ref="roleFormRef" :rules="role_rules" :model="add_role">
      <el-form-item prop="name" label="角色名称">
        <el-input
          autocomplete="off"
          v-model="add_role.name"
          maxlength="10"
        ></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="add_role.type" placeholder="请选择权限点类型">
          <el-option
            v-for="(value, key, index) in type_enum"
            :key="index"
            :label="value"
            :value="key"
          >
            <span style="float: left">{{ value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              key
            }}</span></el-option
          >
        </el-select>
      </el-form-item>
      <el-form-item prop="status" label="角色状态">
        <el-select v-model="add_role.status" placeholder="请选择角色状态">
          <el-option
            v-for="(value, key, index) in status_enum"
            :key="index"
            :label="value"
            :value="key"
          >
            <span style="float: left">{{ value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              key
            }}</span></el-option
          >
        </el-select>
      </el-form-item>
      <el-form-item prop="seq" label="显示顺序序号">
        <el-input-number
          v-model="add_role.seq"
          :min="1"
          :max="10"
          :value="add_role.seq"
        ></el-input-number>
      </el-form-item>
      <el-form-item prop="memo" label="备注">
        <el-input
          type="textarea"
          v-model="add_role.memo"
          maxlength="150"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="role_dialog.show = false">取 消</el-button>
      <el-button type="primary" @click="submitRole('roleFormRef')"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'role_dialog',
  props: {
    role_dialog: Object,
    add_role: Object,
    status_enum: Object,
    type_enum: Object,
  },
  data() {
    return {
      role_rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
        ],
        status: [
          {
            // type: 'string',因为object的key是string而不是number,key可以是String或Symbol,用其它类型的值作为key去取值或设值,会先转为字符串再进行get或set
            required: true,
            message: '状态不能为空',
            trigger: 'change',
          },
        ],
        type: [
          {
            // type: 'string',
            required: true,
            message: '类型不能为空',
            trigger: 'change',
          },
        ],
      },
    }
  },
  methods: {
    submitRole(formRef) {
      this.$refs[formRef].validate((valid) => {
        if (valid) {
          console.log(this.add_role)
          const url = this.role_dialog.option == 'add' ? 'add' : 'update'
          const op = this.role_dialog.option == 'add' ? '添加' : '编辑'
          this.$axios
            .post(`api/sys/role/${url}`, this.add_role)
            .then((res) => {
              let result = res.data
              if (result.code == 200) {
                this.$message({
                  message: op + '角色成功',
                  type: 'success',
                })
                this.role_dialog.show = false
                //通知父组件刷新列表
                this.$emit('updateData')
              } else {
                this.$message({
                  message: op + '角色失败' + result.msg,
                  type: 'fail',
                })
              }
            })
            .catch((error) => {
              this.$message({
                message: error,
                type: 'fail',
              })
            })
        }
      })
    },
  },
}
</script>
<style scoped></style>
