/**
 * Created by Timmimim on 18.08.2016.
 */
"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


var app = express();
app.use(bodyParser.urlencoded({extended: true})); // to enable processing of the received post content


var config = {
    httpPort: 3103,
    mongoPort: 27017
};

// ------------------------------------------------------


/* database schema */
var featureSchema = mongoose.Schema({
    data: {}
});
var Feature = mongoose.model('Feature', featureSchema);


/* database connection */
mongoose.connect('mongodb://localhost:' + config.mongoPort + '/olympic_venues');

var database = mongoose.connection;


database.on('error', console.error.bind(console, 'connection error:'));
database.once('open', function (callback) {
    console.log('connection to database established on port ' + config.mongoPort);
});


/* http routing */
// code which is executed on every request
app.use(function(req, res, next) {
    console.log(req.method + ' ' + req.url + ' was requested by ' + req.connection.remoteAddress);

    res.header('Access-Control-Allow-Origin', '*');    // allow CORS
    //res.header('Access-Control-Allow-Methods', 'GET,POST');

    next();
});


/* get home page */
app.use(express.static("./webapp/"));



// returns json of all stored features
app.get('/getAllFeatures', function(req, res) {
    Feature.find(function(error, features) {
        if (error) return console.error(error);
        res.send(features);
    });
});

// takes a json document via POST, which will be added to the database
// name is passed via URL
// url format: /addFeature?name=
app.post('/addFeature', function(req, res) {
    //console.log(JSON.stringify(req.body));

    var feature = new Feature({
        data: req.body
    });

    feature.save(function(error){
        var message = error ? 'failed to save feature: ' + error
            : 'feature saved: ' + feature.name;
        console.log(message + ' from ' + req.connection.remoteAddress);
        res.send(message);
    });
});

app.get('/getOneFeature/:id', function(req, res) {
    var featId = req.params.id;
    console.log(featId);

    Feature.findOne({_id: featId}, function(error, features) {
        if (error) return console.error(error);
        //look for special feature
        res.send(features);
    });
});


app.post('/updateFeature/:id', function(req, res) {
    var featID = req.params.id;
    Feature.findByIdAndUpdate(featID, req.body, {runValiditors: true, upsert:true}, function(error, features) {
        if(error) return console.error(error);
        res.send('Updated feature ' + featID);
    });
});

app.get('/removeFeature/:id/', function(req, res){
    var featId = req.params.id;
    Feature.findOne({_id: featId}, function(err, value){
        if(err){
            console.log(err);
        } else {
            console.log('remove found');
            value.remove();
        }
        res.send('removed feature' + featId);
    });
});

// launch server
app.listen(config.httpPort, function(){
    console.log('http server now running on port ' + config.httpPort);
});