module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    context.log(`Http trigger state passed in: ${context.bindingData.state}`);

    if (context.bindings.inputDocuments && context.bindings.inputDocuments.length > 0) {
        context.res = {
            body: context.bindings.inputDocuments
        };
    }
    else {
        context.res = {
            status: 404,
            body: "No car reviews found to be returned"
        };
    }
    context.done();
};