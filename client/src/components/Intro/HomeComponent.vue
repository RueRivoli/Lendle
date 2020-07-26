<template>
    <div>
        <nav-component></nav-component>
         <el-container class="furnit" style="height:85vh;">
             <el-row style="width: 100%;height: 20vh;margin-top:7vw;">
              <el-col :span="10" :offset="7">
                  <h3 class="title">Louer des meubles gratuitement près de chez vous</h3>
                    <el-form ref="furniture" name="furniture" style="margin-left: 25px;" :inline="true" :model="furniture" :rules="rulesFurniture" enctype="multipart/form-data">
                            <el-form-item>
                                <el-select placeholder="Ville" v-model="furniture.city">
                                    <el-option label="Paris" value="Paris"></el-option>
                                    <el-option label="Lyon" value="Lyon"></el-option>
                                    <el-option label="Lille" value="Lille"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-select placeholder="Type" v-model="furniture.type">
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
                            <el-form-item>
                                <el-button type="danger" icon="el-icon-search" @click="submit"></el-button>
                            </el-form-item>
                            
                            
                  
                    </el-form>
                </el-col>
            </el-row>
           
        </el-container>
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
    color: #851922;
    background-color: white;
    text-align:center;
    padding: 5px;
    border-radius: 5px;

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


</style>