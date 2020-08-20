import axios from 'axios';
import store from './../store'
var jwt = require('jsonwebtoken');

const url = 'http://localhost:5000/api/users';

class UserService {

    static defaultsHeaders() {
        let token = store.getters.GET_TOKEN;
        console.log(token);
        // let token = document.cookie.split('jwt=')[1];
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    static getUserFromToken(token) {
        var decoded = jwt.decode(token, {complete: true});
        var payload = decoded.payload;
        return payload;
    }
    static getUser() {
        let token = document.cookie.split('jwt=')[1];
        var decoded = jwt.decode(token, {complete: true});
        return decoded.payload;
    }
    static getIfProfileComplete(isLoaner) {
        let url_profile_completed = url + `/isComplete/${isLoaner}`;
        this.defaultsHeaders();
        return new Promise(function(resolve, reject) {
            try {
                return axios.get(url_profile_completed).then(function (response) {
                    console.log('PROFILE IS Complete');
                    console.log(response);
                    resolve(response.data);
                }).catch(function (error) {
                    console.log('Donne une erreur');
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                      }
                      console.log(error);
                    reject(error.response.data.err);
                });
            } catch(err) {
                console.log('Erreur de promesse');
                console.log(err);
                reject(err);
            }
        })
    }
    static getProfile() {
        let url_profile = url + '/profile';
        this.defaultsHeaders();
        return new Promise(function(resolve, reject) {
            try {
                
                return axios.get(url_profile).then(function (response) {
                    console.log(response);
                    resolve(response.data.profile);
                }).catch(function (error) {
                    console.log('Error');
                    if (error.response) {
                        console.log('Response');
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    } else if (error.request) {
                        console.log('Request');
                        console.log(error.request);
                    } else {
                        console.log('Else');
                        console.log('Error', error.message);
                    }
                });
            } catch(err) {
                console.log(err);
                reject(err);
            }
        })
    }

    static updateUser(user) {
        const url_update = url + '/update';
        this.defaultsHeaders();
        console.log('updateUser');
        return new Promise(function(resolve, reject) {
            try {
                return axios.post(url_update, user).then(function (response) {
                    console.log(response.data.msg);
                    resolve(response.data.msg);
                }).catch(function (error) {
                    console.log('Réponse de lerreur');
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                      }
                    reject(error);
                });
            } catch(err) {
                console.log('Erreur de promesse');
                console.log(err);
                reject(err);
            }
        })
    }

    static changePassword(pswd) {
        const url_change_pswd = url + '/password';
        console.log('change Password ==>');
        this.defaultsHeaders();
        return new Promise(function(resolve, reject) {
            try {
                return axios.post(url_change_pswd, pswd).then(function (response) {
                    console.log(response.data.msg);
                    resolve(response.data.msg);
                }).catch(function (error) {
                    console.log('Donne une erreur');
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                      }
                      console.log(error);
                    reject(error.response.data.err);
                });
            } catch(err) {
                console.log('Erreur de promesse');
                console.log(err);
                reject(err);
            }
        })
    }

    static getPictures(){
        return new Promise(function(resolve, reject) {
            try {
                axios.get(url + 'images').then(function (response) {
                    const data = response.data;
                    console.log('Response a get Pictures =====>');
                    console.log(data);
                    resolve(data);
                  })
                  .catch(function (error) {
                    // handle error
                    console.log(error);
                  });
                } catch(err) {
                    reject(err);
                }
            })
        }
}



 export default UserService;