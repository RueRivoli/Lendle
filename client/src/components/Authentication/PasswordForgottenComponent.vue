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
         <el-form ref="registration" name="registration" style="width:100%;height:70vh;" :model="registration" :rules="rulesRegistration" label-position="top" label-width="130px" enctype="multipart/form-data">
            <br><br>  
            <el-row>
                <el-col :span="8" :offset="8">
                    <span style="font-weight:bold;font-size:18px;">Réinitialiser votre mot de passe</span>
                    <el-form-item label="" prop="email">
                        <el-input type="email" size="mini" placeholder="Email"  v-model="registration.email" required></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
                   
            <el-row>
                <el-col class="flex sp-around" :span="8" :offset="8">
                    <el-button type="primary" value="submit" :show-password="true" @click="submitForm()" style="margin-top:5px;" size="mini" round>C'est parti</el-button>
                </el-col>
            </el-row>
        </el-form>
        <footer-component></footer-component>
    </div>
</template> 


<script>
import NavComponent from './../Navigation/NavComponent';
import FooterComponent from './../Footer/FooterComponent';
import AuthService from './../../Service/AuthService';

export default {
  name: 'PasswordForgottenComponent',
  components: { NavComponent, FooterComponent },
  data() {
      return {
          msg: {
              on: false,
              title: '',
              text: '',
              type: ''
          },
          registration: {
              email: ''
          },
        rulesRegistration: {
            email: [
                { required: true, message: 'Please input your email', trigger: 'blur' },
                { min: 3, max: 50, message: 'Length should be between 3 and 20', trigger: 'blur' },
                { type: 'email', message: 'Please write a correct email', trigger: 'blur' }
            ],
            },
        }
    },
    methods: {
        setMessage(on, type, title, text) {
            this.msg.on = on,
            this.msg.type = type,
            this.msg.title = title,
            this.msg.text = text
        },
        async submitForm() {
            console.log(this.registration);
            let context = this;
            this.$refs['registration'].validate((valid) => {
              if (!valid) {
                console.log('error submit!!')
              return false
             } else {
                AuthService.passwordForgotten(this.registration).then(function(data) {
                console.log('Retour reinitialize Password');
                console.log(data);
                 context.setMessage(true, 'success', 'Information', data.data.msg);
            }).catch(function(err) {
                context.setMessage(true, 'warning', 'Avertissement', err.response.data.err);
                console.log(err.response);
                console.log(err.response.data.err);
            });
            }
       });

    }
  }
}
</script>

<style lang="scss" scoped>

@import "./../../style/element-variables.scss";

.green{
    color: $--color-primary;
}


</style>