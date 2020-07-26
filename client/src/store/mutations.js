const mutations = {
    AUTH: (state) => {
        state.authentificated = true
    },
    ID: (state, id) => {
        state.id = id
    },
    USERNAME: (state, username) => {
        state.username = username
    },
    AVATAR: (state, avatar) => {
        state.avatar = avatar
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
        state.authentificated = false;
        state.id = '';
        state.loaner = true,
        state.token = ''
    },
}

export default mutations