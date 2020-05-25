<template>
 <el-container style="height: 100vh;">
     <aside-component/>
    <el-main>
    <el-row>
      <el-col :span="24" style="margin-bottom:50px;">
         <span class="add__furnit__title">VOS MEUBLES</span>
      </el-col>
        </el-row>
        <el-row v-for="(fnt, index) in furnitures" v-bind:key="index" style="height:100px;">
            <el-col :span="24">
             <el-card class="box-card" :body-style="{ padding: '2px'}">
                 <el-col :span="5" >
                   <img v-if="url.imgurl && url.imgurl[index]" class="image pointer opacity" :src="url.imgurl[index]">
                   <img v-else class="image pointer opacity" src="../assets/gris.jpg">
                </el-col>
                <el-col :span="5" :offset="1">
                    <div style="margin-top:35px;"><span class= "pointer opacity" style="font-weight:bold;">{{ fnt.name }}</span></div>
                </el-col>
                <el-col :span="6" :offset="4">
                    <div style="margin-top:35px;">
                        <time class="time"> du {{ toFormat(fnt.loanstart)}} au {{ toFormat(fnt.loanend) }}</time>
                    </div>
                </el-col>
                <el-col :span="2" :offset="1">
                     <el-button icon="el-icon-close" size="medium" type="text" class="button cursor" style="float:right;" @click="deleteFurnit(fnt)"></el-button>
                </el-col>
            </el-card>
            </el-col>

             <!-- <el-col :span="8" v-if="url">
                <img :src="url.imgurl" alt="">
             </el-col> -->
             <!-- <el-col :span="8" >
                <span> xd </span>
             </el-col>
             <el-col :span="8">
                <span> du {{ toFormat(fnt.loanstart)}} au {{ toFormat(fnt.loanend) }}</span> -->
        
        
        </el-row>
  </el-main>
  </el-container>
</template>


<script>
import AsideComponent from './AsideComponent';
import FurnitService from '../FurnitService';
import moment from 'moment';

export default {
  name: 'MyFurnitComponent',
  components: { AsideComponent },
  data() {
      return {
          furnitures: '',
          url: [],
          methods:{
          }
      }
  },
  methods: {
      toFormat (date) {
          let mom = moment(date);
          return mom.format('DD/MM/YY');
      },
      async deleteFurnit (fn) {
          let id = fn._id;
          await FurnitService.deleteFurnit(id);
          this.furnitures = await FurnitService.getFurnitures();
          await FurnitService.deleteFile(fn);
          
      }
  },
  computed: {
  },
  async created() {
    this.furnitures = await FurnitService.getFurnitures();
    console.log(this.furnitures);
    // this.pictures = await FurnitService.getPictures();
    
    let picture_ids = new Array();
    this.furnitures.forEach(function(furn){
        if (furn.picture_ids.length > 0) picture_ids.push(furn.picture_ids[0]);
    });
    if (picture_ids.length > 0) {
        this.url = await FurnitService.getImagesUrlFromPicIds(picture_ids);
        console.log(this.url);
    }
    }
}
</script>

<style>

.box-card{
    margin-bottom:5px;
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
</style>