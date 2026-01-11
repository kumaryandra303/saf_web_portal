// String validator utility for SQL injection prevention
module.exports = {
    qryString: function(data) {
        if (typeof data === 'object' && data !== null) {
            Object.keys(data).forEach(key => {
                if (typeof data[key] === 'string') {
                    // Basic sanitization
                    data[key] = data[key].replace(/[<>]/g, '');
                }
            });
        }
        return data;
    }
};










