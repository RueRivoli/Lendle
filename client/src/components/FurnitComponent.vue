<template>
    <div>
     <nav-component :displayTitles="true"></nav-component>
        <el-container style="height:680px;">
            <el-main style="width:100%">
                  <el-form label-position="left" label-width="120px" >
                       <el-col :span="10" style="">
                        <el-row style="font-size:18px;margin-bottom: 5vh;font-weight:bold;">
                            <span>{{furnit.name }}</span>
                          
                         </el-row>
                       
                                <el-carousel trigger="click" height="30vh">
                                    <el-carousel-item  class="opacity" v-for="(img, index) in imgUrl" :key="index">
                                <!-- <div style="background-color: #D6DCDD"> -->
                                        <h3 class="small">
                                            <el-image class="imgcarousel"
                                                :src="imgUrl[index]"
                                                fit="contain"
                                                @click="display(fnt)">
                                            </el-image>
                                        </h3>
                            <!-- </div> -->
                                    </el-carousel-item>
                                    
                                </el-carousel>
                                <el-row style="margin-top:5vh;">
                                    <el-form-item label="Disponibilité">
                                        <el-date-picker
                                            readonly
                                            v-model="date"
                                            type="daterange"
                                            range-separator="au"
                                            start-placeholder="Début"
                                            end-placeholder="Fin"
                                            format="dd/MM/yyyy"
                                            size="mini"
                                            :picker-options="readonly"
                                            :default-value="[furnit.loanstart, furnit.loanend]">
                                            </el-date-picker>
                                    </el-form-item>
                                </el-row>
                                <el-row>
                            
                                </el-row>
                        </el-col>
                      
                            <el-col :span="8" :offset="3" style="">
                                <el-row>
                                     <h4>{{furnit.price}} €/MOIS</h4>
                                    <tag-component state="furnit.state"></tag-component>
                                </el-row>

                                <el-row>
                                     <!-- <el-form-item label="Propriétaire">
                                     <el-input
                                        size="mini"
                                        type="textarea"
                                        :rows="2"
                                        :placeholder="owner"
                                        :disabled="true">
                                    </el-input>
                                </el-form-item> -->
                               <h4>Le propriétaire</h4>
                               <i class="el-icon-user-solid">
                               <span style="font-size:14px;margin-right:30px;">{{furnit.owner[0].firstname}}</span>
                               </i>
                                <i class="el-icon-location">
                               <span style="font-size:14px;">
                                   {{furnit.owner[0].city}}</span>
                                   </i>
                                </el-row>
                                 <el-row>
                                       <h4>Description</h4>
                                       <p style="font-size:14px">{{ furnit.description}}</p>
                                     <!-- <el-form-item label="Description">
                                     <el-input
                                        size="mini"
                                        type="textarea"
                                        :rows="4"
                                        :placeholder="furnit.description"
                                        :disabled="true">
                                        </el-input>
                                       </el-form-item> -->
                                 
                                </el-row>
                                 <el-row>
                                        <i class="el-icon-truck">
                                        <span style="font-size:14px;margin-left:10px;">Livraison possible par le propriétaire</span>
                                </i>
                                 </el-row>
                            </el-col>
                           
                     
                         <el-row style="margin-top:5vh;">
                              <el-col :span="10" style="">
                                
                            </el-col>
                        </el-row>
                            <el-row style="margin-top:30px;">
                                <el-form :inline="true" style="text-align:center;margin-top:20px;">
                                <el-form-item>
                                    <el-button size="small" value="submit" type="primary" @click="contact">Faire une demande de location</el-button>
                                </el-form-item>
                                 <el-form-item>
                                    <el-button size="small" value="submit" type="success" @click="contact">Contacter le propriétaire</el-button>
                                </el-form-item>
                                </el-form>
                            </el-row>
                         </el-form>
                    
            </el-main>
        </el-container>
        <footer-component></footer-component>
    </div>
</template>

<script>
import NavComponent from './Navigation/NavComponent';
import TagComponent from './Utils/TagComponent';
import FurnitService from '../FurnitService';
import './../style/style.css';
import FooterComponent from './Footer/FooterComponent';

export default {
  name: 'FurnitComponent',
  components: { NavComponent, FooterComponent, TagComponent },
  data() {
    return {
      furnit: { state: 0 },
      dialogImageUrl: '',
      file: null,
    //   furnit: '',
      date: [],
      imgUrl: '',
    }
  },
  computed: {
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
    FurnitService.getIdentityCardFurnit(this.$route.params.id).then(function(furn) {
      console.log('result');
      console.log(furn);
      context.furnit = furn.furnit;
      let a = furn.furnit.loanstart;
      let b = furn.furnit.loanend;
      context.date = [a, b];
      context.imgUrl = furn.imgUrl;
    //   context.numberFurnits = furn.furnits.length;
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
      },
      contact () {
          console.log('contact');
          console.log(this.furnit._id);
          console.log(this.furnit.owner_id);
           this.$router.push({ name: 'Chat', params: { furnit_id: this.furnit._id, interlocutor_id: this.furnit.owner_id } });
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
