<template>
<div>
    <nav-component></nav-component>
    <BreadcrumpComponent v-bind:field1="{title: 'Mes annonces', path: '/myads'}" ></BreadcrumpComponent>
    <el-container style="height: 100vh;">
        <el-main>
    <!-- <el-row>
        <el-col :span="5" style="margin-bottom:50px;">
            <span class="add__furnit__title">VOS ANNONCES</span>
        </el-col>
        <el-col :span="15" style="margin-bottom:50px;">
  
        </el-col>
    </el-row> -->
            <el-row style="margin-top:5vh;font-size:14px;">
                <el-col :span="18" :offset="3">
                    <div>
                        <!-- <h4>
                            Vos annonces à pourvoir <el-tag :type="typeOfQuantity" size="mini" style="margin-left: 15px;">{{ quantity }}</el-tag>
                        </h4> -->
                        <div style="border-bottom: 1px solid #1E969D;color: #1E969D;margin-bottom:10px;">
                            <span class="title font-17">VOS ANNONCES A POURVOIR</span>
                        </div>
                        <div class="block">
                        <div v-for="(ft, index) in furnits" v-bind:key="index">
                            <el-row class="pointer green" style="padding: 2px;margin-bottom:2vh;height: 11vh;">
                                <el-col  class="full_height" :span="24">
                                    <el-card class="m-b-5 card" :body-style="{ padding: '2px', height: '11vh'}">
                                        <el-col class="full_height" :span="4">
                                            <div class="full_height" style="background-color: #D6DCDD;">
                                                <el-image v-if="url[index] !== 'null'"
                                                    class="pointer full_height"
                                                    :src="url[index]"
                                                    fit="contain">
                                                </el-image>
                                            </div>
                                        </el-col>
                                        <el-col :span="5" :offset="1">
                                            <div style="margin-top: 20px;"><span class= "pointer">{{ ft.name.toUpperCase() }}</span></div>
                                        </el-col>
                                        <el-col :span="6" :offset="1">
                                            <div style="margin-top: 20px;justify-content:center; font-style:italic;color: #1E969D;">
                                                <time class="time"> {{ toFormat(ft.loanstart) }}</time> - 
                                                <time class="time">
                                                    <!-- <i class="el-icon-minus"></i>  -->
                                                {{ toFormat(ft.loanend) }}</time>
                                    
                                            </div>
                                        </el-col>
                                        <el-col class="flex column" :span="6" :offset="1" style="height:100%;">
                                            <!-- <div class="m-auto">
                                                <time class="time"> Mensualité 0 €/mois</time>
                                            </div> -->
                                            <!-- <div class="m-auto flex">
                                                <el-button icon="el-icon-view" size="mini" type="primary" class="button cursor" plain @click="details(ft._id)">Consulter</el-button>
                                                <el-button icon="el-icon-edit" size="mini" type="success" class="button cursor" plain @click="edit(ft._id)">Editer</el-button>
                                            </div> -->
                                             <div class="m-auto">
                                                <el-button icon="el-icon-view" size="mini" type="primary" class="button cursor opacity screen_small" circle @click="details(ft._id)"></el-button>
                                                <el-button icon="el-icon-edit" size="mini" type="success" class="button cursor opacity screen_small" circle @click="edit(ft._id)"></el-button>
                                                
                                                
                                                <!-- <el-button icon="el-icon-view" type="primary" class="button cursor opacity screen_small"  size="mini" circle @click="details(rt, 0)"></el-button> -->
                                            </div>
                                        </el-col>
                                    </el-card>
                                </el-col>
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
import BreadcrumpComponent from './../Utils/BreadcrumpComponent';
import FooterComponent from './../Footer/FooterComponent';
import FurnitService from './../../Service/FurnitService';
import moment from 'moment';

export default {
  name: 'MyAdsComponent',
  components: { NavComponent, FooterComponent, BreadcrumpComponent },
  data() {
      return {
          furnits: {},
          url: [],
          activeNames: [],
          quantity: 0,
          typeOfQuantity: null
      }
  },
  methods: {
      toFormat (date) {
          let mom = moment(date);
          return mom.format('DD MMMM YYYY');
      },
    details(id) {
        this.$router.push({ name: 'Furnit',  params: { id: id } });
    },
    edit(id) {
        this.$router.push({ name: 'Editfurnit',  params: { furnit_id: id } });
    },
    //   async deleteFurnit (fn) {
    //       let id = fn._id;
    //       await FurnitService.deleteFurnit(id);
    //       this.furnitures = await FurnitService.getFurnitures();
    //       await FurnitService.deleteFile(fn);
          
    //   }
  },
  computed: {
    },
  async created() {
    let context = this;
    console.log('RentalService getRentals');
    FurnitService.getFurnitsFromRenter().then(function(furnits) {
        console.log('FURNITS');
        console.log(furnits);
        context.furnits = furnits.furnits;
       context.url = furnits.imgUrl;
      console.log(context.furnits);
      console.log(context.url);
      context.quantity = Object.keys(context.furnits).length;
      context.quantity > 0 ? context.activeNames.push('1'): '';
      context.quantity > 0 ? context.typeOfQuantity = 'primary'  : context.typeOfQuantity = 'danger';

    // let picture_ids = new Array();
    // context.rentals.forEach(function(ft){
    //     console.log(ft);
    //     if (ft.furnit[0].picture_ids.length > 0) picture_ids.push(ft.furnit[0].picture_ids[0]);
    // });
    // console.log('PICIDS');
    // console.log(picture_ids);
    // if (picture_ids.length > 0) {
    //     FurnitService.getImagesUrlFromPicIds(picture_ids).then(function(urls) {
    //         context.url = urls;
    //         console.log(urls);
    //         }).catch(function(err) {
    //         console.log(err);
    //     });
    // }
    }).catch(function(err) {
        console.log(err);
    });
    }
}
</script>

<style lang="scss" scoped>

// @import "./../../style/element-variables.scss";


.card {
    height: 11vh;
}

.card:hover {
    opacity: 0.85;
    border: 1px solid grey;
    font-weight:bold;
}

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

.el-image img {
    max-height: 100px;
}


// .el-card.box-card{
//     height: 90px;
// }

.title{
   color: #1E969D;
}

.el-card.is-always-shadow{
    box-shadow: none;
}

</style>