import axios from 'axios';
// import VueCookies from 'vue-cookies'

const url = 'http://localhost:5000/api/auth';

class AuthService {

    static insertUser(user) {
        const url_signup = url + '/signup';
        console.log('insertUser');
        return new Promise(function(resolve, reject) {
            try {
                console.log(user);
                return axios.post(url_signup, user).then(function (response) {
                    console.log(response);
                    resolve(response.data);
                }).catch(function (error) {
                    console.log('RET 1');
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                      }
                    reject(error);
                });
            } catch(err) {
                console.log('RET 2');
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
                    console.log('RETOUR DE LOGIN');
                    console.log(response);
                    if (response.data.success) {
                        // const token = response.data.token;
                        // VueCookies.set('jwt' , token , "1h");
                        resolve(response.data);
                    } else {
                        resolve(response);
                    }
                }).catch(function (error) {
                    console.log(error);
                    reject(error);
                });
            } catch(err) {
                reject(err);
            }
        })
    }

    static signUpGoogle() {
        const url_google = url + '/google';
        console.log(url_google);
        return new Promise(function(resolve, reject) {
            try {
                let config = {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    }
                }
                console.log('Try to sign up With Google');
                return axios.get(url_google, config).then(function (response) {
                    console.log('RETOUR');
                    console.log(response);
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

    static signUpFacebook() {
        const url_fb = url + '/facebook';
        console.log(url_fb);
        return new Promise(function(resolve, reject) {
            try {
                console.log('Try to sign up With Google');
                return axios.get(url_fb).then(function (response) {
                    console.log('Retour de signUp Fb');
                    console.log(response);
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


    static sendValidationUser(mail) {
        const url_validation = url + '/validation';
        return new Promise(function(resolve, reject) {
            try {
                return axios.post(url_validation, mail).then(function (response) {
                    console.log(response);
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

    static passwordForgotten(mail) {
        const url_reinit_pswd = url + '/passwordForgotten';
        return new Promise(function(resolve, reject) {
            try {
                return axios.post(url_reinit_pswd, mail).then(function (response) {
                    console.log(response);
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

    static reinitializePassword(password, query) {
        const url_reinit_pswd = url + '/reinitializePassword';
        console.log(query);
        return new Promise(function(resolve, reject) {
            try {
                let {token, email} = query;
                let data = { password, token, email };
                return axios.post(url_reinit_pswd, data).then(function (response) {
                    console.log('RETOUR DE REINIT PSWD');
                    console.log(response);
                    if (response.data.success) {
                        resolve(response.data);
                    } else {
                        resolve(response);
                    }
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
        let url_profile = url + '/profile'
        return new Promise(function(resolve, reject) {
            try {
                return axios.get(url_profile, { withCredentials: true }).then(function (response) {
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