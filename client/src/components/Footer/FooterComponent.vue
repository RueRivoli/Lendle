<template>
    <el-footer class="flex" style="background-color:#cfccc4; height: 200px;">
        <div class="margin-auto" style="width:40vh;margin:auto;">
            <span class="lendle" style="line-height:40px;font-size:40px;color:black;">Lendle</span>
            <el-row style="font-size:14px;color:black;">Le site de locations de meubles entre particuliers</el-row>
        </div>
        <el-main style="font-size:12px;margin:auto;">
            <el-row>
                <el-col :span="6" :offset="2">
                    <el-row>
                        <span class="pointer"><router-link to="/home" tag="span">Accueil</router-link></span>
                    </el-row>
                    <el-row>
                        <span class="pointer"><router-link to="/intro/beARenter" tag="span">Comment louer des meubles</router-link></span>
                    </el-row>
                    <el-row>
                        <span class="pointer"><router-link to="/intro/beARenter" tag="span">Comment mettre en location</router-link></span>
                    </el-row>
                </el-col>
                <el-col :span="6">
                    <el-row>
                        <span class="pointer"><router-link to="/search" tag="span">Chercher des meubles</router-link></span>
                    </el-row>
                    <el-row>
                        <span class="pointer"><router-link to="/profile" tag="span">Mon compte</router-link></span>
                    </el-row>
                    <el-row>
                        <span class="pointer"><router-link to="/login" tag="span">Se connecter</router-link></span>
                    </el-row>
                    <el-row>
                        <span class="pointer"><router-link to="/signup/loaner" tag="span">S'inscrire pour louer</router-link></span>
                    </el-row>
                    <el-row>
                        <span class="pointer"><router-link to="/signup/renter" tag="span">S'inscrire pour mettre en location</router-link></span>
                    </el-row>
                </el-col>
                <el-col :span="6">
                    <el-row>
                        <span class="pointer"><router-link to="/help" tag="span">Aide</router-link></span>
                    </el-row>
                    <el-row>
                        <span class="pointer"><router-link to="/conditionsutilisation" tag="span">Conditions d'utilisation</router-link></span>
                    </el-row>
                    <el-row>
                        <span class="pointer"><router-link to="/help" tag="span">Contact</router-link></span>
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