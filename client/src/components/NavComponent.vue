<template>
    <nav style="border-bottom: 1px solid #dfe0e6">
        <ul role="menubar" class="" style="height: 50px;">
            <li tabindex="0" class="mright" v-bind:class="{ 'selected': displayLendle, 'pointer': true, 'lendle': true }"><router-link to="/" tag="span">LENDLE</router-link></li>
            <!-- <li v-if="displayTitles" tabindex="0" v-bind:class="{ 'selected': displayLoanFurnit, 'pointer': true }" style="float:right;margin-right:5px;" @click="select(1)"> Prêter des meubles</li>
            <li v-if="displayTitles" tabindex="0" v-bind:class="{ 'selected': displayFindFurnit, 'pointer': true }" style="float:right;margin-left:5px;" @click="select(2)">Trouver des meubles</li> -->
            <div v-if="displayTitles" style="width:50%;"></div>
            <div class="f-auto" v-if="displayTitles">
                <el-button type="primary" size="mini" plain><router-link to="/intro/beARenter" tag="span">J'ai des meubles</router-link></el-button>
            </div>
            <div class="f-auto" v-if="displayTitles">
                <li tabindex="0" class="pointer" style="float:right;margin-right: 10px;" v-if="displayTitles" ><router-link to="/login" tag="span">Connexion</router-link></li>
                <span style="float:right;margin-right: 5px;" v-if="displayTitles" >|</span>
                 <li tabindex="0" class="pointer" style="float:right;margin-right: 5px;" v-if="displayTitles" ><router-link to="/signup/find" tag="span">Inscription</router-link></li>
            </div>
             <!-- <div class="f-auto" v-if="displayTitles">
                <li tabindex="0" class="pointer" style="float:right;margin-right: 5px;" v-if="displayTitles" ><router-link to="/signup" tag="span">Inscription</router-link></li>
            </div> -->
            <div class="f-auto" v-if="displayTitles" style="width:5%;">
                <li tabindex="0" class="pointer" style="float:right;margin-right: 10px;"><router-link to="/help" tag="span">Aide</router-link></li>
            </div>
            <div class="f-auto" v-else style="width:5%;">
                <li tabindex="0" class="pointer" style="float:right;margin-right: 10px;"><router-link to="/" tag="span">Retour</router-link></li>
            </div>
        </ul>
    </nav>
</template>


<script>

export default {
  name: 'NavComponent',
  props: ['displayTitles'],
  data() {
      return {
          display: 1,
          searchWord: ''
        }
    },
    methods: {
  },
  computed: {
      displayLendle () {
          return this.display === 0;
      },
      displayLoanFurnit () {
          return this.display === 1;
      },
       displayFindFurnit () {
          return this.display === 2;
      }
  }
}
</script>

<style scoped>


.mright{
    margin-left: 18px;
}

ul {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  /* justify-content: space-between; */
  align-items:center;
  margin: 0;
  padding: 0;
  white-space: nowrap;/* interdiction de passer à la ligne */
}


li {
  font-family: 'Gagalin';
  list-style: none;
  cursor: pointer;
  position: relative;
  font-size: 14px;
}


.selected{
  color: #1E969D;
  font-weight: bold;
}


nav ul{
    justify-content: space-around;
}
</style>