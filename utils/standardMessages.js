// Standard Messages utility
module.exports = {
    message: {
        "SUCCESS": { code: 200, message: "Success" },
        "CREATED": { code: 201, message: "Created successfully" },
        "INVALID_CREDENTIALS": { code: 401, message: "Invalid username or password" },
        "UN_AUTH_ACCESS": { code: 401, message: "Unauthorized access" },
        "INVALID_ROUTE": { code: 404, message: "Invalid route" },
        "INVALID_DATA_FORMAT": { code: 400, message: "Invalid data format" },
        "SYNTAX_ERROR": { code: 500, message: "Syntax error" },
        "INVALID_CAPTCHA": { code: 400, message: "Invalid captcha" },
        "TOOMANY_ATTEMPTS": { code: 429, message: "Too many attempts. Please try again later" },
        "INVALID_OTP": { code: 400, message: "Invalid OTP" },
        "USER_NOT_FOUND": { code: 404, message: "User not found" },
        "USER_NOT_EXIST": { code: 404, message: "User does not exist" },
        "LOGGED_OUT": { code: 200, message: "Logged out successfully" }
    },
    varErrorMsg: function(key) {
        return this.message[key] || { code: 500, message: "Unknown error" };
    }
};





