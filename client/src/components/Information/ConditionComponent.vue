<template>
   <div>
    <nav-component style="width:100%;" :displayTitles="true"></nav-component>
      <div style="height:90vh;">
      Conditions d'utilisation
      </div>
    <footer-component></footer-component>
  </div>
</template>

<script>
import NavComponent from './../Navigation/NavComponent';
import FooterComponent from './../Footer/FooterComponent';

export default {
  name: 'ConditionComponent',
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

