<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style lang="scss">
#app {
  // font-family: Optima, Helvetica, Arial, sans-serif;
  // font-family: 'Gagalin';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}

body{
  margin: 0px;
}

// .el-button{
//   font-family: 'Gagalin';
// }
</style>
