const getters = {
    GET_AUTH: (state) => state.authentificated,
    GET_LOAN: (state) => state.loaner,
    GET_USERNAME: (state) => state.username,
    GET_AVATAR: (state) => state.avatar,
    GET_TOKEN: (state) => state.token,
    GET_ID: (state) => state.id,
    GET_SOCKET: (state) => state.socketMessage,
  }
  
  export default getters

