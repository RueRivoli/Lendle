<template>
<div>

     <nav-component style="width:100%;" :displayTitles="true"></nav-component>
Conditions
    </div>
</template>

<script>
import NavComponent from './Navigation/NavComponent';

export default {
  name: 'ConditionComponent',
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
