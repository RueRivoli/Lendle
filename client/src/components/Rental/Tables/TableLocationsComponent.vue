<template>
  <div>
    <table width="100%" v-if="loaner">
      <col><col><col><col><col><col>
      <thead>
        <tr>
          <th colspan="2">Période</th>
          <th>Prix total</th>
          <th>Statut</th>
          <th>Payé</th>
          <th>Retourné</th>
          <th>Avis</th>
          <th>Réclamation</th>
          <th>Archiver</th>
          <th>Contacter</th>
        </tr>
        <tr style="font-weight:light;font-size: 10px">
          <th>Début</th>
          <th>Fin</th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, id) in rentals" :key="id" :class="classEntry(entry)">
          <td>{{ format(entry.loan_start) }} </td>
          <td>{{ format(entry.loan_end) }} </td>
          <td>{{ price(entry) }}€</td>
          <td>{{ displayStatus(entry.status) }}</td>
          <td>{{ entry.paid ? 'Oui': 'Non'  }}</td>
          <td>{{ entry.returned ? 'Oui': 'Non' }}</td>
          <td>
                <el-button type="success" icon="el-icon-postcard" size="mini" circle @click="giveReview(entry._id)"></el-button>
          </td>
          <td>
                <el-button type="danger" icon="el-icon-chat-line-square" size="mini" circle @click="claimDispute(entry._id)"></el-button>
          </td>
           <td>
                <el-button v-if="isCancelable(entry)" type="danger" icon="el-icon-close" size="mini" circle @click="cancelRental(id, entry._id)"></el-button>
           </td>
            <td>
                <el-button type="warning" icon="el-icon-chat-line-round" size="mini" circle @click="contact(entry.loaner[0]._id)"></el-button>
            </td>
          </tr>
        </tbody>
      </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as Formats from './../../../utils/format.js';
const moment = require('moment');
import RentalService from './../../../Service/RentalService';

export default {
  name: 'TableLocationsComponent',
  components: {},
  props: {
    rentals: Array,
    dateProposition: Array
  },
  data() {
    return {
      editMode: false,
      today: new Date()
    }
  },
  async created() {
  },
  computed: {
    ...mapGetters({
      loaner: 'GET_LOAN',
    })
 },
  methods: {
    format (date) {
          return Formats.toFormatSpecific(date, 'DD/MM/YY');
    },
    classEntry(rt) {
        if (rt.status === 2 && !this.isFinished(rt)) return 'isProposed'
        else if (status === 1) return 'isAccepted'
        else if (status === 2) return 'isConfirmed'
    },
    displayStatus(rt, status) {
        let finished = this.isFinished(rt);
        if (this.loaner) {
          if (!finished) return 'En cours'
          else {
              if (rt.paid && rt.returned) return 'Finalisé'
          }
        } else {
          if (status === 0) return 'Proposition'
          else if (status === 1) return 'Attente de confirmation finale'
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
      contact(id) {
        this.$router.push({ name: 'Chat',  params: { interlocutor_id: id } });
      },
      isCancelable (rt) {
          let finished = this.isFinished(rt);
          let reviewed;
          this.loaner ? reviewed = rt.review_loaner : rt.review_renter
          return rt.paid && rt.returned && reviewed && finished
      },
      isFinished(rt) {
        let today = moment(new Date());
        let finished = moment(rt.loan_end).isBefore(today);
        return finished;
      },
      cancelRental (index_modified, rental_id) {
        console.log('cancel Rental');
        this.$emit('display-dialog', 
          { 
            refuseLoan: true, 
            titleDialog: 'Confirmation',
            message: 'Si vous archivez cette location, elle sera supprimé définitivement. Confirmez-vous que vous l archivation ?', 
            dialogVisible: true 
          });
        this.$emit('change-rental', 
          { 
            index_modified: index_modified, 
            rental_id: rental_id,
          });
    },
    editProposition (id, rental_id) {
        let context = this;
        this.$emit('change-rental', 
          { 
            index_modified: id, 
            rental_id: rental_id,
          });

        let params = {rental_id: rental_id, statusCheck: 0, loan_start: this.dateProposition[0], loan_end: this.dateProposition[1]};
        RentalService.updateRental(params).then(function(resp) {
          if (resp.success) {
            context.rentals[id].loan_start = context.dateProposition[0];
            context.rentals[id].loan_end = context.dateProposition[1];
          }
          context.editMode = false;
          context.$message = "La modification de la proposition a été prise en compte";
          console.log(resp);
        });
      },
     validLoan(index_modified, rental_id, furnit_id){
         this.$emit('change-rental', 
          { 
            index_modified: index_modified, 
            rental_id: rental_id,
            furnit_id: furnit_id
          });
        this.$emit('display-dialog', { refuseLoan: false, confirmLoan: true, validExpression: 'Confirmer', titleDialog: 'Confirmation de la location', message: 'Confirmez-vous la location de ce meuble ? Le propriétaire ne pourra plus louer son meuble aux dates indiquées', dialogVisible: true });
      },
    confirmCancel() {
      if (this.loaner) {
        if (this.rentals[this.index_modified].status < 0) {
          RentalService.deleteRental(this.rental_id);
          this.$router.push({ path: '/myrentals/Demands'});
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
            context.$router.push({ path: '/myrentals/Demands'});
          }).catch(function(err) {
              console.log(err);
          })
      }
    } else {
      if (this.rentals[this.index_modified].status < 0) {
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
    acceptLoan(index_modified, rental_id, furnit_id, start, end){
        let context = this;
        RentalService.isRentable(furnit_id, start, end).then(function(res) {
          console.log("isRentable");
          console.log(res);
          context.index_modified = index_modified;
          if (res.maxStatus === 0) {
            context.rental_id = rental_id;
             context.$emit('display-dialog', 
              { 
                refuseLoan: false, 
                confirmLoan: true, 
                validExpression: 'Accepter', 
                titleDialog: 'Confirmation', 
                message: 'Confirmez-vous que vous acceptez cette proposition ? Le demandeur devra confirmer cette offre pour valider la location', 
                dialogVisible: true });
          }
          else {
              let msg;
              if (res.maxStatus === 1) msg = "Vous avez déjà accepté une location (non confirmée) qui chevauche celle-ci. Annulez l'autre proposition pour accepter celle-ci";
              if (res.maxStatus === 2) msg = "Vous avez déjà une location prévue qui chevauche celle-ci";
              context.$emit('display-dialog', 
                { 
                  confirmLoan: false, 
                  validExpression: 'Accepter', 
                  titleDialog: 'Erreur', 
                  message: msg, 
                  dialogVisible: true 
                });
          }
        }).catch(function(err) {
          console.log(err);
        });
      },
  }
}
</script>

<style lang="scss" scoped>

thead tr th {
  font-weight: lighter;
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

.actions{
    display: flex;
    justify-content: center;
     width: 150px;
}

th, td {
  min-width: 40px;
  padding: 5px 10px;
}

th.active {
  color: #fff;
}

th {
  background-color: #1E969D;
  color: rgba(255, 255, 255, 0.66);
}

td {
  background-color: #f9f9f9;
  text-align: center;
}

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
</style>
