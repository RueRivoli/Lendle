<template>
<div>
    <div class="flex column" style="height:65vh;">
            <div class="slogan flex">
                <div>
                    BESOIN DE STOCKER TON LIT, TA TABLE, TA MACHINE A LAVER ...
                    POURQUOI NE PAS LES PRÊTER?
                </div>
                <div style="width:50%;"></div>
            </div>
            <div style="margin:auto;"><el-button type="primary" round>S'inscrire pour prêter</el-button></div>
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
                    <img src="../assets/chaise.png" alt="">
                    <h2 style="">PROPRE</h2>
                    <span>
                    Oublie les cartons humides qui s'encombrent 
                    </span>
                </div>
                <div class="center">
                    <img src="../assets/lampe.png" alt="">
                    <div>
                    <h2 style="">UTILE A TOUS</h2>
                    <span>
                        En utilisant Lendle tu aides ceux qui cherchent des meubles
                    </span>
                    </div>
                </div>
            </div>
        </el-container>
        <div style="height:2px;"></div>
           <el-container style="height:65vh;">
               <div style="display:flex;margin: auto;">
                    <img src="../assets/meuble.png" alt="" style="padding: 20px;margin: auto;">
                </div>
                <div class="flex" style="background-color:#252627;width:68%;padding:25px;color:white;text-align:left;">
                    <div style="margin:auto;">
                        <h2>COMMENT CA MARCHE ?</h2>
                        Tu as besoin de stocker des meubles pendant une période donnée. Lendle a besoin de meubles pendant la même période.
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
  name: 'LoadFurnitComponent',
  data() {
      return {
        }
    },
    methods: {
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

.lendle{
    color: #1E969D;
    text-align: center;
    font-weight:bold;
    font-size:22px;
    font-family:Times New Roman, Times, serif;
}

</style>