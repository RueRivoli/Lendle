<template>
    <div>
        <nav-component :displayTitles="false" style="border-bottom: 1px solid #dfe0e6"></nav-component>
            <el-form ref="registration" name="registration" style="width:100%;margin-top:15vh;" :model="registration" :rules="rulesRegistration" label-position="top" label-width="130px" enctype="multipart/form-data">
                    <el-row>
                        <el-col class="flex sp-around" :span="8" :offset="8">
                            <el-button type="info" value="submit" style="margin-top:5px;background-color:#6C7076;" size="mini">Connectez-vous avec Gmail</el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col class="flex sp-around" :span="8" :offset="8">
                            <el-button id="fb" type="danger" value="submit"  style="margin-top:5px;background-color:#4773B0;" size="mini">Connectez-vous avec Facebook</el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8" :offset="8">
                            <strong class="line-thru">ou</strong>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8" :offset="8">
                            <div style="text-align:center;font-size:12px;">
                                Inscrivez-vous avec votre adresse email
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8" :offset="8">
                            <el-form-item label="" prop="name">
                                <el-input type="email" size="mini" placeholder="Email"  v-model="registration.email" required></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8" :offset="8">
                            <el-form-item label="" prop="type">
                                <el-input type="text" size="mini" placeholder="Mot de passe" v-model="registration.password" required></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8" :offset="8">
                            <el-form-item label="" prop="type" style="margin-bottom: 30px;">
                                <el-input type="text" size="mini" placeholder="Confirmez le mot de passe" v-model="registration.passwordConfirmed" required></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8" :offset="8">
                            <div style="text-align:center;font-size:12px;">
                                En cliquant sur le bouton d'inscription, vous acceptez les <span class="pointer green">conditions générales d'utilisation </span> de Lendle. 
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col class="flex sp-around" :span="8" :offset="8">
                            <el-button type="primary" value="submit" @click="submitForm()" style="margin-top:5px;" size="mini" round>Submit</el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8" :offset="8">
                            <div style="text-align:center;font-size:12px;margin-top:5px;">
                                Vous avez déjà un compte ? <span class="pointer green">Connexion</span>
                            </div>
                        </el-col>
                    </el-row>
        </el-form>
    </div>
</template>


<script>
import NavComponent from './NavComponent';

export default {
  name: 'SignUpComponent',
  components: { NavComponent },
  data() {
      return {
          registration: {
              email: '',
              password: '',
              passwordConfirmed: ''
          }
        }
    },
    methods: {
  }
}
</script>

<style lang="scss" scoped>

@import "./../style/element-variables.scss";

#fb:hover{
  background-color:#7490B8 !important;
}

.el-form-item {
    margin-bottom: 0px;
}

.line-thru {
    display: block;
    font-size: .875em;
    margin-top: 1em;
    margin-bottom: 1em;
    position: relative;
    text-align: center;
    width: 100%;
    z-index: 1;
}

.line-thru:before {
    width: 40px;
    height: 10px;
    background-color: #FFF;
    content: '';
    margin: -5px 0 0 -20px;
    left: 50%;
    position: absolute;
    top: 50%;
    z-index: -1;
}

.line-thru:after {
    border-bottom: 1px solid #dfe0e6;
    content: '';
    display: block;
    position: absolute;
    top: 49%;
    width: 100%;
    z-index: -2;
}

.green{
    color: $--color-primary;
}


</style>