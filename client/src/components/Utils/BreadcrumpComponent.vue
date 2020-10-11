<template>
    <div>
        <el-breadcrumb class="underligned" style="padding: 10px;" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-if="field1.title" :to="{ path: field1.path }">{{field1.title}}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="field2.title" :to="{ path: field2.path }" >{{ field2.title }}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="field3.title" :to="{ path: field3.path }" >{{ field3.title }}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="field4.title" :to="{ path: field4.path }" >{{ field4.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
</template>


<script>

export default {
  name: 'BreadcrumpComponent',
  props: {
      field1: Object,
      field2: Object,
      field3: Object,
      field4: Object
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