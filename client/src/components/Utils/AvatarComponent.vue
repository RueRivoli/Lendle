<template>
    <div>
        <!-- <el-avatar v-if="avatar" size="30" :src="avatar"></el-avatar> -->
        <avatar :username="displayName()" :size="size" :inline="true" style="margin-right:10px;"></avatar>
    </div>
</template>


<script>

import Avatar from 'vue-avatar'
import { mapGetters } from 'vuex'

export default {
  name: 'AvatarComponent',
  components: { Avatar },
  props: ['size', 'name'],
  data() {
      return {
      }
  },
    computed: {
    ...mapGetters({
      avatar: 'GET_AVATAR',
      username: 'GET_USERNAME'
    }),
  },
  methods: {
      displayName () {
          if (this.name) return this.name
          else return this.username
        }
      }
  }
</script>

<style scoped>

</style>