/*
Load Twilio configuration from .env config file - the following environment
variables should be set:
process.env.TWILIO_ACCOUNT_SID
process.env.TWILIO_API_KEY
process.env.TWILIO_API_SECRET
process.env.TWILIO_CONFIGURATION_SID
*/
require('dotenv').load();
var http = require('http');
var path = require('path');

var AccessToken = require('twilio').AccessToken;
var ConversationsGrant = AccessToken.ConversationsGrant;
var express = require('express');
var randomUsername = require('./randos');

// Create Express webapp
var app = express();
app.use(express.static(path.join(__dirname, 'public')));

/*
Generate an Access Token for a chat application user - it generates a random
username for the client requesting a token, and takes a device ID as a query
parameter.
*/

app.get('/token', function(request, response) {
    var requestRemote = require('request');
    requestRemote.post({
        // live url: 'http://hippo-back.herokuapp.com/auth/dealer', //URL to hit
        url: 'http://127.0.0.1:3000/auth/client',
        qs: {time: 'now'}, //Query string data
        method: 'POST',
        //Lets post the following key/values as form
        json: {
            identity: '456'
        }
    }, function(error, innerResponse, body) {
        if(error) {
            console.log(error);
        } else {
            // Serialize the token to a JWT string and include it in a JSON response
            response.send({
                identity: body.identity,
                token: body.token
            });
        }
    });

});


// Create http server and run it.
var server = http.createServer(app);
var port = process.env.PORT || 2000;
server.listen(port, function() {
    console.log('Express server running on *:' + port);
});

