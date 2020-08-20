<template>
    <div>
      <nav-component></nav-component>
      <BreadcrumpComponent :field1="{title: loaner? 'Mes meubles' : 'Mes locations', path: '/myrentals/' + pathToMyRentals[0] }" :field2="{title: pathToMyRentals[0], path: '/myrentals/' + pathToMyRentals[0]}" :field3="{title: pathToMyRentals[1]}"></BreadcrumpComponent>
      <el-container >
        <el-main style="width:100%">
           <el-dialog
              :title="titleDialog"
              :visible.sync="dialogVisible"
              width="55%"
              >
              <span>{{ message }}</span>
              <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">Annuler</el-button>
              <el-button v-if="confirmLoan && !refuseLoan" type="primary" @click="confirm(rental_id, index_modified)">Accepter la demande</el-button>
              <el-button v-if="!confirmLoan && !refuseLoan" type="primary" @click="dialogVisible = false">ok</el-button>
              <el-button v-if="refuseLoan" type="primary" @click="confirmCancel()">Refuser la proposition</el-button>
              </span>
          </el-dialog>
          
          <el-form label-position="top" label-width="80px">
            <!-- <el-row style="margin-bottom:4vh;">
                <el-col :span="5">
                  <span class="f-left pointer" style="font-weight:bold;font-size:18px;"><router-link v-if="rentals[0]" :to="{ name: 'Furnit', params: { id: rentals[0].furnit[0]._id }}" tag="span">{{rentals[0].furnit[0].name}}</router-link></span>
                  </el-col>
                  <el-col :span="5">
                    <span class="f-right pointer" style="font-size:16px" ><router-link v-if="rentals[0]" :to="{ name: 'Furnit', params: { id: rentals[0].furnit[0]._id }}" tag="span">Réf: {{rentals[0].furnit[0]._id}}</router-link></span>
                  </el-col>
            </el-row> -->
              <el-row>
                                    <!-- <el-form-item label="Disponibilité">
                                     
                                        <el-date-picker
                                            v-model="dateDisponibility"
                                            type="daterange"
                                            range-separator="au"
                                            start-placeholder="Début"
                                            end-placeholder="Fin"
                                            format="dd/MM/yyyy"
                                            size="mini"
                                            :picker-options="readonly"
                                            :disabled="false">
                                            </el-date-picker>
                                    </el-form-item> -->
                <el-col :span="9">
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

            <el-col  :span="14" :offset="1">

              <!-- <el-row v-if="loaner && rentals[0] && rentals[0].status == 0">
                <h4>Votre proposition de location</h4>
                <div v-if="!editMode">
                  <p>Du {{ format(dateStart) }} Au {{ format(dateEnd) }}</p>
                  <p>Statut: En attente de réponse</p>  
                  <el-button type="success" size="mini" plain @click="editMode = true">Editer</el-button>
                  <el-button type="danger" size="mini" plain @click="cancelRental">Annuler la demande</el-button>
                </div>
                <div v-else>
                  <el-form-item label="Période de location">
                    <el-date-picker
                      v-model="dateRental"
                      type="daterange"
                      range-separator="au"
                      start-placeholder="Début"
                      end-placeholder="Fin"
                      format="dd/MM/yyyy"
                      size="mini">
                  </el-date-picker>
                  </el-form-item>
                  <el-button type="success" size="mini" plain @click="modifyRental">Modifier</el-button>
                  <el-button type="warning" size="mini" plain @click="editMode = false">Revenir</el-button>
                </div>
              </el-row> -->

              <div >
                <el-row style="font-size:18px;margin-bottom: 5vh;font-weight:bold;">
                  <span class="f-left">Vos demandes</span>
                </el-row>
                <el-row style="margin-bottom: 2vh;">
                    <span class="f-left" style="font-size:14px"></span>
                </el-row>
                <table width="100%">
                  <col >
                  <col >
                  <col >
                  <col>
                  <col>
                  <col>
                
                    <thead>
                      <tr>
                        <th v-if="!loaner" class="width1">Nom du locataire</th>
                        <th v-if="loaner && !editMode" class="width1">Nom du propriétaire</th>
                        <th v-if="!editMode" class="width1">Note</th>
                        <th class="width1" colspan="2">Période</th>
                        <th v-if="editMode" class="width1">Prix</th>
                        <th class="width1">Total</th>
                        <th v-if="!editMode" class="width1">Statut</th>
                        <th v-if="!loaner" class="width1" colspan="3">Actions</th>
                        <th v-if="loaner && !editMode" class="width2" colspan="3">Actions</th>
                        <th v-if="loaner && editMode" class="width2" colspan="2">Actions</th>
                      </tr>
                      <tr style="font-weight:light;font-size: 10px">
                        <th v-if="!editMode"></th>
                        <th v-if="!editMode"></th>
                        <th>Début</th>
                        <th>Fin</th>
                        <th></th>
                        <th></th>
                        <th v-if="!loaner">Accepter</th>
                        <th v-if="!loaner">Refuser</th>
                        <th v-if="!loaner">Contacter</th>
                         <th v-if="loaner && !editMode && rentals[0].status === 1">Confirmer</th>
                        <th v-if="loaner && !editMode && rentals[0].status === 0">Editer</th>
                        <th v-if="loaner && !editMode">Annuler</th>
                         <th v-if="loaner && !editMode">Contacter</th>
                          <th v-if="editMode">Annuler</th>
                         <th v-if="editMode">Valider</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr :class="{isProposed: entry.status === 0 , isAccepted: entry.status === 1 ,isRefused: entry.status === -2, isRefused: entry.status === -1, isConfirmed: entry.status === 2}" v-for="(entry, id) in rentals" :key="id">
                        <td v-if="!loaner">{{ entry.loaner[0].username}} </td>
                        <td v-if="loaner && !editMode">{{ entry.owner[0].username}} </td>
                        <td v-if="!loaner">{{ entry.loaner[0].mark}} / 5</td>
                         <td v-if="loaner && !editMode">{{ entry.owner[0].mark}} / 5</td>
                        <td v-if="!editMode">{{ format(entry.loan_start) }} </td>
                        <td v-if="!editMode">{{ format(entry.loan_end) }} </td>
                        <td v-if="loaner && editMode" colspan="2">
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
                        <td v-if="loaner && editMode">{{ entry.furnit[0].price }}€ / mois</td>
                        <td>{{ price(entry) }}€</td>
                        <td v-if="!editMode">{{ displayStatus(entry.status) }}</td>
                        <td v-if="!loaner" >
                            <el-button v-if="entry.status === 0" type="success" icon="el-icon-check" size="mini" circle @click="acceptLoan(id, entry._id, entry.furnit[0]._id, entry.loan_start, entry.loan_end)"></el-button>
                        </td>
                        <td v-if="!loaner" >
                          <el-button v-if="entry.status < 2" type="danger" icon="el-icon-close" size="mini" circle @click="cancelRental(id, entry._id)"></el-button>
                        </td>
                        <td v-if="!loaner" >
                          <el-button type="warning" icon="el-icon-chat-line-round" size="mini" circle @click="contact(entry.loaner[0]._id)"></el-button>
                        </td>
                        <td v-if="loaner && !editMode && rentals[0].status === 1">
                            <el-button v-if="entry.status === 1" type="success" icon="el-icon-check" size="mini" circle @click="confirmLoan(id, entry._id, entry.furnit[0]._id, entry.loan_start, entry.loan_end)"></el-button>
                        </td>
                        <td v-if="loaner && !editMode && rentals[0].status === 0">
                          <el-button v-if="entry.status === 0 && !editMode" type="danger" icon="el-icon-edit" size="mini" circle @click="editMode = true"></el-button>
                          <el-button v-if="entry.status === 0 && editMode" type="danger" icon="el-icon-check" size="mini" circle @click="editMode = false"></el-button>
                        </td>
                        <td v-if="loaner && !editMode" >
                          <el-button v-if="entry.status < 2" type="warning" icon="el-icon-close" size="mini" circle @click="cancelRental(id, entry._id)"></el-button>
                        </td>
                           <td v-if="loaner && !editMode">
                          <el-button type="warning" icon="el-icon-chat-line-round" size="mini" circle @click="contact(entry.owner[0]._id)"></el-button>
                        </td>
                         <td v-if="loaner && editMode">
                          <el-button type="danger" icon="el-icon-close" size="mini" circle @click="editMode = false"></el-button>
                        </td>
                         <td v-if="loaner && editMode">
                          <el-button type="success" icon="el-icon-check" size="mini" circle @click="editProposition()"></el-button>
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
      // columns: ["Nom locataire", "Note", "Début", "Fin", "Total", "Statut", "Actions"],
      rental_id: this.$route.params.rental_id,
      furnit_id: this.$route.params.furnit_id,
      isLocation: this.$route.params.isLocation,
      confirmLoan: false,
      refuseLoan: false,
      rentals: [],
      index_modified: null,
      // rental: {},
      today: new Date(),
      indisponibility: [],
      dialogVisible: false, 
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
      console.log('THIS LOANER');
      console.log(this.rental_id);
      RentalService.getRentalById(this.rental_id).then(function(rental) {
      console.log('Rental');
      console.log(rental);
      context.rentals.push(rental.rental);
      console.log('context Rentals');
      console.log(context.rentals);
      context.dateProposition =  [context.rentals[0].loan_start, context.rentals[0].loan_end];
      // context.dateEnd = rental.loan_end;
      context.indisponibility = context.rentals[0].furnit[0].indisponible;
    //   console.log(context.dateDisponibility);
     let picture_ids = rental.rental.furnit[0].picture_ids;
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
    else { // if user is a renter

      RentalService.getAllRentalsForFurnit(this.furnit_id, this.isLocation).then(function(rentals) {
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
    
    



    // RentalService.getRentalById(this.$route.params.id, this.isLoaner).then(function(rental) {
    //   console.log('result');
    //   console.log(rental);
    //   context.rental = rental.rental;
    //   console.log(context.rental);
    //   context.dateStart = context.rental.loan_start;
    //   context.dateEnd = context.rental.loan_end;
    //   context.dateRental = [context.dateStart, context.dateEnd];
    //   context.dateDisponibility = [context.rental.furnit[0].loanstart, context.rental.furnit[0].loanend];
    //   console.log(context.dateDisponibility);
    //  let picture_ids = context.rental.furnit[0].picture_ids;
    //  console.log(picture_ids);
    //  if (picture_ids && picture_ids.length > 0) {
    //     FurnitService.getImagesUrlFromPicIds(picture_ids).then(function(urls) {
    //         context.url = urls.imgUrl;
    //         console.log(context.url);
    //         }).catch(function(err) {
    //         console.log(err);
    //     });
    // }
    // }).catch(function(err) {
    //     console.log(err);
    // });


  },
  methods: {
      format (date) {
          return Formats.toFormatSpecific(date, 'DD/MM/YY');
      },
      displayStatus(status) {
        if (this.loaner) {
          if (status === 0) return 'Attente de réponse'
          else if (status === 1) return 'Confirmez et la location est planifiée'
          else if (status === 2) return 'Location confirmée'
          else if (status === -2) return 'Confirmation refusée'
          else if (status === -1) return 'Refusée'
          else return ''
        } else {
          if (status === 0) return 'Proposition'
          else if (status === 1) return 'Attente de confirmation'
          else if (status === 2) return 'Location confirmée'
          else if (status === -1) return 'Proposition refusée'
          else if (status === -2) return 'Refusée'
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
      editProposition () {
        let context = this;
        let params = {rental_id: this.rental_id, statusCheck: 0, loan_start: this.dateProposition[0], loan_end: this.dateProposition[1]};
        RentalService.updateRental(params).then(function(resp) {
          console.log('resp');
          if (resp.success) {
            context.rentals[0].loan_start = context.dateProposition[0];
            context.rentals[0].loan_end = context.dateProposition[1];
          }
          context.editMode = false;
          context.$message = "La modification de la proposition a été prise en compte";
          console.log(resp);
        });
      },
      confirm (rental_id) {
        let params = {
            statusCheck: 1,
            id: rental_id
        };
        let context = this;
        RentalService.updateRental(params).then(function(rt) {
            console.log('Update rental');
            console.log(rt.rental);
            // rt.status = 1;
            context.rentals[context.index_modified].status = 1;
            context.dialogVisible = false;
          }).catch(function(err) {
              console.log(err);
          })
      },
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
            context.message = "Confirmez-vous que vous acceptez cette proposition. Le demandeur devra confirmer cette offre pour valider la location";
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
      contact(id) {
        this.$router.push({ name: 'Chat',  params: { interlocutor_id: id } });
      },
      cancelRental (index_modified, rental_id) {
        console.log('cancel Rental');
        this.index_modified = index_modified;
        this.rental_id = rental_id;
        this.refuseLoan = true;
        this.titleDialog = 'Confirmation de refus';
        this.message = "Le refus de la proposition est définitif. Confirmez-vous que vous refusez ?";
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
            context.$router.push({ path: '/myrentals/' + this.pathToMyRentals[0]});
          }).catch(function(err) {
              console.log(err);
          })
      }
    } else {
      RentalService.deleteRental(this.rental_id);
      this.dialogVisible = false;
      this.refuseLoan = false;
      this.rentals.splice(this.index_modified, 1);
      }

    },
    async modifyRental ()
    {
        // let context = this;
        // this.rental.loan_start = this.dateRental[0];
        // this.rental.loan_end = this.dateRental[1];
        // this.dateStart = this.dateRental[0];
        // this.dateEnd = this.dateRental[1];
        // this.dateRental = [this.dateRental[0], this.dateRental[1]];
        // this.editMode = false;
        // console.log('Rentals to be modified');
        //  console.log(this.rentals);
        //   RentalService.updateRental(this.rentals).then(function(rt) {
        //     console.log('Update rental');
        //     console.log(rt.rental);
        //     context.rental = rt.rental;
        //     // context.dateStart = rt.rental.loan_start;
        //     // context.dateEnd = rt.rental.loan_end;
        //     // context.dateRental = [rt.rental.loan_start, rt.rental.loan_end];
        //     //   context.editMode = false;
        //     //   rt.rental.furnit = [];
        //     //   rt.rental.furnit[0] = context.furnit_proposition.furnit;
        //     //   let index = Object.keys(context.imgUrl).length;
        //     //   context.imgUrl[index] = context.furnit_proposition.imgUrl[0];
        //     //  context.rentals.push(rt.rental);
        //     //  context.proposition_id = null;
        //   }).catch(function(err) {
        //       console.log(err);
        //   }) 
    },
  }
}

</script>



<style lang="scss" scoped>

// table {
//   width:100%;
//   margin-bottom:0 !important;
// }

// table, th {
//   text-align: center;
//   width: 25%;
// }

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

table.el-calendar-table tbody tr{
  height: 10px;
}

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
</style>
