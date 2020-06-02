const actions = {
    signIn ({ commit }, { token, id }) {
      commit('SET_AUTH', { token, id })
    },
    signOut ({ commit }) {
      commit('DEL_AUTH')
      commit('UPDATE_USER', { newUser: {} })
    },
    loadOn ({ commit }) {
        commit('LOAD_ON')
      },
      loadOff ({ commit }) {
        commit('LOAD_OFF')
      },
      init ({ commit }) {
        commit('INIT')
      },
    }


export default actions