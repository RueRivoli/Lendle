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
                            <el-form-item label="" prop="email">
                                <el-input type="email" size="mini" placeholder="Email"  v-model="registration.email" required></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8" :offset="8">
                            <el-form-item label="" prop="password">
                                <el-input type="text" size="mini" placeholder="Mot de passe" v-model="registration.password" required></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8" :offset="8">
                            <el-form-item label="" prop="passwordConfirmed" style="margin-bottom: 30px;">
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
import AuthService from '../AuthService';

export default {
  name: 'SignUpComponent',
  components: { NavComponent },
  data() {
      var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Veuillez entrer le mot de passe'))
      } else {
        if (this.registration.passwordConfirmed !== '') {
          this.$refs.registration.validateField('passwordConfirmed')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Veuillez entrer à nouveau le mot de passe'))
      } else if (value !== this.registration.password) {
        callback(new Error('Les deux entrées ne correspondent pas!'))
      } else {
        callback()
      }
    }
      return {
          registration: {
              email: '',
              password: '',
              passwordConfirmed: ''
          },
        rulesRegistration: {
            email: [
                { required: true, message: 'Please input your email', trigger: 'blur' },
                { min: 3, max: 50, message: 'Length should be between 3 and 20', trigger: 'blur' },
                { type: 'email', message: 'Please write a correct email', trigger: 'blur' }
            ],
            password: [
                { required: true, message: 'Please enter a password', trigger: 'blur' },
                 { validator: validatePass, trigger: 'blur' },
                { pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-+!*$@%_])([a-zA-Z0-9-+!*$@%_]{6,30})$',
                    message: 'Between 6 and 30 characters, at least one uppercase, one lowercase, one figure, a special character among -+!*$@%_',
                    trigger: 'blur' }
                ],
            passwordConfirmed: [
                { required: true, message: 'Please confirm the password', trigger: 'blur' },
                { validator: validatePass2, trigger: 'blur' },
                { pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-+!*$@%_])([a-zA-Z0-9-+!*$@%_]{6,30})$',
                    message: 'Between 6 and 30 characters, at least one uppercase, one lowercase, one figure, a special character among -+!*$@%_',
                    trigger: 'blur' }
                ],
            },
        }
    },
    methods: {
        async submitForm() {
        //     this.$refs['registration'].validate((valid) => {
        //       if (!valid) {
        //         return false
        //     }
        // });
        var result = await AuthService.insertUser(this.registration);
        if (result.success) {
            this.$router.push({ name: 'LogIn', params: { comeFromSignUp: true }});
        }
    }
  }
}
</script>

<style lang="scss" scoped>

@import "./../style/element-variables.scss";

#fb:hover{
  background-color:#7490B8 !important;
}

// .el-form-item {
//     margin-bottom: 0px;
// }

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