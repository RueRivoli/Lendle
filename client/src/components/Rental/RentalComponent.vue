<template>
    <div>
      <nav-component></nav-component>
      <BreadcrumpComponent :field1="{title: loaner? 'Mes meubles' : 'Mes locations', path: '/myrentals/' + pathToMyRentals[0] }" :field2="{title: pathToMyRentals[0], path: '/myrentals/' + pathToMyRentals[0]}" :field3="{title: pathToMyRentals[1]}"></BreadcrumpComponent>
      <el-container >
        <el-main style="width:100%">
           <el-dialog
              :title="titleDialog"
              :visible.sync="dialogVisible"
              width="55%">
              <span>{{ message }}</span>
              <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">Annuler</el-button>
              <el-button v-if="confirmLoan && !refuseLoan" type="primary" @click="confirm(rental_id, index_modified)">{{ validExpression }}</el-button>
              <el-button v-if="!confirmLoan && !refuseLoan" type="primary" @click="dialogVisible = false">ok</el-button>
              <el-button v-if="refuseLoan" type="primary" @click="confirmCancel()">Refuser la proposition</el-button>
              </span>
          </el-dialog>
          
          <el-form label-position="top" label-width="80px">
              <el-row style="height:50vh;">
                <el-col :span="7">
                  <el-calendar v-model="today">
                    <template
                      slot="dateCell"
                      slot-scope="{date, data}">
                      <p :class="isIndisponible(data) ? 'is-selected' : ''">
                        {{ data.day.split('-').slice(2).join('') }} {{ data.isSelected ? 'x' : ''}}
                      </p>
                    </template>
                  </el-calendar>
              </el-col>

            <el-col  :span="15" :offset="2">
              <div >
                <el-row style="font-size:18px;margin-bottom: 5vh;font-weight:bold;">
                  <span class="f-left">Vos demandes</span>
                </el-row>
                <el-row style="margin-bottom: 2vh;">
                    <span class="f-left" style="font-size:14px"></span>
                </el-row>
                <table width="100%" v-if="loaner">
                  <col >
                  <col >
                  <col >
                  <col>
                  <col>
                  <col>
                    <thead>
                      <tr>
                        <th class="width1" colspan="2">Période</th>
                        <th v-if="editMode" class="width1">Prix</th>
                        <th class="width1">Total</th>
                        <th v-if="!editMode" class="width1">Statut</th>
                        <th v-if="!editMode" class="width2" colspan="3">Actions</th>
                        <th v-if="editMode" class="width2" colspan="2">Actions</th>
                      </tr>
                      <tr style="font-weight:light;font-size: 10px">
                        <th>Début</th>
                        <th>Fin</th>
                        <th></th>
                        <th></th>
                         
                        <th v-if="!editMode">Editer</th>
                        <th>Annuler</th>
                        <th>Valider/Confirmer</th>
                         <!-- <th v-if="!editMode">Contacter</th> -->
                          <!-- <th v-if="editMode">Annuler</th>
                         <th v-if="editMode">Valider</th> -->
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(entry, id) in rentals" :key="id" :class="classEntry(entry.status)">
                        <td v-if="!editMode || entry.status !== 0">{{ format(entry.loan_start) }} </td>
                        <td v-if="!editMode || entry.status !== 0">{{ format(entry.loan_end) }} </td>
                        <td v-if="editMode && entry.status === 0" colspan="2">
                                <el-date-picker
                                  v-model="dateProposition"
                                  type="daterange"
                                  range-separator="au"
                                  start-placeholder="Début"
                                  end-placeholder="Fin"
                                  format="dd/MM/yyyy"
                                  style="width:20vw;"
                                  size="mini">
                              </el-date-picker>
                        </td>
                        <td v-if="editMode">{{ entry.furnit[0].price }}€ / mois</td>
                        <td>{{ price(entry) }}€</td>
                        <td v-if="!editMode">{{ displayStatus(entry.status) }}</td>
                          <!-- Part Edit -->
                         <td v-if="!editMode">
                          <el-button v-if="entry.status === 0" type="danger" icon="el-icon-edit" size="mini" circle @click="editMode = true"></el-button>
                          <!-- <el-button v-if="editMode" type="danger" icon="el-icon-check" size="mini" circle @click="editMode = false"></el-button> -->
                        </td>
                           <!-- Part Cancel -->
                        <td>
                            <el-button v-if="!editMode && entry.status < 2" type="warning" icon="el-icon-close" size="mini" circle @click="cancelRental(id, entry._id)"></el-button>
                            <el-button v-if="editMode && entry.status === 0" type="danger" icon="el-icon-close" size="mini" circle @click="editMode = false"></el-button>
                        </td>
                         <!-- Part Validate/Confirm -->
                        <td>
                           <el-button v-if="editMode && entry.status === 0" type="success" icon="el-icon-check" size="mini" circle @click="editProposition(id, entry._id)"></el-button>
                          <el-button v-if="entry.status === 1" type="success" icon="el-icon-check" size="mini" circle @click="validLoan(id, entry._id, entry.furnit_id)"></el-button>
                        </td>
                           <!-- <td v-if="!editMode">
                          <el-button type="warning" icon="el-icon-chat-line-round" size="mini" circle @click="contact(entry.owner[0]._id)"></el-button>
                        </td> -->
                      </tr>
                      </tbody>
                    </table>


              <table width="100%" v-else>
                  <col>
                  <col>
                  <col>
                  <col>
                  <col>
                  <col>
                    <thead>
                      <tr>
                        <th class="width1">Nom du locataire</th>
                        <th class="width1">Note</th>
                        <th class="width1" colspan="2">Période</th>
                        <th class="width1">Total</th>
                        <th class="width1">Statut</th>
                        <th class="width1" colspan="3">Actions</th>
                      </tr>
                      <tr style="font-weight:light;font-size: 10px">
                        <th></th>
                        <th></th>
                        <th>Début</th>
                        <th>Fin</th>
                        <th></th>
                        <th></th>
                        <th>Contacter</th>
                        <th>Refuser/Effacer</th>
                        
                        <th>Accepter</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(entry, id) in rentals" :key="id" :class="classEntry(entry.status)" >
                        <td>{{ entry.loaner[0].username}} </td>
                        <td>{{ entry.loaner[0].mark}} / 5</td>
                        <td>{{ format(entry.loan_start) }} </td>
                        <td>{{ format(entry.loan_end) }} </td>
                        <td>{{ price(entry) }}€</td>
                        <td>{{ displayStatus(entry.status) }}</td>
                          <td>
                          <el-button type="warning" icon="el-icon-chat-line-round" size="mini" circle @click="contact(entry.loaner[0]._id)"></el-button>
                        </td>
                    
                        <td>
                          <el-button v-if="entry.status < 2" type="danger" icon="el-icon-close" size="mini" circle @click="cancelRental(id, entry._id)"></el-button>
                        </td>
                          <td>
                            <el-button v-if="entry.status === 0" type="success" icon="el-icon-check" size="mini" circle @click="acceptLoan(id, entry._id, entry.furnit[0]._id, entry.loan_start, entry.loan_end)"></el-button>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </el-col>
                </el-row>
            </el-form> 
            </el-main>
        </el-container>
         <footer-component></footer-component>
    </div>
</template>

<script>
import NavComponent from './../Navigation/NavComponent';
import FooterComponent from './../Footer/FooterComponent';
import BreadcrumpComponent from './../Utils/BreadcrumpComponent';
import RentalService from './../../Service/RentalService';
import FurnitService from './../../Service/FurnitService';
import { mapGetters } from 'vuex';
import './../../style/style.css';
// const toFormatSpecific = require('./../../utils/format');
import * as Formats from './../../utils/format.js'
const moment = require('moment');

export default {
  name: 'RentalComponent',
  components: { NavComponent, FooterComponent, BreadcrumpComponent },
  data() {
    return {
      rental_id: null,
      furnit_id: null,
      isLocation: this.$route.params.isLocation,
      confirmLoan: false,
      refuseLoan: false,
      rentals: [],
      nbColumns : 3,
      index_modified: null,
      today: new Date(),
      indisponibility: [],
      dialogVisible: false,
      validExpression: '',
      message: '',
      titleDialog: '',
      url: {},
      dateProposition: [],
      editMode: false
    }
  },
  computed: {
    ...mapGetters({
      loaner: 'GET_LOAN',
    }),
    pathToMyRentals () {
      let path = [];
      this.isLocation ? path[0] = 'Locations': path[0] = 'Demands';
      console.log("avant path");
      console.log(this.rentals);
      if (this.rentals[0]) path[1] = this.rentals[0].furnit[0].name;
      console.log('PATH');
      console.log(path);
      return path;
    },
 },
 async created() {
   let context = this;

    if (this.loaner) {
      console.log('Loaner');
      console.log(this.rental_id);
      this.furnit_id = this.$route.params.id;
      let parameters = {
        params: {
          furnit_id: this.furnit_id,
          isLocation: this.isLocation,
          loaner: this.loaner
        }
      }
      RentalService.getAllRentalsForFurnit(parameters).then(function(rentals) {
        console.log('Rentals');
        console.log(rentals);
      let rtls = rentals.rentals;
      context.rentals = rtls.filter(rt => rt.status !== -2);
      context.rentals.forEach(function(rt) {
        if (rt.status === 0) {
            context.dateProposition =  [rt.loan_start, rt.loan_end];
        }
      })
      console.log(context.rentals);
      context.indisponibility = context.rentals[0].furnit[0].indisponible;
      context.limitStartLoan = context.rentals[0].furnit[0].loanstart;
      context.limitEndLoan = context.rentals[0].furnit[0].loan_end;
      
      // context.dateRental = [context.dateStart, context.dateEnd];
    //     let picture_ids = context.rentals[0].furnit[0].picture_ids;
    //        if (picture_ids && picture_ids.length > 0) {
    //         FurnitService.getImagesUrlFromPicIds(picture_ids).then(function(urls) {
    //         context.url = urls.imgUrl;
    //         console.log(context.url);
    //         }).catch(function(err) {
    //         console.log(err);
    //     });
    // }
    }).catch(function(err) {
        console.log(err);
      });
    //   RentalService.getRentalById(this.rental_id).then(function(rental) {
    //   console.log('Rental');
    //   console.log(rental);
    //   context.rentals.push(rental.rental);
    //   console.log('context Rentals');
    //   console.log(context.rentals);
    //   context.dateProposition =  [context.rentals[0].loan_start, context.rentals[0].loan_end];
    //   // context.dateEnd = rental.loan_end;
    //   context.indisponibility = context.rentals[0].furnit[0].indisponible;
    // //   console.log(context.dateDisponibility);
    //  let picture_ids = rental.rental.furnit[0].picture_ids;
    //        if (picture_ids && picture_ids.length > 0) {
    //     FurnitService.getImagesUrlFromPicIds(picture_ids).then(function(urls) {
    //         context.url = urls.imgUrl;
    //         console.log(context.url);
    //         }).catch(function(err) {
    //         console.log(err);
    //     });
    // }
    //   }).catch(function(err) {
    //     console.log(err);
    //   });
    } 
    else { // if user is a renter
      console.log('Renter');
      this.furnit_id = this.$route.params.id;
      let parameters = {
        params: {
          furnit_id: this.furnit_id,
          isLocation: this.isLocation,
          loaner: this.loaner
        }
      }
      RentalService.getAllRentalsForFurnit(parameters).then(function(rentals) {
      console.log('Rentals');
      console.log(rentals);
      let rtls = rentals.rentals;
      context.rentals = rtls.filter(rt => rt.status !== -1);
      console.log(context.rentals);
      context.indisponibility = context.rentals[0].furnit[0].indisponible;
      context.limitStartLoan = context.rentals[0].furnit[0].loanstart;
      context.limitEndLoan = context.rentals[0].furnit[0].loan_end;
      // context.dateRental = [context.dateStart, context.dateEnd];
        let picture_ids = context.rentals[0].furnit[0].picture_ids;
           if (picture_ids && picture_ids.length > 0) {
            FurnitService.getImagesUrlFromPicIds(picture_ids).then(function(urls) {
            context.url = urls.imgUrl;
            console.log(context.url);
            }).catch(function(err) {
            console.log(err);
        });
    }
    }).catch(function(err) {
        console.log(err);
      });
    }
  },
  methods: {
      format (date) {
          return Formats.toFormatSpecific(date, 'DD/MM/YY');
      },
      classEntry(status) {
        if (status === -2 || status === -1) return 'isRefused'
        else if (status === 0) return 'isProposed'
        else if (status === 1) return 'isAccepted'
        else if (status === 2) return 'isConfirmed'
      },
      displayStatus(status) {
        if (this.loaner) {
          if (status === 0) return 'Attente de réponse'
          else if (status === 1) return 'Confirmez pour valider définitivement la location'
          else if (status === 2) return 'Location confirmée'
          else if (status === -2) return 'Confirmation refusée'
          else if (status === -1) return 'Refusée'
          else return ''
        } else {
          if (status === 0) return 'Proposition'
          else if (status === 1) return 'Attente de confirmation finale'
          else if (status === 2) return 'Location validée'
          else if (status === -1) return 'Proposition refusée'
          else if (status === -2) return 'Annulée'
          else return ''
        }
      },
      price (rt) {
        if (!this.loaner || !this.editMode) {
          let price = rt.furnit[0].price;
          let a = moment(rt.loan_start);
          let b = moment(rt.loan_end);
          return b.diff(a, 'month') * price;
        } else {
          let price = rt.furnit[0].price;
          let a = moment(this.dateProposition[0]);
          let b = moment(this.dateProposition[1]);
          return b.diff(a, 'month') * price;
        }
      },
      isIndisponible (data) {
        let date = data.day;
        let i;
        for (i = 0; i < this.indisponibility.length; i++) {
          const dateStart = this.indisponibility[i].start;
          const dateEnd = this.indisponibility[i].end;
          if (moment(date).isBetween(dateStart, dateEnd) && moment(date).isBetween(this.limitStartLoan, this.limitEndLoan)) return true
        }
        if (i === this.indisponibility.length) return false
      },
      editProposition (id, rental_id) {
        let context = this;
        console.log('Test editProposition');
        this.rental_id = rental_id;
        console.log(this.rental_id);
        console.log(this.dateProposition[0]);
        console.log(this.dateProposition[1]);
        let params = {rental_id: this.rental_id, statusCheck: 0, loan_start: this.dateProposition[0], loan_end: this.dateProposition[1]};
        RentalService.updateRental(params).then(function(resp) {
          console.log('resp');
          if (resp.success) {
            context.rentals[id].loan_start = context.dateProposition[0];
            context.rentals[id].loan_end = context.dateProposition[1];
          }
          context.editMode = false;
          context.$message = "La modification de la proposition a été prise en compte";
          console.log(resp);
        });
      },
      confirm (rental_id) {
        let params = {
            rental_id: rental_id
        };
        if (this.loaner) {
          params.statusCheck = 1;
          params.status = 2;
        } else {
          params.statusCheck = 0;
          params.status = 1;
        }
        let context = this;
        RentalService.updateRental(params).then(function(rt) {
            console.log('Update rental');
            console.log(rt.rental);
            context.rentals[context.index_modified].status = params.status;
            context.dialogVisible = false;
          }).catch(function(err) {
              console.log(err);
          })
      },
      // Renter accepts rental when status = 0
      acceptLoan(index_modified, rental_id, furnit_id, start, end){
        let context = this;
        RentalService.isRentable(furnit_id, start, end).then(function(res) {
          console.log("isRentable");
          console.log(res);
          context.index_modified = index_modified;
          context.refuseLoan = false;
          if (res.maxStatus === 0) {
            context.rental_id = rental_id;
            context.confirmLoan = true;
            context.titleDialog = 'Confirmation';
            context.validExpression = "Accepter";
            context.message = "Confirmez-vous que vous acceptez cette proposition ? Le demandeur devra confirmer cette offre pour valider la location";
          }
          else {
              context.confirmLoan = false;
              context.titleDialog = 'Erreur';
              if (res.maxStatus === 1) context.message = "Vous avez déjà accepté une location (non confirmée) qui chevauche celle-ci. Annulez l'autre proposition pour accepter celle-ci";
              if (res.maxStatus === 2) context.message = "Vous avez déjà une location prévue qui chevauche celle-ci";
          }
          context.dialogVisible = true;
        }).catch(function(err) {
          console.log(err);
        });
      },
      // Loaner confirms rental when status = 1. Location becomes valid
      validLoan(index_modified, rental_id, furnit_id){
        this.index_modified = index_modified;
        this.rental_id = rental_id;
        this.furnit_id = furnit_id;
        this.titleDialog = "Confirmation de la location";
        this.dialogVisible = true;
        this.confirmLoan = true;
        this.validExpression = "Confirmer";
        this.message = "Confirmez-vous la location de ce meuble ? Le propriétaire ne pourra plus louer son meuble aux dates indiquées"
          
      },
      contact(id) {
        this.$router.push({ name: 'Chat',  params: { interlocutor_id: id } });
      },
      cancelRental (index_modified, rental_id) {
        console.log('cancel Rental');
        this.index_modified = index_modified;
        this.rental_id = rental_id;
        this.refuseLoan = true;
        this.titleDialog = 'Confirmation de refus';
        this.message = "Le refus ou l'annulation de la proposition sont définitifs. Confirmez-vous que vous annulez/refusez ?";
        this.dialogVisible = true;
    },
    confirmCancel() {
      if (this.loaner) {
        if (this.rentals[0].status < 0) {
          RentalService.deleteRental(this.rental_id);
          this.$router.push({ path: '/myrentals/' + this.pathToMyRentals[0]});
        } else {
          let params = {
            rental_id: this.rental_id,
            status: -2
          };
          let context = this;
          RentalService.updateRental(params).then(function(rt) {
            console.log('Update rental');
            console.log(rt.rental);
            context.dialogVisible = false;
            context.$router.push({ path: '/myrentals/' + context.pathToMyRentals[0]});
          }).catch(function(err) {
              console.log(err);
          })
      }
    } else {
      console.log('stat');
      console.log(this.index_modified);
      console.log(this.rentals[this.index_modified]);
      if (this.rentals[this.index_modified].status < 0) {
        console.log('INDICE');
        console.log(this.index_modified);
        RentalService.deleteRental(this.rental_id);
        this.rentals.splice(this.index_modified, 1);
        //  this.$router.push({ path: '/myrentals/' + this.pathToMyRentals[0]});
      }
      else {
        let context = this;
        let params = {rental_id: this.rental_id, status: -1 };
        RentalService.updateRental(params).then(function(resp) {
          console.log('resp');
          context.rentals.splice(context.index_modified, 1);
          context.editMode = false;
          context.$message = "La modification de la proposition a été prise en compte";
          // context.$router.push({ path: '/myrentals/' + this.pathToMyRentals[0]});
          console.log(resp);
        });
        
      }
      this.dialogVisible = false;
      this.refuseLoan = false;
      
     
      }

    },
  }
}

</script>



<style lang="scss" scoped>




thead tr th {
  font-weight: lighter;
}

th, td {
  // border: 1px solid #eee;
  // vertical-align: middle !important;
}

tr.isProposed td{
  background-color: #d4cb92;
}


tr.isConfirmed td{
  background-color: #92cae0;
}

tr.isAccepted td{
  background-color: #c6a9d6;
}

tr.isRefused td{
  background-color: #c48974;
  // background-color: red !important;
}

.el-form-item{
    margin-bottom: 2px !important;
}

.el-form--label-top .el-form-item__label{
    padding: 0px !important;
}

// .width-150{
//   width: 150px;
// }



/*table*/

body {
  /* font-family: Helvetica Neue, Arial, sans-serif; */
  font-size: 12px;
  color: #1E969D;
}

table {
  /* border: 2px solid #42b983;*/
  table-layout: fixed;
  border-radius: 2px; 
  background-color: #fff;
  border-collapse: collapse;
}

// table.el-calendar-table tbody tr{
//   height: 10px;
// }


th {
  background-color: #1E969D;
  color: rgba(255, 255, 255, 0.66);
}

td {
  background-color: #f9f9f9;
  text-align: center;
}

// th.width1, td.width1 {
//   width: 140px;
// } 

// th.width3, td.width3 {
//   width: 120px;
// } 

// th.width2, td.width2 {
//   width: 190px;
// } 

th, td {
  min-width: 40px;
  padding: 5px 10px;
}

th.active {
  color: #fff;
}


.actions{
    display: flex;
    justify-content: center;
     width: 150px;
}

td p.is-selected{
    color: red !important;
}

td p{
  color: #1E969D;
}

</style>


<style>

.el-calendar-table .el-calendar-day {
  height: 8vh !important;
}
</style>
