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

    static getFurnitWithId(id){
        console.log('furnit of research');
        // console.log(furnit);
        let furnit0 = {
            params: {
              id: id,
            }
        };
        return new Promise(function(resolve, reject) {
            try {
                axios.get(url, furnit0).then(function (response) {
                    // handle success
                    console.log('getFurnit with Id ==>');
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

    static getFurnitWithSearch(search){
        console.log('Searching with a word');
        let url_search = url + 'search/';
        let word = search.word;
        console.log(word);
        let furnit0 = {
            params: {
                word,
            }
        };
        // `${url_search}${word.word}`
        console.log('form before send');
        console.log(furnit0);
        return new Promise(function(resolve, reject) {
            try {
                axios.get(url_search, furnit0).then(function (response) {
                    // handle success
                    console.log('getFurnit with Word response success ==>');
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
        let url_new = url + 'furn/';
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


    static getIdentidyCardFurnit(furnit_id){
        return new Promise(function(resolve, reject) {
            try {
                axios.get(url + `images/${furnit_id}`).then(function (response) {
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