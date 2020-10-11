<template>
<div>
    <nav-component></nav-component>
    <BreadcrumpComponent v-if="loaner" v-bind:field1="{title: 'Mes meubles', path: '/myrentals'}" :field2="{title: typeofRental ? 'Locations' : 'Propositions', path: '/myrentals/' + typeofRental }"></BreadcrumpComponent>
    <BreadcrumpComponent v-else :field1="{title: 'Mes locations', path: '/myrentals'}" :field2="{title: typeofRental ? 'Locations' : 'Propositions', path: '/myrentals/' + typeofRental }"></BreadcrumpComponent>
    <el-container>
        <el-main style="margin-top: 4vh;">
            <div class="m-auto" style="width: 353px;">
                <el-switch v-model="typeofRental" :width="40" active-text="LOCATIONS" inactive-text="PROPOSITIONS DE LOCATION" size="mini">
                </el-switch>
            </div>
            <el-row style="margin-top:5vh;font-size:14px;">
                <el-col :span="18" :offset="3">
                    <div v-if="typeofRental === false">
                        <!-- <div style="border-bottom: 1px solid #1E969D;color: #1E969D;margin-bottom:10px;"> -->
                            <!-- <span class="title font-17" v-if="!loaner">PROPOSITIONS DE LOCATION</span>
                            <span class="title font-17" v-else>VOS PROPOSITIONS DE LOCATION</span> -->
                            <TitleComponent text="propositions de locations" v-if="!loaner"/>
                            <TitleComponent text="vos propositions de locations" v-else/>
                            <!-- <el-tag type="primary" size="mini" style="margin-left: 15px;">{{quantity[0]}}</el-tag> -->
                            <!-- <span style="float:right;margin-right:15vh;font-weight:bold;font-style:18px;">{{quantity[0]}}</span> -->
                        <!-- </div> -->
                        <div class="block">
                            <el-row v-if="proposition_id" style="margin-bottom:7px;">
                                <el-card class="m-b-5 card" style="padding: 2px;border:1px solid grey;color:white;background-color:#1E969D;border-radius: 5px;margin-top:2vh;">
                                    <el-form label-position="top" label-width="80px">
                                        <el-col class="full_height" :span="4">
                                            <div class="full_height" style="background-color: #D6DCDD;">
                                                <el-image v-if="furnit_proposition" class="pointer full_height" :src="furnit_proposition.imgUrl[0]" fit="contain"></el-image>
                                            </div>
                                        </el-col>

                                        <el-col :span="12" :offset="1">
                                            <div style="margin-top: 10px;">
                                                <span>Proposition de location</span>
                                                <el-form-item label="">
                                                    <el-date-picker v-model="dateProposition" type="daterange" range-separator="au" start-placeholder="Début" end-placeholder="Fin" format="dd/MM/yyyy" size="mini">
                                                    </el-date-picker>
                                                </el-form-item>
                                            </div>
                                        </el-col>

                                        <el-col class="flex column" :span="5" :offset="2" style="margin-top: 20px;border-left: 1px solid rgb(223, 224, 230);">
                                            <!-- <div class="m-auto">
                                                <time class="time"> Mensualité {{ furnit_proposition.price }} €/mois</time>
                                            </div> -->
                                            <div class="m-auto">
                                                <el-button icon="el-icon-success" size="mini" type="essai" class="button cursor" @click="makeAnOffer()">Proposer</el-button>
                                            </div>
                                        </el-col>
                                    </el-form>
                                </el-card>
                            </el-row>
                            <div v-for="(rt, index) in rentals" :key="index" v-loading="loading">
                                <el-row class="pointer" v-if="displayInList(rt)" style="padding: 2px;margin-bottom:2vh;height: 11vh;">
                                    <el-card class="m-b-5 card" :body-style="{ padding: '2px', height: '11vh'}">
                                        <el-col class="full_height" :span="4">
                                            <div class="full_height" style="background-color: #D6DCDD;">
                                                <el-image class="pointer full_height" :src="imgUrl[index]" fit="contain">{{imgUrl[index]}}
                                                </el-image>
                                            </div>
                                        </el-col>
                                        <el-col class="name" :span="6" :offset="1">
                                            <div style="display:table;height:11vh;">
                                                <span class="pointer" style="font-size:15px;display:table-cell;vertical-align:middle;">
                                                    {{ rt.furnit[0].name.toUpperCase() }}
                                                </span>
                                            </div>
                                        </el-col>
                                        <el-col class="flex column full_height state_demand" :span="10" :offset="1" style="justify-content:center; font-style:italic">
                                            <div v-if="loaner">
                                                <div v-if="rt.totalDemands">
                                                    <span style="color: #1E969D;">Une demande a été envoyée au propriétaire</span>
                                                </div>
                                                <div v-if="rt.totalDemandsAccepted">
                                                    <span style="color: #666633;">Une demande a été acceptée. Confirmez-la pour valider la location</span>
                                                </div>
                                                <div v-if="rt.totalLoansConfirmedRecently">
                                                    <span style="color: #4287f5">Vous avez conclu une location récemment.</span>
                                                </div>
                                                <div v-if="rt.totalLoansRefusedByRenter">
                                                    <span style="color: purple;">Une demande a été refusée</span>
                                                </div>
                                            </div>
                                            <div v-else>
                                                <div>
                                                    <span style="color: #1E969D;">{{rt.totalDemands}} proposition(s)</span>
                                                </div>
                                                <div>
                                                    <span style="color: #666633;"> {{rt.totalDemandsAccepted}} proposition(s) en attente de confirnation</span>
                                                </div>
                                                <div v-if="rt.totalLoansRefusedByLoaner">
                                                    <span style="color: purple;"> {{rt.totalLoansRefusedByLoaner}} demande(s) annulée(s)</span>
                                                </div>
                                                <div v-if="rt.totalLoansConfirmedRecently">
                                                    <span style="color: #86b300"> {{rt.totalLoansConfirmedRecently}} location(s) conclue(s) récemment</span>
                                                </div>
                                            </div>
                                        </el-col>
                                        <el-col class="flex column" :span="2" :offset="0" style="height:100%;">
                                            <div class="m-auto">
                                                <!-- <el-button icon="el-icon-view" size="mini" type="primary" class="button cursor opacity screen_big" @click="details(rt, 0)">Consulter</el-button> -->
                                                <el-button icon="el-icon-view" type="primary" class="button cursor opacity screen_small"  size="mini" circle @click="details(rt, 0)"></el-button>
                                            </div>
                                        </el-col>
                                    </el-card>
                                </el-row>
                            </div>
                        </div>
                    </div>

                    <div v-if="typeofRental === true">
                            <TitleComponent text="en location"/>
                        <div class="block" v-loading="loading">
                            <div v-for="(rt, index) in rentals" v-bind:key="index">
                                <el-row class="pointer" v-if="rt.totalLoansConfirmed || rt.totalLoansFinished" style="padding: 2px;margin-bottom:2vh;height: 11vh;">
                                    <el-card class="opacity m-b-5 card_height" :body-style="{ padding: '2px', height: '11vh'}">
                                        <el-col class="full_height" :span="4">
                                            <div class="full_height" style="background-color: #D6DCDD;">
                                                <el-image v-if="imgUrl[index]" class="pointer full_height" :src="imgUrl[index]" fit="contain"></el-image>
                                                <el-image v-else class="pointer full_height" src="./../../assets/table.png" fit="contain">
                                                </el-image>
                                            </div>
                                        </el-col>
                                        <el-col :span="6" :offset="1">
                                            <div style="display:table;height:11vh;">
                                              <span class="pointer" style="font-size:15px;display:table-cell;vertical-align:middle;">
                                                    {{ rt.furnit[0].name.toUpperCase() }}
                                                </span>
                                            </div>
                                        </el-col>
                                        <el-col class="flex column full_height" :span="10" :offset="1" style="justify-content:center;font-style:italic">
                                            <div>
                                                <div>
                                                    <span style="color: #1E969D;"> {{rt.totalLoansConfirmed}} location(s) prévue(s)</span>
                                                </div>
                                                <div>
                                                    <span style="color: #666633;"> {{rt.totalLoansFinished}} location(s) terminée(s)</span>
                                                </div>
                                            </div>
                                        </el-col>
                                        <el-col class="flex column" :span="2" :offset="0" style="height:100%;">
                                            <div class="m-auto">
                                                <!-- <el-button icon="el-icon-view" size="mini" type="primary" class="button cursor opacity" @click="details(rt, 1)">Consulter</el-button> -->

                                                <el-button icon="el-icon-view" type="primary" class="button cursor opacity screen_small"  size="mini" circle @click="details(rt, 0)"></el-button>
                                            </div>
                                        </el-col>
                                    </el-card>
                                </el-row>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
    <footer-component></footer-component>
</div>
</template>

<script>
import NavComponent from './../Navigation/NavComponent';
import RentalService from './../../Service/RentalService';
import BreadcrumpComponent from './../Utils/BreadcrumpComponent';
import FurnitService from './../../Service/FurnitService';
import FooterComponent from './../Footer/FooterComponent';
import TitleComponent from './../Utils/TitleComponent';

import {
    mapGetters
} from 'vuex';
const moment = require('moment');
import * as Formats from './../../utils/format.js'

export default {
    name: 'MyRentalsComponent',
    components: {
        NavComponent,
        FooterComponent,
        BreadcrumpComponent,
        TitleComponent
    },
    data() {
        return {
            typeofRental: this.$route.params.display || false,
            proposition_id: this.$route.params.furnit_id,
            rentals: [],
            imgUrl: {},
            quantity: [0, 0],
            dateProposition: ['', ''],
            furnit_proposition: null,
            picture_ids: [],
            loading: true
            /*             typeofRental: 0 */
        }
    },
    methods: {
        format(date) {
            return Formats.toFormat(date);
        },
        price(start, end, price) {
            let a = moment(start);
            let b = moment(end);
            return b.diff(a, 'month') * price;
        },
        async makeAnOffer() {
            let context = this;
            let new_rental = {};
            new_rental.furnit_id = this.proposition_id;
            new_rental.loaner_id = this.id;
            new_rental.renter_id = this.furnit_proposition.furnit.owner_id;
            new_rental.loan_start = this.dateProposition[0];
            new_rental.loan_end = this.dateProposition[1];
            new_rental.price = this.price(this.dateProposition[0], this.dateProposition[1], this.furnit_proposition.price);
            RentalService.postRental(new_rental).then(function (rt) {
                console.log('Retour de postRental');
                console.log(rt.rental);
                context.proposition_id = null;
                context.getStatistics();
            }).catch(function (err) {
                console.log(err);
            })
        },
        displayInList(rt) {
            if (this.loaner) {
                if (rt.totalDemands || rt.totalDemandsAccepted || rt.totalLoansConfirmedRecently || rt.totalLoansRefusedByRenter) return true
                else return false
            } else {
                if (rt.totalDemands || rt.totalDemandsAccepted || rt.totalLoansConfirmedRecently || rt.totalLoansRefusedByLoaner) return true
                else return false
            }
        },
        details(rt, isLocation) {
            if (this.loaner) {
                console.log('rt.rental_id');
                console.log(rt);
                this.$router.push({
                    path: `/rental/${rt._id}/${isLocation}`
                })
            } else {
                //this.$router.push({ name: 'Rental',  params: { furnit_id: rt._id, isLocation: isLocation} })
                this.$router.push({
                    path: `/rental/${rt._id}/${isLocation}`
                })
            }
        },
        getStatistics() {
            let context = this;
            RentalService.getStatisticsForRentals(this.loaner).then(function (rentals) {
                console.log('getStatisticsForRentals =>');
                console.log(rentals);
                context.rentals = rentals.rentals;
                console.log(context.rentals);
                let index = context.rentals.length;
                let i = 0;
                context.picture_ids = [];
                context.rentals.forEach(function (rt) {
                    console.log('RT');
                    console.log(rt);
                    context.quantity[0] = context.quantity[0] + rt.totalDemands + rt.totalDemandsAccepted;
                    context.quantity[1] = context.quantity[1] + rt.totalLoansConfirmed;
                    if (rt.furnit[0].picture_ids.length > 0) {
                        context.picture_ids.push(rt.furnit[0].picture_ids[0]);
                    }
                    if (i === index - 1) {
                        FurnitService.getImagesUrlFromPicIds(context.picture_ids).then(function (urls) {
                            console.log('URL');
                            console.log(urls);
                            context.loading = false;
                            context.imgUrl = urls.imgUrl;
                        }).catch(function (err) {
                            console.log(err);
                        });
                    }
                    i++;
                });
            }).catch(function (err) {
                console.log(err);
            });
        }
    },
    computed: {
        ...mapGetters({
            loaner: 'GET_LOAN',
            id: 'GET_ID',
            token: 'GET_TOKEN'
        })
    },
    async created() {
        let context = this;
        console.log('RentalService getRentals');
        console.log(this.$route.params.furnit_id);
        console.log(this.$route.params.display);
        console.log(this.$route.query);
        if (this.proposition_id) {
            FurnitService.getIdentityCardFurnit(this.proposition_id).then(function (fnt) {
                console.log('Le meuble de la demande de location:');
                console.log(fnt);
                context.furnit_proposition = fnt;
            }).catch(function (err) {
                console.log(err);
            });
        }
        this.getStatistics();
    }
}
</script>

<style lang="scss" scoped>
// @import "./../../style/element-variables.scss";


.title{
   color: #1E969D;
}

.el-image img {
    max-height: 100%;
}

.card {
    height: 11vh;
}

.el-card.is-always-shadow{
    box-shadow: none;
}
// .card:hover .name{
//     opacity: 0.85;
//     color:#1E969D;
// }

.card:hover {
    opacity: 0.85;
    border: 1px solid grey;
    font-weight:bold;
}

// @media screen and (min-width: 900px) {
//     .screen_small{
//         display:none;
//     }
// }

@media screen and (max-width: 700px) {
    // .screen_big{
    //     display:none;
    // }
    .state_demand{
        font-size: 10px;
    }
    .name{
        font-size: 12px;
    }
}


</style>
