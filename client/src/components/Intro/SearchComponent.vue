<template>
    <div>
        <nav-component :displayTitles="true"></nav-component>
        <BreadcrumpComponent :field1="{title: 'Chercher', path: '/search'}" :field2="{title: furniture.city, path: `/search`}" :field3="{title: furniture.type, path: `/search`}" :field4="{title: furniture.word, path: `/search`}"></BreadcrumpComponent>
    <el-container style="min-height:95vh;">
        <el-header>
            <el-row style="margin-top:2vh;">
                <el-form class="search" ref="furniture" name="furniture" :inline="true" :model="furniture" :rules="rulesFurniture" enctype="multipart/form-data">
                    <el-row>
                        <el-col :span="3" :offset="0">
                            <el-select placeholder="Ville" v-model="furniture.city" size="mini">
                                <i class="el-icon-edit el-input__icon" slot="suffix"></i>
                                <el-option label="Paris" value="Paris"></el-option>
                                <el-option label="Lyon" value="Lyon"></el-option>
                                <el-option label="Lille" value="Lille"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="8" :offset="6">
                            <el-input placeholder="Nom" size="mini" v-model="furniture.word">
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
            <!-- <el-row style="margin-top:2vh;margin-left: 15vw;margin-right:15vw;">
                <h4>
                    Top Catégories
                </h4>
            </el-row> -->
        </el-header>
        <div style="margin-top:6vh;padding:10px;">
             <el-row text-align="left">
                 <el-col :span="5">
                    <!-- <span style="font-size:13px;">Nbre de meubles/page: {{page_indication}}</span> -->
                    <TitleComponent text="Meubles/page" />
                    <el-radio-group :class="$mq" v-if="$mq === 'laptop' || $mq === 'desktop'" v-model="page_size" size="mini">
                       <el-radio-button label="4"></el-radio-button>
                      <el-radio-button label="8"></el-radio-button>
                      <!-- <el-radio-button label="12"></el-radio-button> -->
                      <el-radio-button label="16"></el-radio-button>
                      <el-radio-button label="20"></el-radio-button>
                      <el-radio-button label="24"></el-radio-button>
                    </el-radio-group>
                     <el-select v-if="$mq === 'mobile' || $mq === 'tablet'" v-model="page_size" placeholder="Select" size="mini">
                        <el-option key="4" label="4" value="4"></el-option>
                        <el-option key="8" label="8" value="8"></el-option>
                        <el-option key="16" label="16" value="16"></el-option>
                        <el-option key="20" label="20" value="20"></el-option>
                        <el-option key="24" label="24" value="24"></el-option>
                      </el-select>
                        <TitleComponent text="Trier par" style="margin-top:5px"/>
                        <el-form class="search" ref="order" name="order" :inline="true" :model="furniture" :rules="rulesFurniture" enctype="multipart/form-data">
                        <el-select v-model="furniture.order" placeholder="Critère" size="mini">
                            <el-option
                              v-for="item in criteriaSort"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                        </el-select>
                        </el-form>
                </el-col>
                <el-col :span="19" :offset="0" v-loading="loading">
                    <el-row>
                        <el-col :offset="1" style="font-size:13px;">
                            <span v-if="!numberFurnits || numberFurnits === 0" >Résultats: 0 <i class="el-icon-arrow-right"></i> 0 / 0</span>
                            <span v-else>Résultats: {{first_furnit + 1}} <i class="el-icon-arrow-right"></i> {{totalFurnits()}} / {{total}} </span>
                        </el-col>
                        <el-col :span="$mq | mq({mobile: 20, tablet: 7, laptop: 5, desktop: 5})" :offset="$mq | mq({mobile: 1, tablet: 1, laptop: 1, desktop: 1})" v-for="(fnt, index) in furnits_current" v-bind:key="index"  style="margin-top:5px;">
                            <div :class="{ description: hover === index, displayPicture: hover !== index }" style="height: 23vh; font-family: Jazz LET;border-radius:2px;" @mouseover="hover = index" @mouseleave="hover = null">
                                    <el-image v-if="hover !== index" :src="imgUrl[fnt.order]" fit="contain" style="height: 23vh;" @click="display(fnt)"></el-image>
                                    <div v-else style="height: 19vh; cursor: pointer;padding: 1.5vh;position:relative;" @click="display(fnt)">
                                        <span class="title" style="font-weight: bold;position:absolute;">{{ fnt.name.toUpperCase() }}</span>
                                            <span style="font-size:14px;text-align:center;position:absolute;bottom:30%;color:white;">{{ fnt.price }} €/ MOIS</span>
                                            <span style="font-size:14px;text-align:center;position:absolute;bottom:0;float:center;color:white;"> 
                                                 <i class=" el-icon-location"></i>
                                                 {{ fnt.city.toUpperCase() }}
                                           </span>
                                    </div>
                                </div>
                        </el-col>
                    
                     </el-row>
                           <div style="text-align:center;margin:2vh;">
        <el-pagination background :page-size="page_size" :total="numberFurnits" layout="prev, pager, next" :current-page.sync="current_page" @current-change="new_page"></el-pagination>
    </div>
                </el-col>
            </el-row>
           
        </div>
           
    </el-container>
    <footer-component></footer-component>
</div>
</template>

<script>
import NavComponent from './../Navigation/NavComponent';
import BreadcrumpComponent from './../Utils/BreadcrumpComponent';
import FooterComponent from './../Footer/FooterComponent';
import FurnitService from './../../Service/FurnitService';
import TitleComponent from './../Utils/TitleComponent';
import moment from 'moment';

export default {
    name: 'SearchComponent',
    components: {
        NavComponent,
        FooterComponent,
        BreadcrumpComponent,
        TitleComponent,
    },
    data() {
        return {
            furniture: {
                city: this.$route.params.city || localStorage.city || '',
                type: this.$route.params.type || localStorage.type || '',
                word: this.$route.params.word || localStorage.word || '',
                order: localStorage.order
            },
            loading: true,
            // order: '',
            criteriaSort: [{
                  value: 1,
                  label: 'Prix croissant'
                }, {
                  value: -1,
                  label: 'Prix décroissant'
                }, 
                // {
                //   value: 'startDate',
                //   label: 'Date de début'
                // }
              ],
            hover: null,
            current_page: 1,
            page_size: 8,
            numberFurnits: 0,
            furnits: [],
            imgUrl: {},
            rulesFurniture: {},
        }
    },
    mounted() {
    },
    async created() {
        console.log('This furniture');
        console.log(this.furniture);
        this.searchFurnits();
    },
    computed: {
        furnits_current: function () {
            console.log('CALCUL SLICE');
            console.log(this.furnits);
            if (!this.furnits || this.furnits.length === 0) return [];
            else if (this.furnits.length > 0) {
                return this.furnits.slice(this.first_furnit, this.last_furnit);
            } else return [];
        },
        first_furnit: function () {
            return (this.current_page - 1) * this.page_size;
        },
        last_furnit: function () {
            return this.first_furnit + this.page_size;
        },
        // page_indication: function () {
        //     if (!this.numberFurnits || this.numberFurnits === 0) return "0 --> 0 sur ";
        //     else {
        //         let first = this.first_furnit + 1;
        //         let last = this.last_furnit;
        //         if (this.numberFurnits < last) last = this.numberFurnits;
        //         return first.toString() + " --> " + last.toString() + " sur ";
        //     }
        // },
        total: function () {
            if (this.numberFurnits) return this.numberFurnits;
            else return "0";
        }
    },
    watch: {
        'furniture.city': {
            handler: function () {
                this.searchFurnits();
            },
        },
        'furniture.type': {
            handler: function () {
                this.searchFurnits();
            },
        },
        'furniture.word': {
            handler: function () {
                this.searchFurnits();
            },
        },
        'furniture.order': {
            handler: function () {
                this.searchFurnits();
            },
        }
    },
    methods: {
        totalFurnits () {
            if (this.numberFurnits < this.last_furnit) return this.numberFurnits
            else return this.last_furnit 
        },
        new_page() {
            console.log('NOUVELLE PAGE');
        },
        async searchFurnits() {
            let context = this;
            console.log(this.furniture);
            this.loading = true;
            FurnitService.getFurnit(this.furniture).then(function (furn) {
                console.log('Furnits');
                console.log(furn);
                context.furnits = furn.furnits;
                console.log(furn.furnits);
                console.log(furn.imgUrl);
                context.imgUrl = furn.imgUrl;
                context.numberFurnits = furn.furnits.length;
                context.loading = false;
            }).catch(function (err) {
                console.log(err);
            });
        },
        display(fnt) {
            console.log('Display');
            console.log(fnt._id);
            this.$router.push({
                name: 'Furnit',
                params: {
                    id: fnt._id
                }
            });
        },
        async search() {
            this.$refs['furniture'].validate((valid) => {
                if (!valid) {
                    console.log('error submit!!')
                    return false
                }
                console.log('formulaire validé');
                //  let context = this;
                this.searchFurnits();
            });
        },
        toFormat(date) {
            let mom = moment(date);
            return mom.format('DD/MM/YY');
        },
    }
}
</script>

<style lang="scss">
// @import "./../../style/element-variables.scss";

.description{
    font-family: Jazz LET;
    background-color: #1E969D;
    background-image: linear-gradient(90deg, rgba(255,255,255,.07) 50%, transparent 50%),
    linear-gradient(90deg, rgba(255,255,255,.13) 50%, transparent 50%),
    linear-gradient(90deg, transparent 50%, rgba(255,255,255,.17) 50%),
    linear-gradient(90deg, transparent 50%, rgba(255,255,255,.19) 50%);
    background-size: 13px, 29px, 37px, 53px;
}

.displayPicture{
    background-color: #D6DCDD;
}
.search {
    padding: 8px;
}

.el-card__body {
    padding: 0px !important;
}

.el-input-group__prepend {
    width: 36%;
    background-color: #1E969D;
    color:white;
}

.el-radio-group.laptop .el-radio-button__inner{
     padding: 7px 12px; 
}

.center {
    text-align: center;
}

.title {
    color: white;
    font-size:18px;
}

.red {
    background-color: #851922;
    border-color: #851922;
    color: white;
}

.red:hover {
    background-color: #DB2A3B;
    border-color: #DB2A3B;
}


.imgcarousel {
    height: 30vh;
    cursor: pointer;
    background-color: #D6DCDD;
}
</style>
<style scoped>

@media screen and (max-width: 850px) {
    .title {
        /* color: #1E969D; */
        font-size:12px;
    }
}

@media screen and (max-width: 450px) {
    .details{
      display:none;
    }
}

.red,
    {
    color: white !important;
    border-color: #bce0e2;
    background-color: red;
}

.red:hover,
.el-button:focus {
    color: red !important;
    border-color: #bce0e2;
    background-color: #e9f5f5;
}

.el-image {
    /* height: 20vh; */
    cursor: pointer;
}
</style>
