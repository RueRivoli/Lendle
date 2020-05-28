<template>
    <el-container>
        <nav-component :displayTitles="true"></nav-component>
         <el-container class="furnit" style="height:85vh;">
             <el-row style="width: 100%;height: 20vh;margin-top:18vh;">
              <el-col :span="8" :offset="8">
                  <h3 class="title">Louer des meubles gratuitement près de chez vous</h3>
                    <el-form class="select" ref="furniture" name="furniture"  :inline="true" :model="furniture" :rules="rulesFurniture" enctype="multipart/form-data">
                         <el-input placeholder="Entrez un meuble" v-model="furniture.type" class="input-with-select">
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

export default {
  name: 'HomeComponent',
  components: { NavComponent },
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
    methods: {
        async submit () {
            console.log(this.$refs['furniture']);
            let context = this;
            this.$refs['furniture'].validate((valid) => {
              if (!valid) {
                console.log('error submit!!')
              return false
             }
            console.log('Formulaire valid');
            let furn = context.furniture;
            context.$router.push({ name: 'Search', params: { furniture: furn } });
        });
    }
}
}

</script>

<style>

.furnit{
    background: no-repeat right 50% url('./../assets/fauteuilrouge.png'),
    no-repeat left 50% url('./../assets/fauteuilrouge.png');
    /* url('./../assets/fatvert.jpg') no-repeat right top; */
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


</style>