var nodemailer = require('nodemailer');
var log = require(appRoot + '/utils/logmessages');
var df = require(appRoot + '/utils/dflower.utils');
var cntxtDtls = df.getModuleMetaData(__dirname, __filename);
var svgCaptcha = require('svg-captcha');
var captchMdl = require('../model/captchaMdl');
var crypto = require('crypto');

/**************************************************************************************
* Controller     : generateCaptchaCntrl
* Parameters     : req,res()
* Description    : Generate captcha image with salt key
* Change History :
* 25/03/2021   - Initial Function
***************************************************************************************/
var genSaltKey = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

exports.generateCaptchaCntrl = function (req, res) {
    var fnm = "generateCaptchaCntrl";
    var captcha = svgCaptcha.create(
        {
            Size: 4,
            Width: 100,
            Height: 50,
            Noise: 2,
            fontSize: 35,
            Color: false,
            ignoreChars: 'Il'
        }
    );
    var salt_ky = genSaltKey(16);
    captchMdl.insrtCpatchaTxtMdl(captcha.text, salt_ky).then(function (results) {
        if (results && results['insertId']) {
            var img_src = `data:image/svg+xml;base64,` + Buffer.from(captcha.data).toString('base64');
            res.type('svg');
            res.status(200).send({ 
                data: img_src, 
                text: results['insertId'], 
                salt_ky : salt_ky 
            });
        }
        else {
            res.status(500).send({ data: null, text: null });
        }
    }, function (error) {
        df.formatErrorRes(res, error, cntxtDtls, fnm, {});
    });
}

/**************************************************************************************
* Controller     : validateCaptchaCntrl
* Parameters     : req,res()
* Description    : Validate captcha
* Change History :
* 2/04/2021   - Initial Function
***************************************************************************************/
exports.validateCaptchaCntrl = function (req, res) {
    var fnm = "validateCaptchaCntrl";
    var cptch_txt = req.params.cptch_txt;
    var cptch_id = req.params.cptch_id;
    captchMdl.validateCaptchaMdl(cptch_txt, cptch_id).then(function (results) {
        if (results && results.length) {
            df.formatSucessRes(req, res, "valid", cntxtDtls, fnm, {});
        }
        else {
            df.formatErrorRes(res, "error", cntxtDtls, fnm, {
                error_status: 500,
                err_message: "invalid captcha"
            });
        }
    }, function (error) {
        df.formatErrorRes(res, error, cntxtDtls, fnm, {
            error_status: 500,
            err_message: "invalid captcha"
        });
    });
}

/**************************************************************************************
* Controller     : captchScheduleJob
* Parameters     : req,res()
* Description    : Schedule job to clean old captcha records
* Change History :
* 2/04/2021   - Initial Function
***************************************************************************************/
exports.captchScheduleJob = function () {
    captchMdl.captchScheduleJobMdl().then(function (results) {
        log.message("--captcha schedule-- cleaning captcha records success.", cntxtDtls, 100, ``);
    }, function (error) {
        log.message("Captcha schedule error ", cntxtDtls, 100, ` ${error} `);
    });
}







