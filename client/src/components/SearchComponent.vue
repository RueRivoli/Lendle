<template>
    <div>
        <nav-component :displayTitles="true"></nav-component>
       
        <el-container>
            <el-header>
                 <el-row style="margin-top:2vh;margin-left: 15vw;margin-right:15vw;">
                    <el-form class="search" ref="furniture" name="furniture"  :inline="true" :model="furniture" :rules="rulesFurniture" enctype="multipart/form-data">
                    <el-row>
                         <el-col :span="3" :offset="0">
                          <el-select placeholder="Ville" v-model="furniture.city" size="mini">
                               <i class="el-icon-edit el-input__icon" slot="suffix"></i>
                                <el-option label="Paris" value="Paris"></el-option>
                                <el-option label="Lyon" value="Lyon"></el-option>
                                <el-option label="Lille" value="Lille"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="10" :offset="5">
                         <el-input placeholder="Nom" size="mini" v-model="furniture.word" class="input-with-select">
                              <i class="el-icon-search el-input__icon" slot="suffix"></i>
                            <el-select placeholder="Type" size="mini" v-model="furniture.type" slot="prepend">
                                <el-option label="Tous" value=""></el-option>
                                <el-option label="Fauteuil" value="fauteuil"></el-option>
                                <el-option label="Chaise" value="chaise"></el-option>
                                <el-option label="Canapé" value="canape"></el-option>
                                <el-option label="Frigidaire" value="frigidaire"></el-option>
                                <el-option label="Machine à laver" value="machinealaver"></el-option>
                                <el-option label="Lave vaisselle" value="lavevaisselle"></el-option>
                                <el-option label="Sèche linge" value="sechelinge"></el-option>
                                <el-option label="Table" value="table"></el-option>
                                <el-option label="Armoire" value="armoire"></el-option>
                                <el-option label="Etagère" value="etagere"></el-option>
                            </el-select>
                        </el-input>
                         </el-col>
                          </el-row>
                        <el-row style="margin-top:10px;">
                        <!-- <el-col :span="6" :offset="10">
                            <el-button type="primary" size="mini" icon="el-icon-search" @click="search">Rechercher</el-button>
                        </el-col> -->
                        </el-row>
                    </el-form>
            </el-row>
            </el-header>
            <el-main style="max-height:220vh;min-height: 55vh;margin-left: 15vw;margin-top:6vh;">
                <el-row text-align="left">
                    <span style="font-size:13px;">Meubles: {{page_indication}} {{ total }}</span>
                </el-row>
               <el-row :gutter="6" style="width: 100%;">
                    <el-col v-for="(fnt, index) in furnits_current" v-bind:key="index" :span="5" style="margin-top:5px;">
                        <el-card class="card opacity" style="height:34vh;">
                            <div style="background-color: #D6DCDD;height: 23vh;">
                                <!-- <img class="img pointer opacity" :src="imgUrl[index]"> -->
                                <el-image
                                    :src="imgUrl[fnt.order]"
                                    fit="contain"
                                    style="height: 23vh;"
                                    @click="display(fnt)">
                                </el-image>
                            </div>
                            <div class="center" style="padding: 12px;">
                                <span class="title cursor" style="font-size:12px;padding:3px;font-weight: bold;">{{ fnt.name }}</span>
                                <div class="bottom clearfix">
                                    <time  style="font-size:12px;float:left;margin-top: 4px;font-style: italic;" class="time">{{ toFormat(fnt.loanstart)}} - {{ toFormat(fnt.loanend) }}</time>
                                    <el-tag type="primary" size="mini" style="float: right">{{ fnt.city }}</el-tag>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
        <div style="text-align:center;margin:10vh;">
        <el-pagination
        background
        :page-size="page_size"
        :total="numberFurnits"
        layout="prev, pager, next"
        :current-page.sync="current_page"
        @current-change="new_page"
        >
        </el-pagination>
         </div>
        <footer-component></footer-component>
    </div>
</template>


<script>
import NavComponent from './Navigation/NavComponent';
import FooterComponent from './Footer/FooterComponent';
import FurnitService from '../FurnitService';
// import FurnitComponent from './FurnitComponent';
import moment from 'moment';

export default {
  name: 'SearchComponent',
  components: { NavComponent, FooterComponent },
  data() {
      return {
        furniture: {
            city: '',
            type: '',
            word: ''
        },
        current_page: 1,
        page_size: 4,
        numberFurnits: 0,
        furnits: [],
        imgUrl: {},
        rulesFurniture: {
        }
  }
  },
  async created() {
      this.identified = false;
    if (this.$route.params && this.$route.params.furniture && this.$route.params.furniture.type) this.furniture.type = this.$route.params.furniture.type;
    if (this.$route.params && this.$route.params.furniture && this.$route.params.furniture.city) this.furniture.city = this.$route.params.furniture.city;
    if (this.$route.params && this.$route.params.furniture && this.$route.params.furniture.word) this.furniture.word = this.$route.params.furniture.word;
    let context = this;
    console.log('THIS FURNITURE');
    console.log(this.$route.params);
    console.log(this.furniture);
    FurnitService.getFurnit(this.furniture).then(function(furn) {
      console.log('result');
      console.log(furn);
      context.furnits = furn.furnits;
      context.imgUrl = furn.imgUrl;
      context.numberFurnits = furn.furnits.length;
    //   context.total = furn.furnits.length;
    }).catch(function(err) {
        console.log(err);
    });
  },
  computed: {
      furnits_current: function () {
          console.log('CALCUL SLICE');
          console.log(this.furnits);
          if (!this.furnits || this.furnits.length === 0) return [];
          else if (this.furnits.length > 0){
              return this.furnits.slice(this.first_furnit, this.last_furnit);
          }
          else return [];
      },
    //     imgUrl_current: function () {
    //       console.log('CALCUL imgUrl');
    //       console.log(this.imgUrl);

    //       if (!this.imgUrl) return {};
    //       if (Object.keys(this.imgUrl) === 0 ) return {};
    //       else {
              
    //           return this.imgUrl.slice(this.first_furnit, this.last_furnit);
    //       }
    //       else return [];
    //   },
      first_furnit: function () {
          return (this.current_page - 1) * this.page_size;
      },
      last_furnit: function () {
          return this.first_furnit + this.page_size;
      },
     page_indication: function () {
         if (!this.numberFurnits || this.numberFurnits === 0) return "0 --> 0 sur ";
         else {
            let first = this.first_furnit + 1;
            let last = this.last_furnit;
            if (this.numberFurnits < last) last = this.numberFurnits;
            return first.toString() + " --> " + last.toString() + " sur ";
         } 
      },
      total: function () {
          if (this.numberFurnits) return this.numberFurnits;
          else return "0";
      }
  },
  watch: {
    // '$route.params.furniture' : {
    //   //Your code here
    //   handler: function(search) {
    //       console.log('HANDLER');
    //        console.log(search);
    //        let context = this;
    //        FurnitService.getFurnitWithSearch(search).then(function(furn) {
    //             console.log('result');
    //             console.log(furn);
    //             context.furnits = furn.furnits;
    //             context.imgUrl = furn.imgUrl;
    //             context.numberFurnits = furn.furnits.length;
    //         }).catch(function(err) {
    //             console.log(err);
    //         });
    //     },
    //     deep: true,
    //     immediate: true
    //   }
    'furniture.city' : {
      //Your code here
      handler: function() {
            this.searchFurnits();
        },
      },
       'furniture.type' : {
      //Your code here
      handler: function() {
            this.searchFurnits();
        },
      },
       'furniture.word' : {
      //Your code here
      handler: function() {
            this.searchFurnits();
        },
      }
    },
    methods: {
        new_page () {
            console.log('NOUVELLE PAGE');
        },
        async searchFurnits() {
            let context = this;
           console.log(this.furniture);
           FurnitService.getFurnit(this.furniture).then(function(furn) {
                console.log('result');
                console.log(furn);
                context.furnits = furn.furnits;
                console.log(furn.furnits);
                console.log(furn.imgUrl);
                context.imgUrl = furn.imgUrl;
                context.numberFurnits = furn.furnits.length;
            }).catch(function(err) {
                console.log(err);
            });
        },
        display (fnt) {
          console.log('Display');
          console.log(fnt._id);
          this.$router.push({ name:'Furnit', params: { id: fnt._id } });
        },
        async search () {
            this.$refs['furniture'].validate((valid) => {
              if (!valid) {
                console.log('error submit!!')
              return false
             }
             console.log('formulaire validé');
             let context = this;
              FurnitService.getFurnit(this.furniture).then(function(furn) {
                console.log('result');
                console.log(furn);
                context.furnits = furn.furnits;
                context.imgUrl = furn.imgUrl;
                context.numberFurnits = furn.furnits.length;
                }).catch(function(err) {
                    console.log(err);
                });
            });
        },
        toFormat (date) {
          let mom = moment(date);
          return mom.format('DD/MM/YY');
      },
    }
}

</script>

<style lang="scss">


@import "./../style/element-variables.scss";

/* .el-button{
    PADDING:
} */

// .el-card__body .img{
//     display:block;
//     margin:auto;
//     height: 20vh;
//     max-width: 16vw;
//     cursor: pointer;
// }

.search{
    // border: 1px solid rgb(223, 224, 230);
    // box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);
    // border-radius: 4px;
    padding: 8px;
}

.cursor{
    cursor: pointer;
}

.card:hover{
    color: $--color-primary;
}

.el-card__body {
    padding: 0px !important;
}



.el-input-group__prepend{
    width: 36%;
}

.center{
    text-align: center;
}

.title{
    color: #1E969D;
    text-align:center;
}

.red{
  background-color: #851922;
  border-color:#851922;
  /* cursor: pointer; */
  color: white;
}

.red:hover{
  background-color: #DB2A3B;
  border-color:#DB2A3B;
}

/* .el-select .el-input {
    width: 26%;
  } */


/* .select{
  color: red;
} */

/* .hovering:hover{
    color: white !important;
    opacity: 0.9;
} */


  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }


</style>
<style scoped>
.red, {
    color: white !important;
    border-color: #bce0e2;
    background-color: red;
}

.red:hover, .el-button:focus {
    color: red !important;
    border-color: #bce0e2;
    background-color: #e9f5f5;
}

.el-image{
    /* height: 20vh; */
    cursor: pointer;
}
</style>