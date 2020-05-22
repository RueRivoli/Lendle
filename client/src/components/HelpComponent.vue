<template>
 <el-container style="height: 100vh;">
     HELP
    </el-container>
</template>

<script>


export default {
  name: 'HelpComponent',
  components: { },
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

$color-primary: #1E969D;
$color-success: #484538;
$color-info: #cad49d;
$color-warning: #d4eac8;
$color-danger: #c0d8e0;

.add_furnit_title{
  color: #1E969D;
  text-align: center;
  font-style:oblique;
  font-weight:bold;
  font-size:22px;
  font-family:Times New Roman, Times, serif;
}

.el-form-item__label{
  padding: 0px !important;
  line-height: 10px !important;
}

.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}


.grid-content{
  border-radius: 4px;
  min-height: 50px;
}

</style>
