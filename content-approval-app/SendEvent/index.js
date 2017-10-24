var request = require('request-promise');
var uuidv4 = require('uuid/v4');
var moment = require('moment');

module.exports = function (context, rejectedReview) {
if (rejectedReview && rejectedReview.id && rejectedReview.company && rejectedReview.description && rejectedReview.image_url && rejectedReview.name && rejectedReview.state && rejectedReview.rejectionReason) {
   var eventGridEvents =  [{
        "id": uuidv4(),
        "eventType": "recordInserted",
        "subject": "car/review/rejected",
        "eventTime": moment().format(),
        "data": rejectedReview
    }];
   
    var options = {
        uri: process.env["EventGridUrl"],
        method: 'POST',
        qs: {
            visualFeatures: 'Description'
        },
        headers: {
            'aeg-sas-key': process.env["EventGridKey"],
            'Content-Type': 'application/json'
        },
        body : eventGridEvents,
        json: true
    };

    request(options)
    .then(function (parsedBody) {
        context.done(); 
    })
    .catch(function (err) {
        throw err;
        context.done();
    });
    } else {
        throw "Provide correct input for the function";
        context.done();
  }
};