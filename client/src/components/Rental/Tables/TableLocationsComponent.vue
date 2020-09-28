<template>
    <div>
        <el-dialog
            title="Confirmation"
            :visible.sync="dialogConfirmation"
            width="50%">
            <span></span>
            <div v-for="(msg, ind) in msgConfirmation" :key="ind">
                <span>{{ msg }}</span>
                </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogConfirmation = false; rental = null">Annuler</el-button>
            <el-button type="primary" @click="sendReview">Confirmer la notation</el-button>
            </span>
        </el-dialog>
        <el-form ref="review" name="review"  :model="review" label-position="left" label-width="190px" style="margin-top: 30px;" enctype="multipart/form-data">
            <table width="100%" v-if="loaner">
                <col>
                <col>
                <col>
                <col>
                <col>
                <!-- <col> -->
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
                        <!-- <th>Archiver</th> -->

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
                        <!-- <th>Ne plus faire apparaitre</th> -->
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(entry, id) in rentals">
                        <tr v-if="!entry.review_loaner" :key="id" :class="classEntry(entry)" style="font-size: 12px">
                            <td>
                                <el-button v-if="activename !== id" type="text" icon="el-icon-arrow-right" size="mini" style="color:black;" @click="expandLine(id)"></el-button>
                                <el-button v-if="activename === id" type="text" icon="el-icon-arrow-down" size="mini" style="color:black;" @click="expandLine(id)"></el-button>
                            </td>
                            <td>{{ format(entry.loan_start) }} </td>
                            <td>{{ format(entry.loan_end) }} </td>
                            <td>{{ entry.price }} €</td>
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
                            <!-- <td>
                                <el-button v-if="!entry.review_loaner" type="text" icon="el-icon-close" style="color:black;" size="mini" @click="cancelRental(id, entry._id)"></el-button>
                            </td> -->
                        </tr>
                        <tr v-if="activename === id && !entry.review_loaner" :key="'modify_' + id">
                            <!-- <td class="finished" v-if="entry.review_loaner" :colspan="7">
                                 <span style="font-style: italic;">Vous avez finalisé la location</span>
                            </td> -->
                            <td class="finishing" :colspan="6" v-if="isFinished(entry)">
                                <span style="font-weight: bold;font-size: 14px;">Laisser un avis sur {{ entry.renter[0].username }} pour finaliser la location</span><br>
                                 <span style="font-style: italic;font-size: 12px;">Vos avis nous sont utiles pour connaitre nos utilisateurs</span>
                                 <div style="margin-top: 15px;font-size:12px;">
                                    <el-form-item label="Notez le propriétaire" prop="mark" size="mini">
                                        <el-rate v-model="review.mark"></el-rate>
                                    </el-form-item>
                                    <el-form-item label="Votre avis" prop="text" size="mini">
                                        <el-input type="textarea" maxlength="500" show-word-limit rows="4" v-model="review.text"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" icon="el-icon-circle-check" style="float:left;" size="mini" plain @click="save(entry, false, 5)">Enregistrer</el-button>
                                    </el-form-item>
                                </div>
                            </td>
                            <td class="canceling" :colspan="6" v-else>
                                 <span style="font-weight: bold;font-size: 14px;">Abandonner la location</span><br>
                                <span style="font-style: italic;font-size: 12px;">En cas d'insatisfaction de {{ entry.renter[0].username }} ou en cas de réelle nécessité, à ne pas abuser</span>
                                     <div style="margin-top: 15px;font-size:12px;">
                                        <el-form-item label="Notez le propriétaire" prop="mark" size="mini" style="margin-top: 10px;">
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
                                            <el-input v-model="review.text" type="textarea" maxlength="500" show-word-limit rows="4"></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="danger" icon="el-icon-circle-check" style="float:left;" size="mini" plain @click="save(entry, false, 4)">Abandonner définitivement</el-button>
                                        </el-form-item>
                                    </div>
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
            <!-- <col> -->

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
                    <!-- <th>Archiver</th> -->
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
                    <!-- <th>Ne plus faire apparaitre</th> -->
                </tr>
            </thead>
            <tbody>
                <template v-for="(entry, id) in rentals">
                    <tr v-if="!entry.review_renter" :class="classEntry(entry)" :key="id" style="font-size: 12px">
                        <td>
                            <el-button v-if="activename !== id" type="text" icon="el-icon-arrow-right" size="mini" style="color:black;" @click="expandLine(id)"></el-button>
                            <el-button v-if="activename === id" type="text" icon="el-icon-arrow-down" size="mini" style="color:black;" @click="expandLine(id)"></el-button>
                        </td>
                        <td>{{ format(entry.loan_start) }} </td>
                        <td>{{ format(entry.loan_end) }} </td>
                        <td>{{ entry.price }} €</td>
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
                        <!-- <td>
                            <el-button v-if="!entry.review_renter" type="text" icon="el-icon-close" style="color:black;" size="mini"  @click="cancelRental(id, entry._id)"></el-button>
                        </td> -->
                    </tr>
                    <tr v-if="activename === id && !entry.review_renter" :key="'modify_' + id">
                         <!-- <td class="finished" v-if="entry.review_renter" :colspan="7">
                            <span style="font-style: italic;">Vous avez déjà finalisé la location</span>
                        </td> -->
                        <td class="finishing" :colspan="6" v-if="isFinished(entry)">
                            <span style="font-weight: bold;font-size: 14px;">Laisser un avis sur {{ entry.loaner[0].username }} pour finaliser la location</span><br>
                            <span style="font-style: italic;font-size: 12px;">Vos avis nous sont utiles pour connaitre nos utilisateurs</span>
                            <div style="margin-top: 15px;font-size: 12px;">
                                <el-form-item label="A t'il rapporté le meuble ?" prop="returned" size="mini" >
                                    <el-radio-group name="returned" size="mini" v-model="review.returned" required>
                                        <el-radio label="Oui" value="true"></el-radio>
                                        <el-radio label="Non" value="false"></el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item  label="A t'il payé ?" prop="paid" size="mini">
                                    <el-radio-group name="paid"  size="mini" v-model="review.paid">
                                        <el-radio label="Oui" value="true"></el-radio>
                                        <el-radio label="Non" value="false"></el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="Notez le locataire" prop="mark" size="mini">
                                    <el-rate name="mark"  v-model="review.mark">
                                    </el-rate>
                                </el-form-item>
                                <el-form-item  label="Votre avis" prop="text" size="mini">
                                    <el-input name="text"  type="textarea" maxlength="500" show-word-limit rows="4" v-model="review.text"></el-input>
                                </el-form-item>
                                 <el-form-item>
                            <el-button type="primary" icon="el-icon-circle-check" style="float:left;" size="mini" plain @click="save(entry, true, 5)">Enregistrer</el-button>   
                                 </el-form-item>
                            </div>
                        </td>
                        <td class="canceling" :colspan="6" v-else>
                            <span style="font-weight: bold;font-size: 14px;">Abandonner la location</span><br>
                            <span style="font-style: italic;font-size: 12px;">En cas d'insatisfaction de {{ entry.loaner[0].username }} ou en cas de vrai nécessité, à ne pas abuser</span>
                                 <div style="margin-top: 15px;font-size: 12px;">
                                    <el-form-item label="Notez le locataire" prop="mark" size="mini" style="margin-top: 10px;">
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
                                        <el-button type="danger" icon="el-icon-circle-check" style="float:left;" size="mini" plain @click="save(entry, false, 3)">Abandonner définitivement</el-button>
                                    </el-form-item>
                                </div>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </el-form>
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex';
import * as Formats from './../../../utils/format.js';
const moment = require('moment');
// import FormData from 'form-data';
import ReviewService from './../../../Service/ReviewService';
import RentalService from './../../../Service/RentalService';

export default {
    name: 'TableLocationsComponent',
    components: {},
    props: {
        rentals: Array,
    },
    data() {
        return {
            activename: null,
            msgConfirmation: [],
            dialogConfirmation: false,
            rental: null,
            statusUpdate: null,
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
                paid: 'Non',
                returned: 'Non',
                mark: null,
                text: '',
                reason: ''
            },
        }
    },
    created() {},
        computed: {
            ...mapGetters({
                loaner: 'GET_LOAN',
            }),
    },
    methods: {
        save(rental, checkPaidAndReturned, statusUpdate) {
            console.log("Save Review");
            this.msgConfirmation = [];
            this.statusUpdate = statusUpdate;
            if (checkPaidAndReturned) {
                if (this.review.paid === 'Non') this.msgConfirmation.push('Confirmez-vous que le locataire ne vous a pas payé ? ');
                if (this.review.returned === 'Non') this.msgConfirmation.push('Confirmez-vous que le locataire ne vous a pas retourné le meuble ? ');
            }
            if (this.review.mark === 0) this.msgConfirmation.push('Etes-vous sûr d attribuer une note de 0 ? ');
            if (this.msgConfirmation.length === 0) this.msgConfirmation.push('Confirmez-vous votre notation ? ');
            this.dialogConfirmation = true;
            this.rental = rental;
        },
        sendReview() {
            console.log("Send Review");
            console.log(this.$refs.review);
            let context = this;
            this.dialogConfirmation = false;
            this.$refs.review.validate((valid) => {
                console.log('VALID REVIEW');
                if (valid) {
                    let paid, returned;
                    this.review.paid === 'Oui' ? paid = true : paid = false;
                    this.review.returned === 'Oui' ? returned = true : returned = false;
                    let formData = {
                        paid: paid,
                        returned: returned,
                        mark: this.review.mark,
                        text: this.review.text,
                        reason: this.review.reason,
                        rental_id: this.rental._id,
                    };
                    if (this.loaner) formData.author_id = this.rental.loaner_id;
                    else formData.author_id = this.rental.renter_id;
                    console.log('FormData');
                    console.log(formData);
                    ReviewService.insertReview(formData).then(function (rv) {
                        console.log('Review');
                        console.log(rv);
                        let review_id = rv.review._id;
                        if (context.loaner) context.rental.review_loaner = review_id;
                        else context.rental.review_renter = review_id;
                        context.rental.status = context.statusUpdate;
                        console.log('RENTAL');
                        console.log(context.rental);
                        RentalService.updateRental(context.rental).then(function(rt) {
                            console.log('UPDATE');
                            console.log(rt);
                        }).catch(function (err) {
                        context.$message.warning(err);
                    });
                    }).catch(function (err) {
                        context.$message.warning(err);
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
        expandLine(ind) {
            console.log('ACTIVE NAME');
            console.log(ind);
            console.log(this.activename);

            this.review = {
                paid: 'Non',
                returned: 'Non',
                mark: null,
                text: '',
                reason: ''
            }
            console.log(this.review);
            if (this.activename === ind) this.activename = null
            else this.activename = ind;
            console.log(this.activename);
        },
        contact(id) {
            this.$router.push({
                name: 'Chat',
                params: {
                    interlocutor_id: id
                }
            });
        },
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
