<template>
    <el-container>
        <nav-component :displayTitles="true"></nav-component>
        <el-container>
            <el-header>
                 <el-row style="width: 100%;height: 8vh;margin-top:2vh;">
              <el-col :span="8" :offset="8">
                    <el-form class="select" ref="furniture" name="furniture"  :inline="true" :model="furniture" :rules="rulesFurniture" enctype="multipart/form-data">
                         <el-input placeholder="Entrez un meuble" v-model="furniture.name" class="input-with-select">
                            <el-select placeholder="Ville" v-model="furniture.city" slot="prepend">
                                <el-option label="Paris" value="Paris"></el-option>
                                <el-option label="Lyon" value="Lyon"></el-option>
                                <el-option label="Lille" value="Lille"></el-option>
                            </el-select>
                            <el-button class="red" slot="append" icon="el-icon-search" @click="submit"></el-button>
                        </el-input>
                    </el-form>
                </el-col>
            </el-row>
            </el-header>
            <el-main style="max-height:220vh;margin-left: 10vw;">
               <el-row  :gutter="6" style="width: 100%;">
                    <el-col v-for="(fnt, index) in furnits" v-bind:key="index" :span="5" style="margin-top:5px;">
                        <el-card class="">
                      
                    
                        <!-- <div class="center" style="">
                            <time class="time"> {{ toFormat(fnt.loanstart)}} - {{ toFormat(fnt.loanend) }}</time>
                        </div> -->
                        <el-row>
                            <div style="background-color: #D6DCDD">
                                <img class="img pointer opacity" :src="imgUrl[index]">
                            </div>
                        </el-row>
                        <!-- <el-row class="center">
                            <el-badge class="item">
                                <el-button size="mini">{{ fnt.city }}</el-button>
                            </el-badge>
                        </el-row> -->
                        <div class="center" style="padding: 5px;">
                            <span style="font-size:12px;padding:3px;">{{ fnt.name }}</span>
                            <div class="bottom clearfix">
                                <time  style="font-size:12px;float:left;margin-top: 4px;" class="time">{{ toFormat(fnt.loanstart)}} - {{ toFormat(fnt.loanend) }}</time>
                                <el-tag type="primary" size="mini" style="float: right">{{ fnt.city }}</el-tag>
                            </div>
                        </div>
                      
                        </el-card>
                    </el-col>
            </el-row>
            </el-main>
        </el-container>
        <div style="text-align:center;margin-top:10vh;">

        <el-pagination
        :page-size="20"
        :pager-count="11"
        layout="prev, pager, next"
        :total="1000">
        </el-pagination>
         </div>
         
        <el-footer class="flex" style="background-color:#cfccc4; height: 200px;">
            <div class="margin-auto lendle" style="width:40vh;line-height:40px;font-size:40px;color:black;">Lendle</div>
            <el-main style="font-size:12px;">
                <el-row>
                    <el-col :span="6">
                        <span class="pointer">Accueil</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="pointer">Trouver les emprunteurs</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="pointer">Trouver les prêteurs</span>
                    </el-col>
                </el-row>
                   <el-row>
                    <el-col :span="6">
                        <span class="pointer">Prêter des meubles</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="pointer">Trouver les prêteurs</span>
                    </el-col>
                    <el-col :span="6">
                         <span class="pointer">Mon compte</span>
                    </el-col>
                </el-row>
                   <el-row>
                    <el-col :span="6">
                         <span class="pointer">Trouver des meubles</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="pointer">FAQ</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="pointer">Contact</span>
                    </el-col>
                </el-row>
            </el-main>
        </el-footer>
    </el-container>
</template>


<script>
import NavComponent from './NavComponent';
// import FooterComponent from './FooterComponent';
import FurnitService from '../FurnitService';
import moment from 'moment';

export default {
  name: 'SearchComponent',
  components: { NavComponent },
  data() {
      return {
        furniture: {
            name: '',
            city: '',
        },
        furnits: [],
        imgUrl: [],
        rulesFurniture: {
            name: [
            { required: true, message: 'Sélectionner un meuble', trigger: 'blur' },
            { min: 3, max: 40, message: 'Plus de 2 lettres svp', trigger: 'blur' }
            ],
            city: [
            { required: true, message: 'Sélectionnez une ville', trigger: 'change' }
            ],
        }
  }
  },
  async created() {
    if (this.$route.params && this.$route.params.furniture && this.$route.params.furniture.name) this.furniture.name = this.$route.params.furniture.name;
    if (this.$route.params && this.$route.params.furniture && this.$route.params.furniture.city) this.furniture.city = this.$route.params.furniture.city;
    let context = this;
    console.log(this.furniture);
    FurnitService.getFurnit(this.furniture).then(function(furn) {
      console.log('result');
      console.log(furn);
      context.furnits = furn.furnits;
      context.imgUrl = furn.imgUrl;
    }).catch(function(err) {
        console.log(err);
    });
  },
    methods: {
        async submit () {
            this.$refs['furniture'].validate((valid) => {
              if (!valid) {
                console.log('error submit!!')
              return false
             }
             console.log('valider');
            //  let context = this;
              FurnitService.getFurnit(this.furniture).then(function(furnits) {
                console.log('FURNITURE');
                console.log(furnits);
                // context.$router.push({ name: 'ProfileComponent' });
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

<style>

/* .el-button{
    PADDING:
} */

.el-card__body {
    padding: 0px !important;
}

.img{
    display:block;
    margin:auto;
    height: 20vh;
    max-width: 16vw;
    cursor: pointer;
}

.center{
    text-align: center;
}

.title{
    color: #851922;
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

.el-input-group__prepend{
    width: 26%;
}

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