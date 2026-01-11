var express = require('express');
var cors = require('cors');
var router = express.Router();
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var MySQLStore = require('express-mysql-session')(expressSession);
var request = require('request');
var app = express();
const helmet = require("helmet");
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var https = require('https');
var fs = require('fs');
var compression = require('compression')
moment = require('moment');
path = require('path');
nconf = require('nconf');
expressValidator = require('express-validator');
util = require('util');
var _ = require('lodash');
appRoot = __dirname;
var isLocal = true;
isServerRunLocal = isLocal;
var settings = require('./utils/settings.utils');
appSettings = settings.getSettings();
var auditRequest = require('./utils/audit.requests');
validate = require('./utils/validate.utils');
var banner = require('./utils/banner');
var df = require(appRoot + '/utils/dflower.utils');
var cntxtDtls = df.getModuleMetaData(__dirname, __filename);
var log = require(appRoot + '/utils/logmessages');
var std = require(appRoot + '/utils/standardMessages');
var sqlInjctUtl = require(appRoot + '/utils/stringvalidator')

// Load environment variables
require('dotenv').config();

// Create log directory
var logDirectory = appRoot + '/' + appSettings.app.log_dir;
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Security middleware
app.use(helmet());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'",
          'https://apis.google.com',
          'https://cdn.jsdelivr.net/gh/gokertanrisever/leaflet-ruler@master/src/leaflet-ruler.js',
          'https://cdn.syndication.twimg.com/timeline/profile',
          'https://connect.facebook.net/en_US/sdk.js', 'https://cdn.embedly.com/widgets/platform.js',
          'https://platform.twitter.com','https://www.google-analytics.com',
          'https://fonts.googleapis.com/',
          'https://settibalijaactionforce.com', 'https://settibalijaactionforce.com',
    'http://settibalijaactionforce.com',
          'https://weatherwidget.io/js/widget.min.js', 'https://www.googletagmanager.com','https://es-staging.cdac.in'
        ],
        styleSrc: ["'self'", "'unsafe-inline'",
          'https://use.fontawesome.com',
          'https://platform.twitter.com',
          'https://www.google-analytics.com',
          'https://fonts.googleapis.com/', 'https://settibalijaactionforce.com',
          'http://settibalijaactionforce.com',
          'https://settibalijaactionforce.com',
          'https://cdn.jsdelivr.net', 'https://www.jqueryscript.net/','https://es-staging.cdac.in'
        ],
        fontSrc: ["'self'", 'fonts.gstatic.com', 'https://fonts.googleapis.com/', 'https://settibalijaactionforce.com',
            'http://settibalijaactionforce.com',
             'https://settibalijaactionforce.com', 'https://use.fontawesome.com','https://es-staging.cdac.in'],
        frameSrc: ["'self'", 'https://accounts.google.com https://platform.twitter.com',  'https://settibalijaactionforce.com',
            'http://settibalijaactionforce.com',
            'https://fonts.googleapis.com/', 'https://settibalijaactionforce.com', 'https://syndication.twitter.com', 'https://weatherwidget.io','https://es-staging.cdac.in'],
        connectSrc: ["'self'", "'unsafe-inline'", 'https://settibalijaactionforce.com',
            'http://settibalijaactionforce.com', 'https://www.google-analytics.com', 'https://fonts.googleapis.com/', 'https://translate.googleapis.com', 'https://www.facebook.com', 'https://graph.facebook.com','https://es-staging.cdac.in'],
        imgSrc: ["'self'", "'unsafe-inline'", 'data:', 'https://settibalijaactionforce.com',
            'http://settibalijaactionforce.com',
          'https://wetrackon.s3.ap-southeast-1.amazonaws.com/', 'https://fonts.googleapis.com/', 'https://www.facebook.com',
          'https://lh3.googleusercontent.com/',
          'https://dswetrack.s3.ap-southeast-1.amazonaws.com/',
          'https://pbs.twimg.com',
          'https://fonts.googleapis.com/', 'https://settibalijaactionforce.com', 'https://platform.twitter.com',
          'https://syndication.twitter.com', 'https://www.facebook.com', 'https://www.gstatic.com',
          'https://es-staging.cdac.in','https://www.google.com/', 'https://translate.googleapis.com', 'https://translate.google.com/','https://www.freecounterstat.com/','https://counter5.stat.ovh/'],
      
        }
}));

// Body parser middleware
// Note: bodyParser automatically skips multipart/form-data requests (handled by multer)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Skip global multer for updates and funds routes (they have their own multer configuration)
app.use(function(req, res, next) {
    if (req.path && (req.path.includes('/updates/') || req.path.includes('/funds/'))) {
        return next(); // Skip global multer for updates and funds routes
    }
    upload.array()(req, res, next);
});
app.use(compression());


  


 
app.use(express.static(__dirname + '/client/public/dist/enlink', {
    setHeaders(res, path) {
        if (path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|json)$/)) {
            const date = new Date();
            date.setFullYear(date.getFullYear() + 1);
            res.setHeader("Expires", date.toUTCString());
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
    }
}));

// Serve uploaded documents/images
app.use('/docs', express.static(__dirname + '/public/docs', {
    setHeaders(res, path) {
        if (path.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) {
            const date = new Date();
            date.setFullYear(date.getFullYear() + 1);
            res.setHeader("Expires", date.toUTCString());
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
    }
}));

// Session configuration
var sqlstoreOptions = {
    clearExpired: false,
    acquireTimeout: 5000,
    connectionLimit: 10,
    endConnectionOnClose: false,
    schema: {
        tableName: 'user_session_dtl_t',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'token'
        }
    }
}

var sqldb = require(appRoot + '/config/db.config');
var connection = sqldb.MySQLConPool;
sessionStore = new MySQLStore(sqlstoreOptions, connection, (error) => {
    if (error) {
        console.log('In sessionStore error');
        console.log(error);
        log.db.conError(cntxtDtls, '', error.code, error.fatal);
        return error;
    }
    log.info('Database session store established')
});

appSettings.app.session_options.store = sessionStore;
appSettings.app.session_options.cookie.secure = appSettings.app.prod;
var sessionConnection = expressSession(appSettings.app.session_options)
app.use(sessionConnection);

// CORS configuration
var allowedDomains = [
    'http://localhost:3000', 
    'http://localhost:3001',  // SAF Admin Portal
    'http://localhost:4200',
    'http://localhost:8100', 
    'https://settibalijaactionforce.com',
    'https://settibalijaactionforce.com',
    'http://settibalijaactionforce.com'

];

app.use(cors({
    origin: function (origin, callback) {
        // bypass the requests with no origin (like curl requests, mobile apps, etc)
        if (!origin) return callback(null, true);
 
        if (allowedDomains.indexOf(origin) === -1) {
            var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true 
}));

app.use(cookieParser());

// Cache control
const nocache = require('nocache');
app.use(nocache());

// JSON error handling
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        cntxtDtls.mod_name = 'JSON_ERROR'
        log.error(err.message.replace(/\n/g, " "), req.url, cntxtDtls)
        return df.formatErrorRes(res, [{ "message": err.message.replace(/\n/g, " ") }], cntxtDtls, null, { 
            "error_status": std.message.INVALID_DATA_FORMAT.code, 
            "err_message": std.message.INVALID_DATA_FORMAT.message 
        });
    }
    next();
});

// Error logging
app.use(logErrors);
function logErrors(err, req, res, next) {
    cntxtDtls.mod_name = 'LOG_ERROR'
    log.error(err.stack, req.url, cntxtDtls)
    next(err);
}

// Request processing middleware
app.use(function (req, res, next) {
    var origin = req.headers.origin;
    if (_.includes(allowedDomains, origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept');
    res.setHeader('Access-Control-Expose-Headers', 'x-access-token');
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.body && req.body['data']) {
        req.body['data'] = sqlInjctUtl.qryString(req.body['data'])
    }
    else if (req.body) {
        req.body = sqlInjctUtl.qryString(req.body)
    }
    next();
});

// Audit middleware
app.all('*', function (req, res, next) {
    auditRequest.auditAllUrls(req, res, 'audit', 'SAF');
    auditRequest.isMobile(req, res, (e, r) => {
        req.isMobile = r;
        validate.SanitizeInputs(req, res, (result) => {
            if (result) { 
                next(); 
            }
            else {
                res.setHeader('Access', 'Denied')
                return df.formatErrorRes(res, null, cntxtDtls, null, { 
                    "error_status": std.message.UN_AUTH_ACCESS.code, 
                    "err_message": std.message.UN_AUTH_ACCESS.message 
                });
            }
        })
    })
});

// API Routes
app.use('/apiv1', require('./server/api/routes/apiRoutes'));
app.use('/apiv2', cors(), require('./server/api/routes/apiRoutes'));

// Serve client application
app.get('/', function (req, res) {
    res.sendFile(path.join(appRoot + '/client/public/dist/enlink/index.html'));
});

// 500 Error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    cntxtDtls.mod_name = '500_ERROR'
    log.error(err.message, req.url, cntxtDtls)
    return df.formatErrorRes(res, null, cntxtDtls, null, { 
        "error_status": std.message.SYNTAX_ERROR.code, 
        "err_message": std.message.SYNTAX_ERROR.message 
    });
});

// Allowed extensions for static files
const allowedExt = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.woff2',
    '.woff',
    '.ttf',
    '.svg',
];

// Catch all route for SPA
app.get('*', function (req, res) {
    var filename = path.join(appRoot, req.url);
    if (filename.indexOf(appRoot) !== 0) {
        return df.formatErrorRes(res, null, cntxtDtls, null, { 
            "error_status": std.message.INVALID_ROUTE.code, 
            "err_message": std.message.INVALID_ROUTE.message 
        });
    } else {
        if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
            const date = new Date();
            date.setFullYear(date.getFullYear() + 1);
            res.setHeader("Expires", date.toUTCString());
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
            res.sendFile(path.resolve(__dirname + '/client/public/dist/enlink/' + req.url));
        } else {
            res.sendFile(path.join(appRoot + '/client/public/dist/enlink/index.html'));
        }
    }
});

// Start server
if (isLocal) {
    /* for local working - START */
    var server = app.listen(appSettings.app.app_port, () => {
        var host = server.address().address;
        var port = server.address().port;
        console.log(appSettings.app.app_name + ' Started. listening at http://%s:%s', host, port);
        if (appSettings.app.banner == true)
            banner.startPrint("http://" + server.address().address + ":" + server.address().port);
    });
    /* for local working - END */

} else {
    /** UAT / PROD  - START */
    var server = https.createServer({
        key: fs.readFileSync('/path/to/private.key'),
        cert: fs.readFileSync('/path/to/certificate.crt'),
        ca: [fs.readFileSync('/path/to/ca_bundle.crt')]
    }, app).listen(appSettings.app.app_port, () => {
        var host = server.address().address;
        var port = server.address().port;
        console.log(appSettings.app.app_name + ' Started. listening at https://%s:%s', host, port);
        if (appSettings.app.banner == true)
            banner.startPrint("https://" + server.address().address + ":" + server.address().port);
    });
    /** UAT / PROD  - END */
}

