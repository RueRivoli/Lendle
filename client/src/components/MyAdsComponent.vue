<template>
<div>
    <nav-component></nav-component>
 <el-container style="height: 100vh;">
    <el-main>
    <!-- <el-row>
        <el-col :span="5" style="margin-bottom:50px;">
            <span class="add__furnit__title">VOS ANNONCES</span>
        </el-col>
        <el-col :span="15" style="margin-bottom:50px;">
  
        </el-col>
    </el-row> -->
    <el-row style="margin-top:5vh;">
        <el-col :span="18" :offset="3">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="Vos annonces à pourvoir" name="1">
                <div v-for="(ft, index) in furnits" v-bind:key="index">
            <el-row class="pointer opacity" style="height:90px;padding: 10px;margin-bottom:7px;">
            <el-col  :span="24" style="height: 100%;">
             <el-card class="box-card opacity" :body-style="{ padding: '2px', height: '90px'}">
                <el-col class="full_height" :span="4" >
                 <div class="full_height" style="background-color: #D6DCDD;max-height: 100px;">
                    <el-image v-if="url[index] !== 'null'"
                        class="pointer full_height"
                        :src="url[index]"
                        fit="contain">
                    </el-image>
                </div>
                </el-col>
                <el-col :span="5" :offset="1">
                    <div style="margin-top: 20px;"><span class= "pointer opacity" style="font-weight:bold;">{{ ft.name }}</span></div>
                </el-col>
                <el-col :span="4" :offset="1">
                    <div style="margin-top: 20px;">
                         <time class="time"> {{ toFormat(ft.loanstart) }}</time>
                        <time class="time"> <i class="el-icon-minus"></i> {{ toFormat(ft.loanend) }}</time>
            
                    </div>
                </el-col>
                <el-col class="flex column" :span="6" :offset="2" style="border-left: 1px solid rgb(223, 224, 230);margin-top: 20px;">
                     <div class="m-auto">
                        <time class="time"> Mensualité 0 €/mois</time>
                    </div>
                    <div class="m-auto">
                        <el-button icon="el-icon-edit" size="mini" type="primary" class="button cursor" @click="details(ft._id)">Modifier</el-button>
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
import NavComponent from './Navigation/NavComponent';
import FooterComponent from './Footer/FooterComponent';
import FurnitService from '../FurnitService';
import moment from 'moment';

export default {
  name: 'MyAdsComponent',
  components: { NavComponent, FooterComponent },
  data() {
      return {
          furnits: {},
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
        this.$router.push({ name: 'Ad',  params: { id: id } });
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