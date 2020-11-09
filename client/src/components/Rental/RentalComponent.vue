<template>
<div>
    <nav-component></nav-component>
    <BreadcrumpComponent :field1="{title: loaner? 'Mes meubles' : 'Mes locations', path: '/myrentals/' + pathToMyRentals[0] }" :field2="{title: pathToMyRentals[0], path: '/myrentals/' + pathToMyRentals[0]}" :field3="{title: pathToMyRentals[1]}"></BreadcrumpComponent>
    <el-container>
        <el-main style="width:100%; height: 76.3vh;">
            <el-dialog :title="titleDialog" :visible.sync="dialogVisible" width="55%">
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
                    <el-col :span="22" :offset="1">
                        <TitleComponent text="Vos demandes" />
                            <el-row>
                              <el-button v-if="!loaner && tableFocus" icon="el-icon-notebook-1" type="success" size="mini" @click="tableFocus = false" round>Agenda</el-button>
                              <el-button v-if="!loaner && !tableFocus" icon="el-icon-monitor" type="primary" size="mini" @click="tableFocus = true" round>Tableau</el-button>
                              <div v-if="!loaner && !tableFocus" style="float:right;">
                                <el-row v-if="isLocation !== '1' && demandsattributes.length > 0" style="margin-bottom:5px;">
                                    <span style="margin-right:20px;">Demandes</span>
                                    <!-- <md-chip class="md-primary" md-deletable>Deletable</md-chip> -->
                                    <template v-for="(d, ind) in demandsattributes" >
                                        <el-button :key="ind" icon="el-icon-user-solid" :class="'background-'+ d.dot" style="color: grey" size="mini" @click="tableFocus = true" round>{{d.key}}</el-button>
                                        <!-- <el-button icon="el-icon-user-solid" type="info" size="mini" @click="tableFocus = true" round>Marie Frue</el-button> -->
                                    </template>
                                </el-row>
                                 <el-row v-if="locationsattributes.length > 0">
                                    <span style="margin-right:20px;">Locations</span>
                                        <template v-for="(d, ind) in locationsattributes" >
                                        <el-button :key="ind" icon="el-icon-user-solid" :class="'background-'+ d.highlight.color" size="mini" @click="tableFocus = true" round>{{d.key}}</el-button>
                                          </template>
                                </el-row>
                              </div>
                            </el-row>
                          <div class="m-t-10" v-if="tableFocus">
                             <table-demands-component v-if="$route.params.isLocation === '0'" :colors="colorsSelected" :rentals="demands" :dateProposition="dateProposition" @display-dialog="displayDialog" @change-rental="changeRental"></table-demands-component>
                            <table-locations-component v-if="$route.params.isLocation === '1'" :rentals="locations" @display-dialog="displayDialog" @change-rental="changeRental"></table-locations-component>
                          </div>
                          <div class="m-t-10" v-else>
                             <vc-calendar :rows="2" :dates="dates" :attributes="selectAttributes()" :columns="$screens({ default: 1, desktop: 2 })" is-dark is-expanded title-position="left"/>
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
import TableDemandsComponent from './Tables/TableDemandsComponent';
import TableLocationsComponent from './Tables/TableLocationsComponent';
import RentalService from './../../Service/RentalService';
import TitleComponent from './../Utils/TitleComponent';

import { mapGetters } from 'vuex';
const moment = require('moment');

export default {
    name: 'RentalComponent',
    components: {
        NavComponent,
        FooterComponent,
        BreadcrumpComponent,
        TableDemandsComponent,
        TitleComponent,
        TableLocationsComponent,

    },
    data() {
        return {
            rental_id: null,
            furnit_id: null,
            isLocation: this.$route.params.isLocation,
            confirmLoan: false,
            refuseLoan: false,
            rentals: [],
            index_modified: null,
            today: new Date(),
            indisponibility: [],
            dialogVisible: false,
            validExpression: '',
            message: '',
            titleDialog: '',
            dateProposition: [],
            dates: [
                { start: new Date(2020, 11, 10), end: new Date(2020, 11, 17) },
                { start: new Date(2020, 11, 5), span: 3 } // # of days
            ],
            tableFocus: true,
            attributes: [
                  {
                    key: 'today',
                    highlight: {
                      color: 'red',
                      fillMode: 'light',
                      contentClass: 'italic',
                    },
                    dates: new Date()
                  },
                //   {
                //       dot: 'blue',
                //       dates: { start: new Date(2020, 10, 10), end: new Date(2020, 10, 17) }
                //   },
                //   {
                //       dot: {
                //         color: 'orange',
                //         // fillMode: 'none',
                //       },
                //       dates: { start: new Date(2020, 10, 15), end: new Date(2020, 10, 25) }
                //   },
            ],
            value: '',
            colors: ['indigo', 'pink', 'orange', 'blue', 'cyan', 'skyblue', 'red', 'yellow', 'green', ],
            colorsSelected: []
        }
    },
    computed: {
        ...mapGetters({
            loaner: 'GET_LOAN',
        }),
        demandsattributes() {
            return this.attributes.filter(att => att.dot);
        },
        locationsattributes() {
            return this.attributes.filter(att => att.highlight && att.key !== 'today');
        },
        demands () {
             return this.rentals.filter(rt => rt.status < 2);
        },
        locations () {
            return this.rentals.filter(rt => rt.status >= 2);
        },
        pathToMyRentals() {
            let path = [];
            this.isLocation ? path[0] = 'Locations' : path[0] = 'Demands';
            if (this.rentals[0]) path[1] = this.rentals[0].furnit[0].name;
            return path;
        },
    },
    async created() {
        this.furnit_id = this.$route.params.id;
        let parameters = {
            params: {
                furnit_id: this.furnit_id,
                isLocation: this.isLocation,
                loaner: this.loaner
            }
        }
        let context = this;
        RentalService.getAllRentalsForFurnit(parameters).then(function (rentals) {
            console.log('Rentals');
            console.log(rentals);
            let rtls = rentals.rentals;
            if (context.loaner) {
                context.rentals = rtls.filter(rt => rt.status !== -2);
                context.rentals.forEach(function (rt) {
                    if (rt.status === 0) {
                        context.dateProposition = [rt.loan_start, rt.loan_end];
                    }
                })
            } else context.rentals = rtls.filter(rt => rt.status !== -1);
            context.indisponibility = context.rentals[0].furnit[0].indisponible;
            context.limitStartLoan = context.rentals[0].furnit[0].loanstart;
            context.limitEndLoan = context.rentals[0].furnit[0].loan_end;
        console.log('RENTALS');
        console.log(context.rentals);
       
      if (!context.loaner) {
          let i = 0;
          while (context.rentals[i]) {
              console.log(i);
              let status = context.rentals[i].status;
              console.log('status ' + status)
              if (status >= 0) {
                console.log(i % 10);
                let color = context.colors[i % 10];
                context.colorsSelected.push(color);
                let new_attribute = { 
                    key: context.rentals[i].loaner[0].username,
                    dates: {
                        start: context.rentals[i].loan_start,
                        end: context.rentals[i].loan_end,
                  }
                }
                if (status >= 2) {
                      new_attribute.highlight = {
                      color: color,
                      fillMode: 'light',
                      contentClass: 'italic',
                    }
                } else {
                    new_attribute.dot = color
                }
                context.attributes.push(new_attribute)
              }
            i++;
          } } else {
          let i = 0;
          while (context.rentals[i]) {
              let status = context.rentals[i].status;
              console.log('status ' + status)
              if (status >= 0) {
                context.attributes.push({
                  key: 'Proposition',
                  title: context.rentals[i].renter[0].username,
                  highlight: context.colors[status],
                  dates: {
                      start: context.rentals[i].loan_start,
                      end: context.rentals[i].loan_end,
                  }
                })
              }
            i++;
          }
      }
        }).catch(function (err) {
            console.log(err);
        });
    },
    methods: {
        displayDialog(payload) {
            console.log('DISPLAY DIALOG');
            console.log(payload.index_modified);
            this.rental_id = payload.rental_id;
            this.index_modified = payload.index_modified;
            this.dialogVisible = payload.dialogVisible;
            this.titleDialog = payload.titleDialog;
            this.refuseLoan = payload.refuseLoan;
            this.message = payload.message;
            this.confirmLoan = payload.confirmLoan;
            this.validExpression = payload.validExpression;
        },
        changeRental(payload) {
            this.index_modified = payload.index_modified;
            this.rental_id = payload.rental_id;
        },
        selectAttributes() {
            console.log('select  Attri');
             console.log(this.isLocation);
            if (this.isLocation === '1') {
                console.log('les locations');
                console.log(this.locations);
                return this.locationsattributes
            }
            else return this.demandsattributes
        },
        isIndisponible(data) {
            let date = data.day;
            let i;
            for (i = 0; i < this.indisponibility.length; i++) {
                const dateStart = this.indisponibility[i].start;
                const dateEnd = this.indisponibility[i].end;
                if (moment(date).isBetween(dateStart, dateEnd) && moment(date).isBetween(this.limitStartLoan, this.limitEndLoan)) return true
            }
            if (i === this.indisponibility.length) return false
        },
        confirm(rental_id) {
            console.log('RENTAL ID' + rental_id);
            let params = {
                _id: rental_id
            };
            if (this.loaner) {
                params.statusCheck = 1;
                params.status = 2;
            } else {
                params.statusCheck = 0;
                params.status = 1;
            }
            let context = this;
            RentalService.updateRental(params).then(function (rt) {
                console.log('Update rental');
                console.log(rt.rental);
                 console.log('index modif');
                console.log(context.index_modified);
                console.log(context.rentals[context.index_modified]);
                 console.log(params);
                context.rentals[context.index_modified].status = params.status;
                context.dialogVisible = false;
            }).catch(function (err) {
                console.log(err);
            })
        },
        confirmCancel() {
            if (this.loaner) {
                if (this.rentals[this.index_modified].status < 0) {
                    RentalService.deleteRental(this.rental_id);
                    this.$router.push({
                        path: '/myrentals/' + this.pathToMyRentals[0]
                    });
                } else {
                    let params = {
                        _id: this.rental_id,
                        status: -2
                    };
                    let context = this;
                    RentalService.updateRental(params).then(function (rt) {
                        console.log('Update rental');
                        console.log(rt.rental);
                        context.dialogVisible = false;
                        context.$router.push({
                            path: '/myrentals/' + context.pathToMyRentals[0]
                        });
                    }).catch(function (err) {
                        console.log(err);
                    })
                }
            } else {
                if (this.rentals[this.index_modified].status < 0) {

                    RentalService.deleteRental(this.rental_id);
                    this.rentals.splice(this.index_modified, 1);
                    //  this.$router.push({ path: '/myrentals/' + this.pathToMyRentals[0]});
                } else {
                    let context = this;
                    let params = {
                        _id: this.rental_id,
                        status: -1
                    };
                    RentalService.updateRental(params).then(function (resp) {
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
        }
    }
}
</script>

<style lang="scss" scoped>
thead tr th {
    font-weight: lighter;
}



.el-form-item {
    margin-bottom: 2px !important;
}

.el-form--label-top .el-form-item__label {
    padding: 0px !important;
}


td p.is-selected {
    color: red !important;
}

td p {
    color: #1E969D;
}



h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

</style>

<style>

.family{
    background-color:red !important;
}

.el-calendar-table .el-calendar-day {
    height: 8vh !important;
}


.el-calendar.laptop .el-calendar__button-group .el-button-group .el-button{
     padding: 7px 12px; 
}
</style>
