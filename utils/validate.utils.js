// Validation utility
module.exports = {
    validate_input_params: function(reqBody, validations, callback) {
        let errors = [];
        
        validations.forEach(validation => {
            const field = validation.field;
            const value = reqBody[field];
            
            // Check if required field is missing
            if (validation.required && (!value || value === '')) {
                errors.push(`${validation.name || field} is required`);
                return;
            }
            
            // Skip validation if field is not required and empty
            if (!validation.required && (!value || value === '')) {
                return;
            }
            
            // Type-specific validations
            switch(validation.type) {
                case 'username':
                    if (!/^[a-zA-Z0-9_]{3,30}$/.test(value)) {
                        errors.push(`${validation.name || field} must be alphanumeric`);
                    }
                    break;
                case 'email':
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        errors.push(`${validation.name || field} must be a valid email`);
                    }
                    break;
                case 'password':
                    if (value.length < 6) {
                        errors.push(`${validation.name || field} must be at least 6 characters`);
                    }
                    break;
                case 'int':
                    if (!/^\d+$/.test(value)) {
                        errors.push(`${validation.name || field} must be an integer`);
                    }
                    break;
                case 'alpha':
                    if (!/^[a-zA-Z]+$/.test(value)) {
                        errors.push(`${validation.name || field} must contain only letters`);
                    }
                    break;
                case 'alpha_space':
                    if (!/^[a-zA-Z\s]+$/.test(value)) {
                        errors.push(`${validation.name || field} must contain only letters and spaces`);
                    }
                    break;
                case 'otp':
                    if (!/^\d{4,6}$/.test(value)) {
                        errors.push(`${validation.name || field} must be a 4-6 digit OTP`);
                    }
                    break;
            }
        });
        
        if (errors.length > 0) {
            callback(null, { status: 0, error_msg: errors.join(', '), msg: errors });
        } else {
            callback(null, { status: 1 });
        }
    },

    SanitizeInputs: function(req, res, callback) {
        // Basic sanitization - can be extended
        callback(true);
    }
};

validate = module.exports;





