<template>
    <div style="border-bottom: 1px solid #1E969D;color: #1E969D;margin-bottom:10px;">
        <span style="font-size:17px;font-color:#1E969D;">{{ text.toUpperCase()}}</span>
    </div>
</template>


<script>

export default {
  name: 'TitleComponent',
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