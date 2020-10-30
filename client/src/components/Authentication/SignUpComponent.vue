<template>
    <div>
        <nav-component :displayTitles="false"></nav-component>
            <div style="height:90vh;">
                <div style="height:10vh;"></div>
                    <el-row>
                        <el-col v-if="$route.params.as === 'loaner'" class="center" style="margin-bottom: 3vh;" :span="8" :offset="8">
                            <span style="font-weight:bold;font-size:18px;">Créer un compte pour louer des meubles:</span>
                            <div style="text-align:center;font-size:12px;">
                                Ou <span class="pointer green"><router-link to="/signup/renter" tag="span">inscrivez-vous </router-link></span> pour faire louer vos meubles 
                            </div>
                        </el-col>
                         <el-col v-else-if="$route.params.as === 'renter'" class="center" style="margin-bottom: 3vh;" :span="8" :offset="8">
                            <span style="font-weight:bold;font-size:18px;">Créer un compte pour mettre des meubles en location:</span>
                            <div style="text-align:center;font-size:12px;">
                                Ou <span class="pointer green"><router-link to="/signup/loaner" tag="span">inscrivez-vous </router-link></span> pour louer des meubles 
                            </div>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col class="flex sp-around" :span="8" :offset="8">
                            <!-- <a href="http://localhost:5000/api/auth/google">CLIQUE ICI</a> -->
                            <a href="http://localhost:5000/api/auth/google">
                                <el-button id="ggl" value="submit" style="margin-top:5px;background-color:#6C7076;color:white;" size="mini" >Créer un compte avec Gmail</el-button>
                            </a>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col class="flex sp-around" :span="8" :offset="8">
                            <a href="http://localhost:5000/api/auth/facebook">
                            <el-button id="fb" value="submit"  style="margin-top:5px;background-color:#4773B0;color:white;" size="mini">Créer un compte avec Facebook</el-button>
                            </a>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8" :offset="8">
                            <strong class="line-thru">ou</strong>
                        </el-col>
                    </el-row>
                    <el-form ref="registration" name="registration" style="width:100%;" :model="registration" :rules="rulesRegistration" label-position="top" label-width="130px" enctype="multipart/form-data">
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
                                <el-input type="email" size="mini" prefix-icon="el-icon-user" placeholder="Email"  v-model="registration.email" required></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8" :offset="8">
                            <el-form-item label="" prop="password">
                                <el-input type="text" size="mini" prefix-icon="el-icon-lock" placeholder="Mot de passe" :show-password="true" v-model="registration.password" required></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8" :offset="8">
                            <el-form-item label="" prop="passwordConfirmed" style="margin-bottom: 30px;">
                                <el-input type="text" size="mini" prefix-icon="el-icon-lock" placeholder="Confirmez le mot de passe" :show-password="true" v-model="registration.passwordConfirmed" required></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8" :offset="8">
                            <div style="text-align:center;font-size:12px;">
                                En cliquant sur le bouton d'inscription, vous acceptez les <span class="pointer green"><router-link to="/conditionsutilisation" tag="span">conditions générales d'utilisation </router-link></span> de Lendle. 
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
                                Vous avez déjà un compte ? <span class="pointer green"><router-link to="/login" tag="span">Connexion</router-link></span>
                            </div>
                        </el-col>
                    </el-row>
            </el-form>
        </div>
        <footer-component></footer-component>
    </div>
</template>


<script>
import NavComponent from './../Navigation/NavComponent';
import FooterComponent from './../Footer/FooterComponent';
import AuthService from './../../Service/AuthService';

export default {
  name: 'SignUpComponent',
  components: { NavComponent, FooterComponent },
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
              passwordConfirmed: '',
              as: this.$route.params.as
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
            this.$refs['registration'].validate((valid) => {
              if (!valid) {
                return false
            }
             if (this.$route.params.as === 'renter') {
                this.registration.renter = true;
                this.registration.loaner = false;
            } else {
                this.registration.loaner = true;
                this.registration.renter = false;
            }
            let context = this;
            AuthService.insertUser(this.registration).then(function() {
                context.$router.push({ name: 'LogIn', params: { checkMails: true }})
            }).catch(function(error){
                let msg = "Pb";
                console.log(error);
                console.log(error.response);
                if (error.response && error.response.data.err) {
                    msg = error.response.data.err;
                }
                context.$message({
                    message: msg,
                    type: 'warning'
                });
              }
            );
        });
    },
    async signUpGoogle() {
        let result = await AuthService.signUpGoogle();
        console.log('GOOGLE RESULT');
        console.log(result);
    },
    async signUpFacebook() {
        let result = await AuthService.signUpFacebook();
        console.log(result);
    }
  }
}

</script>

<style lang="scss" scoped>

@import "./../../style/element-variables.scss";

#fb:hover{
  opacity: 0.7;
}

#ggl:hover{
  opacity: 0.7;
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