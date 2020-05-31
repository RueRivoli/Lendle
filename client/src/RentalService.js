import axios from 'axios';

const url = 'http://localhost:5000/api/rentals/';


class RentalService {


    static getRentals(){
        return new Promise(function(resolve, reject) {
            try {
                let token = document.cookie.split('jwt=')[1];
                let config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                };
                axios.get(url, config).then(function (response) {
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
        console.log('get Rental By Id');
        console.log(rental_id);
        let url_rental = url + `details/${rental_id}`;
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