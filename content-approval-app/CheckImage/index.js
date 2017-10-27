var request = require('request-promise');

module.exports = function (context, carReviewTextChecked) {

if(context.bindingData.dequeueCount > 2) {
  context.bindings.poisonedMessage = carReviewTextChecked;
  context.done();
}

if (carReviewTextChecked && (!carReviewTextChecked.imageApproval ||  carReviewTextChecked.imageApproval  != "complete")) {

    var options = {
        uri: process.env["VisionApiUrl"],
        method: 'POST',
        qs: {
            visualFeatures: 'Description'
        },
        headers: {
            'Ocp-Apim-Subscription-Key': process.env["VisionApiKey"],
            'Content-Type': 'application/json'
        },
        body :{ "url" : carReviewTextChecked.image_url },
        json: true
    };

    request(options)
    .then(function (parsedBody) {
        var tags = parsedBody.description.tags;
        carReviewTextChecked.imageApproval = "complete";
        if(tags.indexOf("car") > -1){
            carReviewTextChecked.state = "approved";
            context.bindings.outputDocument = carReviewTextChecked;
        } else {
            carReviewTextChecked.state = "rejected";
            context.bindings.outputDocument = carReviewTextChecked;
            var rejectionEvent = {
                id: carReviewTextChecked.id,
                company: carReviewTextChecked.company,
                description: carReviewTextChecked.description,
                image_url: carReviewTextChecked.image_url,
                name: carReviewTextChecked.name,
                state: carReviewTextChecked.state,
                rejectionReason: "car is not on the image"
            };
            context.bindings.rejectedReviewEvent = rejectionEvent;
        }
        context.done();
    })
    .catch(function (err) {
       context.log(err);
       context.done(err, {});
    });
    }
    else {

        if(!carReviewTextChecked.imageApproval ||  carReviewTextChecked.imageApproval  != "complete") {
            throw "Please pass an image url for verification in the request body";
        }
        context.done();
    }
};