<template>
    <div>
        <nav-component :displayTitles="false" style="border-bottom: 1px solid #dfe0e6"></nav-component>
        <div style="height:15vh;" >
           <el-alert
                v-if="checkMails"
                title="Avertissement"
                type="warning"
                description="Checkez vos mails et activez votre compte afin de vous connecter."
                show-icon>
            </el-alert>
        </div>
            <el-form ref="validation" name="validation" style="width:100%;" :model="validation" :rules="rulesValidation" label-position="top" label-width="130px" enctype="multipart/form-data">
                    <br><br>
                    <el-row>
                        <el-col :span="8" :offset="8">
                            <div style="text-align:center;font-size:12px;">
                                Rentrez votre adresse email
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8" :offset="8">
                            <el-form-item label="" prop="email">
                                <el-input type="email" size="mini" placeholder="Email"  v-model="validation.email" required></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col class="flex sp-around" :span="8" :offset="8">
                            <el-button type="primary" value="submit" @click="submitForm()" style="margin-top:5px;" size="mini" round>Submit</el-button>
                        </el-col>
                    </el-row>
        </el-form>
    </div>
</template>


<script>
import NavComponent from './NavComponent';
import AuthService from '../AuthService';

export default {
  name: 'ReSendMailValidationComponent',
  components: { NavComponent },
  data() {
      return {
          validation: {
              email: '',
          },
        rulesValidation: {
            email: [
                { required: true, message: 'Please input your email', trigger: 'blur' },
                { min: 3, max: 50, message: 'Length should be between 3 and 20', trigger: 'blur' },
                { type: 'email', message: 'Please write a correct email', trigger: 'blur' }
            ],
            },
        }
    },
    created() {
    },
    methods: {
        async submitForm() {
            console.log(this.validation);
            this.$refs['validation'].validate((valid) => {
              if (!valid) {
              return false
             }
             let context = this;
            AuthService.sendValidationUser(this.validation).then(function() {
                context.$router.push({ name: 'LogIn', params: { checkMails: true }})
            }).catch(function(error){
                let msg = "There is a problem";
                if (error.response.data.err) {
                    msg = error.response.data.err;
                }
                context.$message({
                    message: msg,
                    type: 'warning'
                });
              }
            );
       });
        var result = await AuthService.logUser(this.validation);
        console.log(result);
        if (result) {
            this.$router.push({ name: 'ProfileComponent' });
        } 
        console.log('RESULT');
        console.log(result);
    },
  }
}
</script>

<style lang="scss" scoped>

@import "./../style/element-variables.scss";

#fb:hover{
  background-color:#7490B8 !important;
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