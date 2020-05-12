import axios from 'axios';

const url = 'http://localhost:5000/api/users';

class UserService {

    static getProfile() {
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