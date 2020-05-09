import axios from 'axios';

const url = 'http://localhost:5000/api/users/register';

class FurnitService {

    static getFurnitures(){
        return new Promise(function(resolve, reject) {
            try {
                axios.get(url).then(function (response) {
                    // handle success
                    const data = response.data;
                    console.log(data);
                    data.map(furnit => ({
                    ...furnit,
                    dateCreation: new Date(furnit.date)
                    }));
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

    static getImages(){
        return new Promise(function(resolve, reject) {
            try {
                axios.get(url + 'files/').then(function (response) {
                    // handle success
                    const data = response.data;
                    resolve(data.files);
                  })
                  .catch(function (error) {
                    // handle error
                    console.log(error);
                  });
                // const data = res.data;
            } catch(err) {
                reject(err);
            }
        })
    }

    //pour myFurnitComponent

    static insertUser(user) {
        return new Promise(function(resolve, reject) {
            try {
                return axios.post(url, user).then(function (response) {
                    console.log(response)
                }).catch(function (error) {
                    console.log(error);
                });
            } catch(err) {
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
    // Create Post
    


    // static getImages() {
    //     const url0 = url + 'files/';
    //     return axios.get(url0).then(function (response) {
    //         console.log(response);
    //     }).catch(function (error) {
    //         console.log(error);
    //     });
    // }

    //create Furniture
    static insertFurniture(furnit) {
        console.log(furnit);
        return axios.post(url, furnit).then(function (response) {
            console.log('oooo');
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        });
    }

    //Delete Furnit
    static deleteFurnit(id) {
        return axios.delete(`${url}${id}`).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        });
    }
    //Delete File
    static deleteFile(fl) {
        let url0 = url + 'files/';
        let files_id = fl.picture_ids;
        return axios.delete(`${url0}${files_id}`).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        });
    }

}



 export default FurnitService;