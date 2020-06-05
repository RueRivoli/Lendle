<template>
    <div>
      <nav-component style="border-bottom: 1px solid #dfe0e6"></nav-component>
        <el-container style="height:85vh;">
            <el-main style="width:100%">
                  <el-form label-position="top" label-width="80px">
                            <el-row style="font-size:18px;margin-bottom: 5vh;font-weight:bold;">
                                <el-col :span="10">
                                    <span v-if="!modeEdit">{{ad.name}}</span>
                                    <span v-else>Edition</span>
                                </el-col>
                                <el-col :span="14">
                                    <el-switch
                                        v-model="modeEdit"
                                        active-color="primary"
                                        inactive-color="success"
                                        size="mini"
                                        active-text="Edition mode"
                                        inactive-text="View mode"
                                        >
                                    </el-switch>
                                 </el-col>
                            </el-row>
                         <div v-if="!modeEdit">
                             <el-col :span="10">
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
                                    <el-form-item label="Période">
                                        <el-date-picker
                                            v-model="date"
                                            type="daterange"
                                            range-separator="à"
                                            start-placeholder="Début"
                                            end-placeholder="Fin"
                                            format="dd/MM/yyyy"
                                            size="mini"
                                            :picker-options="readonly"
                                            >
                                            </el-date-picker>
                                    </el-form-item>
                                </el-row>
                                 </el-col>
                            </div>

                       
                            <el-col :span="8" :offset="3" style="">
                                <div v-if="!modeEdit">
                                <el-row>
                                     <el-form-item label="Prix">
                                        <el-input
                                            type="primary"
                                            placeholder="0€/mois"
                                            size="mini"
                                            :disabled="true">
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item :label="stateOfFurnit">
                                        <el-slider v-model="ad.state" :step="25"
                                            show-stops :format-tooltip="formatTooltip" :disabled="true"></el-slider>
                                    </el-form-item>
                                </el-row>
                                 <el-row>
                                     <el-form-item label="Description">
                                     <el-input
                                        size="mini"
                                        type="textarea"
                                        :rows="4"
                                        :placeholder="ad.description"
                                        :disabled="true">
                                        </el-input>
                                       </el-form-item>
                                 
                                </el-row>
                                 </div>
                            </el-col>
                           </el-form>
                              <div v-if="modeEdit">
                                  <el-form label-position="top" label-width="80px">
                                
                                <table style="width: 100%;">
                                    <thead>
                                        <tr>
                                            <th style="width: 10%;"></th>
                                            <th style="width: 15%"></th>
                                            <th style="width: 10%"></th>
                                             <th style="width: 10%"></th>
                                             <th style="width: 15%"></th>
                                        </tr>
                                    </thead>
                                     <tr>
                                        <td style="font-size:14px;">Nom</td>
                                        <td> 
                                            <el-form-item label="">
                                                <el-input
                                                    v-model="ad.name"
                                                    type="primary"
                                                    size="mini"
                                                    >
                                                </el-input>
                                            </el-form-item>
                                        </td>
                                        <td></td>
                                        <td style="font-size:14px;">Description</td>

                                        
                                        <td> 
                                            <el-input
                                                size="mini"
                                                type="textarea"
                                                :rows="4"
                                                v-model="ad.description"
                                                >
                                        </el-input>
                                        </td>
                                   
                                    </tr>
                                    <tr>
                                        <td style="font-size:14px;">Prix</td>
                                        <td> 
                                            <el-form-item label="">
                                            <el-input
                                                v-model="ad.price"
                                                type="primary"
                                                suffix="€/mois"
                                                size="mini"
                                                >
                                                <template slot="append">€/mois</template>
                                            </el-input>
                                            </el-form-item>
                                        </td>
                                         <td></td>
                                         <td style="font-size:14px;">Période de disponibilité</td>
                                        <td> 
                                             <el-date-picker
                                            v-model="date"
                                            type="daterange"
                                            range-separator="à"
                                            start-placeholder="Début"
                                            end-placeholder="Fin"
                                            format="dd/MM/yyyy"
                                            size="mini"
                                            :picker-options="readonly"
                                            >
                                              </el-date-picker>
                              
                                        </td>
                                    </tr>
                                      <tr>
                                        <td style="font-size:14px;">Etat</td>
                                        <td> 
                                            <el-form-item label="">
                                                <el-slider v-model="ad.state" :step="25"
                                                    show-stops :format-tooltip="formatTooltip" size="mini">
                                                </el-slider>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                     <!-- <tr>
                                        <td style="font-size:14px;">Description</td>
                                        <td> 
                                            <el-input
                                                size="mini"
                                                type="textarea"
                                                :rows="4"
                                                v-model="ad.description"
                                                >
                                        </el-input>
                                        </td>
                                    </tr> -->
                                     <!-- <tr>
                                        <td style="font-size:14px;">Période de disponibilité</td>
                                        <td> 
                                             <el-date-picker
                                            v-model="date"
                                            type="daterange"
                                            range-separator="à"
                                            start-placeholder="Début"
                                            end-placeholder="Fin"
                                            format="dd/MM/yyyy"
                                            size="mini"
                                            :picker-options="readonly"
                                            >
                                              </el-date-picker>
                              
                                        </td>
                                    </tr> -->
                                </table>
                       
                              </el-form>
                            </div>
    
            </el-main>
        </el-container>
    </div>
</template>

<script>
import NavComponent from './Navigation/NavComponent';
// import RentalService from '../RentalService';
import FurnitService from '../FurnitService';
import './../style/style.css';
// import moment from 'moment'

export default {
  name: 'AdComponent',
  components: { NavComponent },
  data() {
    return {
      furnit_id: this.$route.params.id,
      ad: {},
      url: {},
      date: [],
      modeEdit: false
    }
  },
  computed: {
    stateOfFurnit: function () {
        if (this.ad && this.ad.state === 100) return "Excellent état";
        if (this.ad && this.ad.state === 75) return "Bon état";
        if (this.ad && this.ad.state === 50) return "Etat correct";
        if (this.ad && this.ad.state === 25) return "Etat délicat";
        return "Bon état";
    },
    // owner: function () {
    //     if (this.rental.owner && this.rental.owner[0]) {
    //         return this.rental.owner[0].firstname + ' ' + this.rental.owner[0].lastname + ' \u000A' + this.rental.owner[0].address + ', ' + this.rental.owner[0].postcode + ' ' + this.rental.owner[0].city;
    //     }
    //     return '';
    // },
    // loaner: function () {
    //     if (this.rental.loaner && this.rental.loaner[0]) {
    //         return this.rental.loaner[0].firstname + ' ' + this.rental.loaner[0].lastname + ' \u000A' + this.rental.loaner[0].address + ', ' + this.rental.loaner[0].postcode + ' ' + this.rental.loaner[0].city;
    //     }
    //     return '';
    // },
    renter () {
        return this.$store.getters.GET_AUTH && !this.$store.getters.GET_LOAN;
    },
    isLoaner () {
        return this.$store.getters.GET_AUTH && this.$store.getters.GET_LOAN;
    }
},
    // watch: {
    //     modeView: function () {
    //       this.$router.push({ name: 'EditAd',  params: { id: this.furnit_id } });
    //     }
    // },
 async created() {
    let context = this;
    console.log(this.furnit_id);
    FurnitService.getIdentityCardFurnit(this.furnit_id).then(function(ft) {
      console.log('result');
      console.log(ft);
      context.ad = ft.furnit;
      context.url = ft.imgurl;
      let dateStart = context.ad.loanstart;
      let dateEnd = context.ad.loanend;
      context.date = [dateStart, dateEnd];
      console.log(context.date);
    //  let picture_ids = context.rental.furnit[0].picture_ids;
    //  console.log(picture_ids);
    //  if (picture_ids && picture_ids.length > 0) {
    //     FurnitService.getImagesUrlFromPicIds(picture_ids).then(function(urls) {
    //         context.url = urls.imgurl;
    //         console.log(context.url);
    //         }).catch(function(err) {
    //         console.log(err);
    //     });
    // }
    }).catch(function(err) {
        console.log(err);
    });
  },
  methods: {
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
