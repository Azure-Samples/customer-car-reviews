var uuidv4 = require('uuid/v4');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.body && req.body.name && req.body.company && 
        req.body.description && req.body.image_url && req.body.state) {

        var outDoc = req.body;
        outDoc.id = uuidv4();
        outDoc.textApproval = "pending";
        outDoc.imageApproval = "pending";
        outDoc.name = req.body.name.trim();
        context.bindings.outputDocument = outDoc;
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Car review created"
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a valid car review in the request body"
        };
    }
    context.done();
};