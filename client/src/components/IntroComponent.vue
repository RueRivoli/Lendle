<template>
    <el-container>
        <nav-component :displayTitles="true" @display="display"></nav-component>
         <div v-if="displayLendle">
            <lendle-component></lendle-component>
        </div>
        <div v-else-if="displayLoanFurnit">
            <loan-furnit-component></loan-furnit-component>
        </div>
        <div v-else>
            <find-furnit-component></find-furnit-component>
        </div>
        <el-footer class="flex" style="background-color:#cfccc4; height: 200px;">
            <div class="margin-auto lendle" style="width:40vh;line-height:40px;font-size:40px;color:black;">Lendle</div>
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
    </el-container>
</template>


<script>
import NavComponent from './NavComponent';
import LendleComponent from './LendleComponent';
import LoanFurnitComponent from './LoanFurnitComponent';
import FindFurnitComponent from './FindFurnitComponent';
// import FooterComponent from './FooterComponent';

export default {
  name: 'IntroComponent',
  components: { NavComponent, LendleComponent, LoanFurnitComponent, FindFurnitComponent },
  props: ['displayLoanFurnit', 'displayLendle'],
  data() {
      return {
        //   displayLendle: false,
        //   displayLoanFurnit: true,
        //   displayFindFurnit: false,
      }
  },
    methods: {
        display (n) {
          this.displayLendle = (n === 0);
          this.displayLoanFurnit = (n === 1);
          this.displayFindFurnit = (n === 2);
    }

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
    line-height: 44px;
    margin-top: 8px;
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