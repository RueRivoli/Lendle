<template>
 <el-container style="height: 100vh;">
  <aside-component/>
  <el-main>
    <el-row>
      <el-col :span="24" style="margin-bottom:50px;">
         <span class="add_furnit_title">AJOUTER VOTRE MEUBLE</span>
      </el-col>
    </el-row>
      <el-form ref="furniture" name="furniture" :model="furniture" :rules="rulesFurniture" label-position="top" label-width="130px" enctype="multipart/form-data">
        <el-row>
          <el-col :span="8">
            <el-form-item label="Nom du meuble" prop="name">
              <el-input type="text" size="mini" v-model="furniture.name" required></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="4">
            <el-form-item label="Type de meuble" prop="type">
              <el-select v-model="furniture.type" size="mini" placeholder="Type of furniture">
                <el-option label="Table" value="table"></el-option>
                <el-option label="Chaise" value="chaise"></el-option>
                <el-option label="Frigidaire" value="frigidaire"></el-option>
                <el-option label="Machine à laver" value="machinealaver"></el-option>
                <el-option label="Armoire" value="armoire"></el-option>
                <el-option label="Placard" value="placard"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
        <el-form-item label="Start of the loan" prop="dateStart">
          <el-date-picker ref="dateStart" type="date" v-model="furniture.dateStart" size="mini" style="width: 100%;"></el-date-picker>
        </el-form-item>
        </el-col>
         <el-col :span="8" :offset="4">
        <el-form-item label="End of the loan" prop="dateEnd">
            <el-date-picker ref="dateEnd" type="date" v-model="furniture.dateEnd" size="mini" style="width: 100%;"></el-date-picker>
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
          <el-button type="primary" value="submit" @click="submitForm()" style="float:left" size="mini">Submit</el-button>
        </el-row>
      </el-form>
      <img :src="imageprov" alt="">
  </el-main>
</el-container>
</template>

<script>

/* Dans template Si class=el-upload-list-thumbnail images pleines dans img class= el-upload-list__item-thumbnail*/

import AsideComponent from './AsideComponent';
import FurnitService from '../FurnitService';
// import FormData from 'form-data';
import moment from 'moment'
// import axios from 'axios';

export default {
  name: 'FurnitComponent',
  components: { AsideComponent },
  data() {
    var validateDates = (rule, value, callback) => {
      let dateStart = this.$refs.dateStart.value;
      let dateEnd = this.$refs.dateEnd.value;
      if (dateEnd !== null && dateEnd !== '' && dateStart !== null && dateStart !== '') {
        console.log('ENNTNRANNCE');
        let momStart = moment(dateStart).add(1, 'days').unix();
        let momEnd = moment(dateEnd).unix();
        if (momStart <= momEnd) callback()
        else {
          callback(new Error('Please choose a end of loan after the beggining'));
        }
      }
      callback()
    }
    return {
      imageprov: 'data:image/jpg;base64,',
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      file: null,
      furniture: {
        name: '',
        type: '',
        dateStart: '',
        dateEnd: '',
        description: '',
        picture_ids: []
      },
      rulesFurniture: {
        name: [
          { required: true, message: 'Please input the name of your furniture', trigger: 'blur' },
          { min: 3, max: 40, message: 'Length should be between 3 and 40', trigger: 'blur' }
        ],
        type: [
          { required: true, message: 'Please select a type', trigger: 'change' }
        ],
        dateStart: [
          { type: 'date', required: true, message: 'Please input the start of the loan', trigger: 'blur' },
          { validator: validateDates, trigger: 'blur' }
        ],
        dateEnd: [
          { type: 'date', required: true, message: 'Please input the end of the loan', trigger: 'blur' },
          { validator: validateDates, trigger: 'blur' }
        ],
      },
      posts: [],
      text: ''
    }
  },
  async created() {
  },
  methods: {
    handleRemove(file) {
      let deletedUid = file.uid;
      let uploadFls = this.$refs.elUpload.uploadFiles;
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
    async submitForm () {
      let oData = new FormData(document.forms.namedItem("furniture"));
      // console.log('oData');
      // console.log(oData);
      // for (var value of oData.values()) {
      //     console.log(value); 
      // }

      
      //  this.$refs['furniture'].validate((valid) => {
      //    if (valid) {
      //      this.$message.success(`Votre meuble a bien été crée`);
      //    } else {
      //     this.$message.warning(`Veuillez remplir correctement le formulaire`);
      //      return false
      //    }
      // })

      var picture_ids = await FurnitService.insertPicture(oData, {
        headers: {
        'Content-Type': `multipart/form-data;`
          }
        });
      console.log(picture_ids);
      this.furniture.picture_ids = picture_ids;
      this.furniture.owner_id = '5eab3f5eef84ce1f98676228'; // a modifier prendre parametre de session 
      console.log('This furniture ==>');
      console.log(this.furniture);
      var result = await FurnitService.insertFurniture(this.furniture);
      console.log(result);
    },
    async createPost() {
      await FurnitService.insertPost(this.text);
      this.posts = await FurnitService.getPosts();
    },
    async deletePost(id) {
      await FurnitService.deletePost(id);
      this.posts = await FurnitService.getPosts();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

$color-primary: #1E969D;
$color-success: #484538;
$color-info: #cad49d;
$color-warning: #d4eac8;
$color-danger: #c0d8e0;

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
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}


.grid-content{
  border-radius: 4px;
  min-height: 50px;
}

</style>
