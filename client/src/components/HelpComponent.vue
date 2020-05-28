<template>
 <el-container>
     <nav-component style="width:100%;" :displayTitles="true"></nav-component>
     <el-container style="height:85vh;">
         Help
        </el-container>
    </el-container>
</template>

<script>
import NavComponent from './NavComponent';

export default {
  name: 'HelpComponent',
  components: { NavComponent },
  data() {
    return {
    }
  },
  async created() {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
