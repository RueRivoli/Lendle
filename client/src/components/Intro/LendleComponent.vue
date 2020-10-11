<template>
    <div>
        <el-container style="height:65vh;">
            <div class="slogan">
                PRÊTEZ VOS MEUBLES A CEUX QUI EN CHERCHENT
                <router-link to="/signup/loaner">
                     <el-button type="primary" value="submit"  round style="float:center" size="mini">S'inscrire</el-button>
                </router-link>
                
            </div>
            <div>
                <img src="./../../assets/fauteuilrouge.png" alt="" style="float:right;height:100%;width:50vw;">
            </div>
        </el-container>
        <div style="height:2px;"></div>
        <el-row class="ad_container">
                    <div class="text_container" style="background-color:#252627;padding:10px;color:white;text-align:right;display: table;">
                        <span style="vertical-align: middle;display:table-cell;">
                            <h2>PRÊTEUR</h2>
                            <p>
                                Trouvez la personne près de chez vous qui saura prendre soin de vos meubles.
                                Entrez vos dates de prêt, partagez vos photos de frigo, machine à laver, sèche-linge ...<br>
                                Et choisissez parmi toutes les personnes intéressées
                             </p>
                            <router-link to="/signup/renter" style="color:white;text-decoration:none;">
                                <!-- <el-button type="primary" @click="$route" round size="mini">Prêter des meubles</el-button> -->
                                <el-button type="primary" @click="$route" icon="el-icon-arrow-right" circle size="mini" style="margin-right:5px;"></el-button>Prêter des meubles
                            </router-link>
                        </span>
                    </div>
                    <div class="img_container" style="text-align:center;">
                        <img class="m-auto" src="./../../assets/meuble.png" alt="" style="padding: 10px;">
                    </div>
                </el-row>
        <div style="height:2px;"></div>
       <el-row class="ad_container">
               <div class="img_container" style="text-align:center;">
                    <img src="./../../assets/preteur.png" alt="" style="padding:10px;">
                </div>
                <div class="text_container" style="background-color:#1F939B;padding:10px;color:white;text-align:left;display: table;">
                    <span style="vertical-align: middle;display:table-cell;">
                        <h2>EMPRUNTEUR</h2>
                        <p>
                            Trouvez des meubles pour votre stage, votre année d'étude ou tout autre séjour à durée moyenne.
                            Entrez vos dates d'emprunt et cherchez un propriétaire qui sera content de vous prêter son mobilier.
                        </p>
                        <router-link to="/signup/loaner" style="color:white;text-decoration:none;">
                            <!-- <el-button type="success" @click="$route" round size="mini">Trouver des meubles</el-button> -->
                            <el-button type="success" @click="$route" icon="el-icon-arrow-right" circle size="mini" style="margin-right:5px;"></el-button>Trouver des meubles
                        </router-link>
                    </span>
                </div>
        </el-row>
        <div style="height:2px;"></div>
        </div>
</template>


<script>

export default {
  name: 'LendleComponent',
  data() {
      return {
          findFurnits: true
        }
    },
    methods: {
        changeSection: function () {
            console.log(this.findFurnits);
            this.$emit('changeDisplay', this.findFurnits);
        }
  }
}
</script>

<style scoped>

.hovering:hover{
    color: white !important;
    opacity: 0.9;
}

.slogan{
    width:68%;
    margin: auto;
    text-align:center;
    font-size:42px;
    font-weight:600;
    padding: 20px;
}

.text_container, .img_container{
    float: left;
    box-sizing: border-box;
}

.text_container{
    width: 66.66667%;
}
.img_container{
    width:33.33333%;
}

.ad_container{
    height:200px;
}

@media screen and (max-width: 800px) {
  p {
    font-size:12px;
  }
  .img_container{
      display:none;
  }
  .text_container{
      width: 100% !important;
      height: 200px;
      padding: 10px !important;
  }
}

@media screen and (min-width: 800px) and (max-width: 1400px) {
    .ad_container, .text_container{
        height:250px;
    }
    .img_container img{
        height: 230px;
    }
}


@media screen and (min-width: 1400px){
    .ad_container, .text_container{
        height:400px;
    }
    p {
        font-size:20px;
    }
    .router-link{
        font-size: 20px;
    }
    .img_container img{
        height: 380px;
    }
}

</style>