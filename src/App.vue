<template>
  <div id="app">
    <el-menu class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="0">甜甜销售中心</el-menu-item>
      <el-submenu index="1">
        <template slot="title">商品</template>
        <el-menu-item index="1-1">仓库</el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">订单</template>
        <el-menu-item index="2-1">下单</el-menu-item>
      </el-submenu>
    </el-menu>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isCollapse: true
    };
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(keyPath)
      if (key === '0') {
        this.$router.push('/')
      } else if (keyPath[1] === '1-1') {
        this.$router.push('/commodity/warehouse')
      } else if (keyPath[1] === '2-1') {
        this.$router.push('/order/booking')
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
