<template>
    <el-container>
        <nav-component :displayTitles="true"></nav-component>
         <el-container style="height:85vh;"> 
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
            </el-row>{{ $route.params.furnits }}
               <el-row v-for="(fnt, index) in furnitures" v-bind:key="index" style="width: 100%;height: 70vh;">
                <el-col :span="6" :offset="2">
                    <h4>{{ fnt.name }}</h4>
                    - {{ fnt.loanstart/fnt.loanend }}
                    - {{ fnt.city }}
                </el-col>
            </el-row>

        </el-container>
         
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

export default {
  name: 'SearchComponent',
  components: { NavComponent },
  data() {
      return {
         furniture: {
            name: '',
            city: '',
        },
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
    methods: {
        async submit () {
            console.log(this.$refs['furniture']);
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
    }
}
}

</script>

<style>

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


</style>