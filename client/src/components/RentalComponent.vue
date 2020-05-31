<template>
    <div>
      <nav-logged-component style="border-bottom: 1px solid #dfe0e6"></nav-logged-component>
        <el-container style="height:85vh;">
            <el-main style="width:100%"> 
                  <el-form label-position="top" label-width="80px">
                       <el-col :span="10" style="">
                        <el-row style="font-size:18px;margin-bottom: 5vh;font-weight:bold;">
                            <span><span>{{rental[0].furnit[0].name}}</span></span>
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
                                    <el-form-item label="Période">
                                        <el-date-picker
                                            readonly
                                            v-model="date"
                                            type="daterange"
                                            range-separator="à"
                                            start-placeholder="Début"
                                            end-placeholder="Fin"
                                            format="dd/MM/yyyy"
                                            size="mini"
                                            :picker-options="readonly"
                                            :default-value="[rental[0].loan_start, rental[0].loan_end]">
                                            </el-date-picker>
                                    </el-form-item>
                                </el-row>
                        </el-col>
                            <el-col :span="8" :offset="3" style="">
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
                                        <el-slider v-model="rental[0].furnit[0].state" :step="25"
                                            show-stops :format-tooltip="formatTooltip" :disabled="true"></el-slider>
                                    </el-form-item>
                                </el-row>

                                <el-row>
                                     <el-form-item label="Propriétaire">
                                     <el-input
                                        size="mini"
                                        type="textarea"
                                        :rows="2"
                                        :placeholder="owner"
                                        :disabled="true">
                                    </el-input>
                                </el-form-item>
                                    <el-button class="pointer" size="mini" type="primary"  style="margin-top:10px;">Contacter le loueur</el-button>
                                </el-row>
                                 <el-row>
                                     <el-form-item label="Description">
                                     <el-input
                                        size="mini"
                                        type="textarea"
                                        :rows="4"
                                        :placeholder="rental[0].furnit[0].description"
                                        :disabled="true">
                                        </el-input>
                                       </el-form-item>
                                 
                                </el-row>
                                
                            </el-col>
                           
                     
                         <el-row style="margin-top:5vh;">
                              <el-col :span="10" style="">
                                
                            </el-col>
                        </el-row>
                         </el-form>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import NavLoggedComponent from './NavLoggedComponent';
import RentalService from '../RentalService';
import FurnitService from '../FurnitService';
import './../style/style.css';
// import moment from 'moment'

export default {
  name: 'RentalComponent',
  components: { NavLoggedComponent },
  data() {
    return {
      rental_id: this.$route.params.id,
      rental: {},
      url: {},
      dialogImageUrl: '',
      file: null,
    //   furnit: '',
      date: [],
      imgUrl: '',
    }
  },
  computed: {
    // owner: function () {
    //     return 'Philip Morris, 13 rue Auguste Delone, 75013 ' + this.furnit.city;
    // },
    stateOfFurnit: function () {
        if (this.rental[0].furnit[0].state === 100) return "Excellent état";
        if (this.rental[0].furnit[0].state === 75) return "Bon état";
        if (this.rental[0].furnit[0].state === 50) return "Etat correct";
        if (this.rental[0].furnit[0].state === 25) return "Etat délicat";
        return "Bon état";
    }
},
 async created() {
    let context = this;
    RentalService.getRentalById(this.$route.params.id).then(function(rental) {
      console.log('result');
      console.log(rental);
      context.rental = rental.rental;
      console.log(context.rental[0]);
      let dateStart = context.rental[0].loan_start;
      let dateEnd = context.rental[0].loan_end;
      context.date = [dateStart, dateEnd];
     let picture_ids = context.rental[0].furnit[0].picture_ids;
     if (picture_ids && picture_ids.length > 0) {
        FurnitService.getImagesUrlFromPicIds(picture_ids).then(function(urls) {
            context.url = urls.imgurl;
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
