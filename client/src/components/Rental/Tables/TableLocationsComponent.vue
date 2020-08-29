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
                        <el-form ref="review" name="review" :model="review" :rules="rulesSimpleReview" label-position="left" label-width="190px" style="margin-top: 30px;">
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
                        <el-form ref="review" name="review" :model="review" :rules="rulesSimpleReview" label-position="left" label-width="190px" style="margin-top: 30px;">
                            <el-form-item label="Notez le propriétaire" prop="mark" size="mini">
                                <el-rate v-model="review.mark">
                                </el-rate>
                            </el-form-item>
                            <el-form-item label="Quel est le motif de l'abandon ?" prop="reason" size="mini">
                                <el-select v-model="review.reason" placeholder="Select">
                                    <el-option v-for="item in posibleReasons" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
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
                <tr :class="classEntry(entry)" :key="id">
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
                        <el-form ref="review" name="review" :model="review" :rules="rulesReview" label-position="left" label-width="190px" style="margin-top: 30px;">
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
                        <el-form ref="simpleReview" name="simpleReview" :model="review" :rules="rulesReview" label-position="left" label-width="190px" style="margin-top: 30px;">
                            <el-form-item label="Notez le locataire" prop="mark" size="mini">
                                <el-rate v-model="review.mark">
                                </el-rate>
                            </el-form-item>
                            <el-form-item label="Quel est le motif de l'abandon?" prop="reason" size="mini">
                                <el-select v-model="review.reason" placeholder="Select">
                                    <el-option v-for="item in posibleReasons" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
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
import ReviewService from './../../../Service/ReviewService';

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
            posibleReasons: [{
                    value: 'unreachable',
                    label: 'Injoignable'
                },
                {
                    value: 'absent',
                    label: 'Pas Present'
                },
                {
                    value: 'unpaid',
                    label: 'N a pas payé'
                },
                {
                    value: 'unappropriatebehavior',
                    label: 'Comportement inapproprié'
                },
                {
                    value: 'other',
                    label: 'Autre'
                }
            ],
            review: {
                paid: false,
                returned: false,
                mark: 0,
                text: '',
                reason: ''
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
                reason: [{
                    required: true,
                    message: 'Donnez le motif de labandon',
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
    methods: {
        save() {
            console.log("SAVE REVIEW");
            let context = this;
            this.$refs['review'].validate((valid) => {
                console.log('VALID REVIEW');
                if (valid) {
                    let fd = new FormData(document.forms.namedItem("review"));
                    ReviewService.insertReview(fd).then(function (rv) {
                        console.log('Review');
                        console.log(rv);
                    }).catch(function (err) {
                        this.$message.warning(err);
                    });
                } else {
                    context.$message.warning(`Veuillez remplir correctement le sondage d opinion`);
                }
            });
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
        }
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
