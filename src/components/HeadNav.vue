<template>
  <header class="head-nav">
    <el-row>
      <el-col :span="6" class="logo-container">
        <img src="../assets/logo.png" class="logo" alt="" />
        <span class="title">vue在线后台管理系统</span>
      </el-col>
      <el-col :span="3" class="user">
        <div class="userinfo">
          <img :src="user.avatar" class="avatar" alt="" />
        </div>
        <div class="welcome">
          <p class="name comename">欢迎</p>
          <p class="name avatarname">{{ user.username }}</p>
        </div>
        <span class="name">
          <!-- 下拉箭头 -->
          <el-dropdown trigger="click" @command="setDialogInfo">
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="info">个人信息</el-dropdown-item>
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </el-col>
    </el-row>
  </header>
</template>

<script>
export default {
  name: 'head-nav',
  computed: {
    user() {
      return this.$store.getters.user
    }
  },
  methods: {
    setDialogInfo(cmdItem) {
      switch (cmdItem) {
        case 'info':
          this.showInfoList()
          break
        case 'logout':
          this.logout()
          break
      }
    },
    showInfoList() {
      this.$router.push('/infoshow')
    },
    logout() {
      //清除Token
      localStorage.removeItem('eleToken')
      //设置vuex store
      this.$store.dispatch('clearCurrentState')
      //跳转
      this.$router.push('/login')
    }
  }
}
</script>

<style>
.head-nav {
  width: 100%;
  height: 60px;
  min-width: 500px;
  padding: 5px;
  background: #324057;
  color: #fff;
  border-bottom: 1px solid #1f2d3d;
}
.logo-container {
  line-height: 60px;
  min-width: 400px;
}
.logo {
  height: 50px;
  width: 50px;
  margin-right: 5px;
  vertical-align: middle;
  display: inline-block;
}
.title {
  vertical-align: middle;
  font-size: 22px;
  font-family: 'Microsoft YaHei';
  letter-spacing: 3px;
}
.user {
  height: 60px;
  float: right;
  display: flex;
  flex-direction: row;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 11px;
}
.welcome {
  margin: auto 5px;
  padding: 0 5px;
}
.name {
  line-height: 20px;
  text-align: center;
  font-size: 14px;
}
.comename {
  font-size: 12px;
}
.avatarname {
  color: #409eff;
  font-weight: bolder;
}
.name {
  cursor: pointer;
  margin-right: 5px;
}
.el-dropdown {
  color: #fff;
}
.el-icon--right {
  margin-top: 20px;
}
</style>
