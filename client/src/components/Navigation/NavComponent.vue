<template>
    <el-container>
        <nav-logged-component v-if="identified" style="border-bottom: 1px solid #dfe0e6"></nav-logged-component>
        <nav-visitor-component v-else :displayTitles="true"></nav-visitor-component>
    </el-container>
</template>



<script>
import NavVisitorComponent from './NavVisitorComponent';
import NavLoggedComponent from './NavLoggedComponent';


export default {
  name: 'NavComponent',
  components: { NavVisitorComponent, NavLoggedComponent },
  data() {
      return {
        identified: this.$store.getters.GET_AUTH,
    }
  },
    methods: {
    }
}

</script>


<style lang="scss">
</style>