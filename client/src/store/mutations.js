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
    EXIT: (state) => {
        state.authentificated = false
    },
    TO_RENT: (state, value) => {
        state.toLoan = value
    },
    SOCKET_CONNECT(state) {
        state.isConnectedToChat = true;
      },
    SOCKET_DISCONNECT(state) {
        state.isConnectedToChat = false;
    },
    SOCKET_MESSAGECHANNEL(state, message) {
       state.socketMessage = message
    }
}

export default mutations