<template>
    <div>
        <nav-component></nav-component>
        <el-container style="height: 100vh;">
            <el-main>
                <el-row style="margin-top:5vh;">
                    <el-col :span="18" :offset="3">
                        <el-collapse v-model="activeNames">
                            <el-collapse-item name="1">
                                <template slot="title">
                                    En demande de location<el-tag type="primary" size="mini" style="margin-left: 15px;">{{quantity[0]}}</el-tag>
                                </template>
                                <el-row v-if="proposition_id" style="height:90px;padding: 10px;margin-bottom:7px;">
                                    <el-card  class="m-b-5 high_opacity" style="height:90px;padding: 2px;border:1px solid grey;color:white;background-color:#1E969D;border-radius: 5px;">
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
                                               
                                                    <el-col :span="9" :offset="1">
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
                                                                    size="mini"
                                                                >
                                                                </el-date-picker>
                                                            
                                                            </el-form-item>
                                                            </div>
                                                    </el-col>

                                                    <el-col class="flex column" :span="6" :offset="3" style="margin-top: 20px;border-left: 1px solid rgb(223, 224, 230);">
                                                        <div class="m-auto">
                                                            <time class="time"> Mensualité 0 €/mois</time>
                                                        </div>
                                                        <div class="m-auto">
                                                            <el-button icon="el-icon-success" size="mini" type="essai" class="button cursor" @click=makeAnOffer()>Proposer</el-button>
                                                        </div>
                                                    </el-col>
                                 
                                        </el-form>
                                    
                                    </el-card>
                                </el-row>
                  <div v-for="(rt, index) in rentals" v-bind:key="index">
                    <el-row class="opacity" v-if="rt.status === 0" style="height:90px;padding: 10px;margin-bottom:7px;">
                        <el-col :span="24" style="height: 100%;">
                            <el-card class="m-b-5 opacity" :body-style="{ padding: '2px', height: '90px'}">
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
                    <div style="margin-top: 20px;"><span class= "pointer opacity" style="font-weight:bold;">{{ rt.furnit[0].name }}</span></div>
                </el-col>
                <el-col :span="4" :offset="1">
                    <div style="margin-top: 20px;">
                        <div style="text-align:center;"><el-tag size="mini" type="warning" style="margin-right:20px;">Proposition</el-tag></div>
                    </div>
                </el-col>
                <el-col class="flex column" :span="6" :offset="2" style="border-left: 1px solid rgb(223, 224, 230);margin-top: 20px;">
                     <div class="m-auto">
                        <time class="time"> Mensualité 0 €/mois</time>
                    </div>
                    <div class="m-auto">
                        <el-button icon="el-icon-view" size="mini" type="primary" class="button cursor" @click="details(rt._id)">Consulter</el-button>
                    </div>
                </el-col>
            </el-card>
            </el-col>
                </el-row>
                </div>

                
            </el-collapse-item>
            <el-collapse-item name="2">
                <template slot="title">
                    En location<el-tag type="primary" size="mini" style="margin-left: 15px;">{{quantity[1]}}</el-tag>
                </template>
                <div v-for="(rt, index) in rentals" v-bind:key="index">
            <el-row class="opacity" v-if="rt.status === 1" style="height:90px;padding: 10px;margin-bottom:7px;">
            <el-col  :span="24" style="height: 100%;">
             <el-card class="m-b-5 opacity" :body-style="{ padding: '2px', height: '90px'}">
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
                    <div style="margin-top: 20px;"><span class= "pointer opacity" style="font-weight:bold;">{{ rt.furnit[0].name }}</span></div>
                </el-col>
                <el-col :span="4" :offset="1">
                    <div style="margin-top: 20px;">
                        <time class="time"> <i class="el-icon-d-arrow-right"></i> {{ format(rt.loan_end) }}</time>
                        <div style="text-align:center;"><el-tag size="mini" type="primary" style="margin-right:20px;">En cours</el-tag></div>
                    </div>
                </el-col>
                <el-col class="flex column" :span="6" :offset="2" style="border-left: 1px solid rgb(223, 224, 230);margin-top: 20px;">
                     <div class="m-auto">
                        <time class="time"> Mensualité 0 €/mois</time>
                    </div>
                    <div class="m-auto">
                        <el-button icon="el-icon-edit" size="mini" type="primary" class="button cursor" @click="details(rt._id)">Modifier</el-button>
                    </div>
                </el-col>
            </el-card>
            </el-col>
                </el-row>
                </div>
            </el-collapse-item>
            <el-collapse-item name="3">
                 <template slot="title">
                    Locations terminées <el-tag type="primary" size="mini" style="margin-left: 15px;">{{quantity[2]}}</el-tag>
                </template>
                <div v-for="(rt, index) in rentals" v-bind:key="index">
                <el-row class="opacity"  v-if="rt.status === 2"  style="height:90px;padding: 10px;margin-bottom:7px;">
                    <el-col  :span="24" style="height: 100%;">
                        <el-card class="m-b-5 opacity" :body-style="{ padding: '2px', height: '90px'}">
                            <el-col class="full_height" :span="4" >
                            <div class="full_height" style="background-color: #D6DCDD;max-height: 100px;">
                                            <!-- <img class="img pointer opacity" :src="imgUrl[index]"> -->
                                <el-image
                                    class="pointer full_height"
                                    :src="imgUrl[index]"
                                    fit="contain">
                                </el-image>
                            </div>
                            </el-col>
                            <el-col :span="5" :offset="1">
                                <div style="margin-top: 20px;"><span class= "pointer opacity" style="font-weight:bold;">{{ rt.furnit[0].name }}</span></div>
                            </el-col>
                            <el-col :span="4" :offset="1">
                                <div style="margin-top: 20px;">
                                    <time class="time"> <i class="el-icon-d-arrow-left"></i> {{ format(rt.loan_end) }}</time>
                                    <div style="text-align:center;"><el-tag size="mini" type="danger" style="margin-right:20px;">Terminé</el-tag></div>
                                </div>
                            </el-col>
                            <el-col class="flex column" :span="6" :offset="2" style="border-left: 1px solid rgb(223, 224, 230);margin-top: 20px;">
                                <div class="m-auto">
                                    <time class="time"> Mensualité 0 €/mois</time>
                                </div>
                                <div class="m-auto">
                                    <el-button icon="el-icon-view" size="mini" type="info" class="button cursor" @click="details(rt._id)">Détails</el-button>
                                </div>
                            </el-col>
                    </el-card>
                 </el-col>
                </el-row>
                </div>
            </el-collapse-item>
        </el-collapse>
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
import FurnitService from './../../Service/FurnitService';
import FooterComponent from './../Footer/FooterComponent';
import { mapGetters } from 'vuex';
import { toFormat } from './../../utils/format';

export default {
  name: 'MyRentalsComponent',
  components: { NavComponent, FooterComponent },
  data() {
      return {
          rentals: {},
          imgUrl: {},
          activeNames: [''],
          quantity: [0, 0, 0],
          dateProposition: ['', ''],
          proposition_id: this.$route.params.id,
          furnit_proposition: null,
          picture_ids: []
      }
  },
  methods: {
      format (date) {
          return toFormat(date);
      },
      async makeAnOffer () {
          let context = this;
          let new_rental = {};
          new_rental.furnit_id = this.proposition_id;
          new_rental.loaner_id = this.id;
          new_rental.renter_id = this.furnit_proposition.furnit.owner_id;
          new_rental.loan_start = this.dateProposition[0];
          new_rental.loan_end = this.dateProposition[1];
          new_rental.status = 0;
          new_rental.paid = false;
          RentalService.postRental(new_rental).then(function(rt) {
              console.log('Retour de postRental');
              console.log(rt.rental);
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
    details(id) {
        this.$router.push({ name: 'Rental',  params: { id: id } });
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
    if (this.proposition_id) {
        this.activeNames.push('1');
        FurnitService.getIdentityCardFurnit(this.proposition_id).then(function(fnt) {
            console.log('Le meuble de la demande de location:');
            console.log(fnt);
            context.furnit_proposition = fnt;
        }).catch(function(err) {
            console.log(err);
        });
    }
    RentalService.getRentals(this.loaner).then(function(rentals) {
      console.log('getRentals =>');
      console.log(rentals);
      context.rentals = rentals.rentals;
      let index = rentals.rentals.length;
      let i = 0;
      context.rentals.forEach(function(rt){
        console.log(rt);
        if (rt.status === 0) {
            context.activeNames.push('1');
            context.quantity[0]++;
        }
        if (rt.status === 1) {
            context.activeNames.push('2');
            context.quantity[1]++;
        }
        if (rt.status === 2) {
            context.activeNames.push('3');
            context.quantity[2]++;
        }
        if (rt.furnit[0].picture_ids.length > 0) {
            context.picture_ids.push(rt.furnit[0].picture_ids[0]);
        }
        if (i === index - 1) {
            FurnitService.getImagesUrlFromPicIds(context.picture_ids).then(function(urls) {
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