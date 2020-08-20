<template>
 <div>
  <nav-component :displayTitles="true"></nav-component>
    <BreadcrumpComponent v-bind:field1="{title: 'Créer une annonce', path: '/search'}"></BreadcrumpComponent>
  <el-main>
    <!-- <el-header>
      <el-row>
        <el-col :span="24" style="margin-bottom:50px;">
          <span class="add_furnit_title">AJOUTER VOTRE MEUBLE</span>
        </el-col>
      </el-row>
    </el-header> -->
      <el-dialog
      title="Profile incomplet"
      :visible.sync="dialogProfileVisible"
      width="50%"
      >
      <span>Pour créer une annonce, veuillez d'abord renseigner dans votre profil : </span>
      <div v-for="(fd, ind) in fieldsMissings" :key="ind">
         <span>{{fd}}</span>
        </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogProfileVisible = false">Annuler</el-button>
      <el-button type="primary" @click="fillProfile">Compléter le profil</el-button>
     </span>
    </el-dialog>
      <el-form ref="furniture" name="furniture" :model="furniture" :rules="rulesFurniture" label-position="top" label-width="130px" enctype="multipart/form-data">
        <el-row>
          <el-col :span="6">
            <el-form-item label="Nom du meuble" prop="name">
              <el-input type="text" size="mini" v-model="furniture.name" required></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-form-item label="Type de meuble" prop="type">
              <el-select v-model="furniture.type" size="mini" placeholder="Type de meuble">
                <el-option label="Table" value="table"></el-option>
                <el-option label="Chaise" value="chaise"></el-option>
                <el-option label="Frigidaire" value="frigidaire"></el-option>
                <el-option label="Machine à laver" value="machinealaver"></el-option>
                <el-option label="Armoire" value="armoire"></el-option>
                <el-option label="Placard" value="placard"></el-option>
                <el-option label="Fauteuil" value="fauteuil"></el-option>
                <el-option label="Canapé" value="canape"></el-option>
                <el-option label="Lampe" value="lampe"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" :offset="1">
            <el-form-item label="Ville de location" prop="city">
              <el-select v-model="furniture.city" size="mini" placeholder="Ville">
                <el-option label="Lille" value="Lille"></el-option>
                <el-option label="Lyon" value="Lyon"></el-option>
                <el-option label="Paris" value="Paris"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
        <el-form-item label="Début de disponibilité" prop="loanstart">
          <el-date-picker ref="loanstart" type="date" v-model="furniture.loanstart" size="mini" style="width: 100%;"></el-date-picker>
        </el-form-item>
        </el-col>
         <el-col :span="8" :offset="4">
        <el-form-item label="Fin de disponibilité" prop="loanend">
            <el-date-picker ref="loanend" type="date" v-model="furniture.loanend" size="mini" style="width: 100%;"></el-date-picker>
        </el-form-item>
         </el-col>
        </el-row>

        <el-row>
          <el-col :span="3">
            <el-form-item label="Prix de location" prop="price">
                  <el-input type="text" size="mini" v-model="furniture.price" placeholder="Prix" required>
                    <span  slot="suffix">€/mois</span>
                  </el-input>
            </el-form-item>
        </el-col>
        <el-col :span="5" :offset="2">
            <el-form-item label="Etat de l'objet" prop="state">
                  <el-select v-model="furniture.state" size="mini" placeholder="Etat">
                  <el-option label="Moyen" value="25"></el-option>
                  <el-option label="Correct" value="50"></el-option>
                  <el-option label="Excellent" value="75"></el-option>
                  <el-option label="Comme neuf" value="100"></el-option>
              </el-select>
            </el-form-item>
        </el-col>
        </el-row>
        <el-row style="text-align: left;margin-bottom: 20px;">
          <el-col :span="12">
          </el-col>
          <el-upload
            ref="elUpload"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :file-list="filesData"
            accept=" .jpg, .jpeg, .png,"
            multiple
            :limit="10"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :on-exceed="handleExceed">
            <i slot="default" class="el-icon-plus"></i>
            <div class="el-upload__tip" slot="tip">Format jpg/png/jpeg</div>
            <div slot="file" slot-scope="{file}">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url" alt="">
              <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)">
              <i class="el-icon-delete"></i>
              </span>
            </span>
            </div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-row>
         <el-row>
           <el-col :span="20">
            <el-form-item label="Description">
              <el-input type="textarea" :rows="3" v-model="furniture.description"></el-input>
            </el-form-item>
            </el-col>
          </el-row>
        <el-row>
          <el-button  class="f-left" v-if="$route.params.furnit_id" type="primary" value="submit" @click="submitFormUpdate()" size="mini">Editer l'annonce</el-button>
          <el-button class="f-left" v-else type="primary" value="submit" @click="submitForm()" size="mini">Créer une annonce</el-button>
        </el-row>
      </el-form>
      <img :src="imageprov" alt="">
  </el-main>
  <footer-component></footer-component>
</div>
</template>

<script>

/* Dans template Si class=el-upload-list-thumbnail images pleines dans img class= el-upload-list__item-thumbnail*/
import NavComponent from '../Navigation/NavComponent';
import FurnitService from '../../Service/FurnitService';
import UserService from '../../Service/UserService';
import BreadcrumpComponent from './../Utils/BreadcrumpComponent';
import FormData from 'form-data';
import moment from 'moment';
import FooterComponent from '../Footer/FooterComponent';
import { mapGetters } from 'vuex'

export default {
  name: 'AddFurnitComponent',
  components: { NavComponent, FooterComponent, BreadcrumpComponent },
  data() {
    var validateDates = (rule, value, callback) => {
      let loanstart = this.$refs.loanstart.value;
      let loanend = this.$refs.loanend.value;
      if (loanend !== null && loanend !== '' && loanstart !== null && loanstart !== '') {
        let momStart = moment(loanstart).add(1, 'days').unix();
        let momEnd = moment(loanend).unix();
        if (momStart <= momEnd) callback()
        else {
          callback(new Error('Please choose a end of loan after the beggining'));
        }
      }
      callback()
    }
    return {
      imageprov: 'data:image/jpg;base64,',
      fieldsMissings: [],
      dialogImageUrl: '',
      dialogVisible: false,
      dialogProfileVisible: false,
      disabled: false,
      file: null,
      pic_ids_deleted: [],
      furniture: {
        name: '',
        type: '',
        city: '',
        loanstart: '',
        loanend: '',
        description: '',
        picture_ids: []
      },
      filesData: [],
      url: null,
      rulesFurniture: {
        name: [
          { required: true, message: 'Rentrez le nom du meuble', trigger: 'blur' },
          { min: 3, max: 40, message: 'La longueur du nom doit être entre 3 et 40', trigger: 'blur' }
        ],
        price: [
          { required: true, message: 'Rentrez le prix de location', trigger: 'blur' },
          { pattern: '^[0-9]+$', message: 'Le prix de location est incorrect', trigger: 'blur' }
        ],
        type: [
          { required: true, message: 'Sélectionnez un type', trigger: 'change' }
        ],
        state: [
          { required: true, message: 'Sélectionnez un état', trigger: 'change' },
        ],
         city: [
          { required: true, message: 'Choisissez une ville', trigger: 'change' }
        ],
        loanstart: [
          { required: true, message: 'Inscrivez le début de disponibilité', trigger: 'blur' },
          { validator: validateDates, trigger: 'blur' }
        ],
        loanend: [
          { required: true, message: 'Inscrivez la fin de disponibilité', trigger: 'blur' },
          //  { type: Date, message: 'Inscrivez la fin de disponibilité', trigger: 'blur' },
          { validator: validateDates, trigger: 'blur' }
        ],
      }
    }
  },
  computed: {
    ...mapGetters({
      loaner: 'GET_LOAN'
    }),
  },
  async created() {
    let context = this;
    UserService.getIfProfileComplete(this.loaner).then(function(result) {
      console.log('RESULT');
      console.log(result.complete);
      console.log(result);
      if (!result.complete) {
        context.fieldsMissings = result.fields;
        context.dialogProfileVisible = true;
      }
      }).catch(function(err) {
        console.log(err);
    });
    if (this.$route.params.furnit_id) {
      FurnitService.getIdentityCardFurnit(this.$route.params.furnit_id).then(function(furnit) {
        console.log('Retour identité furnit');
        console.log(furnit);
        context.furniture = furnit.furnit;
        if (furnit.imgUrl && Object.keys(furnit.imgUrl) !== 0) {
          context.url = furnit.imgUrl;
        }
        Object.keys(furnit.imgUrl).forEach(ul => {
          context.filesData.push({name: 'name', url: furnit.imgUrl[ul], pic_id: furnit.furnit.picture_ids[ul]});
        });
      })
    }
  },
  methods: {
    handleRemove(file) {
      let deletedUid = file.uid;
      let uploadFls = this.$refs.elUpload.uploadFiles;
      this.pic_ids_deleted.push(file.pic_id);
      this.$refs.elUpload.uploadFiles = uploadFls.filter(elt => elt.uid !== deletedUid);
    },
    handlePictureCardPreview(file) {
      this.file = file;
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleChange(file) {
      this.file = file
      console.log(this.file)
    },
    handleExceed(files) {
        this.$message.warning(`La limite est de 10 images, vous avez déjà choisi ${files.length} fichiers`);
    },
    fillProfile() {
       this.$router.push({ name: 'ProfileComponent', fields: this.fieldsMissings});
    },
    async submitFormUpdate () {
      let context = this;
      console.log('submitFU');
       this.$refs['furniture'].validate((valid) => {
         console.log('refs');
        if (valid) {
           console.log('valid');
          //create formData to send
          let fd = new FormData(document.forms.namedItem("furniture"));
          // insert pictures uploaded into the db and return ids of the image
           console.log('before insertPicture');
            FurnitService.insertPicture(fd).then(function(picture_ids) {
              console.log('PICIDS');
              console.log(picture_ids);
              let pic_ids = context.furniture.picture_ids.filter(pid => !context.pic_ids_deleted.includes(pid));
              console.log(pic_ids);
              context.furniture.picture_ids =  pic_ids.concat(picture_ids);
              FurnitService.updateFurniture(context.furniture).then(function(result) {
              console.log('result updateFurniture');
              const message = result.data.msg;
              if (context.pic_ids_deleted && context.pic_ids_deleted.length > 0) {
                  FurnitService.deleteFile({ picture_ids: context.pic_ids_deleted });
              }
              context.$message.success(message);
              context.$router.push({ name: 'MyAds'});
            }).catch(function(err) {
              context.$message.warning(err);
            });
          });
        } else {
        context.$message.warning(`Veuillez remplir correctement le formulaire`);
        }
       });
    },
    async submitForm () {
      console.log("SUBMIT FORM");
      let context = this;
      this.$refs['furniture'].validate((valid) => {
        if (valid) {
          //create formData to send
          let fd = new FormData(document.forms.namedItem("furniture"));
          // insert pictures uploaded into the db and return ids of the image
            FurnitService.insertPicture(fd).then(function(picture_ids) {
            context.furniture.picture_ids = picture_ids;
            // context.furniture.owner_id = '5eab3f5eef84ce1f98676228';
            console.log('Furniture before insert into Db');
            console.log(context.furniture);
            FurnitService.insertFurniture(context.furniture).then(function(result) {
              context.$message.success(result);
              context.$router.push({ name: 'MyAds'});
            }).catch(function(err) {
              context.$message.warning(err);
         });
         }).catch(function(err) {
             this.$message.warning(err);
         });
      } else {
        context.$message.warning(`Veuillez remplir correctement le formulaire`);
      }
  });
}
}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.add_furnit_title{
  color: #1E969D;
  text-align: center;
  font-style:oblique;
  font-weight:bold;
  font-size:22px;
  font-family:Times New Roman, Times, serif;
}

.el-form-item__label{
  padding: 0px !important;
  line-height: 10px !important;
}

.el-header, .el-footer {
  // background-color: #B3C0D1;
  color: #333;
  text-align: left;
  line-height: 30px;
}


.grid-content{
  border-radius: 4px;
  min-height: 50px;
}

</style>
