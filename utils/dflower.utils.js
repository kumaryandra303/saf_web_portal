// Dflower utility functions
var std = require('./standardMessages');

module.exports = {
    getModuleMetaData: function(__dirname, __filename) {
        return {
            dir_name: __dirname,
            file_name: __filename,
            mod_name: __filename.split('/').pop().split('.')[0]
        };
    },

    formatSucessRes: function(req, res, data, cntxtDtls, fnm, options) {
        return res.status(200).json({
            status: 'success',
            message: options.success_msg || std.message.SUCCESS.message,
            data: data
        });
    },

    formatErrorRes: function(res, errors, cntxtDtls, fnm, options) {
        const statusCode = options && options.error_status ? options.error_status : 500;
        const errorMessage = options && options.err_message ? options.err_message : 'Internal Server Error';
        
        return res.status(statusCode).json({
            status: 'error',
            message: errorMessage,
            errors: errors || [],
            data: null
        });
    }
};

