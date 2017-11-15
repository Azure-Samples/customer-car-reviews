module.exports = function (context, input) {
    if (!!input && input.length > 0) {
      context.bindings.outputQueueItem = input;
    }
    context.done();
}
