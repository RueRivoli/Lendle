<template>
<div>
    <nav-component></nav-component>
    <BreadcrumpComponent :field1="{title: loaner? 'Mes meubles' : 'Mes locations', path: '/myrentals/' + pathToMyRentals[0] }" :field2="{title: pathToMyRentals[0], path: '/myrentals/' + pathToMyRentals[0]}" :field3="{title: pathToMyRentals[1]}"></BreadcrumpComponent>
    <el-container>
        <el-main style="width:100%; height:76.3vh;">
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
                    <el-col :span="7">
                        <el-calendar v-model="today">
                            <template slot="dateCell" slot-scope="{date, data}">
                                <p :class="isIndisponible(data) ? 'is-selected' : ''">
                                    {{ data.day.split('-').slice(2).join('') }} {{ data.isSelected ? 'x' : ''}}
                                </p>
                            </template>
                        </el-calendar>
                    </el-col>

                    <el-col :span="14" :offset="2">

                        <el-row style="font-size:18px;margin-bottom: 5vh;font-weight:bold;">
                            <span class="f-left">Vos demandes</span>
                        </el-row>
                        <table-demands-component :rentals="rentals" :dateProposition="dateProposition" @display-dialog="displayDialog" @change-rental="changeRental" v-if="$route.params.isLocation === '0'">
                        </table-demands-component>
                        <table-locations-component :rentals="rentals" @display-dialog="displayDialog" @change-rental="changeRental" v-if="$route.params.isLocation === '1'">
                        </table-locations-component>

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
import {
    mapGetters
} from 'vuex';
import './../../style/style.css';
const moment = require('moment');

export default {
    name: 'RentalComponent',
    components: {
        NavComponent,
        FooterComponent,
        BreadcrumpComponent,
        TableDemandsComponent,
        TableLocationsComponent
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
            dateProposition: []
        }
    },
    computed: {
        ...mapGetters({
            loaner: 'GET_LOAN',
        }),
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
        }).catch(function (err) {
            console.log(err);
        });
    },
    methods: {
        displayDialog(payload) {
            console.log('DISPLAY DIALOG');
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
            RentalService.updateRental(params).then(function (rt) {
                console.log('Update rental');
                console.log(rt.rental);
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
                        rental_id: this.rental_id,
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
                        rental_id: this.rental_id,
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

th,
td {
    // border: 1px solid #eee;
    // vertical-align: middle !important;
}

// tr.isProposed td{
//   background-color: #d4cb92;
// }

// tr.isConfirmed td{
//   background-color: #92cae0;
// }

// tr.isAccepted td{
//   background-color: #c6a9d6;
// }

// tr.isRefused td{
//   background-color: #c48974;
//   // background-color: red !important;
// }

.el-form-item {
    margin-bottom: 2px !important;
}

.el-form--label-top .el-form-item__label {
    padding: 0px !important;
}

// .width-150{
//   width: 150px;
// }

/*table*/

// body {
//   /* font-family: Helvetica Neue, Arial, sans-serif; */
//   font-size: 12px;
//   color: #1E969D;
// }

// table {
//   /* border: 2px solid #42b983;*/
//   table-layout: fixed;
//   border-radius: 2px; 
//   background-color: #fff;
//   border-collapse: collapse;
// }

// table.el-calendar-table tbody tr{
//   height: 10px;
// }

// th {
//   background-color: #1E969D;
//   color: rgba(255, 255, 255, 0.66);
// }

// td {
//   background-color: #f9f9f9;
//   text-align: center;
// }

// th.width1, td.width1 {
//   width: 140px;
// } 

// th.width3, td.width3 {
//   width: 120px;
// } 

// th.width2, td.width2 {
//   width: 190px;
// } 

// th, td {
//   min-width: 40px;
//   padding: 5px 10px;
// }

// th.active {
//   color: #fff;
// }

// .actions{
//     display: flex;
//     justify-content: center;
//      width: 150px;
// }

td p.is-selected {
    color: red !important;
}

td p {
    color: #1E969D;
}
</style>

<style>
.el-calendar-table .el-calendar-day {
    height: 8vh !important;
}
</style>
