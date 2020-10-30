<template>
    <nav style="border-bottom: 1px solid #dfe0e6; width: 100%;">
        <ul role="menubar" class="" style="height: 6vh;">
            <li tabindex="0" class="mright selected pointer lendle"><router-link to="/" tag="span">LENDLE</router-link></li>
            <div class="white_space" v-if="displayTitles"></div>
            <div class="f-auto" v-if="displayTitles">
                <el-button type="primary" size="mini" plain><router-link to="/intro/beARenter" tag="span">J'ai des meubles</router-link></el-button>
            </div>
            <div class="f-auto" v-if="displayTitles">
                <li tabindex="0" class="pointer" style="float:right;margin-right: 10px;" v-if="displayTitles" ><router-link to="/login" tag="span">Connexion</router-link></li>
                <span class="bar" style="float:right;margin-right: 5px;font-size:14px;" v-if="displayTitles" >|</span>
                 <li tabindex="0" class="pointer" style="float:right;margin-right: 5px;" v-if="displayTitles" ><router-link to="/signup/loaner" tag="span">Inscription</router-link></li>
            </div>
            <div class="f-auto help" v-if="displayTitles" style="width:5%;">
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
  name: 'NavVisitorComponent',
  props: ['displayTitles'],
  data() {
      return {
        }
    },
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
  /* font-family: 'Gagalin'; */
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

.white_space{
    width:50%;
}

@media screen and (max-width: 800px) {
    .white_space{
        width:10%;
    }
    .help, .bar{
        display: none;
    }
}

</style>