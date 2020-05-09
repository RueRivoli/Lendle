<template>
    <el-aside width="200px">
    <span class="lendle">Lendle</span>
    <div class="aside__container">
      <router-link to='/addfurnit'>
         <el-button type="primary" size="small" icon="el-icon-plus" round>Ajouter un meuble</el-button>
      </router-link>
      <div class="pointer menu__item" style="margin-top:50px;">
        <span><router-link to="/myfurnitures" tag="span">Mes meubles</router-link></span>
      </div>
      <div class="pointer menu__item">
        <span><router-link to="/chat" tag="span">Messagerie</router-link></span>
      </div>
      <div class="pointer menu__item">
        <span><router-link to="/" tag="span">Deconnexion</router-link></span>
      </div>
    </div>
  </el-aside>

</template>


<script>

export default {
  name: 'AsideComponent',
  data() {
      return {
          methods: {
          }
      }
  }
}
</script>

<style scoped>

.el-aside {
  padding-top: 10px;
  /*background-color: #160F29;*/
  background: linear-gradient(to right,#160F29, #484538);
  padding: 20px 40px 0px 20px;
}

.aside__container{
    color: white;
    text-align: left;
    margin-top:70px;
    font-size:15px;
}

.menu__item{
    height:50px;
}

</style>