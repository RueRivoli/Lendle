<template>
<div>
    <div class="flex column" style="height:65vh;">
            <div class="slogan">
                BESOIN D'UNE TABLE, D'UN LIT, D'UNE MACHINE A LAVER ...
                QUELQU'UN PEUT TOUT TE PRÊTER
            </div>
            <div style="margin:auto;"><el-button type="info" round>S'inscrire pour emprunter</el-button></div>
        </div>
        <div style="height:2px;"></div>
        <el-container style="height:50vh;">
            <div class="flex" style="background-color:#1F939B;width:100%;justify-content:space-around;padding:25px;color:white;text-align:right;">
                <div class="center">
                    <img src="../assets/cochon.png" alt="">
                    <h2>ECONOMIQUE</h2>
                    <span>
                    Utiliser Lendle c'est gratuit
                    </span>
                </div>
                <div class="center">
                    <img src="../assets/facile.png" alt="">
                    <h2 style="">FACILE</h2>
                    <span>
                    Quand ta location se termine, tu as juste à rendre ce que tu as emprunté
                    </span>
                </div>
                <div class="center">
                    <img src="../assets/lampe.png" alt="">
                    <div>
                    <h2 style="">UTILE A TOUS</h2>
                    <span>
                    En utilisant Lendle tu aides ceux qui veulent stocker des meubles
                    </span>
                    </div>
                </div>
            </div>
        </el-container>
        <div style="height:2px;"></div>
           <el-container style="height:65vh;">
               <div class="flex m-auto">
                    <img class="m-auto" src="../assets/preteur.png" alt="" style="padding: 20px;">
                </div>
                <div class="flex" style="background-color:#252627;width:68%;padding:25px;color:white;text-align:left;">
                    <div class="m-auto">
                        <h2>COMMENT CA MARCHE ?</h2>
                        Tu as besoin de meubles pendant une période donnée. Quelqu'un a besoin de les stocker pendant la même période.
                        Lendle vous met en relation, ensuite c'est à vous de jouer !
                        <h3 class="pointer hovering" style="color:black;margin-top:40px;text-decoration: underline;">Je commence</h3>
                    </div>
                </div>
        </el-container>
        <div style="height:2px;"></div>
        </div>
</template>


<script>

export default {
  name: 'FindFurnitComponent',
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

.center{
    flex: 1;
    text-align: center;
    margin: auto;
}

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
}


</style>