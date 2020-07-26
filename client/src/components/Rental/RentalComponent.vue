<template>
    <div>
      <nav-component></nav-component>
        <el-container style="height:85vh;">
            <el-main style="width:100%"> 
                  <el-form label-position="top" label-width="80px">
                       <el-col :span="10" style="">
                        <el-row style="font-size:18px;margin-bottom: 5vh;font-weight:bold;">
                            <span><span>{{rental.furnit[0].name}}</span></span>
                         </el-row>
                                <el-carousel trigger="click" height="30vh">
                                    <el-carousel-item  v-for="(img, index) in url" :key="index">
                                <!-- <div style="background-color: #D6DCDD"> -->
                                        <h3 class="small">
                                            <el-image class="imgcarousel"
                                                :src="img"
                                                fit="contain"
                                                >
                                            </el-image>
                                        </h3>
                            <!-- </div> -->
                                    </el-carousel-item>
                                </el-carousel>
                                <el-row style="margin-top:5vh;">
                                    <el-form-item label="Période de disponibilité">
                                     
                                        <el-date-picker
                                            v-model="dateDisponibility"
                                            type="daterange"
                                            range-separator="au"
                                            start-placeholder="Début"
                                            end-placeholder="Fin"
                                            format="dd/MM/yyyy"
                                            size="mini"
                                            :picker-options="readonly"
                                            :disabled="true">
                                            </el-date-picker>
                                    </el-form-item>
                                </el-row>
                        </el-col>
                            <el-col :span="8" :offset="3" style="">
                                <el-row v-if="isLoaner && rental.status == 0">
                                   <h4>Votre proposition de location</h4>
                                   <div v-if="!editMode">

                                        <p>Du {{ format(dateStart) }} Au {{ format(dateEnd) }}</p>
                                        <p>
                                            Statut: En attente de réponse
                                        </p>  
                                        <el-button type="success" size="mini" plain @click="editMode = true">Editer</el-button>
                                            <el-button type="danger" size="mini" plain @click="cancelRental">Annuler la demande</el-button>
                                   </div>
                                   <div v-else>
                                   <el-form-item label="Période de location">
                                     
                                        <el-date-picker
                                            v-model="dateRental"
                                            type="daterange"
                                            range-separator="au"
                                            start-placeholder="Début"
                                            end-placeholder="Fin"
                                            format="dd/MM/yyyy"
                                            size="mini"
                                            >
                                            </el-date-picker>
                                    </el-form-item>
                                     <el-button type="success" size="mini" plain @click="modifyRental">Modifier</el-button>
                                    <el-button type="warning" size="mini" plain @click="editMode = false">Revenir</el-button>
                                   </div>
                                     <el-table
                                        :data="tableData"
                                        style="width: 100%">
                                        <el-table-column
                                            prop="date"
                                            label="Date"
                                            width="180">
                                        </el-table-column>
                                    </el-table>
                                </el-row>

                                <!-- <el-row>
                                     <el-form-item label="Prix">
                                        <el-input
                                            type="primary"
                                            placeholder="0€/mois"
                                            size="mini"
                                            :disabled="true">
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item :label="stateOfFurnit">
                                        <el-slider v-model="rental.furnit[0].state" :step="25"
                                            show-stops :format-tooltip="formatTooltip" :disabled="true"></el-slider>
                                    </el-form-item>
                                </el-row> -->

                                <!-- <el-row v-if="isLoaner">
                                     <el-form-item  label="Propriétaire">
                                     <el-input
                                        size="mini"
                                        type="textarea"
                                        :rows="2"
                                        :placeholder="owner"
                                        :disabled="true">
                                    </el-input>
                                    </el-form-item>

 
                                </el-row>
                                 <el-row v-else>
                                     <el-form-item  label="Locataire">
                                     <el-input
                                        size="mini"
                                        type="textarea"
                                        :rows="2"
                                        :placeholder="loaner"
                                        :disabled="true">
                                    </el-input>
                                    </el-form-item>
                                </el-row>

                                 <el-row>
                                     <el-form-item label="Description">
                                     <el-input
                                        size="mini"
                                        type="textarea"
                                        :rows="4"
                                        :placeholder="rental.furnit[0].description"
                                        :disabled="true">
                                        </el-input>
                                       </el-form-item>
                                 
                                </el-row> -->
                                
                            </el-col>
                          <!-- <el-row>
                                <el-form :inline="true">
                                    <el-form-item>
                                        <el-button size="mini" value="submit" type="success" @click="contact">Contacter le locataire</el-button>
                                    </el-form-item>
                                </el-form>
                            </el-row> -->

                         </el-form>
            </el-main>
        </el-container>
         <footer-component></footer-component>
    </div>
</template>

<script>
import NavComponent from './../Navigation/NavComponent';
import FooterComponent from './../Footer/FooterComponent';
import RentalService from './../../Service/RentalService';
import FurnitService from './../../Service/FurnitService';
import './../../style/style.css';
const toFormat = require('./../../utils/format');

export default {
  name: 'RentalComponent',
  components: { NavComponent, FooterComponent },
  data() {
    return {
                  tableData: [{
            date: '2016-05-03',
            name: 'Tom',
            address: 'No. 189, Grove St, Los Angeles'
          }, {
            date: '2016-05-02',
            name: 'Tom',
            address: 'No. 189, Grove St, Los Angeles'
          }, {
            date: '2016-05-04',
            name: 'Tom',
            address: 'No. 189, Grove St, Los Angeles'
          }, {
            date: '2016-05-01',
            name: 'Tom',
            address: 'No. 189, Grove St, Los Angeles'
          }],
      rental_id: this.$route.params.id,
      rental: {},
      url: {},
      dateStart: '',
      dateEnd: '',
      dateDisponibility: [],
      dateRental: [],
      editMode: false
    }
  },
  computed: {
    stateOfFurnit: function () {
        if (this.rental.furnit && this.rental.furnit[0].state === 100) return "Excellent état";
        if (this.rental.furnit && this.rental.furnit[0].state === 75) return "Bon état";
        if (this.rental.furnit && this.rental.furnit[0].state === 50) return "Etat correct";
        if (this.rental.furnit && this.rental.furnit[0].state === 25) return "Etat délicat";
        return "Bon état";
    },
    owner: function () {
        if (this.rental.owner && this.rental.owner[0]) {
            return this.rental.owner[0].firstname + ' ' + this.rental.owner[0].lastname + ' \u000A' + this.rental.owner[0].address + ', ' + this.rental.owner[0].postcode + ' ' + this.rental.owner[0].city;
        }
        return '';
    },
    loaner: function () {
        if (this.rental.loaner && this.rental.loaner[0]) {
            return this.rental.loaner[0].firstname + ' ' + this.rental.loaner[0].lastname + ' \u000A' + this.rental.loaner[0].address + ', ' + this.rental.loaner[0].postcode + ' ' + this.rental.loaner[0].city;
        }
        return '';
    },
    renter () {
        return this.$store.getters.GET_AUTH && !this.$store.getters.GET_LOAN;
    },
    isLoaner () {
        return this.$store.getters.GET_AUTH && this.$store.getters.GET_LOAN;
    }
},
 async created() {
    let context = this;
    RentalService.getRentalById(this.$route.params.id, this.isLoaner).then(function(rental) {
      console.log('result');
      console.log(rental);
      context.rental = rental.rental;
      console.log(context.rental);
      context.dateStart = context.rental.loan_start;
      context.dateEnd = context.rental.loan_end;
      context.dateRental = [context.dateStart, context.dateEnd];
      context.dateDisponibility = [context.rental.furnit[0].loanstart, context.rental.furnit[0].loanend];
      console.log(context.date);
     let picture_ids = context.rental.furnit[0].picture_ids;
     console.log(picture_ids);
     if (picture_ids && picture_ids.length > 0) {
        FurnitService.getImagesUrlFromPicIds(picture_ids).then(function(urls) {
            context.url = urls.imgUrl;
            console.log(context.url);
            }).catch(function(err) {
            console.log(err);
        });
    }
    }).catch(function(err) {
        console.log(err);
    });
  },
  methods: {
    format (date) {
        return toFormat(date);
    },
    async modifyRental ()
    {
        let context = this;
        this.rental.loan_start = this.dateRental[0];
        this.rental.loan_end = this.dateRental[1];
        this.dateStart = this.dateRental[0];
        this.dateEnd = this.dateRental[1];
        this.dateRental = [this.dateRental[0], this.dateRental[1]];
        this.editMode = false;
        console.log('Rental to be modified');
         console.log(this.rental);
          RentalService.updateRental(this.rental).then(function(rt) {
            console.log('Update rental');
            console.log(rt.rental);
            context.rental = rt.rental;
            // context.dateStart = rt.rental.loan_start;
            // context.dateEnd = rt.rental.loan_end;
            // context.dateRental = [rt.rental.loan_start, rt.rental.loan_end];
            //   context.editMode = false;
            //   rt.rental.furnit = [];
            //   rt.rental.furnit[0] = context.furnit_proposition.furnit;
            //   let index = Object.keys(context.imgUrl).length;
            //   context.imgUrl[index] = context.furnit_proposition.imgUrl[0];
            //  context.rentals.push(rt.rental);
            //  context.proposition_id = null;
          }).catch(function(err) {
              console.log(err);
          }) 
    },
    readonly () {
          return true;
    },
    formatTooltip(val) {
        return val/100;
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

.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}


.imgcarousel{
    height: 30vh;
    cursor: pointer;
    background-color: #D6DCDD;
}


  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
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


.el-form-item{
    margin-bottom: 2px !important;
}

.el-form--label-top .el-form-item__label{
    padding: 0px !important;
}

</style>
<style>


</style>
