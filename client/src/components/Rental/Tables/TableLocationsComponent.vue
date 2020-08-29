<template>
<div>
    <table width="100%" v-if="loaner">
        <col>
        <col>
        <col>
        <col>
        <col>
        <col>
        <thead>
            <tr>
                <th>Modifier</th>
                <th colspan="2">Période</th>
                <th>Prix total</th>
                <th>Statut</th>
                <!-- <th>Payé</th>
                <th>Retourné</th>
                <th>Avis</th>
                <th>Réclamation</th> -->
                <th>Contacter</th>
                <th>Archiver</th>

            </tr>
            <tr style="font-weight:light;font-size: 10px">
                <th></th>
                <th>Début</th>
                <th>Fin</th>
                <th></th>
                <th></th>
                <!-- <th></th>
                <th></th>
                <th>Laisser un avis</th>
                <th>Pour tout souci</th> -->
                <th></th>
                <th>Ne plus faire apparaitre</th>
            </tr>
        </thead>
        <tbody>
            <template v-for="(entry, id) in rentals">
                <tr :key="id" :class="classEntry(entry)">
                    <td>
                        <el-button v-if="activename !== id" type="text" icon="el-icon-arrow-right" size="medium" style="color:black;" @click="expandLine(id)"></el-button>
                        <el-button v-if="activename === id" type="text" icon="el-icon-arrow-down" size="medium" style="color:black;" @click="expandLine(id)"></el-button>
                    </td>
                    <td>{{ format(entry.loan_start) }} </td>
                    <td>{{ format(entry.loan_end) }} </td>
                    <td>{{ price(entry) }} €</td>
                    <td>{{ displayStatus(entry, entry.status) }}</td>
                    <!-- <td>{{ entry.paid ? 'Oui': 'Non'  }}</td>
                    <td>{{ entry.returned ? 'Oui': 'Non' }}</td>
                    <td>
                        <el-button v-if="isFinished(entry)" type="success" icon="el-icon-postcard" size="mini" circle @click="giveReview(entry._id)"></el-button>
                    </td>
                    <td>
                        <el-button type="danger" icon="el-icon-chat-line-square" size="mini" circle @click="claimDispute(entry._id)"></el-button>
                    </td> -->
                    <td>
                        <el-button type="text" icon="el-icon-chat-line-round" size="medium" circle style="color:black;" @click="contact(entry.loaner[0]._id)"></el-button>
                    </td>
                    <td>
                        <el-button v-if="entry.review_loaner" type="danger" icon="el-icon-close" size="medium" circle @click="cancelRental(id, entry._id)"></el-button>
                    </td>
                </tr>
                <tr v-if="activename === id" :key="'modify_' + id">
                    <td class="finishing" :colspan="7" v-if="!isFinished(entry)">
                        <h4>Laisser un avis sur le propriétaire pour finaliser la location</h4>
                        <span style="font-style: italic;">Vos avis nous sont utiles pour connaitre nos utilisateurs</span>
                        <el-form label-position="left" label-width="180px" :model="review" :rules="rulesSimpleReview" style="margin-top: 30px;">
                            <el-form-item label="Notez le propriétaire" prop="mark" size="mini">
                                <el-rate v-model="review.mark">
                                </el-rate>
                            </el-form-item>
                            <el-form-item label="Votre avis" prop="text" size="mini">
                                <el-input type="textarea" maxlength="500" show-word-limit rows="4" v-model="review.text"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" icon="el-icon-circle-check" style="float:left;" size="mini" plain @click="save">Enregistrer</el-button>
                            </el-form-item>
                        </el-form>
                    </td>
                    <td class="canceling" :colspan="7" v-else>
                        <h4>Abandonner la location</h4>
                        <span style="font-style: italic;">En cas d'insatisfaction du propriétaire ou en cas de réelle nécessité, à ne pas abuser</span>
                        <el-form label-position="left" label-width="180px" :model="review" :rules="rulesSimpleReview" style="margin-top: 30px;">
                            <el-form-item label="Notez le propriétaire" prop="mark" size="mini">
                                <el-rate v-model="review.mark">
                                </el-rate>
                            </el-form-item>
                            <el-form-item label="Votre avis" prop="text" size="mini">
                                <el-input type="textarea" maxlength="500" show-word-limit rows="4" v-model="review.text"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="danger" icon="el-icon-circle-check" style="float:left;" size="mini" plain @click="save">Abandonner définitivement</el-button>
                            </el-form-item>
                        </el-form>
                    </td>
                </tr>
            </template>
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
                <th>Modifier</th>
                <th colspan="2">Période</th>
                <th>Prix total</th>
                <th>Statut</th>
                <!-- <th>Payé</th>
                <th>Retourné</th>
                <th>Avis</th>
                <th>Réclamation</th> -->
                <th>Contacter</th>
                <th>Archiver</th>
            </tr>
            <tr style="font-weight:light;font-size: 10px">
                <th></th>
                <th>Début</th>
                <th>Fin</th>
                <th></th>
                <th></th>
                <!-- <th></th>
                <th></th>
                <th></th>
                <th></th> -->
                <th></th>
                <th>Ne plus faire apparaitre</th>
            </tr>
        </thead>
        <tbody>
            <template v-for="(entry, id) in rentals">
                <tr :class="classEntry(entry)" :key="id" style="background-color: #b6b9db;">
                    <td>
                        <el-button v-if="activename !== id" type="text" icon="el-icon-arrow-right" style="color:black;" @click="expandLine(id)"></el-button>
                        <el-button v-if="activename === id" type="text" icon="el-icon-arrow-down" style="color:black;" @click="expandLine(id)"></el-button>
                    </td>
                    <td>{{ format(entry.loan_start) }} </td>
                    <td>{{ format(entry.loan_end) }} </td>
                    <td>{{ price(entry) }} €</td>
                    <td>{{ displayStatus(entry, entry.status) }}</td>
                    <!-- <td>
                        <el-button type="success" icon="el-icon-postcard" size="mini" circle @click="giveReview(entry._id)"></el-button>
                    </td>
                    <td>
                        <el-button type="danger" icon="el-icon-chat-line-square" size="mini" circle @click="claimDispute(entry._id)"></el-button>
                    </td> -->
                    <td>
                        <el-button type="text" icon="el-icon-chat-line-round" size="medium" style="color:black;" @click="contact(entry.loaner[0]._id)"></el-button>
                    </td>
                    <td>
                        <el-button v-if="entry.review_renter" type="text" icon="el-icon-close" size="mini" @click="cancelRental(id, entry._id)"></el-button>
                    </td>
                </tr>
                <tr v-if="activename === id" :key="'modify_' + id">
                    <td class="finishing" :colspan="7" v-if="isFinished(entry)">
                        <h4>Laisser un avis sur le locataire pour finaliser la location</h4>
                        <span style="font-style: italic;">Vos avis nous sont utiles pour connaitre nos utilisateurs</span>
                        <el-form label-position="left" label-width="180px" :model="review" :rules="rulesReview" style="margin-top: 30px;">
                            <el-form-item label="A t'il rapporté le meuble ?" prop="returned" size="mini">
                                <el-radio-group size="mini" v-model="review.returned">
                                    <el-radio label="Oui"></el-radio>
                                    <el-radio label="Non"></el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="A t'il payé ?" prop="paid" size="mini">
                                <el-radio-group size="mini" v-model="review.paid">
                                    <el-radio label="Oui"></el-radio>
                                    <el-radio label="Non"></el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="Notez le locataire" prop="mark" size="mini">
                                <el-rate v-model="review.mark">
                                </el-rate>
                            </el-form-item>
                            <el-form-item label="Votre avis" prop="text" size="mini">
                                <el-input type="textarea" maxlength="500" show-word-limit rows="4" v-model="review.text"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" icon="el-icon-circle-check" style="float:left;" size="mini" plain @click="save">Enregistrer</el-button>
                            </el-form-item>
                        </el-form>
                    </td>
                    <td class="canceling" :colspan="7" v-else>
                        <h4>Abandonner la location</h4>
                        <span style="font-style: italic;">En cas d'insatisfaction du locataire ou en cas de vrai nécessité, à ne pas abuser</span>
                        <el-form label-position="left" label-width="180px" :model="review" :rules="rulesReview" style="margin-top: 30px;">
                            <el-form-item label="Notez le locataire" prop="mark" size="mini">
                                <el-rate v-model="review.mark">
                                </el-rate>
                            </el-form-item>
                            <el-form-item label="Votre avis" prop="text" size="mini">
                                <el-input type="textarea" maxlength="500" show-word-limit rows="4" v-model="review.text"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="danger" icon="el-icon-circle-check" style="float:left;" size="mini" plain @click="save">Abandonner définitivement</el-button>
                            </el-form-item>
                        </el-form>
                    </td>
                </tr>
            </template>
        </tbody>
    </table>
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex';
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
            today: new Date(),
            activename: null,
            review: {
                paid: false,
                returned: false,
                mark: 0,
                text: ''
            },
            rulesReview: {
                returned: [{
                    required: true,
                    message: 'Indiquez si le meuble a été rapporté',
                    trigger: 'blur'
                }, ],
                paid: [{
                    required: true,
                    message: 'Indiquez si le locataire vous a rétributé',
                    trigger: 'blur'
                }, ],
                mark: [{
                    required: true,
                    message: 'Indiquez la satisfaction du locataire',
                    trigger: 'blur'
                }, ],
            },
            rulesSimpleReview: {
                text: [{
                    required: true,
                    message: 'Donnez un avis sur le propriétaire',
                    trigger: 'blur'
                }, ],
                mark: [{
                    required: true,
                    message: 'Notez le propriétaire',
                    trigger: 'blur'
                }, ],
            }
        }
    },
    created() {},
    computed: {
        ...mapGetters({
            loaner: 'GET_LOAN',
        }),

    },
    watch: {
        // rentals: function(val) {
        //      for(var i=0; i < val.length; i++) {
        //         this.expand[i] = false;
        //    }
        // }
    },
    methods: {
        save() {
            console.log('SAVE');
        },
        format(date) {
            return Formats.toFormatSpecific(date, 'DD/MM/YY');
        },
        classEntry(rt) {
            let status = this.displayStatus(rt);
            if (status === 'A venir') return 'isToCome'
            else if (status === 'En cours') return 'isInProgress'
            else if (status === 'Terminé') return 'isFinished'
            else if (status === 'Finalisé') return 'isAccomplished'
        },
        displayStatus(rt) {
            let finished = this.isFinished(rt);
            if (!finished) {
                if (this.hasStarted(rt)) return 'En cours';
                else return 'A venir';
            } else {
                if (rt.reviewed_renter) return 'Finalisé'
                else return 'Terminé'
            }
        },
        price(rt) {
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
        expandLine(ind) {
            console.log('ACTIVE NAME');
            console.log(ind)
            if (this.activename === ind) this.activename = null
            else this.activename = ind;
        },
        contact(id) {
            this.$router.push({
                name: 'Chat',
                params: {
                    interlocutor_id: id
                }
            });
        },
        // isCancelable(rt) {
        //     let finished = this.isFinished(rt);
        //     let reviewed;
        //     this.loaner ? reviewed = rt.review_loaner : rt.review_renter
        //     return rt.paid && rt.returned && reviewed && finished
        // },
        isFinished(rt) {
            let today = moment(new Date());
            let finished = moment(rt.loan_end).isBefore(today);
            return finished;
        },
        hasStarted(rt) {
            let today = moment(new Date());
            let started = moment(rt.loan_start).isBefore(today);
            return started;
        },
        cancelRental(index_modified, rental_id) {
            console.log('cancel Rental');
            this.$emit('display-dialog', {
                refuseLoan: true,
                titleDialog: 'Confirmation',
                message: 'Si vous archivez cette location, elle sera supprimé définitivement. Confirmez-vous que vous l archivation ?',
                dialogVisible: true
            });
            this.$emit('change-rental', {
                index_modified: index_modified,
                rental_id: rental_id,
            });
        },
        editProposition(id, rental_id) {
            let context = this;
            this.$emit('change-rental', {
                index_modified: id,
                rental_id: rental_id,
            });

            let params = {
                rental_id: rental_id,
                statusCheck: 0,
                loan_start: this.dateProposition[0],
                loan_end: this.dateProposition[1]
            };
            RentalService.updateRental(params).then(function (resp) {
                if (resp.success) {
                    context.rentals[id].loan_start = context.dateProposition[0];
                    context.rentals[id].loan_end = context.dateProposition[1];
                }
                context.editMode = false;
                context.$message = "La modification de la proposition a été prise en compte";
                console.log(resp);
            });
        },
        validLoan(index_modified, rental_id, furnit_id) {
            this.$emit('change-rental', {
                index_modified: index_modified,
                rental_id: rental_id,
                furnit_id: furnit_id
            });
            this.$emit('display-dialog', {
                refuseLoan: false,
                confirmLoan: true,
                validExpression: 'Confirmer',
                titleDialog: 'Confirmation de la location',
                message: 'Confirmez-vous la location de ce meuble ? Le propriétaire ne pourra plus louer son meuble aux dates indiquées',
                dialogVisible: true
            });
        },
        confirmCancel() {
            if (this.loaner) {
                if (this.rentals[this.index_modified].status < 0) {
                    RentalService.deleteRental(this.rental_id);
                    this.$router.push({
                        path: '/myrentals/Demands'
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
                            path: '/myrentals/Demands'
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
        },
        acceptLoan(index_modified, rental_id, furnit_id, start, end) {
            let context = this;
            RentalService.isRentable(furnit_id, start, end).then(function (res) {
                console.log("isRentable");
                console.log(res);
                context.index_modified = index_modified;
                if (res.maxStatus === 0) {
                    context.rental_id = rental_id;
                    context.$emit('display-dialog', {
                        refuseLoan: false,
                        confirmLoan: true,
                        validExpression: 'Accepter',
                        titleDialog: 'Confirmation',
                        message: 'Confirmez-vous que vous acceptez cette proposition ? Le demandeur devra confirmer cette offre pour valider la location',
                        dialogVisible: true
                    });
                } else {
                    let msg;
                    if (res.maxStatus === 1) msg = "Vous avez déjà accepté une location (non confirmée) qui chevauche celle-ci. Annulez l'autre proposition pour accepter celle-ci";
                    if (res.maxStatus === 2) msg = "Vous avez déjà une location prévue qui chevauche celle-ci";
                    context.$emit('display-dialog', {
                        confirmLoan: false,
                        validExpression: 'Accepter',
                        titleDialog: 'Erreur',
                        message: msg,
                        dialogVisible: true
                    });
                }
            }).catch(function (err) {
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

tr.isToCome td {
    background-color: #d4cb92;
}

tr.isInProgress td {
    background-color: #92cae0;
}

tr.isFinished td {
    background-color: #c6a9d6;
}

tr.isAccomplished td {
    background-color: #c48974;
    // background-color: red !important;
}

tr td.finishing {
    background-color: ghostwhite;
}

tr td.canceling {
    background-color: #f5d7df;
}

// .actions {
//     display: flex;
//     justify-content: center;
//     width: 150px;
// }

th,
td {
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
    // background-color: #f9f9f9;
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
<style>
.el-form-item__label {
    float: left !important;
}
</style>
