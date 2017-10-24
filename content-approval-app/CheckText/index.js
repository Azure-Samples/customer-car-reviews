var request = require('request-promise');

module.exports = function (context, carReview) {
if (carReview && carReview.description && (!carReview.textApproval ||  carReview.textApproval  != "complete")) {
    var options = {
        uri: process.env["ContentModeratorApiUrl"],
        method: 'POST',
        qs: {
            language: 'eng'
        },
        headers: {
            'Ocp-Apim-Subscription-Key': process.env["ContentModeratorApiKey"],
            'Content-Type': 'text/plain'
        },
        body : carReview.description,
        json: true
    };
    request(options)
    .then(function (parsedBody) {
        var terms = parsedBody.Terms;
        context.log(terms);
        carReview.textApproval = "complete";
        if(terms === null){
            context.bindings.outputDocument = carReview;
            context.bindings.carReviewTextChecked = carReview;
            context.done();
        } else {
            carReview.state = "rejected";
            context.bindings.outputDocument = carReview;
            var rejectionEvent = {
                id: carReview.id,
                company: carReview.company,
                description: carReview.description,
                image_url: carReview.image_url,
                name: carReview.name,
                state: carReview.state,
                rejectionReason: "description text"
            };
            context.bindings.rejectedReviewItem = rejectionEvent;
            context.done();
        }
    })
    .catch(function (err) {
       context.log(err);
       throw err;
       context.done();
    });  
    }
    else {
        if(!carReview.textApproval &&  carReview.textApproval  != "complete") {
            context.log("Please pass a description in the request body");
            throw "Please pass a description in the request body";
        }
        context.done();
    }

};