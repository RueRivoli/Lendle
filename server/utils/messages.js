const moment = require('moment');

function formatMessage(mail, author_id, text) {
    return {
        mail,
        author_id,
        text,
        time: moment().format('DD/MM/YY h:mm a')
    }
}

module.exports = formatMessage