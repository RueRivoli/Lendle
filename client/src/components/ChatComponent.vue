<template>
<div>
      <nav-component  style="border-bottom: 1px solid #dfe0e6"></nav-component>
      <el-container style="height: 100vh;">
     <!-- <aside-component/> -->
    <el-main>CHAT
    <el-row>
      <el-col :span="14" :offset="5">
        <div class="status">Frigidaire bon état
          <span style="float:right;">{{allmsgs[0].mail}}</span>
        </div>
        <el-card style="margin-bottom:15px;">
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
        allmsgs: []
      }
  },
  computed : {

  },
  methods: {
     isAuthor (id) {
      console.log('isAuthor');
      console.log(id);
      console.log(this.id);
      return {
        message: true,
        right: (id === this.id),
        left: (id !== this.id)
      }
    },
    formatTime (time) {
      return moment(time).format('DD/MM/YY h:mm a');
    },
    sendMessage() {
      //Emit message to server
      let data = {
        author_id: this.id,
        mail: this.mail,
        text: this.msg
      }
      this.socket.emit('chatMessage', data);
      this.msg = '';
    }
  },
  created() {
    console.log('CREATED');
    this.socket = io('http://localhost:3000/');
    const payload = UserService.getUser();
    this.id = payload._id;
    this.mail = payload.mail;

    this.socket.on('chatMessage', message => {
      console.log(message);
      message.author = false
      if (message.author_id === this.id) message.class = true
      this.allmsgs.push(message);
    })
    this.socket.on('output', output => {
      console.log('OUTPUT');
      // console.log(output);
      this.allmsgs = output;
      // console.log(this.allmsgs);
    })
    // this.socket.on('chatMessage', message => {
    //   this.allmsgs.push(message);
    // })
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


</style>