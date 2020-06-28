<template>
  <div>
      <nav-component></nav-component>
      <el-container style="height: 92vh;">
        <el-aside width="180px;" style="overflow-y: scroll;">
          <div style="padding:8px;border-bottom: 1px solid #03A59D">
            <div class="chat_it cursor" style="width: 155px;margin:auto;" @click="search()" >
                <el-input
                  placeholder="Rechercher"
                  prefix-icon="el-icon-search"
                  size="mini"
                  v-model="searchName">
                </el-input>
            </div>
          </div>

          <div :class="isSelected(index)" v-for="(itl, index) in interlocutors" :key="index" @click="changeChat(itl, index)" style="padding:8px;border-bottom: 1px solid #03A59D">
        
            <div :key="30" style="align-self: flex-start;margin-right:10px;">
              <el-avatar :size="30" src="../assets/twitter.svg"></el-avatar>
            </div>
            <!-- <div>

            </div> -->
            <div  style="align-self: center;padding:3px;">
              <div style="font-size:12px">{{nameInterlocutor(itl)}}</div>
              <div style="font-size:12px">{{itl.furnit[0].name}} / {{itl.furnit[0].type}}</div>
            </div>
            
          </div>
        </el-aside>
        <el-container style="height: 92vh;">
            <el-header style="height:8vh;line-height:8vh;font-size: 18px;background-color:#C0C0C0;color:white;">
                <span style="float:left;">{{name}}</span>
                <span style="float:right;">{{furnitname}}</span>
            </el-header>
        <div>
          <el-row style="height: 84vh;">
            <el-col :span="24" :offset="0">
              
              <div ref="container" style="height:66vh;overflow-y: scroll; scrollbar-width: thin;padding:3px;">
                <div v-for="(mg, index) in allmsgs" :key="index">
                   <div style="font-size:12px;color:black;text-align:center;">
                     <div style="background-color:#FFFAF0;border-radius:2px;margin: auto;width: 10%; padding: 3px;">
                        <span style="font-style: italic;">{{formatTime(allmsgs[index].time)}}</span>
                      </div>
                  </div>
                  <div :class="isAuthor(allmsgs[index].author_id)">
                      <div style="color:white;font-size:14px;">
                        {{allmsgs[index].text}}
                      </div>
                  </div>
                </div>
              </div>
               <div style="height:18vh;">
                <!-- <el-button slot="append" icon="el-icon-paperclip" size="small"></el-button> -->
                  <el-input placeholder="Message + Entrer"  :rows="4" type="textarea" v-model="msg" @keyup.enter="sendMessage" class="input-with-select">
                  </el-input>
              </div>
           
                   
                    <!-- <el-form-item label="">
                      <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="Message"
                        v-model="msg">
                      </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="sendMessage">Envoyer</el-button>
                </el-form-item> -->
             
                 
            </el-col>
        </el-row>
      </div>
       </el-container>
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
        searchName: '',
        // renters: null,
        // loaners: null,
        dialog_id: this.$route.params.dialog_id || null,
        firstname: '',
        lastname: '',
        furnitname: '',
        interlocutors: null,
        index_selected: null,
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
    nameInterlocutor (itl) {
      return itl.to[0].firstname + ' ' + itl.to[0].lastname;
    },
     isAuthor (id) {
      return {
        message: true,
        right: (id === this.id),
        left: (id !== this.id)
      }
    },
    isSelected (index) {
      return {
        chat_it: true,
        cursor: true,
        flex: true,
        selected: index === this.index_selected
      }
    },
    changeChat (interlocutor, index) {
      this.index_selected = index;
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
    this.$refs.container.scrollTop = this.$refs.container.scrollHeight;
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
       console.log(message);
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

.chat_it:hover{
  opacity:0.7
}

.message{
  padding: 6px;
  border-radius: 3px;
  margin:8px 8px;
  cursor: pointer;
}

.selected{
  background-color:#1EB4B4;
}

.left{
  width: 40%;
  margin-left:2%;
  background-color: #C0C0C0;;
}

.right{
  width: 40%;
  margin-left:57%;
  background-color: #1E969D;
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