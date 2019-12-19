<template>
  <div class="index">
    <HeadNav></HeadNav>

    <LeftMenu></LeftMenu>

    <!--二级路由 -->
    <router-view></router-view>
  </div>
</template>
<script>
import HeadNav from '../components/HeadNav'
import LeftMenu from '../components/LeftMenu'
export default {
  name: 'index',
  components: {
    HeadNav,
    LeftMenu
  }
}
</script>
<style scoped>
.index {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
