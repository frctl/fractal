module.exports = RenderError;

function RenderError(message, previous) {
    var error = Error.call(this, message);

    this.name = 'RenderError';
    this.message = error.message;
    this.stack = previous ? previous.stack : error.stack;
    this.previous = previous;
}

RenderError.prototype = Object.create(Error.prototype);
RenderError.prototype.constructor = RenderError;
