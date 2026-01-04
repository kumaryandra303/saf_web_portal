// Settings utility
module.exports = {
    getSettings: function() {
        return {
            app: {
                app_name: 'SAF Web Portal',
                app_port: process.env.PORT || 4901,
                banner: true,
                prod: process.env.NODE_ENV === 'production',
                log_dir: 'log',
                session_sec_key: process.env.SESSION_SECRET || 'saf-secret-key-2024',
                mobile_session_time: 864000000, // 10 days
                jwt_options: {
                    expiresIn: '24h'
                },
                session_options: {
                    secret: process.env.SESSION_SECRET || 'saf-secret-key-2024',
                    resave: false,
                    saveUninitialized: false,
                    cookie: {
                        maxAge: 86400000, // 24 hours
                        httpOnly: true,
                        secure: false
                    }
                },
                origin: process.env.CLIENT_URL || 'http://localhost:3000'
            }
        };
    }
};

