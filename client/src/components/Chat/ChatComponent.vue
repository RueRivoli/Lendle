<template>
  <div>
      <nav-component></nav-component>
      <el-container style="height: 92vh;">
        <el-aside width="180px;" style="overflow-y: scroll;width:18vw;">

          <!-- a search input -->
          <!-- <div style="padding:8px;border-bottom: 1px solid #03A59D">
            <div class="chat_it cursor" style="width: 155px;margin:auto;" @click="search()" >
                <el-input
                  placeholder="Rechercher"
                  prefix-icon="el-icon-search"
                  size="mini"
                  v-model="searchName">
                </el-input>
            </div>
          </div> -->
          <div v-if="interlocutors.length > 0">
            <div :class="isSelected(itl)" v-for="(itl, index) in interlocutors" :key="index" @click="changeChat(itl)" style="padding:8px;border-bottom: 1px solid #03A59D">
              <div :key="30" style="align-self: flex-start;margin-right:10px;">
                <el-avatar :size="30" src="../assets/twitter.svg"></el-avatar>
              </div>

              <div style="align-self: center;padding:3px;">
                <div style="font-size:12px;">{{nameInterlocutor(itl)}}</div>
                <!-- <div style="font-size:12px">{{itl.furnit[0].name}} / {{itl.furnit[0].type}}</div> -->
              </div>
            </div>
            </div>
            <div v-else style="height:8vh;line-height:8vh;border-bottom: 1px solid #03A59D">
              <div style="align-self: center;text-align:center;">
                <div style="font-size:12px;"> Pas de conversation</div>
              </div>
            </div>
          
         
        </el-aside>
        <el-container style="height: 92vh;">
            <el-header class="center" style="height:8vh;line-height:8vh;font-size: 18px;background-color:#C0C0C0;color:white;">
                <span v-if="interlocutors && interlocutors.length > 0">{{name}}</span>
                <span v-else>Chat</span>
                <!-- <span class="pointer opacity" style="float:right;"><router-link :to="{ name: 'Furnit', params: { id: furnit_id }}" tag="span">{{furnitname}}</router-link></span> -->
            </el-header>
            <el-header class="center" style="height:5vh;line-height:5vh;font-size: 18px;background-color:#F0F8FF;color:white;">
                <span class="cursor" v-for="(ft, index) in furnits" :key="index">
                  <router-link :to="{ name: 'Furnit', params: { id: ft._id }}" tag="span">
                  <el-tag :type="colorType(ft.type)" size="mini">{{ft.name}}</el-tag>
                  </router-link>
                </span>
                <!-- <span class="pointer opacity" style="float:right;"><router-link :to="{ name: 'Furnit', params: { id: furnit_id }}" tag="span">{{furnitname}}</router-link></span> -->
            </el-header>
        <div>
          <el-row style="height: 79vh;">
            <el-col :span="24" :offset="0" style="display:flex;flex-direction:column;justify-content:space-between;height:100%;">
              <div ref="container" style="overflow-y: scroll; scrollbar-width: thin;padding:3px;">
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
               <div v-if="interlocutors && interlocutors.length > 0" style="height:75px;align-self:flex-end;width:100%;">
                <!-- <el-button slot="append" icon="el-icon-paperclip" size="small"></el-button> -->
                  <el-input placeholder="Message + Entrer"  :rows="3" type="textarea" v-model="msg" @change="sendMessage" class="input-with-select">
                  </el-input>
              </div>
                 
            </el-col>
        </el-row>
      </div>
       </el-container>
    </el-container>
    <footer-component></footer-component>
  </div>
</template>


<script>
import NavComponent from './../Navigation/NavComponent';
import FooterComponent from './../Footer/FooterComponent';
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
        // searchName: '',
        // dialog_id: this.$route.params.dialog_id || null,
          //parameters to give to chat directly to somebody in particular
        interlocutor_id: this.$route.params.interlocutor_id || null,
        furnit_id: this.$route.params.furnit_id || null,
        firstname: '',
        lastname: '',
        furnitname: '',
        interlocutors: null,
        // interlocutor_id: null,
      }
  },
  computed : {
    ...mapGetters({
      loaner: 'GET_LOAN',
      id: 'GET_ID',
      token: 'GET_TOKEN'
    }),
      name () {
        if (this.username) return this.username;
        else {
          return this.firstname + ' ' + this.lastname;
        }
      }
  },
  methods: {
    colorType (type) {
      if (type === "machinealaver") return 'primary'
      if (type === "armoire") return 'success'
      if (type === "chaise") return 'info'
      if (type === "fauteuil") return 'warning'
      if (type === "frigidaire") return 'danger'
      if (type === "sechelinge") return 'essai'
    },
    nameInterlocutor (itl) {
      if (itl.interlocutor_username) return itl.interlocutor_username
      else {
        return itl.interlocutor_firstname + ' ' + itl.interlocutor_lastname
      }
    },
     isAuthor (id) {
      return {
        message: true,
        right: (id === this.id),
        left: (id !== this.id)
      }
    },
    isSelected (itl) {
      console.log('ITL');
      console.log(itl._id);
      console.log(this.interlocutor_id);
      return {
        chat_it: true,
        cursor: true,
        flex: true,
        selected: itl.interlocutor_id === this.interlocutor_id
      }
    },
    changeChat (itl) {
      console.log('Change Chat to speak to');
      console.log(itl);
      // Change parameters of current interlocutor
      this.interlocutor_id = itl.interlocutor_id;
      this.dialog_id = itl.dialog_id;
      this.firstname = itl.interlocutor_firstname;
      this.lastname = itl.interlocutor_lastname;
      this.username = itl.interlocutor_username;
      this.furnits = itl.furnit;
      this.socket.emit('getChat', itl.dialog_id);
      this.msg = '';
    },
    formatTime (time) {
      return moment(time).format('DD/MM/YY h:mm a');
    },
    sendMessage() {
      //Emit message to server
      let message = {
        author_id: this.id,
        dest_id: this.interlocutor_id,
        // mail: this.mail,
        text: this.msg,
        dialog_id: this.dialog_id
      }
      console.log('EMIT MESSSAGE');
      console.log(message);
      this.socket.emit('newMessage', message);
      this.msg = '';  
    }
  },
  updated () {
    this.$refs.container.scrollTop = this.$refs.container.scrollHeight;
  },
  created() {
    console.log('Chat Component created');
    this.socket = io('http://localhost:3000/');
    // const payload = UserService.getUser();
    // this.id = payload._id;
    // this.mail = payload.mail;
    let dataUser = {
      loaner: this.loaner,
      id: this.id,
      interlocutor_id: this.interlocutor_id,
      furnit_id: this.furnit_id,
    }
    console.log('DATAUSER');
    console.log(dataUser);
    if (dataUser.interlocutor_id) {
      this.index_selected = dataUser.interlocutor_id;
      this.socket.emit('addNewInterlocutor', dataUser);
    } else {
      this.socket.emit('getInterlocutors', dataUser);
    }

    this.socket.on('updateInterlocutors', message => {
       console.log(message);
       this.socket.emit('getInterlocutors', dataUser);
    })

    this.socket.on('newMessage', message => {
      console.log('receive new message');
      console.log(message);
      // message.author = false
      // if (message.author_id === this.id) message.class = true
      this.allmsgs.push(message);
    })
    this.socket.on('allChat', output => {
      console.log('OUTPUT');
      console.log(output);
      this.allmsgs = output;
    })

     this.socket.on('interlocutors', interlocutors => {
      console.log('List of interlocutors is ');
      console.log(interlocutors);
      this.interlocutors = interlocutors;
      let index_interlocutorWanted =  Object.keys(interlocutors).length - 1;
      console.log('index W');
      console.log(index_interlocutorWanted);
      if (this.interlocutors && this.interlocutors.length > 0 && this.interlocutor_id) {
        console.log('interlocutor id');
        console.log(this.interlocutor_id);
        const isInterlocutorWanted = (element) => element.interlocutor_id == this.interlocutor_id;
        let index_interlocutorWanted = interlocutors.findIndex(isInterlocutorWanted);
        console.log('index interlocutor');
        console.log(index_interlocutorWanted);
        // if (index_interlocutorWanted === -1) {
        //   console.log('ENTRANCE');
        //   this.socket.emit('getNewInterlocutor', this.$route.params.furnit_id);
        // }
        this.changeChat(interlocutors[index_interlocutorWanted]);
      }
      else {
        console.log('there');
        console.log(interlocutors[index_interlocutorWanted]);
        this.changeChat(interlocutors[index_interlocutorWanted]);
      }
      
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