import axios from 'axios';
import store from './../store'
const url = 'http://localhost:5000/api/rentals/';


class RentalService {
    static defaultsHeaders() {
        let token = store.getters.GET_TOKEN;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    static getRentals(as_loaner){
        this.defaultsHeaders();
        return new Promise(function(resolve, reject) {
            try {
                let url_rentals;
                console.log(as_loaner);
                if (as_loaner) url_rentals = url + 'loan/';
                else url_rentals = url + 'rent/';
                axios.get(url_rentals).then(function (response) {
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

    static getRentalById(rental_id, as_loaner){
        this.defaultsHeaders();
        console.log('get Rental By Id');
        console.log(rental_id);
        console.log(as_loaner);
        let url_rental;
        if (as_loaner) url_rental = url + `details/loan/${rental_id}`;
        else url_rental = url + `details/rent/${rental_id}`;
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

}



 export default RentalService;