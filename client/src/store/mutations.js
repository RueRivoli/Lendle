const mutations = {
    INIT: (state) => {
      const id = localStorage.getItem('id')
      const token = localStorage.getItem('token')
      if (token && id) {
        state.id = id
        state.token = token
        state.authentificated = true
        // axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
      }
    }
}

export default mutations