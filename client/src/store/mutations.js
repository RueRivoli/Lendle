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
    //   const id = localStorage.getItem('id')
    //   const token = localStorage.getItem('token')
    //   if (token && id) {
    //     state.id = id
    //     state.token = token
    //     state.authentificated = true
    //     // axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
    //   }
    },
    TO_RENT: (state, value) => {
        state.toLoan = value
    },
}

export default mutations