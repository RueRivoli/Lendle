<template>
    <el-container>
        <nav-loaner-component v-if="loaner" style="border-bottom: 1px solid #dfe0e6">{{loaner}}</nav-loaner-component>
        <nav-renter-component v-else-if="renter" :displayTitles="true">{{loaner}}</nav-renter-component>
        <nav-visitor-component v-else :displayTitles="true"></nav-visitor-component>
    </el-container>
</template>



<script>
import NavVisitorComponent from './NavVisitorComponent';
import NavLoanerComponent from './NavLoanerComponent';
import NavRenterComponent from './NavRenterComponent';

export default {
  name: 'NavComponent',
  components: { NavVisitorComponent, NavLoanerComponent, NavRenterComponent },
  data() {
      return {
    }
  },
    methods: {
    },
    computed: {
        renter () {
            return this.$store.getters.GET_AUTH && !this.$store.getters.GET_LOAN;
        },
        loaner () {
            return this.$store.getters.GET_AUTH && this.$store.getters.GET_LOAN;
        }
    }
}

</script>


<style lang="scss">
</style>