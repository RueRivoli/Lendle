import axios from 'axios';

const url = 'http://localhost:5000/api/rentals/';


class RentalService {


    static getRentals(as_loaner){
        return new Promise(function(resolve, reject) {
            try {
                let url_rentals;
                console.log(as_loaner);
                if (as_loaner) url_rentals = url + 'loan/';
                else url_rentals = url + 'rent/';
                let token = document.cookie.split('jwt=')[1];
                let config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                };
                axios.get(url_rentals, config).then(function (response) {
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
        console.log('get Rental By Id');
        console.log(rental_id);
        console.log(as_loaner);
        let url_rental;
        if (as_loaner) url_rental = url + `details/loan/${rental_id}`;
        else url_rental = url + `details/rent/${rental_id}`;
        return new Promise(function(resolve, reject) {
            try {
                let token = document.cookie.split('jwt=')[1];
                let config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                };
                axios.get(url_rental, config).then(function (response) {
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

}



 export default RentalService;