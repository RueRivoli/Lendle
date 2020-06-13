<template>
    <div>
        <el-tag :type="type">{{title}}</el-tag>
    </div>
</template>


<script>

export default {
  name: 'TagComponent',
  props: ['state'],
  data() {
      return {
          title: this.labelOfState(),
          type: this.typeOfState()
      }
  },
  methods: {
      labelOfState () {
        if (this.state === 100) return "Excellent état";
        if (this.state === 75) return "Bon état";
        if (this.state === 50) return "Etat correct";
        if (this.state === 25) return "Etat délicat";
        return "Bon état";
    },
    typeOfState () {
       if (this.state === 100) return "primary";
        if (this.state === 75) return "success";
        if (this.state === 50) return "warning";
        if (this.state === 25) return "danger";
        return "primary";
    }
      }
  }
</script>

<style scoped>

</style>