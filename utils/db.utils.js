// Database utility functions
const log = require('./logmessages');

module.exports = {
    execQuery: function(connection, query, context, callback) {
        if (typeof callback === 'function') {
            connection.query(query, (error, results) => {
                if (error) {
                    log.error(error.message, query, context);
                    callback(error, null);
                } else {
                    callback(null, results);
                }
            });
        } else {
            return new Promise((resolve, reject) => {
                connection.query(query, (error, results) => {
                    if (error) {
                        log.error(error.message, query, context);
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });
        }
    }
};










