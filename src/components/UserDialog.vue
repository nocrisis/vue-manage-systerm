<template>
  <el-dialog
    :title="user_dialog.title"
    :modal-append-to-body="false"
    :visible.sync="user_dialog.show"
    :close-on-click-modal="false"
  >
    <el-form ref="userFormRef" :rules="user_rules" :model="add_user">
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="add_user.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="telephone">
        <el-input
          v-model="add_user.telephone"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="mail">
        <el-input v-model="add_user.mail" placeholder="请输入email"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="add_user.password"
          type="password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="确认密码"
        v-if="user_dialog.option == 'add'"
        prop="password2"
      >
        <el-input
          v-model="add_user.password2"
          type="password"
          placeholder="请再次输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="deptId" label="所属部门">
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
      <el-form-item prop="status" label="状态">
        <!-- @change="$forceUpdate()"如果层级太深强制触发渲染 -->
        <el-select v-model="add_user.status" placeholder="请选择用户状态">
          <el-option
            v-for="(value, key) in status_enum"
            :key="key"
            :label="value"
            :value="key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="memo" label="备注">
        <el-input
          type="textarea"
          v-model="add_user.memo"
          maxlength="150"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="user_dialog.show = false">取 消</el-button>
      <el-button type="primary" @click="submitUser('userFormRef')"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import SelectTree from '../components/treeSelect'
export default {
  name: 'user_dialog',
  components: {
    SelectTree
  },
  props: {
    user_dialog: Object,
    option_list: Array,
    add_user: Object,
    dept_id: Number,
    status_enum: Object
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.add_user.password) {
        // console.log(value + ' ' + this.add_user.password)
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
      setTimeout(() => {
        if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
          callback(new Error('请填写正确的手机号'))
        } else {
          callback()
        }
      }, 500)
    }
    return {
      placeholderContent: '请选择所属部门',
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      valueId: this.dept_id, // 初始显示ID（可选）
      tree_props: {
        // 配置项（必选）
        value: 'id',
        label: 'name',
        children: 'deptList'
        // disabled:true
      },
      user_rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        mail: [
          {
            type: 'email',
            required: true,
            message: '请输入正确的邮箱',
            trigger: 'blur'
          }
        ],
        telephone: [
          {
            validator: checkPhone,
            trigger: 'blur',
            required: true
          }
        ],
        password: [
          {
            type: 'string',
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        password2: [
          {
            type: 'string',
            required: true,
            message: '确认密码不能为空',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    // valueId(newv, oldv) {
    //   console.log('Dialog tree valueId changed', oldv + ' to ' + newv)
    // },
    //由于自己写的不像其他input有el封装的双向绑定填充数据变化而变化功能，
    //select-tree组件需要在父组件监听每次dialog弹出并传递给子组件重新赋值当前初始化value
    user_dialog(d) {
      if (d.show) {
        this.valueId = this.deptId
      }
    }
  },
  methods: {
    // SelectTree取选择中的option值
    getValue(value) {
      this.valueId = value
      this.add_user.deptId = this.valueId
    },
    submitUser(formRef) {
      this.$refs[formRef].validate(valid => {
        if (valid) {
          console.log(this.add_user)
          const url = this.user_dialog.option == 'add' ? 'register' : 'update'
          const op = this.user_dialog.option == 'add' ? '添加' : '编辑'
          this.$axios
            .post(`api/sys/user/${url}`, this.add_user)
            .then(res => {
              let result = res.data
              if (result.code == 200) {
                this.$message({
                  message: op + '人员成功',
                  type: 'success'
                })
                this.user_dialog.show = false
                //通知父组件刷新列表
                this.$emit('updateUser')
              } else {
                this.$message({
                  message: op + '人员失败' + result.msg,
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
