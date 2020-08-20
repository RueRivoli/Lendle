import axios from 'axios';
import store from './../store'
const url = 'http://localhost:5000/api/rentals/';


class RentalService {
    static defaultsHeaders() {
        let token = store.getters.GET_TOKEN;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // static getAllRentalsForThisFurnit(furnit_id){
    //     this.defaultsHeaders();
    //     return new Promise(function(resolve, reject) {
    //         try {
    //             let url_rental = url + `toFurnit/${furnit_id}`;
    //             axios.get(url_rental).then(function (response) {
    //                 const data = response.data;
    //                 console.log('success');
    //                 console.log(data);
    //                 resolve(data);
    //               })
    //               .catch(function (error) {
    //                 console.log('ERREUR');
    //                 console.log(error);
    //               });
    //         } catch(err) {
    //             reject(err);
    //         }
    //     })
    // }

    // static getRentals(as_loaner){
    //     this.defaultsHeaders();
    //     return new Promise(function(resolve, reject) {
    //         try {
    //             let url_rentals;
    //             console.log(as_loaner);
    //             if (as_loaner) url_rentals = url + 'loan/';
    //             else url_rentals = url + 'rent/';
    //             axios.get(url_rentals).then(function (response) {
    //                 const data = response.data;
    //                 console.log('success');
    //                 console.log(data);
    //                 resolve(data);
    //               })
    //               .catch(function (error) {
    //                 console.log('ERREUR');
    //                 console.log(error);
    //               });
    //         } catch(err) {
    //             reject(err);
    //         }
    //     })
    // }

    static isRentable(furnit_id, loan_start, loan_end) {
        this.defaultsHeaders();
        console.log('Is Rental Possible');
        console.log(furnit_id);
        console.log(loan_start);
        console.log(loan_end);
        let parameters = {
            params: {
              loanStart: loan_start,
              loanEnd: loan_end
            }
          }
        let url_rentable = url + `isRentable/${furnit_id}`;
        return new Promise(function(resolve, reject) {
            try {
                axios.get(url_rentable, parameters).then(function (response) {
                    const data = response.data;
                    resolve(data);
                  })
                  .catch(function (error) {
                    console.log('ERREUR');
                    console.log(error);
                  });
            } catch(err) {
                reject(err);
            }
        })
    }

    static getAllRentalsForFurnit(furnit_id, isLocation){
        this.defaultsHeaders();
        console.log('get Rental By Id');
        console.log(furnit_id);
        let url_rental = url + `details/loan/${furnit_id}/${isLocation}`;
        // if (as_loaner) url_rental = url + `details/loan/${rental_id}`;
        // else url_rental = url + `details/rent/${rental_id}`;
        return new Promise(function(resolve, reject) {
            try {
                axios.get(url_rental).then(function (response) {
                    const data = response.data;
                    console.log('success');
                    console.log(data);
                    resolve(data);
                  })
                  .catch(function (error) {
                    console.log('ERREUR');
                    console.log(error);
                  });
            } catch(err) {
                reject(err);
            }
        })
    }

    static getRentalById(rental_id){
        console.log('Get Information of a Rental with a rental_id');
        this.defaultsHeaders();
        return new Promise(function(resolve, reject) {
            try {
                let url_rental = url + `${rental_id}`;
                axios.get(url_rental).then(function (response) {
                    // handle success
                    console.log('Response of getStatisticsForRentals ==>');
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

    static getStatisticsForRentals(isLoaner){
        console.log('Gets Statistics for all rentals');
        this.defaultsHeaders();
        return new Promise(function(resolve, reject) {
            try {
                let url_rental = url + `statistics/${isLoaner}`;
                axios.get(url_rental).then(function (response) {
                    // handle success
                    console.log('Response of getStatisticsForRentals ==>');
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

    static postRental(rental){
        this.defaultsHeaders();
        console.log('create new Rental');
        console.log(rental);
        return new Promise(function(resolve, reject) {
            try {
                axios.post(url, rental).then(function (response) {
                    console.log('postRental result');
                    const data = response.data;
                    console.log(data);
                    resolve(data);
                  })
                  .catch(function (error) {
                    console.log('Error');
                    console.log(error);
                  });
            } catch(err) {
                reject(err);
            }
        })
    }

    static updateRental(rental){
        this.defaultsHeaders();
        console.log('update new Rental');
        console.log(rental);
        let url_update = url + 'update/';
        return new Promise(function(resolve, reject) {
            try {
                axios.post(url_update, rental).then(function (response) {
                    console.log('updateRental result');
                    console.log(response);
                    const data = response.data;
                    console.log(data);
                    resolve(data);
                  })
                  .catch(function (error) {
                    console.log('Error');
                    console.log(error);
                  });
            } catch(err) {
                reject(err);
            }
        })
    }



    //Delete Rental
    static deleteRental(rental_id) {
        return axios.delete(`${url}${rental_id}`).then(function (response) {
            console.log('REPONSE');
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        });
    }

}



 export default RentalService;