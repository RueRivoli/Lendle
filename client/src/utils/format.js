const moment = require('moment');

function toFormat (date) {
    let mom = moment(date);
    return mom.format('DD MMMM YYYY');
}

module.exports = toFormat