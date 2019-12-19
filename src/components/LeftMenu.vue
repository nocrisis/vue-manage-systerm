<template>
  <el-row class="menu_page">
    <el-col :span="12">
      <el-menu
        class="el-menu-vertical-demo"
        background-color="#324051"
        text-color="#fff"
        active-text-color="#409eff"
        router
      >
        <!-- <router-link to="/home"> -->
        <el-menu-item index="/home">
          <i class="el-icon-s-home fa-margin"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <!-- </router-link> -->
        <template v-for="item in items">
          <el-submenu
            v-if="item.children"
            :index="item.path"
            :key="item.path"
            router
          >
            <template slot="title">
              <i :class="item.icon + ' fa-margin'">
                <span slot="title">{{ item.name }}</span>
              </i>
            </template>
            <!-- <router-link
              v-for="(citem, cindex) in item.children"
              :to="citem.path"
              :key="cindex"
            > -->
            <el-menu-item
              v-for="(citem, cindex) in item.children"
              :index="citem.path"
              :to="citem.path"
              :key="cindex"
            >
              <span slot="title">{{ citem.name }}</span>
            </el-menu-item>
            <!-- </router-link> -->
          </el-submenu>
        </template>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'left-menu',
  data() {
    return {
      items: [
        {
          icon: 'el-icon-s-finance',
          name: '权限管理',
          path: 'permission',
          children: [
            { path: 'userdept', name: '用户管理' },
            { path: 'role', name: '角色管理' },
            { path: 'permission', name: '权限管理' },
            { path: 'permissionHis', name: '权限更新记录' }
          ]
        },
        {
          icon: 'el-icon-s-data',
          name: '系统管理',
          path: 'permission',
          children: [{ path: 'infoshow', name: '个人信息' }]
        }
      ]
    }
  }
}
</script>

<style>
.menu_page {
  float: left;
  min-height: 100%;
  background-color: #324057;
  z-index: 99;
}
.el-menu {
  border: none;
}
.fa-margin {
  margin-right: 10px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  min-height: 400px;
}
.el-menu-vertical-demo {
  width: 35px;
}
.el-submenu .el-menu-item {
  min-width: 180px;
}

.hiddenDropdown,
.hiddenDropname {
  display: none;
}
a {
  text-decoration: none;
}
</style>
