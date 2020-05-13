import axios from 'axios';

const url = 'http://localhost:5000/api/auth';

class AuthService {

    static insertUser(user) {
        const url_register = url + '/register';
        return new Promise(function(resolve, reject) {
            try {
                return axios.post(url_register, user).then(function (response) {
                    console.log(response);
                    resolve(response.data);
                }).catch(function (error) {
                    console.log('RET');
                    console.log(error);
                    reject(error);
                });
            } catch(err) {
                console.log(err);
                reject(err);
            }
        })
    }


    static logUser(user) {
        const url_login = url + '/login';
        return new Promise(function(resolve, reject) {
            try {
                return axios.post(url_login, user).then(function (response) {
                    console.log(response);
                    if (response.data.success) {
                        const token = response.data.token;
                        localStorage.setItem('Authorization', token);
                        resolve(response.data.success);
                    }
                    resolve(response);
                }).catch(function (error) {
                    console.log(error);
                    reject(error);
                });
            } catch(err) {
                reject(err);
            }
        })
    }

    static getProfile() {
        // console.log(profile);
        let url_login = url + '/profile'
        return new Promise(function(resolve, reject) {
            try {
                let config = {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        "Authorization": localStorage.getItem('Authorization'),
                    }
                };
                return axios.get(url_login, config).then(function (response) {
                    console.log(response);
                    resolve(response);
                }).catch(function (error) {
                    console.log(error);
                });
            } catch(err) {
                console.log(err);
                reject(err);
            }
        })
    }

}

 export default AuthService;