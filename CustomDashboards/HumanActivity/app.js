var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var app = express();
var M = require('./Falk_core/Maker');
var Run = require('./clean_run');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.get('/output', function (req, res) {
    console.log("Entered output");
    M.setKey(req.query.api_key, function (e, r) {
        if (!e) {
            console.log("Done with setting the key");
            M.getRevisionOutput(req.query.P_id, 1, function (err, r) {
                console.log("RO ended");
                if (!err) {
                    return res.status(200).send(r);
                }
                else {
                    console.log("Sending message: " + err);
                    return res.status(400).send({'message': err});
                }

            });
        }
    });
});

app.get('/deploy', function (req, res) {
    console.log("Entered API call");
    console.log("About to enter deployNew() call");
    Run.deployNew(req.query.name, req.query.api_key, req.query.code, function (e, r) {
        if (!e) {
            return res.status(200).send({'message': r});
        }
        else {
            return res.status(200).send({'message': e});
        }
    });
});
/*app.use('/pipelist', function (req, res, next) {
 console.log(req.query.api_key);
 M.setKey(req.query.api_key);
 M.getPL_list(function (err, r) {
 if (!err && r!=null) {
 res.status(200);
 return res.json
 /!*res.status(200).send({'message': 'Received stuff'});
 next();*!/
 }
 else if(err) {
 res.status(409).json({'message': err});
 next();
 }
 });

 });*/

app.get('/pipelist', function (req, res) {
    M.setKey(req.query.api_key, function (e, r) {
        if (!e) {
            M.getPL_list(function (err, r) {
                if (!err && r != null) {
                    r.push({'message': 'Success'});
                    return res.status(200).send(JSON.stringify(r));
                }
                else if (err) {
                    return res.status(200).send(JSON.stringify([{'message': err}]));
                }
            });
        }
    });

});

// catch 404 an d forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
