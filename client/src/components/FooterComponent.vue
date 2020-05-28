<template>
    <el-footer class="flex" style="background-color:#cfccc4; height: 100%;">
        <div class="m-auto" style="width:40vh;line-height:40px;font-size:40px;color:black;">LENDLE</div>
        <el-main style="font-size:12px;">
            <el-row>
                <el-col span="6">
                    <span class="pointer">Accueil</span>
                </el-col>
                <el-col span="6">
                    <span class="pointer">Trouver les emprunteurs</span>
                </el-col>
                <el-col span="6">
                    <span class="pointer">Trouver les prêteurs</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col span="6">
                    <span class="pointer">Prêter des meubles</span>
                </el-col>
                <el-col span="6">
                    <span class="pointer">Trouver les prêteurs</span>
                </el-col>
                <el-col span="6">
                    <span class="pointer">Mon compte</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col span="6">
                    <span class="pointer">Trouver des meubles</span>
                </el-col>
                <el-col span="6">
                    <span class="pointer">FAQ</span>
                </el-col>
                <el-col span="6">
                    <span class="pointer">Contact</span>
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
          findFurnits: true,
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

.slogan{
    width:68%;
    margin: auto;
    text-align:center;
    font-size:42px;
    font-weight:600;
}

.el-aside {
  padding-top: 10px;
  /*background-color: #160F29;*/
  background: linear-gradient(to right,#160F29, #484538);
  padding: 20px 40px 0px 20px;
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

.selected{
  color: #1E969D;
  font-weight: bold;
}


.menu__item{
    height:50px;
}
</style>