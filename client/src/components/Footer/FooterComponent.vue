<template>
    <el-footer class="flex" style="background-color:#cfccc4; height: 200px;width: 100%;">
        <div class="margin-auto" style="width:40vh;margin:auto;">
            <el-row class="line-H">
                <span class="lendle" style="line-height:40px;font-size:40px;color:black;">Lendle</span>
            </el-row>
            <el-row class="line-H" style="font-size:14px;color:black;">
                Locations de meubles entre particuliers
            </el-row>
            <el-row class="line-H">
                <span>© Lendle</span>
            </el-row>
        </div>
        <el-main style="font-size:12px;margin:auto;">
            <el-row>
                <el-col :span="5" :offset="2">
                    <el-row class="line-h">
                        <span class="pointer"><router-link to="/home" tag="span">Accueil</router-link></span>
                    </el-row>
                    <el-row class="line-h">
                        <span class="pointer"><router-link to="/intro/beARenter" tag="span">Comment louer des meubles</router-link></span>
                    </el-row>
                    <el-row class="line-h">
                        <span class="pointer"><router-link to="/intro/beARenter" tag="span">Comment mettre en location</router-link></span>
                    </el-row>
                </el-col>
                <el-col :span="5">
                    <el-row class="line-h">
                        <span class="pointer"><router-link to="/search" tag="span">Chercher des meubles</router-link></span>
                    </el-row>
                    <el-row class="line-h">
                        <span class="pointer"><router-link to="/profile" tag="span">Mon compte</router-link></span>
                    </el-row>
                    <el-row class="line-h">
                        <span class="pointer"><router-link to="/login" tag="span">Se connecter</router-link></span>
                    </el-row>
                    <el-row class="line-h">
                        <span class="pointer"><router-link to="/signup/loaner" tag="span">S'inscrire pour louer</router-link></span>
                    </el-row>
                    <el-row class="line-h">
                        <span class="pointer"><router-link to="/signup/renter" tag="span">S'inscrire pour mettre en location</router-link></span>
                    </el-row>
                </el-col>
                <el-col :span="5">
                    <el-row class="line-h">
                        <span class="pointer"><router-link to="/help" tag="span">Aide</router-link></span>
                    </el-row>
                    <el-row class="line-h">
                        <span class="pointer"><router-link to="/conditionsutilisation" tag="span">Conditions d'utilisation</router-link></span>
                    </el-row>
                    <el-row class="line-h">
                        <span class="pointer"><router-link to="/help" tag="span">Contact</router-link></span>
                    </el-row>
                </el-col>
                 <el-col :span="5">
                    <el-row style="text-align:center;margin-top:15px;">
                        <img class="cursor" src="../../assets/instagram_black.svg" alt="" style="width:35px;margin-right:10px;">
                        <img class="cursor" src="../../assets/twitter.svg" alt="" style="width:35px;margin-right:10px;">
                        <img class="cursor" src="../../assets/facebook_black.svg" alt="" style="width:35px;">
                    </el-row>

                </el-col>
                </el-row>
            </el-main>
        </el-footer>
</template>


<script>

export default {
  name: 'FooterComponent',
  data() {
      return {
      }
  },
  methods: {
  }
}
</script>

<style scoped>

.hovering:hover{
    color: white !important;
    opacity: 0.9;
}

.line-H{
    line-height: 25px;
}


.line-h{
    line-height: 18px;
}


.el-main{
    padding: 0;
}

ul {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items:center;
  margin: 0;
  padding: 0;
  height: 50px;
  line-height: 50px;
  white-space: nowrap;/* interdiction de passer à la ligne */
}

li {
  list-style: none;
  cursor: pointer;
  position: relative;
  font-size: 14px;
}

</style>