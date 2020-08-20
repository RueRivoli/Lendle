const moment = require('moment');

export function toFormat (date) {
    let mom = moment(date);
    return mom.format('DD MMMM YYYY');
}

export function toFormatSpecific (date, strFormat) {
    let mom = moment(date);
    return mom.format(strFormat);
}


// module.exports = {toFormat, toFormatSpecific}

// export default { toFormat, toFormatSpecific }