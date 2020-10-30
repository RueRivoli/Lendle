<template>
    <div>
        <nav-component></nav-component>
         <el-container class="furnit" style="height:85vh;">
             <el-row style="width: 100%;height: 20vh;margin-top:7vw;">
              <div style="background: rgba(0,0,0,.6);padding: 3px;box-shadow: 0 4px 8px rgba(0,0,0,.3);">
                  <div style="margin:auto;">
                      <h1 class="title">Louer des meubles près de chez vous</h1>
                        <el-form ref="furniture" name="furniture" :inline="true" :model="furniture" :rules="rulesFurniture" enctype="multipart/form-data">

                            <div style="display: table;table-layout: fixed;box-sizing: border-box;padding: 0 10px;
                                    width: 100%;
                                    clear: both;
                                    text-align:center;
                                    ">
                                <div style="display: table-cell;vertical-align: top;position: relative;text-align: right;padding:2vh;">
                                    <el-form-item>
                                        <el-select placeholder="Ville" v-model="furniture.city" style="float:center;">
                                            <el-option label="Paris" value="Paris"></el-option>
                                            <el-option label="Lyon" value="Lyon"></el-option>
                                            <el-option label="Lille" value="Lille"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>

                                 <div style="display: table-cell;vertical-align: top;position: relative; text-align: left;padding:2vh;">
                                    <el-form-item>
                                        <el-select placeholder="Type" v-model="furniture.type" style="float:center;">
                                            <!-- <el-option label="Tous" value=""></el-option> -->
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
                                    </el-form-item>
                                </div>
                            </div>
                            <div style="text-align: center;">
                                <el-form-item>
                                        <!-- <el-button type="danger" icon="el-icon-search" @click="submit"></el-button> -->
                                    <el-button type="danger" icon="el-icon-search" @click="submit" round>Rechercher</el-button>
                                </el-form-item>
                            </div>
                          
                        </el-form>
                     </div>
                </div>
            </el-row>

            </el-container>
                                 <div style="height:2px;"></div>
                <el-row class="post_container">
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
           <el-row class="post_container">
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
           
     
         <footer-component></footer-component>
    </div>
</template>


<script>
import NavComponent from './../Navigation/NavComponent';
import FooterComponent from './../Footer/FooterComponent';

export default {
  name: 'HomeComponent',
  components: { NavComponent, FooterComponent},
  data() {
      return {
         furniture: {
            type: '',
            city: '',
        },
        rulesFurniture: {
            type: [
            { required: true, message: 'Sélectionner un meuble', trigger: 'blur' },
            { min: 3, max: 40, message: 'Plus de 2 lettres svp', trigger: 'blur' }
            ],
            city: [
            { required: true, message: 'Sélectionnez une ville', trigger: 'change' }
            ],
        }
  }
  },
  created () {
      this.$store.commit('EXIT');
  },
    methods: {
        async submit () {
            console.log(this.$refs['furniture']);
            localStorage.city = this.furniture.city;
            localStorage.type = this.furniture.type;
            let context = this;
            this.$refs['furniture'].validate((valid) => {
              if (!valid) {
                console.log('error submit!!')
              return false
             }
            console.log('Formulaire valid');
            // let furn = context.furniture;
            context.$router.push({ name: 'Search'});
        });
    }
}
}

</script>

<style scoped>

.furnit{
    /* background: no-repeat right 50% url('./../assets/fauteuilrouge.png'), */
    background:  no-repeat url('./../../assets/background.jpg');
    background-size: cover;
    background-position: 100%;
    /* background-size: 100% auto; */
    /* no-repeat left 50% url('./../assets/fauteuilrouge.png'); */
    /* url('./../assets/fatvert.jpg') no-repeat right top; */
}


.title{
    color: antiquewhite;
    text-align:center;
    padding: 5px;
    border-radius: 5px;
    font-family: Times New Roman, Times, serif;
}

.el-form-item{
    margin-right: 0px !important;
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



/* .hovering:hover{
    color: white !important;
    opacity: 0.9;
} */

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

.post_container{
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
    .post_container, .text_container{
        height:250px;
    }
    .img_container img{
        height: 230px;
    }
}


@media screen and (min-width: 1400px){
    .post_container, .text_container{
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

/* @media screen and (max-width: 2000px) {
    .container{
        width: 66.66667%;
    }
    .img-container{
        width:33.33333%;
    }
} */

</style>