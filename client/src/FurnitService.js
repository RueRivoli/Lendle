import axios from 'axios';

const url = 'http://localhost:5000/api/furnits/';

const urlupload = 'http://localhost:5000/api/furnits/upload';

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
        return new Promise(function(resolve, reject) {
            try {
                axios.get(`${url_new}${pic_ids}`).then(function (response) {
                    // handle success
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


    static getIdentityCardFurnit(furnit_id){
        return new Promise(function(resolve, reject) {
            try {
                axios.get(url + `identity/${furnit_id}`).then(function (response) {
                    console.log('Response a get Pictures =====>');
                    const data = response.data;
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

    // when creating a furniture, insert image first in the database and return the id to the form
    // to let it know the id of the pictures associated to this furniture
    static insertPicture(form, hd) {
        return new Promise(function(resolve, reject) {
            try {
                return axios.post(urlupload, form, hd).then(function (response) {
                    console.log(response);
                    var files = response.data.file;
                    var ids = new Array();
                    files.forEach(function(item){
                        ids.push(item.id);
                      });
                    resolve(ids);
                }).catch(function (error) {
                    console.log(error);
                });
            } catch(err) {
                reject(err);
            }
        })
    }


    // insert a new furniture from the form page
    static insertFurniture(furnit) {
        return new Promise(function(resolve, reject) {
            try {
                return axios.post(url, furnit).then(function (response) {
                    console.log('Response');
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