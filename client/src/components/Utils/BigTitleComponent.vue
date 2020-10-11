<template>
    <div style="border-top: double black;border-bottom: double black;">
        <span style="font-size:18px;">{{text.toUpperCase() }}</span>
    </div>
</template>


<script>

export default {
  name: 'BigTitleComponent',
  props: {
      'text': String,
  },
  data() {
      return {
      }
  },
  methods: {
    }
  }
</script>

<style scoped>

</style>