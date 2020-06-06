<template>
    <div>
      <nav-component style="border-bottom: 1px solid #dfe0e6"></nav-component>
        <el-container style="height:85vh;">
            <el-main style="width:100%">
                  <el-form label-position="top" label-width="80px">
                            <el-row style="font-size:18px;margin-bottom: 5vh;font-weight:bold;">
                                <el-col :span="10">
                                    <span v-if="!modeEdit">{{ad.name}}</span>
                                    <span v-else>Edition</span>
                                </el-col>
                                <el-col :span="14">
                                    <el-switch
                                        v-model="modeEdit"
                                        active-color="primary"
                                        inactive-color="success"
                                        size="mini"
                                        active-text="Mode édition"
                                        inactive-text="Mode vue"
                                        >
                                    </el-switch>
                                 </el-col>
                            </el-row>
                         <div v-if="!modeEdit">
                             <el-col :span="10">
                                <el-carousel trigger="click" height="30vh">
                                    <el-carousel-item  v-for="(img, index) in url" :key="index">
                                        <h3 class="small">
                                            <el-image class="imgcarousel"
                                                :src="img"
                                                fit="contain"
                                                >
                                            </el-image>
                                      
                                        </h3>
                                    </el-carousel-item>
                                </el-carousel>
                                <el-row style="margin-top:5vh;">
                                    <el-form-item label="Période">
                                        <el-date-picker
                                            v-model="date"
                                            type="daterange"
                                            range-separator="à"
                                            start-placeholder="Début"
                                            end-placeholder="Fin"
                                            format="dd/MM/yyyy"
                                            size="mini"
                                            :picker-options="readonly"
                                            >
                                            </el-date-picker>
                                    </el-form-item>
                                </el-row>
                                 </el-col>
                            </div>

                       
                            <el-col :span="8" :offset="3" style="">
                                <div v-if="!modeEdit">
                                <el-row>
                                     <el-form-item label="Prix">
                                        <el-input
                                            type="primary"
                                            placeholder="0€/mois"
                                            size="mini"
                                            :disabled="true">
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item :label="stateOfFurnit">
                                        <el-slider v-model="ad.state" :step="25"
                                            show-stops :format-tooltip="formatTooltip" :disabled="true"></el-slider>
                                    </el-form-item>
                                </el-row>
                                 <el-row>
                                     <el-form-item label="Description">
                                     <el-input
                                        size="mini"
                                        type="textarea"
                                        :rows="4"
                                        :placeholder="ad.description"
                                        :disabled="true">
                                        </el-input>
                                       </el-form-item>
                                 
                                </el-row>
                                 </div>
                            </el-col>
                           </el-form>
                              <div v-if="modeEdit">
                                  <el-form ref="ad" name="ad" label-position="" label-width="120px">
                                
                                <table style="width: 100%;">
                                    <thead>
                                        <tr>
                                            <th style="width: 10%;"></th>
                                            <th style="width: 15%"></th>
                                            <th style="width: 10%"></th>
                                             <th style="width: 10%"></th>
                                             <th style="width: 15%"></th>
                                        </tr>
                                    </thead>
                                     <tr>
                                        <td style="font-size:14px;">Nom</td>
                                        <td> 
                                            <el-form-item label="">
                                                <el-input
                                                    v-model="ad.name"
                                                    type="primary"
                                                    size="mini"
                                                    >
                                                </el-input>
                                            </el-form-item>
                                        </td>
                                        <td></td>
                                        <td style="font-size:14px;">Description</td>
                                        <td> 
                                            <el-input
                                                size="mini"
                                                type="textarea"
                                                :rows="4"
                                                v-model="ad.description"
                                                >
                                        </el-input>
                                        </td>
                                   
                                    </tr>
                                    <tr>
                                        <td style="font-size:14px;">Prix</td>
                                        <td> 
                                            <el-form-item label="">
                                            <el-input
                                                v-model="ad.price"
                                                type="number"
                                                suffix="€/mois"
                                                size="mini"
                                                >
                                                <template slot="append">€/mois</template>
                                            </el-input>
                                            </el-form-item>
                                        </td>
                                         <td></td>
                                         <td style="font-size:14px;">Période de disponibilité</td>
                                        <td> 
                                             <el-date-picker
                                            v-model="date"
                                            type="daterange"
                                            range-separator="à"
                                            start-placeholder="Début"
                                            end-placeholder="Fin"
                                            format="dd/MM/yyyy"
                                            size="mini"
                                            :picker-options="readonly"
                                            >
                                              </el-date-picker>
                              
                                        </td>
                                    </tr>
                                      <tr>
                                        <td style="font-size:14px;">Etat</td>
                                        <td>
                                            <el-form-item label="" prop="state">
                                            <el-select v-model="ad.state" size="mini" placeholder="">
                                                <el-option label="Etat moyen" :value="0"></el-option>
                                                <el-option label="Etat correct" :value="25"></el-option>
                                                <el-option label="Bon état" :value="50"></el-option>
                                                <el-option label="Excellent état" :value="75"></el-option>
                                                <el-option label="Comme neuf" :value="100"></el-option>
                                                </el-select>
                                     </el-form-item>
                                        </td>
                                        <td></td>
                                         <td style="font-size:14px;">Type</td>
                                        <td>
                                            <el-form-item label="" prop="type">
                                                <el-select v-model="ad.type" size="mini" placeholder="Type of furniture">
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
                                        </td>
                                    </tr>
                                     <tr>
                                        <td style="font-size:14px;">City</td>
                                        <td>
                                            <el-form-item label="" prop="city">
                                                <el-select v-model="ad.city" size="mini" placeholder="City">
                                                    <el-option label="Lille" value="Lille"></el-option>
                                                    <el-option label="Lyon" value="Lyon"></el-option>
                                                    <el-option label="Paris" value="Paris"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                </table>
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
                        <el-button v-if="modeEdit" type="primary" value="submit" @click="submitForm()" style="float:left;margin-top:10px;" size="mini">Editer</el-button>
                    </el-form>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import NavComponent from './Navigation/NavComponent';
// import RentalService from '../RentalService';
import FurnitService from '../FurnitService';
import './../style/style.css';
// import moment from 'moment'

export default {
  name: 'AdComponent',
  components: { NavComponent },
  data() {
    return {
      furnit_id: this.$route.params.id,
      file: null,
      ad: {
        name: '',
        type: '',
        price: 0,
        state: 0,
        city: '',
        loanstart: '',
        loanend: '',
        description: '',
        picture_ids: []
      },
      url: {},
      filesData: [],
      date: [],
      pic_ids_deleted: [],
      modeEdit: false,
      dialogVisible: false,
      dialogImageUrl: ''
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
    readonly () {
        return true;
    },
    formatTooltip(val) {
        return val/100;
    },
    async submitForm () {
      console.log('submitForm');
      let context = this;
      let fd = new FormData(document.forms.namedItem("ad"));
      FurnitService.insertPicture(fd).then(function(picture_ids) {
        context.ad.loanstart = context.date[0];
        context.ad.loanend = context.date[1];
        let pic_ids = context.ad.picture_ids.filter(pid => !context.pic_ids_deleted.includes(pid));
        context.ad.picture_ids =  pic_ids.concat(picture_ids);
        FurnitService.updateFurniture(context.ad).then(function(result) {
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
      }
    },
  computed: {
    stateOfFurnit: function () {
        if (this.ad && this.ad.state === 100) return "Excellent état";
        if (this.ad && this.ad.state === 75) return "Bon état";
        if (this.ad && this.ad.state === 50) return "Etat correct";
        if (this.ad && this.ad.state === 25) return "Etat délicat";
        return "Bon état";
    },
},
 async created() {
    let context = this;
    console.log(this.furnit_id);
    FurnitService.getIdentityCardFurnit(this.furnit_id).then(function(ft) {
      console.log('getIdentityCard ==');
      console.log(ft);
      context.ad = ft.furnit;
      context.url[0] = "";
      if (ft.imgUrl && Object.keys(ft.imgUrl) !== 0) {
          context.url = ft.imgUrl;
      }
      
      Object.keys(ft.imgUrl).forEach(ul => {
          context.filesData.push({name: 'name', url: ft.imgUrl[ul], pic_id: ft.furnit.picture_ids[ul]});
      });
      console.log('FileData');
      console.log(context.filesData);
      console.log(ft.imgUrl);
      context.date = [context.ad.loanstart, context.ad.loanend];
      console.log(context.date);
    //  let picture_ids = context.rental.furnit[0].picture_ids;
    //  console.log(picture_ids);
    //  if (picture_ids && picture_ids.length > 0) {
    //     FurnitService.getImagesUrlFromPicIds(picture_ids).then(function(urls) {
    //         context.url = urls.imgurl;
    //         console.log(context.url);
    //         }).catch(function(err) {
    //         console.log(err);
    //     });
    // }
    }).catch(function(err) {
        console.log(err);
    });
  },

}

</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>

// .el-form-item__label{
//   padding: 0px !important;
//   line-height: 10px !important;
// }

.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}


.imgcarousel{
    height: 30vh;
    cursor: pointer;
    background-color: #D6DCDD;
}


  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 30vh;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

.el-image {
    display: block !important;
    margin: auto !important;
}


.el-form-item{
    margin-bottom: 2px !important;
}

.el-form--label-top .el-form-item__label{
    padding: 0px !important;
}

</style>
<style>


</style>
