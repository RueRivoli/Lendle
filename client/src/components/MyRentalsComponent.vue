<template>
<div>
    <nav-component  @search="search" style="border-bottom: 1px solid #dfe0e6"></nav-component>
 <el-container style="height: 100vh;">
    <el-main>
    <el-row>
        <el-col :span="5" style="margin-bottom:50px;">
            <span class="add__furnit__title">VOS MEUBLES</span>
        </el-col>
        <el-col :span="15" style="margin-bottom:50px;">
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="16" :offset="7">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="En location" name="1">
                <div v-for="(rt, index) in rentals" v-bind:key="index">
            <el-row class="pointer opacity" v-if="rt.inprocess" style="height:90px;padding: 10px;margin-bottom:7px;">
            <el-col  :span="24" style="height: 100%;">
             <el-card class="box-card opacity" :body-style="{ padding: '2px', height: '90px'}">
                 <!-- <el-col :span="5" >
                   <img v-if="url.imgurl && url.imgurl[index]" class="image pointer opacity" :src="url.imgurl[index]">
                   <img v-else class="image pointer opacity" src="../assets/gris.jpg">
                </el-col> -->
                <el-col class="full_height" :span="4" >
                 <div class="full_height" style="background-color: #D6DCDD;max-height: 100px;">
                                <!-- <img class="img pointer opacity" :src="imgUrl[index]"> -->
                    <el-image
                        class="pointer full_height"
                        :src="url.imgurl[index]"
                        fit="contain">
                    </el-image>
                </div>
                </el-col>
                <el-col :span="5" :offset="1">
                    <div style="margin-top: 20px;"><span class= "pointer opacity" style="font-weight:bold;">{{ rt.furnit[0].name }}</span></div>
                </el-col>
                <el-col :span="4" :offset="1">
                    <div style="margin-top: 20px;">
                        <time class="time"> <i class="el-icon-d-arrow-right"></i> {{ toFormat(rt.loan_end) }}</time>
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
            <el-collapse-item title="Locations terminées" name="2">
                
                <div v-for="(rt, index) in rentals" v-bind:key="index">
                <el-row class="pointer opacity"  v-if="!rt.inprocess"  style="height:90px;padding: 10px;margin-bottom:7px;">
                    <el-col  :span="24" style="height: 100%;">
                        <el-card class="box-card opacity" :body-style="{ padding: '2px', height: '90px'}">
                            <el-col class="full_height" :span="4" >
                            <div class="full_height" style="background-color: #D6DCDD;max-height: 100px;">
                                            <!-- <img class="img pointer opacity" :src="imgUrl[index]"> -->
                                <el-image
                                    class="pointer full_height"
                                    :src="url.imgurl[index]"
                                    fit="contain">
                                </el-image>
                            </div>
                            </el-col>
                            <el-col :span="5" :offset="1">
                                <div style="margin-top: 20px;"><span class= "pointer opacity" style="font-weight:bold;">{{ rt.furnit[0].name }}</span></div>
                            </el-col>
                            <el-col :span="4" :offset="1">
                                <div style="margin-top: 20px;">
                                    <time class="time"> <i class="el-icon-d-arrow-left"></i> {{ toFormat(rt.loan_end) }}</time>
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
  </div>
</template>


<script>
import NavComponent from './Navigation/NavComponent';
import RentalService from '../RentalService';
import FurnitService from '../FurnitService';
import moment from 'moment';

export default {
  name: 'MyRentalsComponent',
  components: { NavComponent },
  data() {
      return {
          rentals: {},
          url: [],
          activeNames: ['1']
      }
  },
  methods: {
      toFormat (date) {
          let mom = moment(date);
          return mom.format('DD MMMM YYYY');
      },
    details(id) {
        this.$router.push({ name: 'Rental',  params: { id: id } });
    },
    search(value) {
          console.log('SEARCH');
          console.log(value);
          let furniture = {
              word: value
          }
          this.$router.push({ name: 'Search',  params: { furniture } });
      }
    //   async deleteFurnit (fn) {
    //       let id = fn._id;
    //       await FurnitService.deleteFurnit(id);
    //       this.furnitures = await FurnitService.getFurnitures();
    //       await FurnitService.deleteFile(fn);
          
    //   }
  },
  computed: {
        renter () {
            return this.$store.getters.GET_AUTH && !this.$store.getters.GET_LOAN;
        },
        loaner () {
            return this.$store.getters.GET_AUTH && this.$store.getters.GET_LOAN;
        }
    },
  async created() {
    let context = this;
    console.log('RentalService getRentals');
    RentalService.getRentals(this.loaner).then(function(rentals) {
        console.log('RENTALS');
        console.log(rentals);
      context.rentals = rentals.rentals;
      console.log(context.rentals);
    let picture_ids = new Array();
    context.rentals.forEach(function(rt){
        console.log(rt);
        if (rt.furnit[0].picture_ids.length > 0) picture_ids.push(rt.furnit[0].picture_ids[0]);
    });
    console.log('PICIDS');
    console.log(picture_ids);
    if (picture_ids.length > 0) {
        FurnitService.getImagesUrlFromPicIds(picture_ids).then(function(urls) {
            context.url = urls;
            console.log(urls);
            }).catch(function(err) {
            console.log(err);
        });
    }
    }).catch(function(err) {
        console.log(err);
    });
    }
}
</script>

<style lang="scss" scoped>

@import "./../style/element-variables.scss";


.box-card{
    margin-bottom: 5px;
}

.image{
    display: block;
    /* height: 100px; */
    /* width: 100%; */
    height: 100px;
    max-width: 128px;
    float:left;
    border-radius: 4px;
}

.opacity:hover{
    opacity: 0.8;
}

.el-image img {
    max-height: 100px;
}

.el-image:hover{
    opacity: 0.8;
}

// .el-card.box-card{
//     height: 90px;
// }
</style>