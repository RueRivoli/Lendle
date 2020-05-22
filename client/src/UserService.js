import axios from 'axios';

const url = 'http://localhost:5000/api/users';

class UserService {

    static getProfile(token) {
        let url_profile = url + '/profile'
        console.log('LE TOKEN');
        console.log(token);
        return new Promise(function(resolve, reject) {
            try {
                // let config = {
                //     headers: {
                //         'Content-Type': 'application/json;charset=UTF-8',
                //         "Authorization": localStorage.getItem('JWT'),
                //     }
                // };
                // let token = "zffzfzffzfz78625362fzezef";
                // let storage = document.cookie.jwt;
                let token = document.cookie.split('jwt=')[1];
                console.log('COOOKKKIIIIEEEEEE')
                console.log(token);
                let config = {
                    headers: {
                        // 'Content-Type': 'application/json;charset=UTF-8',
                        // "Authorization": localStorage.getItem('JWT'),
                        // "Access-Control-Allow-Origin": "http://localhost:8080",
                        //    "Access-Control-Allow-Credentials": true,
                        'Authorization': `Bearer ${token}`
                           
                    },
                };
                // axios.defaults.withCredentials = true;
                // require('axios-debug-log');

                return axios.get(url_profile, config ).then(function (response) {
                    console.log(response);
                    resolve(response);
                }).catch(function (error) {
                    console.log('ERROR');
                    if (error.response) {
                        console.log('RESPOOONNSE');
                        /*
                         * The request was made and the server responded with a
                         * status code that falls out of the range of 2xx
                         */
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    } else if (error.request) {
                        console.log('REQQEUUUEST');
                        /*
                         * The request was made but no response was received, `error.request`
                         * is an instance of XMLHttpRequest in the browser and an instance
                         * of http.ClientRequest in Node.js
                         */
                        console.log(error.request);
                    } else {
                        console.log('ELLLSEE');
                        // Something happened in setting up the request and triggered an Error
                        console.log('Error', error.message);
                    }
                });
            } catch(err) {
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