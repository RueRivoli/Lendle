<template>
  <div>
      <nav-component></nav-component>
             <!-- <BreadcrumpComponent :field1="{title: 'Messagerie', path: '/chat'}" :field2="{title: name(this.interlocutor_id), path: '/chat/' + interlocutor_id}"></BreadcrumpComponent> -->
       <BreadcrumpComponent :field1="{title: 'Messagerie', path: '/chat'}" :field2="{title: usernameInt, path: '/chat/' + interlocutor_id}"></BreadcrumpComponent>
      
        <el-container height="70vh;">
        
        <el-main>
        
        <el-col class="aside" :span="4" style="height:70vh;overflow-y: scroll;">

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
          <div v-if="interlocutors && interlocutors.length > 0" style="padding:4px;">
            <div :class="isSelected(itl)" v-for="(itl, index) in interlocutors" :key="index" @click="changeChat(itl)" style="padding:4px;">
              <div :key="30" style="align-self: flex-start;margin-right:10px;">
                <avatar-component :name="nameInterlocutor(itl)" :size="30"></avatar-component>
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
          
         
        </el-col>

        <el-col  :span="14" style="height: 70vh;border: 1px solid #1E969D; border-radius: 2px;">
            <el-header class="flex" style="justify-content:center;height:8vh;line-height:8vh;background-color:#1E969D;color:white;">
                <div :key="30">
                  <avatar-component :name="usernameInt" :size="30"></avatar-component>
                </div>
                <!-- <span v-if="interlocutors && interlocutors.length > 0">{{usernameInt}}</span> -->
                <div v-if="interlocutors && interlocutors.length > 0" style="padding:3px;">
                  <div style="font-size:15px;">{{usernameInt}}</div>
                <!-- <div style="font-size:12px">{{itl.furnit[0].name}} / {{itl.furnit[0].type}}</div> -->
              </div>
                <span v-else>Chat</span>
                <!-- <span class="pointer opacity" style="float:right;"><router-link :to="{ name: 'Furnit', params: { id: furnit_id }}" tag="span">{{furnitname}}</router-link></span> -->
            </el-header>
            <!-- <el-header class="center" style="height:5vh;line-height:5vh;font-size: 18px;background-color:#F0F8FF;color:white;">
                <span class="cursor" v-for="(ft, index) in furnits" :key="index">
                  <router-link :to="{ name: 'Furnit', params: { id: ft._id }}" tag="span">
                  <el-tag :type="colorType(ft.type)" size="mini">{{ft.name}}</el-tag>
                  </router-link>
                </span>

            </el-header> -->
                            <!-- <span class="pointer opacity" style="float:right;"><router-link :to="{ name: 'Furnit', params: { id: furnit_id }}" tag="span">{{furnitname}}</router-link></span> -->
            <div>
              <el-row style="height: 57vh;">
                <el-col :span="24" :offset="0" style="display:flex;flex-direction:column;justify-content:space-between;height:100%;">
                  <div ref="container" style="overflow-y: scroll; scrollbar-width: thin;padding:3px;">

                    <div v-for="(mg, index) in allmsgs" :key="index" style="margin-bottom: 5px;">
                      <!-- <div style="font-size:12px;color:black;text-align:center;">
                        <div style="background-color:#FFFAF0;border-radius:2px;margin: auto;width: 15%; padding: 3px;">
                            <span style="font-weight:light">{{formatTime(allmsgs[index].time)}}</span>
                          </div>
                      </div> -->

                    
                          <div :class="[{ 'expandable-height': activeMsgs.includes(index)}, 'min-height', 'flex', 'pointer']" style="overflow:hidden;justify-content:space-between;padding:5px;color:black;background:#e8eaed;font-size:14px;border-radius:2px;">
                             <div class="flex" :key="30">
                                <avatar-component :name="name(mg.author_id)" :size="30"></avatar-component>
                                <!-- <div style="font-size:15px;">
                                  <div style="font-weight:bold;">
                                    {{name(msg.author_id)}}
                                  </div>
                                  <div style="font-weight:light;width:300px;">
                                    {{allmsgs[index].text}}
                                  </div>
                                </div> -->
                                  <table  v-on:click="expandMessage(index)"  style="font-weight:bold;table-layout: fixed;word-wrap:break-word;width:100vw">
                                    <col>
                                    <col>
                                    <thead>
                                        <th>
                                          <span style="float:left;">{{name(mg.author_id)}}</span>
                                          <span style="font-weight:normal;float:right;">{{formatTime(allmsgs[index].time)}}</span>
                                        </th>
                                    </thead>
                                    <tbody >
                                      <tr>
                                        <td style="font-weight:lighter;"> {{allmsgs[index].text}}</td>
                                        <td></td>
                                      </tr>
                                    
                                  
                                  <!-- <tr :rowspan="5" style="font-weight:light;">
                                    {{allmsgs[index].text}}
                                  </tr> -->
                                  </tbody>
                                </table>
                              </div>
                             
                              <!-- <div style="font-size:15px;font-weight:light;">{{formatTime(allmsgs[index].time)}}</div> -->
                           
                        
                      </div>
                    </div>
                  </div>
                  <div v-if="interlocutors && interlocutors.length > 0" style="height:75px;align-self:flex-end;width:100%;">
                    <!-- <el-button slot="append" icon="el-icon-paperclip" size="small"></el-button> -->
                      <el-input prefix-icon="el-icon-search" placeholder="Message + Entrer"  :rows="3" type="textarea" v-model="msg" @change="sendMessage" class="input-with-select">
                      </el-input>
                  </div>
                    
                </el-col>
            </el-row>
          </div>
       </el-col>
       <el-col :span="6"></el-col>
      <el-row style="height:5vh;"></el-row>
</el-main>
  </el-container>
    <footer-component></footer-component>
  </div>
</template>


<script>
import NavComponent from './../Navigation/NavComponent';
import FooterComponent from './../Footer/FooterComponent';
import AvatarComponent from './../Utils/AvatarComponent';
import BreadcrumpComponent from './../Utils/BreadcrumpComponent';
import io from 'socket.io-client'
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  name: 'ChatComponent',
  components: { NavComponent, AvatarComponent, FooterComponent, BreadcrumpComponent },
  data() {
      return {
        socket: '',
        msg: '',
        activeMsgs: [],
        allmsgs: [],
        // searchName: '',
        // dialog_id: this.$route.params.dialog_id || null,
          //parameters to give to chat directly to somebody in particular
        interlocutor_id: this.$route.params.interlocutor_id || null,
        furnit_id: this.$route.params.furnit_id || null,
        firstname: '',
        lastname: '',
        usernameInt: '',
        furnitname: '',
        interlocutors: null,
        // interlocutor_id: null,
      }
  },
  computed : {
    ...mapGetters({
      loaner: 'GET_LOAN',
      id: 'GET_ID',
      token: 'GET_TOKEN',
      username: 'GET_USERNAME'
    })
    // name () {
    //     console.log('NAMME');
    //     if (this.username) return this.username;
    //     else {
    //       return this.firstname + ' ' + this.lastname;
    //     }
    //   }
  },
  methods: {
    expandMessage (index) {
      console.log('expandMessage');
      let ind = this.activeMsgs.indexOf(index);
      if (ind !== -1) {
          this.activeMsgs.splice(ind, 1);
      }
      else this.activeMsgs.push(index);
    },
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
    name(id) { 
      if (id === this.id) return this.username
      else return this.usernameInt;
    },
    //  isAuthor (id) {
    //   return {
    //     message: true
    //     // right: (id === this.id),
    //     // left: (id !== this.id)
    //   }
    // },
    isSelected (itl) {
      console.log('ITL');
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
      this.usernameInt = itl.interlocutor_username;
      this.furnits = itl.furnit;
      this.socket.emit('getChat', itl.dialog_id);
      this.msg = '';
    },
    formatTime (time) {
      return moment(time).format('DD/MM/YY HH:mm');
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
    console.log('UPDATED');
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
      let index_interlocutorWanted =  interlocutors.length - 1;
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

.min-height{
  height: 7vh;
}

.expandable-height{
  height: auto;
}

.chat_it:hover{
  background-color:#e8eaed;
  border-radius: 0 16px 16px 0;
  color:#1E969D;
}

.message{
  padding: 6px;
  border-radius: 3px;
  /* margin:8px 8px; */
  cursor: pointer;
}

.selected{
  background-color:#e8eaed;
  border-radius: 0 16px 16px 0;
  color:#1E969D;
  font-weight:bold;
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

 .aside {
    background-color:#1E969D;
    color: white;
    /* background: linear-gradient(to right,#B0C4DE, #1E969D); */
  }
  .aside ul li{

    background-color:#1E969D;
    color: white;
    /* background: linear-gradient(to right,#B0C4DE, #1E969D); */
  }

</style>