<template>
  <div>
     <nav-component style="width:100%;" :displayTitles="true"></nav-component>
      <div style="height:680px;padding:10px;">
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="Principe" name="1">
              <div>Ce site propose la location de meubles entre particuliers</div>
              <div>Le site ne se porte pas responsable en cas de vol/perte de votre meuble</div>
            </el-collapse-item>
            <el-collapse-item title="Comment créer une annonce" name="2">
              <div>Retour d'expérience: permets aux utilisateurs de percevoir clairement leurs opérations par le biais d'animations et d'effets interactifs.</div>
              <div>Retour visuel: reflète l'état actuel de la page via le réarrangement ou la mise à jour des éléments.</div>
            </el-collapse-item>
            <el-collapse-item title="Comment s'effectue la livraison" name="3">
              <div>Simplifier le processus: garde chaque opération simple et intuitive.;</div>
              <div>Clair et défini: énonce clairement ses intentions afin que l'utilisateur puisse comprendre et prendre une décision rapidement;</div>
              <div>Facile à identifier: l'interface devrait être simple et facile d'accès, afin que les utilisateurs n'ai pas d'efforts de mémorisation à faire.</div>
            </el-collapse-item>
            <el-collapse-item title="Comment retourner le meuble" name="4">
              <div>Prise de décision: possibilité de donner des conseils sur les opérations, mais ne jamais prendre de décisions à la place des utilisateurs;</div>
              <div>Contrôle des conséquences: les utilisateurs devraient pouvoir contrôler l'exécution de leurs opérations, y compris l'annulation et la suppression des opérations courantes.</div>
            </el-collapse-item>
          </el-collapse>

      </div>
      <footer-component></footer-component>
  </div>
</template>

<script>
import NavComponent from './../Navigation/NavComponent';
import FooterComponent from './../Footer/FooterComponent';

export default {
  name: 'HelpComponent',
  components: { NavComponent, FooterComponent },
  data() {
    return {
       activeNames: ['1']
    }
  },
  async created() {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
