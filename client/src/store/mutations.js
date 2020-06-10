const mutations = {
    AUTH: (state) => {
        state.authentificated = true
    //   const id = localStorage.getItem('id')
    //   const token = localStorage.getItem('token')
    //   if (token && id) {
    //     state.id = id
    //     state.token = token
    //     state.authentificated = true
    //     // axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
    //   }
    },
    ID: (state, id) => {
        state.id = id
    },
    TOKEN: (state, token) => {
        state.token = token
    },
    LOANER: (state, value) => {
        state.loaner = value
    },
    SOCKET_CONNECT(state) {
        state.isConnectedToChat = true;
      },
    SOCKET_DISCONNECT(state) {
        state.isConnectedToChat = false;
    },
    SOCKET_MESSAGECHANNEL(state, message) {
       state.socketMessage = message
    },
    EXIT: (state) => {
        state.authentificated = false
    },
}

export default mutations