<template>
    <div>
        <el-container style="height:65vh;">
            <div class="slogan">
                PRÊTEZ VOS MEUBLES A CEUX QUI EN CHERCHENT
            </div>
            <div>
                <img src="../assets/fauteuilrouge.png" alt="" style="float:right;height:100%;width:50vw;">
            </div>
        </el-container>
        <div style="height:2px;"></div>
        <el-container style="height:50vh;">
                <div class="flex" style="background-color:#252627;width:68%;padding:25px;color:white;text-align:right;">
                    <div style="margin:auto;">
                        <h2>PRÊTEUR</h2>
                        Trouvez la personne près de chez vous qui saura prendre soin de vos meubles.
                        Entrez vos dates de prêt, partagez vos photos de frigo, machine à laver, sèche-linge ...<br>
                        Et choisissez parmi toutes les personnes intéressées
                        <h3 class="pointer hovering" style="color:#1E969D;margin-top:40px;text-decoration: underline;">Prêter des meubles</h3>
                    </div>
                </div>
                <div class="flex margin-auto">
                    <img class="m-auto" src="../assets/meuble.png" alt="" style="padding: 20px;">
                </div>
        </el-container>
        <div style="height:2px;"></div>
           <el-container style="height:50vh;">
               <div class="flex m-auto">
                    <img class="m-auto" src="../assets/preteur.png" alt="" style="padding: 20px;">
                </div>
                <div class="flex" style="background-color:#1F939B;width:68%;padding:25px;color:white;text-align:left;">
                    <div style="margin:auto;">
                        <h2>EMPRUNTEUR</h2>
                        Trouvez des meubles pour votre stage, votre année d'étude ou tout autre séjour à durée moyenne.
                        Entrez vos dates d'emprunt et cherchez un propriétaire qui sera content de vous prêter son mobilier.
                        <h3 class="pointer hovering" style="color:black;margin-top:40px;text-decoration: underline;">Trouver des meubles</h3>
                    </div>
                </div>
        </el-container>
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


</style>