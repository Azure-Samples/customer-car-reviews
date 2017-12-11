function decodeBase64Image(context, data) {
    var matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var response = {}
    if (matches.length !== 3) {
        context.log("Error case");
        return;
    }

    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64');
    return response;
}

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
//    context.bindings.outputBlob.properties.contentType = "image/png";
  //      context.bindings.outputBlob = req;
        context.log(req.body);
        let response = decodeBase64Image(context, req.body.data);
        context.log('filename: ' + req.name);
        context.log('filetype: ' + response.type);

        context.bindings.outputBlob = response.data;

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Uploaded " 
        };
    context.done();
};