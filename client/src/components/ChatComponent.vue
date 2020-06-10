<template>
<div>
      <nav-component  style="border-bottom: 1px solid #dfe0e6"></nav-component>
      <el-container style="height: 100vh;">
    <el-aside width="220px" style="overflow-y: scroll;">
        <el-menu>
          <el-menu-item-group v-if="interlocutors">
            <el-menu-item index="1-1" v-for="(itl, index) in interlocutors" :key="index" @click="changeChat(itl)">{{itl.furnit[0].name}}</el-menu-item>
          </el-menu-item-group>
    </el-menu>

    </el-aside>
    <el-main>
    <el-row>
      <el-col :span="14" :offset="5">
        <div ref="essai" class="status">{{furnitname}}
          <span style="float:right;">{{name}}</span>
        </div>
        <el-card ref="container" style="margin-bottom:15px;min-height: 25vh;max-height: 65vh;overflow-y: scroll; scrollbar-width: thin;">
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
  </div>
</template>


<script>
// import AsideComponent from './AsideComponent';
import NavComponent from './Navigation/NavComponent';
import UserService from '../UserService';
import io from 'socket.io-client'
import moment from 'moment'

export default {
  name: 'ChatComponent',
  components: { NavComponent },
  data() {
      return {
        socket: '',
        msg: '',
        allmsgs: [],
        // renters: null,
        // loaners: null,
        dialog_id: this.$route.params.id || null,
        firstname: '',
        lastname: '',
        furnitname: '',
        interlocutors: null,
        interlocutor_current: this.$route.params.interlocutor_id || null
      }
  },
  computed : {
     loaner () {
        if (this.$store.getters.GET_AUTH && this.$store.getters.GET_LOAN) return true;
        else return false;
      },
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
    this.socket = io('http://localhost:3000/');
    const payload = UserService.getUser();
    this.id = payload._id;
    this.mail = payload.mail;
    let dataUser = {
      loaner: this.loaner,
      id: this.id
    }
    this.socket.emit('getInterlocutors', dataUser);
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
      let lastSpokenTo =  Object.keys(interlocutors).length - 1;
      this.changeChat(interlocutors[lastSpokenTo]);
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