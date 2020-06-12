<template>
  <div>
      <nav-component></nav-component>
      <el-container style="height:680px;">
        <el-aside width="180px;" style="overflow-y: scroll;">
          <div class="cursor" v-for="(itl, index) in interlocutors" :key="index" @click="changeChat(itl)">{{itl.furnit[0].name}}</div>
        </el-aside>
        <el-main>
          <el-row>
            <el-col :span="14" :offset="5">
              <div ref="essai" class="status">{{furnitname}}
                <span style="float:right;">{{name}}</span>
              </div>
              <el-card ref="container" style="margin-bottom:15px;width:100%;min-height: 25vh;max-height: 65vh;overflow-y: scroll; scrollbar-width: thin;">
                <div v-for="(mg, index) in allmsgs" :key="index">
                  <div :class="isAuthor(allmsgs[index].author_id)">
                      <p style="font-size:12px;color:#1E969D;">
                            <span style="font-style: italic;">{{formatTime(allmsgs[index].time)}}</span>
                          </p>
                          <p>
                            {{allmsgs[index].text}}
                          </p>
                  </div>
                </div>
              </el-card>
                <el-form id="chat-form">
                    <el-form-item label="">
                      <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="Entrez quelque chose"
                        v-model="msg">
                      </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="sendMessage">Envoyer</el-button>
                </el-form-item>
              </el-form>
            </el-col>
        </el-row>
      </el-main>
    </el-container>
    <footer-component></footer-component>
  </div>
</template>


<script>
import NavComponent from './Navigation/NavComponent';
// import UserService from '../UserService';
import FooterComponent from './Footer/FooterComponent';
import io from 'socket.io-client'
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  name: 'ChatComponent',
  components: { NavComponent, FooterComponent },
  data() {
      return {
        socket: '',
        msg: '',
        allmsgs: [],
        // renters: null,
        // loaners: null,
        dialog_id: this.$route.params.dialog_id || null,
        firstname: '',
        lastname: '',
        furnitname: '',
        interlocutors: null,
        //parameters to give to chat directly to somebody in particular
        interlocutor_current: this.$route.params.interlocutor_current || null,
        furnit_id: this.$route.params.furnit_id || null
      }
  },
  computed : {
    ...mapGetters({
      loaner: 'GET_LOAN',
      id: 'GET_ID',
      token: 'GET_TOKEN'
    }),
    //  loaner () {
    //    console.log('loaner');
    //    console.log(this.$store.getters.GET_LOAN);
    //     if (this.$store.getters.GET_AUTH && this.$store.getters.GET_LOAN) 
    //     {
    //       console.log('LOANER TRUE');
    //       return true;
    //     }
    //     else {
    //       console.log('LOANER FALSE');
    //       return false;
    //     }
    //   },
      name () {
        return this.firstname + ' ' + this.lastname;
      }
  },
  methods: {
     isAuthor (id) {
      return {
        message: true,
        right: (id === this.id),
        left: (id !== this.id)
      }
    },
    changeChat (interlocutor) {
      console.log('displayChat of');
      console.log(interlocutor);
      // Change parameters of talking
      this.dialog_id = interlocutor._id;
      this.firstname = interlocutor.to[0].firstname;
      this.lastname = interlocutor.to[0].lastname;
      this.furnitname = interlocutor.furnit[0].name;
      this.interlocutor_current = interlocutor.to[0]._id;
      this.socket.emit('getChat', interlocutor._id);
      this.msg = '';
    },
    formatTime (time) {
      return moment(time).format('DD/MM/YY h:mm a');
    },
    sendMessage() {
      //Emit message to server
      let message = {
        author_id: this.id,
        dest_id: this.interlocutor_current,
        mail: this.mail,
        text: this.msg,
        dialog_id: this.dialog_id
      }
      this.socket.emit('chatMessage', message);
      this.msg = '';  
    }
  },
  updated () {
    this.$refs.container.$el.scrollTop = this.$refs.container.$el.scrollHeight;
  },
  created() {
    console.log('CREATED');
    console.log('TEST STORE');
    this.socket = io('http://localhost:3000/');
    // const payload = UserService.getUser();
    // this.id = payload._id;
    // this.mail = payload.mail;
    let dataUser = {
      loaner: this.loaner,
      id: this.id,
      interlocutor_current: this.interlocutor_current,
      furnit_id: this.furnit_id,
    }
    console.log('DATAUSER');
    console.log(dataUser);
    if (dataUser.interlocutor_current) {
      this.socket.emit('addNewInterlocutor', dataUser);
    } else {
      this.socket.emit('getInterlocutors', dataUser);
    }
     this.socket.on('updateInterlocutors', message => {
       this.socket.emit('getInterlocutors', dataUser);
    })

    this.socket.on('chatMessage', message => {
      console.log(message);
      message.author = false
      if (message.author_id === this.id) message.class = true
      this.allmsgs.push(message);
    })
    this.socket.on('output', output => {
      console.log('OUTPUT');
      console.log(output);
      this.allmsgs = output;
      // console.log(this.allmsgs);
    })
     this.socket.on('interlocutors', interlocutors => {
      console.log('INTERLOCUTORS');
      console.log(interlocutors);
      this.interlocutors = interlocutors;
      let index_interlocutorWanted =  Object.keys(interlocutors).length - 1;
      if (this.interlocutor_current) {
        const isInterlocutorWanted = (element) => element._id === this.interlocutor_current;
        let index_interlocutorWanted = interlocutors.findIndex(isInterlocutorWanted);
        console.log('index interlocutor');
        console.log(index_interlocutorWanted);
      }
      this.changeChat(interlocutors[index_interlocutorWanted]);
    })

  }
}
</script>

<style scoped>

.message{
  padding: 4px;
  border-radius: 3px;
  margin-bottom:8px;
  cursor: pointer;
}

.left{
  width: 40%;
  margin-left:2%;
  background-color: #F0F8FF;
}

.right{
  width: 40%;
  margin-left:57%;
  background-color: #FFFAF0;
}

.status{
  padding: 5px;
}

 .el-aside {
    background-color:#1E969D;
    color: white;
    /* background: linear-gradient(to right,#B0C4DE, #1E969D); */
  }
  .el-aside ul li{

    background-color:#1E969D;
    color: white;
    /* background: linear-gradient(to right,#B0C4DE, #1E969D); */
  }

</style>