<template>
    <div>
        <nav-component></nav-component>
         <BreadcrumpComponent v-if="loaner" v-bind:field1="{title: 'Mes meubles', path: '/myrentals'}" :field2="{title: display, path: '/myrentals/' + display }"></BreadcrumpComponent>
          <BreadcrumpComponent v-else :field1="{title: 'Mes locations', path: '/myrentals'}" :field2="{title: display, path: '/myrentals/' + display }"></BreadcrumpComponent>
        <el-container style="height: 100vh;">
            <el-main>
                <div class="m-auto" style="width: 25vw;">
                    <el-button type="primary" size="mini" plain @click="display = 'Demands'">Demandes de location</el-button>
                    <el-button type="success" size="mini" plain @click="display = 'Locations'">Les locations</el-button>
                </div>
                <el-row style="margin-top:5vh;font-size:14px;">
                    <el-col :span="18" :offset="3">
                        <div v-if="display === 'Demands'">
                            <h4>
                                <span v-if="!loaner">En demande de location </span><span v-else>Vos demandes de location </span> <el-tag type="primary" size="mini" style="margin-left: 15px;">{{quantity[0]}}</el-tag>
                            </h4>
                            <div class="block">
                            <el-row v-if="proposition_id" style="height:90px;padding: 10px;margin-bottom:7px;">EEE
                                <el-card  class="m-b-5" style="height:90px;padding: 2px;border:1px solid grey;color:white;background-color:#1E969D;border-radius: 5px;">
                                    <el-form label-position="top" label-width="80px">
                                        <el-col class="full_height" :span="4">
                                            <div class="full_height" style="background-color: #D6DCDD;max-height: 100px;">
                                                <el-image
                                                    v-if="furnit_proposition"
                                                    class="pointer full_height"
                                                    :src="furnit_proposition.imgUrl[0]"
                                                    fit="contain">
                                                </el-image>
                                            </div>
                                        </el-col>
                                               
                                        <el-col :span="10" :offset="1">
                                            <div style="margin-top: 10px;">
                                                <span>Proposition de location</span>
                                                <el-form-item label="">
                                                    <el-date-picker
                                                        v-model="dateProposition"
                                                        type="daterange"
                                                        range-separator="au"
                                                        start-placeholder="Début"
                                                        end-placeholder="Fin"
                                                        format="dd/MM/yyyy"
                                                        size="mini">
                                                    </el-date-picker>
                                                </el-form-item>
                                            </div>
                                        </el-col>

                                        <el-col class="flex column" :span="6" :offset="3" style="margin-top: 20px;border-left: 1px solid rgb(223, 224, 230);">
                                            <div class="m-auto">
                                                <time class="time"> Mensualité {{ furnit_proposition.price }} €/mois</time>
                                            </div>
                                            <div class="m-auto">
                                                <el-button icon="el-icon-success" size="mini" type="essai" class="button cursor" @click=makeAnOffer()>Proposer</el-button>
                                            </div>
                                        </el-col>
                                    </el-form>
                                </el-card>
                            </el-row>

                            <div v-for="(rt, index) in rentals" :key="index">
                                <el-row class="pointer" v-if="rt.totalDemands || rt.totalDemandsAccepted || rt.totalLoansNonConfirmed || rt.totalLoansConfirmedRecently" style="height:90px;padding: 10px;margin-bottom:7px;">
                                        <el-card class="opacity m-b-5" :body-style="{ padding: '2px', height: '90px'}">
                                            <el-col class="full_height" :span="4" >
                                                <div class="full_height" style="background-color: #D6DCDD;max-height: 100px;">
                                                    <el-image
                                                        class="pointer full_height"
                                                        :src="imgUrl[index]"
                                                        fit="contain">{{imgUrl[index]}}
                                                    </el-image>
                                                </div>
                                             </el-col>
                                            <el-col :span="5" :offset="1">
                                                <div style="margin-top: 20px;"><span class= "pointer" style="font-weight:bold;">{{ rt.furnit[0].name }}</span></div>
                                            </el-col>
                                            <el-col :span="6" :offset="1">
                                                <div v-if="loaner" style="margin-top:20px;">
                                                    <div v-if="rt.totalDemands">
                                                        <span> Vous avez fait une demande</span>
                                                    </div>
                                                    <div v-if="rt.totalDemandsAccepted">
                                                        <span>Votre demande a été acceptée. Confirmez-la pour valider la location</span>
                                                    </div>
                                                </div>
                                                <div v-else style="margin-top:20px;">
                                                    <div >
                                                        <span> {{rt.totalDemands}} proposition(s)</span>
                                                    </div>
                                                    <div>
                                                        <span> {{rt.totalDemandsAccepted}} proposition(s) en attente de confirnation</span>
                                                    </div>
                                                    <div v-if="rt.totalLoansNonConfirmed">
                                                        <span> {{rt.totalLoansNonConfirmed}} demande(s) non confirmée(s)</span>
                                                    </div>
                                                      <div v-if="rt.totalLoansConfirmedRecently">
                                                        <span> {{rt.totalLoansConfirmedRecently}} proposition(s) confirmée(s) récemment</span>
                                                    </div>
                                                </div>
                                            </el-col>
                                            <el-col class="flex column" :span="4" :offset="2" style="border-left: 1px solid rgb(223, 224, 230);margin-top: 30px;">
                                                <div class="m-auto">
                                                    <el-button icon="el-icon-view" size="mini" type="primary" class="button cursor opacity" @click="details(rt, 0)">Consulter</el-button>
                                                </div>
                                            </el-col>
                                        </el-card>
                                   
                                </el-row>
                            </div>
                            </div>
                        </div>

                        <div v-if="display === 'Locations'">
                            <h4>
                                En location<el-tag type="primary" size="mini" style="margin-left: 15px;">{{quantity[1]}}</el-tag>
                            </h4>
                            <div class="block">
                            <div v-for="(rt, index) in rentals" v-bind:key="index">
                                <el-row v-if="rt.totalLoansConfirmed || rt.totalLoansFinished" style="height:90px;padding: 10px;margin-bottom:7px;">
                                    <el-card class="opacity m-b-5" :body-style="{ padding: '2px', height: '90px'}">
                                        <el-col class="full_height" :span="4" >
                                            <div class="full_height" style="background-color: #D6DCDD;max-height: 100px;">
                                                <el-image
                                                    class="pointer full_height"
                                                    :src="imgUrl[index]"
                                                    fit="contain">
                                                </el-image>
                                            </div>
                                        </el-col>
                                        <el-col :span="5" :offset="1">
                                            <div style="margin-top: 20px;"><span class= "pointer" style="font-weight:bold;">{{ rt.furnit[0].name }}</span></div>
                                        </el-col>
                                        <el-col :span="4" :offset="1">
                                            <div style="margin-top:20px;">
                                                <div>
                                                    <span> {{rt.totalLoansConfirmed}} location(s) prévue(s)</span>
                                                </div>
                                                <div>
                                                    <span> {{rt.totalLoansFinished}} location(s) terminée(s)</span>
                                                </div>
                                            </div>
                                        </el-col>
                                        <el-col class="flex column" :span="6" :offset="2" style="border-left: 1px solid rgb(223, 224, 230);margin-top: 20px;">
                                            <div class="m-auto">
                                                <el-button icon="el-icon-view" size="mini" type="primary" class="button cursor opacity" @click="details(rt, 1)">Consulter</el-button>
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
import { mapGetters } from 'vuex';
import * as Formats from './../../utils/format.js'

export default {
  name: 'MyRentalsComponent',
  components: { NavComponent, FooterComponent, BreadcrumpComponent },
  data() {
      return {
          display: this.$route.params.display,
          proposition_id: this.$route.params.furnit_id,
          rentals: [],
          imgUrl: {},
          quantity: [0, 0],
          dateProposition: ['', ''],
          furnit_proposition: null,
          picture_ids: []
      }
  },
  methods: {
      format (date) {
          return Formats.toFormat(date);
      },
      async makeAnOffer () {
          let context = this;
          let new_rental = {};
          new_rental.furnit_id = this.proposition_id;
          new_rental.loaner_id = this.id;
          new_rental.renter_id = this.furnit_proposition.furnit.owner_id;
          new_rental.loan_start = this.dateProposition[0];
          new_rental.loan_end = this.dateProposition[1];
          new_rental.status = 1;
          new_rental.paid = false;
          RentalService.postRental(new_rental).then(function(rt) {
              console.log('Retour de postRental');
              console.log(rt.rental);
              rt.rental.totalDemands = 1;
              rt.rental._id = rt.rental.furnit_id;
              rt.rental.furnit = [];
              rt.rental.furnit[0] = context.furnit_proposition.furnit;
              let index = Object.keys(context.imgUrl).length;
              context.imgUrl[index] = context.furnit_proposition.imgUrl[0];
             context.rentals.push(rt.rental);
             context.proposition_id = null;
          }).catch(function(err) {
              console.log(err);
          }) 
      },
      displayThisRental() {

      },
    details(rt, isLocation) {
        if (this.loaner) {
            console.log('rt.rental_id');
            console.log(rt.rental_id);
            this.$router.push({ name: 'Rental',  params: { rental_id: rt.rental_id, isLocation: isLocation} })
        } else {
            this.$router.push({ name: 'Rental',  params: { furnit_id: rt._id, isLocation: isLocation} })
        }
        
    },
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
        FurnitService.getIdentityCardFurnit(this.proposition_id).then(function(fnt) {
            console.log('Le meuble de la demande de location:');
            console.log(fnt);
            context.furnit_proposition = fnt;
        }).catch(function(err) {
            console.log(err);
        });
    }
    
    RentalService.getStatisticsForRentals(this.loaner).then(function(rentals) {
        console.log('getStatisticsForRentals =>');
        // console.log(rentals);
        context.rentals = rentals.rentals;
        // if (context.loaner) context.rentals = rtls.filter(rt => rt.status !== -2);
        // if (!context.loaner) context.rentals = rtls.filter(rt => rt.status !== -1);
        console.log(context.rentals);
        let index = context.rentals.length;
        let i = 0;
        context.rentals.forEach(function(rt){
            console.log('RT');
            console.log(rt);
            context.quantity[0] = context.quantity[0] + rt.totalDemands + rt.totalDemandsAccepted + rt.totalLoansConfirmedRecently;
            context.quantity[1] = context.quantity[1] + rt.totalLoansConfirmed + rt.totalLoansNonConfirmed;
            if (rt.furnit[0].picture_ids.length > 0) {
                context.picture_ids.push(rt.furnit[0].picture_ids[0]);
            }
        if (i === index - 1) {
            FurnitService.getImagesUrlFromPicIds(context.picture_ids).then(function(urls) {
                console.log('URL');
                console.log(urls);
                context.imgUrl = urls.imgUrl;
            }).catch(function(err) {
                console.log(err);
            });
        }
        i++;
    });
        }).catch(function(err) {
            console.log(err);
        });
    }
}
</script>



<style lang="scss" scoped>

@import "./../../style/element-variables.scss";

.el-image img {
    max-height: 100px;
}

</style>