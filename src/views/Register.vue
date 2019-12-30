<template>
  <div class="register">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">Vue后台管理系统</span>
        <el-form
          ref="registerForm"
          :model="registerUser"
          :rules="rules"
          label-width="80px"
          class="register_form"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="registerUser.username"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="telephone">
            <el-input
              v-model="registerUser.telephone"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="mail">
            <el-input
              v-model="registerUser.mail"
              placeholder="请输入email"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerUser.password"
              type="password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="password2">
            <el-input
              v-model="registerUser.password2"
              type="password"
              placeholder="请再次输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="deptId" label="所属部门">
            <SelectTree
              :props="tree_props"
              :options="optionDept"
              :value="valueId"
              :clearable="isClearable"
              :accordion="isAccordion"
              :placeholder="placeholderContent"
              @getValue="getValue($event)"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="resetForm('registerForm')">重置</el-button>
            <el-button type="primary" @click="submitForm('registerForm')"
              >立即创建</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </section>
  </div>
</template>
<script>
import SelectTree from '../components/treeSelect.vue'
export default {
  name: 'register',
  components: {
    SelectTree
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.registerUser.password) {
        // console.log(value + ' ' + this.registerUser.password)
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
      optionDept: [],
      placeholderContent: '请选择所属部门',
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
      registerUser: {
        username: '',
        mail: '',
        telephone: '',
        password: '',
        password2: '',
        deptId: ''
      },
      rules: {
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
  created() {
    this.getDeptTree()
  },
  methods: {
    // SelectTree取选择中的option值
    getValue(value) {
      this.valueId = value
      this.registerUser.deptId = this.valueId
    },
    getDeptTree() {
      this.$axios.get('/api/sys/dept/tree.json').then(res => {
        let result = res.data
        console.log(result)
        if (result.code > 0) {
          this.optionDept = result.data
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let userStr = JSON.stringify(this.registerUser)
          console.log(userStr)
          this.$axios
            .post('/api/sys/user/register', this.registerUser)
            .then(res => {
              console.log(res)
              let result = res.data
              if (result.code == 200) {
                //注册成功
                this.$message({
                  message: '账号注册成功！',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: result.msg,
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
          this.$router.push('/login')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
//
在Vue组件中,为了使样式私有化(模块化),不对全局造成污染,可以在style标签上添加scoped属性以表示它的只属于当下的模块,局部有效。
<style scoped>
.register {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/bg.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.form_container {
  width: 370px;
  height: 210px;
  position: absolute;
  top: 10%;
  left: 34%;
  padding: 25px;
  border-radius: 5px;
  text-align: center;
}
.form_container .manage_tip .title {
  font-family: 'Microsoft YaHei';
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}
.register_form {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}
</style>
