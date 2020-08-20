<template>
    <div>
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
    <footer-component></footer-component>
    </div>
</template>


<script>
import NavComponent from './../Navigation/NavComponent';
import LendleComponent from './LendleComponent';
import LoanFurnitComponent from './../Furnit/LoanFurnitComponent';
import FindFurnitComponent from './../Furnit/FindFurnitComponent';
import FooterComponent from './../Footer/FooterComponent';

export default {
  name: 'IntroComponent',
  components: { NavComponent, LendleComponent, LoanFurnitComponent, FindFurnitComponent, FooterComponent },
  props: ['displayLoanFurnit', 'displayLendle'],
  data() {
      return {
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