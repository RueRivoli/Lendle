<template>
    <nav style="border-bottom: 1px solid #dfe0e6;width:100%;">
        <ul role="menubar" class="" style="height: 50px;">
            <li tabindex="0" class="mleft selected pointer lendle"><router-link to="/" tag="span">LENDLE</router-link></li>
            <div class="f-auto" style="width:25%;"></div>
            <div class="f-auto" style="flex-grow: 1;">
                 <li tabindex="0" class="pointer" style="float:right;color:#1E969D;" ><router-link to="/search" tag="span">
                 <i class="el-icon-search el-icon--right"></i>
                 Chercher</router-link></li>
            </div>
            <div class="f-auto" style="flex-grow: 2;">
                 <li tabindex="0" class="pointer" style="float:right;" ><router-link to="/myrentals" tag="span">Mes meubles</router-link></li>
            </div>
            <div class="f-auto" style="flex-grow: 2;">
                <li tabindex="0" class="pointer" style="float:right;"><router-link to="/chat" tag="span">Messagerie</router-link></li>
            </div>
            <div class="f-auto" style="flex-grow: 2;">
                <el-dropdown trigger="click" style="float:right;">
                    <span class="el-dropdown-link pointer" style="vertical-align:middle;margin:auto;">
                        <span style="vertical-align:middle;margin:auto;margin-right:5px;">{{ username }}</span>
                        <el-avatar size="small" :src="avatar"></el-avatar>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-setting"><router-link to="/profile" tag="span">Profil</router-link></el-dropdown-item>
                        <el-dropdown-item icon="el-icon-help"><router-link to="/help" tag="span">Aide</router-link></el-dropdown-item>
                        <el-dropdown-item icon="el-icon-caret-left"><router-link to="/" tag="span">Deconnexion</router-link></el-dropdown-item>
                    </el-dropdown-menu>
                    </el-dropdown>
            </div>
        </ul>
    </nav>
</template>


<script>

import { mapGetters } from 'vuex'

export default {
  name: 'NavLoanerComponent',
  data() {
      return {
          }
        },
    methods: {
      searchFurnit() {
          this.$router.push({ name: 'Search' });
      }
  },
  computed: {
    ...mapGetters({
      avatar: 'GET_AVATAR',
      username: 'GET_USERNAME'
    }),
  }
}
</script>

<style scoped>


.mleft{
    margin-left: 18px;
}

ul {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  /* justify-content: space-between; */
  align-items:center;
  margin: 0;
  padding: 0;
  white-space: nowrap;/* interdiction de passer à la ligne */
}

ul.el-dropdown-menu{
 display: flex;
  flex-direction: column;
}
.el-dropdown{
 /* font-family: 'Gagalin'; */
 color: #2c3e50;
}

li {
  /* font-family: 'Gagalin'; */
  list-style: none;
  cursor: pointer;
  position: relative;
  font-size: 14px;
}


.selected{
  color: #1E969D;
  font-weight: bold;
}


nav ul{
    justify-content: space-between;
}

.el-avatar{
    vertical-align:middle;
    margin:auto;
    margin-right:3px;
}

</style>