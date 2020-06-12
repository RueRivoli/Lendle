<template>
  <div>
     <nav-component style="width:100%;" :displayTitles="true"></nav-component>
      <div style="height:680px;">
        Help
      </div>
      <footer-component></footer-component>
  </div>
</template>

<script>
import NavComponent from './Navigation/NavComponent';
import FooterComponent from './Footer/FooterComponent';

export default {
  name: 'HelpComponent',
  components: { NavComponent, FooterComponent },
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
