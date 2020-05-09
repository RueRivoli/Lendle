<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// import FurnitComponent from './components/FurnitComponent.vue'

export default {
  name: 'App',
  components: {
    // FurnitComponent
  }
}
</script>

<style lang="scss">
#app {
  font-family: Optima, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}

body{
  margin: 0px;
}
</style>
