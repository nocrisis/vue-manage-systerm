<template>
  <div class="login">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">Vue后台管理系统</span>
        <el-form
          ref="loginForm"
          :model="loginUser"
          :rules="rules"
          label-width="60px"
          class="login_form"
        >
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="loginUser.email"
              placeholder="请输入email"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginUser.password"
              type="password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="submit_btn"
              @click="submitForm('loginForm')"
              >立即登录</el-button
            >
          </el-form-item>
          <div class="tiparea">
            <p>
              还没有账号？现在<router-link to="/register">注册</router-link>
            </p>
          </div>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode'
export default {
  name: 'login',
  components: {},
  data() {
    return {
      loginUser: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          {
            type: 'email',
            required: true,
            message: '请输入正确的邮箱',
            trigger: 'change'
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
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      // console.log(this.$refs[formName])
      this.$refs[formName].validate(valid => {
        if (valid) {
          let userStr = JSON.stringify(this.loginUser)
          console.log(userStr)
          this.$axios
            .post('/api/sys/user/login', this.loginUser)
            .then(res => {
              console.log(res)
              // const { token } = res.data
              const token = res.data.data
              //存储到ls
              localStorage.setItem('eleToken', token)
              //解析token
              const decoded = jwt_decode(token)
              console.log(decoded)
              //token 存储到vuex中
              this.$store.dispatch('setAuthenticated', !this.isEmpty(decoded))
              this.$store.dispatch('setUser', decoded)
              this.$router.push('/index')
            })
            .catch(error => {
              this.$message({
                message: error,
                type: 'fail'
              })
            })
        }
      })
    },
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
      )
    }
  }
}
</script>
//
在Vue组件中,为了使样式私有化(模块化),不对全局造成污染,可以在style标签上添加scoped属性以表示它的只属于当下的模块,局部有效。
<style scoped>
.login {
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
.login_form {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}
.submit_btn {
  width: 100%;
}
.tiparea {
  text-align: right;
  font-size: 12px;
  color: #333;
}
.tiparea p a {
  color: #409eff;
}
</style>
