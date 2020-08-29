import axios from 'axios';
import store from './../store'

const url = 'http://localhost:5000/api/reviews/';

class ReviewService {

    static defaultsHeaders() {
        let token = store.getters.GET_TOKEN;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    

        // create a review
        static insertReview(review) {
            this.defaultsHeaders();
            return new Promise(function(resolve, reject) {
                try {
                    return axios.post(url, review).then(function (response) {
                        console.log('Response of insertReview');
                        console.log(response);
                        if (response.data) resolve(response.data);
                    }).catch(function (error) {
                        console.log(error);
                    });
                }  catch(err) {
                reject(err);
            }
        });
    }

    static getFurnitures(){
        this.defaultsHeaders();
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

    //get all the furnits from a city and with a name (Search Component)
    static getFurnit(furnit){
        console.log('furnit of research');
        console.log(furnit);
        let furnit0 = {
            params: {
              type: furnit.type,
              city: furnit.city,
              word: furnit.word
            }
        };
        this.defaultsHeaders();
        return new Promise(function(resolve, reject) {
            try {
                axios.get(url + 'search/', furnit0).then(function (response) {
                    // handle success
                    console.log('FurnitService ==>');
                    console.log(response);
                    const data = response.data;
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

    static getFurnitsFromRenter(){
        console.log('Gets Furnit from a renter');
        this.defaultsHeaders();
        return new Promise(function(resolve, reject) {
            try {
                axios.get(url + 'rent/').then(function (response) {
                    // handle success
                    console.log('Response of getFurnitsFromRenter ==>');
                    console.log(response);
                    const data = response.data;
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
    static getImagesUrlFromPicIds(pic_ids) {
        let url_new = url + 'images/';
        this.defaultsHeaders();
        return new Promise(function(resolve, reject) {
            try {
                axios.get(`${url_new}${pic_ids}`).then(function (response) {
                    // handle success
                    console.log('get Images Url From Pic Ids');
                    console.log(response);
                    const data = response.data;
                    console.log(data);
                    resolve(data);
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





    static updateFurniture(ad) {
        let url_update = url + 'update/';
        this.defaultsHeaders();
        return new Promise(function(resolve, reject) {
            try {
                return axios.post(url_update, ad).then(function (response) {
                    console.log('Response');
                    console.log(response);
                    resolve(response);
                    if (response.data) resolve(response.data);
                }).catch(function (error) {
                    console.log(error);
                });
            }  catch(err) {
            reject(err);
        }
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


}



 export default ReviewService;