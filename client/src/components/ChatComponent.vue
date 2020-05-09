<template>
 <el-container style="height: 100vh;">
     <aside-component/>
    <el-main>CHAT
    <el-row>
   </el-row>
  </el-main>
  </el-container>
</template>


<script>
import AsideComponent from './AsideComponent';

export default {
  name: 'ChatComponent',
  components: { AsideComponent },
  data() {
      return {
          methods: {
          }
      }
  }
}
</script>

<style>

.el-aside {
  padding-top: 10px;
  /*background-color: #160F29;*/
  background: linear-gradient(to right,#160F29, #484538);
  padding: 20px 40px 0px 20px;
}

.aside__container{
    color: white;text-align: left;margin-top:70px;font-size:15px;
}

.menu__item{
    height:50px;
}

</style>