<template>
    <div>
        <nav-logged-component  style="border-bottom: 1px solid #dfe0e6"></nav-logged-component>
        
            <el-tabs type="border-card" style="margin-left:15vh;margin-right:15vh;margin-top:5vh;">
                <el-tab-pane>
                    <span slot="label">Profile</span>
                    <el-form  style="width:100%;" label-position="left" label-width="130px">
                        <el-row>
                            <el-col :span="6" :offset="4">
                                <el-form-item label="Nom" prop="lastname">
                                    <span>{{ profile.lastname }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" :offset="3">
                                <el-form-item label="Prénom" prop="firstname">
                                    <span>{{ profile.firstname }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6" :offset="4">
                                <el-form-item label="Email" prop="email">
                                    <span>{{ profile.mail }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" :offset="3">
                                <el-form-item label="Langue" prop="language">
                                    <span>{{ profile.language }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6" :offset="4">
                                <el-form-item label="Inscrit en tant que" >
                                    <el-checkbox v-model="profile.finder" disabled label="Emprunteur">Emprunteur</el-checkbox>
                                    <el-checkbox v-model="profile.loaner" disabled label="Prêteur">Prêteur</el-checkbox>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" :offset="3">
                                <el-form-item label="Membre depuis" prop="email">
                                    <span>{{ toFormat(profile.subscription) }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10" :offset="4">
                                <el-form-item label="Adresse" >
                                    <span>{{ profile.address }} {{ profile.postcode }} {{ profile.city }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12" :offset="4">
                                <el-form-item label="Présentation">
                                    <span>{{ profile.description }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                        <el-col :span="12" :offset="4">
                                <el-form-item label="Note">
                                    <el-rate
                                        v-model="profile.mark"
                                        :texts="['moyen', 'pas mal', 'bien', 'bon', 'excellent']"
                                        disabled
                                        show-text>
                                        </el-rate>
                                </el-form-item>
                            </el-col>
                            
                        </el-row>
                        </el-form>
                    </el-tab-pane>
                    
                    <el-tab-pane> <span slot="label"><i class="el-icon-edit"></i> Edit</span>
                        <el-form ref="profile" name="profile" style="width:100%;" :model="profile" :rules="rulesProfile" label-position="left" label-width="130px">
                            <el-row>
                                <el-col :span="7" :offset="4">
                                    <el-form-item label="Nom" prop="lastname">
                                        <el-input placeholder="Nom" size="mini" v-model="profile.lastname"></el-input>
                                    </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :offset="3">
                                    <el-form-item label="Prénom" prop="firstname">
                                        <el-input placeholder="Prénom" size="mini" v-model="profile.firstname"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="7" :offset="4">
                                    <el-form-item label="Email" prop="email">
                                        <span>{{ profile.mail }}</span>
                                    </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :offset="3">
                                        <el-form-item label="Langue" prop="language">
                                            <el-select v-model="profile.language" size="mini" placeholder="">
                                                <el-option label="Français" value="fr"></el-option>
                                                <el-option label="English" value="eng"></el-option>
                                                <el-option label="Español" value="sp"></el-option>
                                            </el-select>
                                        </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="7" :offset="4">
                                    <el-form-item label="Inscrit en tant que">
                                        <el-checkbox v-if="activeFinder" v-model="profile.finder" label="Emprunteur">Emprunteur</el-checkbox>
                                        <el-checkbox v-else v-model="profile.finder" disabled label="Emprunteur">Emprunteur</el-checkbox>
                                        <el-checkbox v-if="activeLoaner" v-model="profile.loaner"  label="Prêteur">Prêteur</el-checkbox>
                                        <el-checkbox v-else v-model="profile.loaner" disabled label="Prêteur">Prêteur</el-checkbox>
                                    </el-form-item>
                                    </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="9" :offset="4">
                                    <el-form-item label="Adresse" >
                                        <el-input placeholder="" size="mini" v-model="profile.address"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="7" :offset="4">
                                    <el-form-item label="Code postal" prop="postcode">
                                        <el-input ref="postcode" placeholder="" size="mini" v-model="profile.postcode"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="7" :offset="4">
                                    <el-form-item label="Ville" prop="city">
                                        <el-input ref="city" placeholder="" size="mini" v-model="profile.city"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                    <el-row>
                        <el-col :span="12" :offset="4">
                            <el-form-item label="Présentation">
                                <el-input placeholder="Présentez-vous" type="textarea" size="mini" :rows="3" v-model="profile.description"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-button type="primary" value="submit" @click="editProfile()" style="display:block;margin:auto;" size="mini">Valider</el-button>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane> <span slot="label"><i class="el-icon-key"></i>Change password</span>
                    <el-form ref="password" name="password" style="width:100%;" :model="password" :rules="rulesPassword" label-position="left" label-width="160px" enctype="multipart/form-data">
                        <el-row>
                            <el-col :span="10" :offset="4">
                                <el-form-item label="Mot de passe actuel" prop="actualpswd">
                                    <el-input ref="actualpswd" placeholder="Mot de passe actuel" size="mini" :show-password="true" v-model="password.actualpswd"></el-input>
                                </el-form-item>
                            </el-col>
                            </el-row>
                            <el-row>
                            <el-col :span="10" :offset="4">
                                <el-form-item label="Nouveau mot de passe" prop="pswd">
                                    <el-input ref="pswd" placeholder="Nouveau mot de passe" size="mini" :show-password="true" v-model="password.pswd"></el-input>
                                </el-form-item>
                            </el-col>
                            </el-row>
                            <el-row>
                            <el-col :span="10" :offset="4">
                                <el-form-item label="Confirmez" prop="pswdCf">
                                    <el-input ref="pswdCf" placeholder="Confirmez le nouveau mot de passe" :show-password="true" size="mini" v-model="password.pswdCf"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10" :offset="4">
                                <el-button type="primary" value="submit" style="display:block;margin:auto;" @click="editPassword()"  size="mini">Valider</el-button>
                            </el-col>
                              
                        </el-row>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
   
   
    </div>
</template>


<script>
import NavLoggedComponent from './NavLoggedComponent';
import UserService from '../UserService';
import moment from 'moment';


export default {
  name: 'ProfileComponent',
  components: { NavLoggedComponent },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Veuillez entrer le mot de passe'))
      } else {
        if (this.password.pswdCf !== '') {
          this.$refs.password.validateField('passwordConfirmed')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Veuillez entrer à nouveau le mot de passe'))
      } else if (value !== this.password.pswd) {
        callback(new Error('Les deux mots de passe ne correspondent pas!'))
      } else {
        callback()
      }
    }
      return {
        activeLoaner: true,
        activeFinder: true,
        profile: {
            lastname: '',
            firstname: '',
            mail: '',
            address: '',
            postcode: '',
            city: '',
            finder: false,
            loaner: false,
            mark: 0
        },
        password: {
            actualpswd: '',
            pswd: '',
            pswdCf: '',
        },
        rulesPassword: {
            actualpswd: [
                { required: true, message: 'Veuillez rentrer un mot de passe', trigger: 'blur' },
                { pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-+!*$@%_])([a-zA-Z0-9-+!*$@%_]{6,30})$',
                    message: 'Ceci ne peut pas être votre mot de passe',
                    trigger: 'blur' }
                ],
            pswd: [
                { required: true, message: 'Veuillez rentrer un nouveau mot de passe', trigger: 'blur' },
                 { validator: validatePass, trigger: 'blur' },
                { pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-+!*$@%_])([a-zA-Z0-9-+!*$@%_]{6,30})$',
                    message: 'Entre 6 et 30 caractères, au moins une majuscule et une minuscule, un chiffre et un caractère spécial parmi -+!*$@%_',
                    trigger: 'blur' }
                ],
            pswdCf: [
                { required: true, message: 'Veuillez confirmer le nouveau mot de passe', trigger: 'blur' },
                { validator: validatePass2, trigger: 'blur' },
                { pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-+!*$@%_])([a-zA-Z0-9-+!*$@%_]{6,30})$',
                    message: 'Entre 6 et 30 caractères, au moins une majuscule et une minuscule, un chiffre et un caractère spécial parmi -+!*$@%_',
                    trigger: 'blur' }
                ],
            },
        rulesProfile: {
            firstname: [
                { min: 3, max: 40, message: 'Length should be between 3 and 40', trigger: 'blur' }
            ],
            lastname: [
                { min: 3, max: 40, message: 'Length should be between 3 and 40', trigger: 'blur' }
            ],
            type: [
                { type: 'array', required: true, message: 'Sélectionner au moins un statut', trigger: 'change' }
            ],
            postcode: [
                { pattern: '^(?:[0-8][0-9]|9[0-8])[0-9]{3}$', message: 'Ecrivez un code postal correct', trigger: 'blur' },
            ],
            city: [
                { pattern: '^[a-zA-Z]{2,30}$', message: 'Ecrivez une ville correcte', trigger: 'blur' },
            ],
        }
    }
},
    async created() {
        let context = this;
        UserService.getProfile().then(function(profile) {
            context.profile = profile;
            if (profile.finder) context.activeFinder = false;
            if (profile.loaner) context.activeLoaner = false;
        }).catch(function(err) {
        console.log(err);
    });
    },
    methods: {
        async editProfile() {
            let context = this;
             console.log('Edit Profile');
            console.log(this.profile);
            this.$refs['profile'].validate((valid) => {
                if (valid) {
                    console.log('le formulaire');
                    console.log(context.profile);
                    UserService.updateUser(context.profile).then(function(result) {
                        console.log(result);
                        context.$message.success(result);
                    }).catch(function(err) {
                        console.log(err);
                        context.$message.warning(err);
                });
            } else {
                context.$message.warning(`Veuillez remplir correctement le formulaire`);
            }
            });
        },
        async editPassword() {
             let context = this;
             console.log('Edit Password');
            console.log(this.password);
            this.$refs['password'].validate((valid) => {
                if (valid) {
                    console.log('le mot de passe');
                    console.log(context.password);
                    UserService.changePassword(context.password).then(function(result) {
                        console.log(result);
                        context.$message.success(result);
                    }).catch(function(err) {
                        console.log(err);
                        context.$message.warning(err);
                });
            } else {
                context.$message.warning(`Veuillez remplir correctement le formulaire`);
            }
            });
        },
         toFormat (date) {
          let mom = moment(date);
          return mom.format('DD/MM/YYYY');
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