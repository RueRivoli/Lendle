<template>
<div>
    <nav-component :displayTitles="true"></nav-component>
    <BreadcrumpComponent v-bind:field1="{title: 'Meubles', path: '/search'}" v-bind:field2="{title: furnit.name + ' ' + furnit._id , path: '/furniture/' + furnit._id}"></BreadcrumpComponent>
    <el-container style="min-height: 70vh;">
        <el-main style="width:100%;margin:auto;">
            <el-dialog title="Profile incomplet" :visible.sync="dialogProfileVisible" width="50%">
                <span>Votre profil est incomplet. Pour demander une location, remplissez les champs suivants:</span>
                <div v-for="(fd, ind) in fieldsMissings" :key="ind">
                    <span>{{fd}}</span>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogProfileVisible = false">Annuler</el-button>
                    <el-button type="primary" @click="fillProfile">Compléter le profil</el-button>
                </span>
            </el-dialog>
            <el-dialog title="Autre proposition existante" :visible.sync="dialogOtherPropositionVisible" width="50%">
                <span> Vous avez déjà fait une proposition pour ce meuble-ci.</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogOtherPropositionVisible = false">Annuler</el-button>
                    <el-button type="primary" @click="handlePropositions()">Gérer vos propositions de location</el-button>
                </span>
            </el-dialog>
            <el-row>
                <el-col :span="11" :offset="1">
                    <el-row style="font-size:18px;margin-bottom: 5vh;">
                        <BigTitleComponent :text="furnit.name" />
                    </el-row>

                    <el-carousel trigger="click" height="30vh">
                        <el-carousel-item class="opacity" v-for="(img, index) in imgUrl" :key="index">
                            <h3 class="small">
                                <el-image class="imgcarousel" :src="imgUrl[index]" fit="contain" @click="display(fnt)">
                                </el-image>
                            </h3>
                        </el-carousel-item>
                    </el-carousel>
                    <el-row style="margin-top:5vh;">
                        <el-form>
                            <el-form-item label="Disponibilité">
                                <el-date-picker readonly v-model="date" type="daterange" range-separator="au" start-placeholder="Début" end-placeholder="Fin" format="dd/MM/yyyy" size="mini" :picker-options="readonly" :default-value="[furnit.loanstart, furnit.loanend]">
                                </el-date-picker>
                            </el-form-item>
                        </el-form>
                    </el-row>
                    <!-- <el-row style="margin-top:30px;" v-if="loaner">
                        <el-form :inline="true" style="text-align:left;">
                            <el-form-item>
                                <el-button v-if="authentificated" size="mini" value="submit" type="danger" round @click="makeAnOffer">
                                    Faire une demande de location
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-row> -->
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-row>
                        <!-- <h4>{{furnit.price}} €/MOIS</h4> -->
                          <span style="float:left;">{{furnit.price}} €/MOIS</span>
                        <tag-component state="furnit.state" style="float:right;"></tag-component>
                        <!-- <span style="float:right;">{{furnit.state}}</span> -->
                    </el-row>
                    <el-row style="margin-top:5vh;">
                        <TitleComponent text="Le propriétaire" />
                        <el-card class="pointer description" style="padding: 5px;height:8vh;line-height:8vh;color:white;">
                            <span style="margin-right:10px;float:left;">
                                <avatar-component :name="nameOwner(furnit)" :size="40"></avatar-component>
                            </span>
                            <span style="padding:3px;float:center;">
                                <span style="font-size:14px;">{{nameOwner(furnit)}}</span>
                            </span>
                            <span :class="{'f-right': !loaner, 'f-center': loaner }" style="padding:3px;">
                                <span style="font-size:14px;">{{markOwner(furnit)}}</span>
                            </span>
                            <span style="padding:3px;float:right;" v-if="loaner">
                                <el-button v-if="authentificated" size="mini" type="success" value="submit" @click="contact" round>Contacter</el-button>
                            </span>

                        </el-card>
                    </el-row>
                    <el-row style="margin-top:5vh;">
                          <TitleComponent text="Description" />
                        <p style="font-size:14px">{{ furnit.description}}</p>
                    </el-row>
                    <el-row>
                        <i class="el-icon-truck">
                            <span style="font-size:14px;margin-left:10px;">Livraison possible par le propriétaire</span>
                        </i>
                    </el-row>
                </el-col>
            </el-row>

            <!-- <el-row style="margin-top:5vh;">
                <el-col :span="10" style="">

                </el-col>
            </el-row> -->
                 <el-row style="margin-top:30px;" v-if="loaner">
                     <el-col :span="6" :offset="1">
                        <el-form :inline="true" style="text-align:left;">
                            <el-form-item>
                                <el-button v-if="authentificated" icon="el-icon-arrow-right" size="small" value="submit" type="danger" round @click="makeAnOffer">
                                    Faire une demande de location
                                </el-button>
                            </el-form-item>
                        </el-form>
                        </el-col>
                    </el-row>
        </el-main>
    </el-container>
    <footer-component></footer-component>
</div>
</template>

<script>
import NavComponent from '../Navigation/NavComponent';
import TagComponent from '../Utils/TagComponent';
import FurnitService from '../../Service/FurnitService';
import BreadcrumpComponent from './../Utils/BreadcrumpComponent';
import UserService from '../../Service/UserService';
import RentalService from '../../Service/RentalService';
import './../../style/style.css';
import FooterComponent from '../Footer/FooterComponent';
import AvatarComponent from './../Utils/AvatarComponent';
import TitleComponent from './../Utils/TitleComponent';
import BigTitleComponent from './../Utils/BigTitleComponent';
import {
    mapGetters
} from 'vuex'

export default {
    name: 'FurnitComponent',
    components: {
        NavComponent,
        FooterComponent,
        AvatarComponent,
        TagComponent,
        BreadcrumpComponent,
        TitleComponent,
        BigTitleComponent
    },
    data() {
        return {
            furnit: {
                state: 0
            },
            dialogProfileVisible: false,
            dialogOtherPropositionVisible: false,
            fieldsMissings: [],
            file: null,
            date: [],
            imgUrl: ''
        }
    },
    computed: {
        ...mapGetters({
            loaner: 'GET_LOAN',
            id: 'GET_ID',
            authentificated: 'GET_AUTH'
        }),
        stateOfFurnit: function () {
            if (this.furnit.state === 100) return "Excellent état";
            if (this.furnit.state === 75) return "Bon état";
            if (this.furnit.state === 50) return "Etat correct";
            if (this.furnit.state === 25) return "Etat délicat";
            return "Bon état";
        },
        owner: function () {
            if (this.furnit && this.furnit.owner && this.furnit.owner[0]) {
                return this.furnit.owner[0].firstname + ', ' + this.furnit.owner[0].city;
            }
            return '';
        }
    },
    async created() {
        let context = this;
        // console.log(this.furniture);
        FurnitService.getIdentityCardFurnit(this.$route.params.id).then(function (furn) {
            console.log('result');
            console.log(furn);
            context.furnit = furn.furnit;
            let a = furn.furnit.loanstart;
            let b = furn.furnit.loanend;
            context.date = [a, b];
            context.imgUrl = furn.imgUrl;
            //   context.numberFurnits = furn.furnits.length;
        }).catch(function (err) {
            console.log(err);
        });
    },
    methods: {
        fillProfile() {
            this.$router.push({
                name: 'ProfileComponent',
                fields: this.fieldsMissings
            });
        },
        handlePropositions() {
            this.$router.push({
                path: '/myrentals/0'
            });
        },
        readonly() {
            return true;
        },
        avatar(usr) {
            if (usr && usr[0].profilePicture) return usr[0].profilePicture
            else return '../assets/twitter.svg'
        },
        nameOwner(ft) {
            console.log('name Owner');
            console.log(ft);
            if (ft.owner) {
                if (ft.owner[0].username) return ft.owner[0].username;
                else {
                    return ft.owner[0].firstname + ' ' + ft.owner[0].lastname;
                }
            } else {
                return '';
            }
        },
        markOwner(ft) {
            console.log('mark Owner');
            console.log(ft);
            if (ft.owner) {
                if (ft.owner[0].mark) return ft.owner[0].mark + ' / 5';
                else {
                    return '? / 5';
                }
            } else {
                return '? / 5';
            }
        },
        formatTooltip(val) {
            return val / 100;
        },
        contact() {
            this.$router.push({
                name: 'Chat',
                params: {
                    furnit_id: this.furnit._id,
                    interlocutor_id: this.furnit.owner_id
                }
            });
        },
        makeAnOffer() {
            console.log('MAKE AN OFFER');
            console.log(this.furnit._id);
            let context = this;
            UserService.getIfProfileComplete(this.loaner).then(function (result) {
                if (result.complete) {
                    RentalService.existOtherRentalForThatFurnit(context.furnit._id, context.id).then(function (result) {
                        console.log('RESULT');
                        console.log(result);
                        if (result.count !== 0) {
                            console.log('IN');
                            context.dialogOtherPropositionVisible = true;
                            context.fieldsMissings = [];
                        } else {
                            context.$router.push({
                                name: 'MyRentals',
                                params: {
                                    furnit_id: context.furnit._id,
                                    display: 0
                                }
                            });
                        }
                    }).catch();
                } else {
                    context.dialogProfileVisible = true;
                    context.fieldsMissings = result.fields;
                }
            }).catch(function (err) {
                console.log(err);
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
// .el-form-item__label{
//   padding: 0px !important;
//   line-height: 10px !important;
// }

.title{

}
.description{
    font-family: Jazz LET;
    background-color: #1E969D;
    background-image: linear-gradient(90deg, rgba(255,255,255,.07) 50%, transparent 50%),
    linear-gradient(90deg, rgba(255,255,255,.13) 50%, transparent 50%),
    linear-gradient(90deg, transparent 50%, rgba(255,255,255,.17) 50%),
    linear-gradient(90deg, transparent 50%, rgba(255,255,255,.19) 50%);
    background-size: 13px, 29px, 37px, 53px;
}

.el-card__body {
    display: flex !important;
}

.el-header,
.el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.imgcarousel {
    height: 30vh;
    cursor: pointer;
    background-color: #D6DCDD;
}

.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    line-height: 30vh;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}

.el-image {
    display: block !important;
    margin: auto !important;
}

.el-card.pointer {
    cursor: pointer;
}

.el-form-item {
    margin-bottom: 2px !important;
}

.el-form--label-top .el-form-item__label {
    padding: 0px !important;
}

.el-button--danger {
    color: #851922;
    background-color: white !important;
    // border-color: #851922;
}

</style>
<style>

</style>
