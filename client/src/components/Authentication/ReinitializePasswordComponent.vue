<template>
    <div>
        <nav-component :displayTitles="false"></nav-component>
        <div style="height:15vh;" >
           <el-alert
                v-if="msg.on"
                :title="msg.title"
                :type="msg.type"
                :description="msg.text"
                show-icon>
            </el-alert>
        </div>
            <el-form ref="reinitialization" name="reinitialization" style="width:100%;height:70vh;" :model="reinitialization" :rules="rulesReinitialization" label-position="top" label-width="130px" enctype="multipart/form-data">
                   <el-row>
                        <el-col :span="8" :offset="8">
                            <el-form-item label="" prop="password">
                                <el-input type="text" size="mini" placeholder="Mot de passe" :show-password="true" v-model="reinitialization.password" required></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8" :offset="8">
                            <el-form-item label="" prop="passwordConfirmed" style="margin-bottom: 30px;">
                                <el-input type="text" size="mini" placeholder="Confirmez le mot de passe" :show-password="true" v-model="reinitialization.passwordConfirmed" required></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                   
                    <el-row>
                        <el-col class="flex sp-around" :span="8" :offset="8">
                            <el-button type="primary" value="submit" :show-password="true" @click="submitForm()" style="margin-top:5px;" size="mini" round>Réinitialiser le mot de passe</el-button>
                        </el-col>
                    </el-row>
        </el-form>
            <el-dialog
                title="Votre mot de passe est modifié, dans quel but voulez-vous vous connecter ?"
                :visible.sync="centerDialogVisible"
                width="50%"
                style="border-radius:4px;"
                center>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="connectAsLessor()">Mettre en location</el-button>
                    <el-button type="primary" @click="connectAsLoaner()">Louer</el-button>
                </span>
            </el-dialog>
        <footer-component></footer-component>
    </div>
</template> 


<script>
import NavComponent from './../Navigation/NavComponent';
import FooterComponent from './../Footer/FooterComponent';
import AuthService from './../../Service/AuthService';

export default {
  name: 'ReinitializePasswordComponent',
  components: { NavComponent, FooterComponent },
  data() {
       var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Veuillez entrer le mot de passe'))
      } else {
        if (this.reinitialization.passwordConfirmed !== '') {
          this.$refs.reinitialization.validateField('passwordConfirmed')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Veuillez entrer à nouveau le mot de passe'))
      } else if (value !== this.reinitialization.password) {
        callback(new Error('Les deux entrées ne correspondent pas!'))
      } else {
        callback()
      }
    }
      return {
          centerDialogVisible: false,
           msg: {
              on: false,
              title: '',
              text: '',
              type: ''
          },
          reinitialization: {
              email: '',
              password: '',
              passwordConfirmed: ''
          },
        rulesReinitialization: {
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
        connectAsLessor() {
            this.$store.commit('LOANER', false);
            this.centerDialogVisible = false;
            this.$store.commit('AUTH');
            this.$router.push({ name: 'ProfileComponent'});
        },
        connectAsLoaner() {
            this.$store.commit('LOANER', true);
            this.centerDialogVisible = false;
            this.$store.commit('AUTH');
            this.$router.push({ name: 'ProfileComponent'});
        },
        async submitForm() {
            console.log(this.reinitialization);
            this.$refs['reinitialization'].validate((valid) => {
              if (!valid) {
                console.log('error submit!!')
              return false
             } else {
                let context = this;
                AuthService.reinitializePassword(this.reinitialization.password, this.$route.query).then(function(data) {
                context.$store.commit('AUTH');
                if (data.token) {
                    let token = data.token;
                    context.$store.commit('TOKEN', token);
                }
                if (data.id) {
                    let id = data.id;
                    context.$store.commit('ID', id);
                }
                if (data.user.renter && data.user.loaner) {
                    console.log('IS BOTH');
                    context.centerDialogVisible = true
                } else {
                    if (data.user.renter) {
                        context.$store.commit('LOANER', false);
                    } else if (data.user.loaner) {
                         context.$store.commit('LOANER', true);
                }
                context.$router.push({ name: 'ProfileComponent'});
            }
        }).catch(function(err) {
             context.setMessage(true, 'warning', 'Avertissement', err.response.data.err);
        })
        }
       });

    },
  }
}
</script>

<style lang="scss" scoped>

@import "./../../style/element-variables.scss";

</style>