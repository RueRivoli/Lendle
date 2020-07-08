<template>
    <div>
        <nav-component></nav-component>
            <div style="height:680px;">
            <el-tabs type="border-card" style="margin-left:15vh;margin-right:15vh;margin-top:5vh;">
                <el-tab-pane>
                    <span slot="label">Profil</span>
                    <el-form  style="width:100%;" label-position="left" label-width="130px">
                        <el-row v-if="!fromSocialOauth">
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
                            <el-row v-else-if="fromSocialOauth">
                            <el-col :span="6" :offset="4">
                                <el-form-item label="Nom" prop="username">
                                    <span>{{ profile.username }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="!fromSocialOauth">
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
                                    <el-checkbox v-model="profile.loaner" disabled label="Emprunteur">Emprunteur</el-checkbox>
                                    <el-checkbox v-model="profile.renter" disabled label="Prêteur">Prêteur</el-checkbox>
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
                    
                    <el-tab-pane> <span slot="label"><i class="el-icon-edit"></i> Editer</span>
                        <el-form ref="profile" name="profile" style="width:100%;" :model="profile" :rules="rulesProfile" label-position="left" label-width="130px">
                            <el-row v-if="!fromSocialOauth">
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
                            <el-row v-if="!fromSocialOauth">
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
                            <el-row v-if="fromSocialOauth">
                                <el-col :span="7" :offset="4">
                                    <el-form-item label="Nom" prop="username">
                                        <el-input placeholder="Nom" size="mini" v-model="profile.username"></el-input>
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
                                        <el-checkbox v-if="activeLoaner" v-model="profile.loaner"  label="Emprunteur">Emprunteur</el-checkbox>
                                        <el-checkbox v-else v-model="profile.loaner" disabled label="Emprunteur">Emprunteur</el-checkbox>
                                        <el-checkbox v-if="activeRenter" v-model="profile.renter" label="Prêteur">Prêteur</el-checkbox>
                                        <el-checkbox v-else v-model="profile.renter" disabled label="Prêteur">Prêteur</el-checkbox>
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
                <el-tab-pane v-if="!fromSocialOauth"> <span slot="label"><i class="el-icon-key"></i>Changer le mot de passe</span>
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
// import VueCookies from 'vue-cookies'
import NavComponent from './Navigation/NavComponent';
import FooterComponent from './Footer/FooterComponent';
import UserService from '../UserService';
import moment from 'moment';
// import { mapGetters } from 'vuex'

export default {
  name: 'ProfileComponent',
  components: { NavComponent, FooterComponent },
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
        centerDialogVisible: false,
        activeLoaner: true,
        activeRenter: true,
        profile: {
            lastname: '',
            firstname: '',
            username: '',
            mail: '',
            address: '',
            postcode: '',
            city: '',
            renter: false,
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
            username: [
                { min: 3, max: 40, message: 'Length should be between 3 and 40', trigger: 'blur' }
            ],
            type: [
                { type: 'array', required: true, message: 'Sélectionner au moins un statut', trigger: 'change' }
            ],
            postcode: [
                { pattern: '^(?:[0-8][0-9]|9[0-8])[0-9]{3}$', message: 'Ecrivez un code postal correct', trigger: 'blur' },
            ],
            city: [
                // { pattern: '^[a-zA-Z]\s{2,30}$', message: 'Ecrivez une ville correcte', trigger: 'blur' },
            ],
        }
    }
},  beforeCreate() {
    // Register connexion to Store by Google or Fb
    // Create Cookie with token
        if (this.$route.query.token) {
            // VueCookies.set('jwt' , this.$route.query.token , "1h");
            let payload = UserService.getUserFromToken(this.$route.query.token);
            this.$store.commit('AUTH');
            this.$store.commit('ID', payload._id);
            this.$store.commit('TOKEN', this.$route.query.token);
        } 
    },
    async created() {
        let context = this;
        // let token;
        // console.log('TOKKKENNNN');
        // console.log(this.$route.query.token);
        // if (this.$route.query.token) token = this.$route.query.token
        // else {
        //     token = this.token;
        // }
        UserService.getProfile().then(function(profile) {
            context.profile = profile;
            if (profile.renter) context.activeRenter = false;
            if (profile.loaner) context.activeLoaner = false;
            //if we auth with Google or Fb
            if (context.$route.query.token) {
                if (profile.renter && profile.loaner) context.centerDialogVisible = true
                else if (!profile.renter && !profile.loaner) context.centerDialogVisible = true
                else if (profile.renter) {
                    context.$store.commit('LOANER', false);
                } else if (profile.loaner) {
                    context.$store.commit('LOANER', true);
                }
            }
        }).catch(function(err) {
        console.log(err);
    });
    },
    computed: {
    // ...mapGetters({
    //   token: 'GET_TOKEN'
    // }),
    fromSocialOauth: function () {
        return this.profile.facebookId || this.profile.googleId;
    }
    },
    methods: {
        toRent() {
             console.log('User want to be a bailer');
            this.$store.commit('LOANER', false);
             if (!this.profile.renter) {
                this.profile.renter = true;
                UserService.updateUser(this.profile);
            }
            this.centerDialogVisible = false;
        },
        toLoan() {
            console.log('User want to be a locataire');
            this.$store.commit('LOANER', true);
            if (!this.profile.loaner) {
                this.profile.loaner = true;
                UserService.updateUser(this.profile);
            }
            this.centerDialogVisible = false;
        },
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