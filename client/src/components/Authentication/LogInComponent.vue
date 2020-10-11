<template>
    <div>
        <nav-component :displayTitles="false"></nav-component>
        <div style="height:15vh;" >
           <el-alert
                v-if="$route.params.checkMails || checkMails"
                title="Avertissement"
                type="warning"
                description="Checkez vos mails et activez votre compte afin de vous connecter."
                show-icon>
            </el-alert>
        </div>
            <el-form ref="registration" name="registration" style="width:100%;height:70vh;" :model="registration" :rules="rulesRegistration" label-position="top" label-width="130px" enctype="multipart/form-data">
                    <el-row v-if="$route.params.checkMails || checkMails">
                        <el-col :span="8" :offset="8">
                            <div style="text-align:center;font-size:12px;margin-top:5px;">
                                <span class="pointer green" @click="reSendMailValidation">Réenvoyer un mail de validation </span>
                            </div>
                        </el-col>
                    </el-row>
                    <br><br>
                     <el-row>
                        <el-col class="flex sp-around" :span="8" :offset="8">
                            <a href="http://localhost:5000/api/auth/google">
                                <el-button id="gm" value="submit" style="margin-top:5px;background-color:#6C7076;color:white;" size="mini">Connectez-vous avec Gmail</el-button>          </a>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col class="flex sp-around" :span="8" :offset="8">
                            <a href="http://localhost:5000/api/auth/facebook">
                                <el-button id="fb" value="submit"  style="margin-top:5px;background-color:#4773B0;color:white;" size="mini">Connectez-vous avec Facebook</el-button>
                            </a>
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
                                Loggez-vous avec votre adresse email
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
                                <el-input type="text" size="mini" :show-password="true" placeholder="Mot de passe" v-model="registration.password" required></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col class="flex sp-around" :span="8" :offset="8">
                            <el-button type="primary" value="submit" :show-password="true" @click="submitForm()" style="margin-top:5px;" size="mini" round>Submit</el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8" :offset="8">
                            <div style="text-align:center;font-size:12px;margin-top:5px;">
                                Vous avez oublié votre <span class="pointer green"><router-link to="/passwordForgotten" tag="span">mot de passe ?</router-link></span>
                            </div>
                        </el-col>
                    </el-row>
        </el-form>
        <el-dialog
            title="Bienvenue, dans quel but voulez-vous vous connecter ?"
            :visible.sync="centerDialogVisible"
            width="50%"
            style="border-radius:4px;"
            center>
            <span slot="footer" class="dialog-footer">
                <el-button @click="toRent()">Mettre en location</el-button>
                <el-button type="primary" @click="toLoan()">Louer</el-button>
            </span>
        </el-dialog>
        <footer-component></footer-component>
    </div>
</template> 


<script>
import NavComponent from './../Navigation/NavComponent';
import FooterComponent from './../Footer/FooterComponent';
import AuthService from './../../Service/AuthService';
// import VueCookie from 'vue-cookie'

export default {
  name: 'LogInComponent',
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
      return {
          centerDialogVisible: false,
          registration: {
              email: '',
              password: ''
          },
          checkMails: false,
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
                ]
            },
        }
    },
    methods: {
        toRent() {
            console.log('TO RENT');
            console.log('commitons c est un renter');
            this.$store.commit('LOANER', false);
            this.centerDialogVisible = false;
            this.$store.commit('AUTH');
            this.$router.push({ name: 'ProfileComponent'});
        },
        toLoan() {
            console.log('TO LOAN');
            console.log('commitons c est un loaner');
            this.$store.commit('LOANER', true);
            this.centerDialogVisible = false;
            this.$store.commit('AUTH');
            this.$router.push({ name: 'ProfileComponent'});
        },
        async submitForm() {
            console.log(this.registration);
            this.$refs['registration'].validate((valid) => {
              if (!valid) {
                console.log('error submit!!')
              return false
             }
       });
    //    this.$cookie.set('token', 'fzfzzffz', 1);
    //    VueCookies.set('jwt', '1897878378', "1h");
        let context = this;
        AuthService.logUser(this.registration).then(function(data) {
            console.log('Data');
            console.log(data);
            context.$store.commit('AUTH');
            if (data.token) {
                let token = data.token;
                context.$store.commit('TOKEN', token);
            }
            if (data.user._id) {
                let id = data.user._id;
                context.$store.commit('ID', id);
            }
             if (data.user.username) {
                let username = data.user.username;
                context.$store.commit('USERNAME', username);
            }
            else if (data.user.firstname || data.user.lastname) {
                let username = data.user.firstname + ' ' + data.user.lastname;
                context.$store.commit('USERNAME', username);
            }
            else if (data.user.mail){
                let mail = data.user.mail;
                context.$store.commit('USERNAME', mail);
            }
              if (data.user.profilePicture) {
                let avatar = data.user.profilePicture;
                context.$store.commit('avatar', avatar);
            }
            if (data.user.renter && data.user.loaner) {
                 console.log('user is both a loaner and a renter');
                context.centerDialogVisible = true
            }
            else {
                if (data.user.renter) {
                    console.log('commitons c est un renter');
                    context.$store.commit('LOANER', false);
                } else if (data.user.loaner) {
                    console.log('commitons c est un loaner');
                     context.$store.commit('LOANER', true);
                }
                context.$router.push({ name: 'ProfileComponent'});
            }
        }).catch(function(err) {
            if (err.response && err.response.data.type === 0) {
                let msg = "Il y a une erreur de connexion";
              if (err.response.data.err) {
                msg = err.response.data.err;
              }
                 context.$message({
                    message: msg,
                    type: 'warning'
                });
            }
            else if (err.response && err.response.data.type === 1) context.checkMails = true;
        })
    },
    reSendMailValidation() {
        this.$router.push({ name: 'ReSendMailValidationComponent' });
    }
  }
}
</script>

<style lang="scss" scoped>

@import "./../../style/element-variables.scss";

#fb:hover, #gm:hover{
//   background-color:#7490B8 !important;
  opacity:0.8;
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