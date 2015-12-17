module.exports = NotFoundError;

function NotFoundError(message, previous) {
    var error = Error.call(this, message);

    this.name = 'NotFoundError';
    this.message = error.message;
    this.stack = previous ? previous.stack : error.stack;
    this.previous = previous;
}

NotFoundError.prototype = Object.create(Error.prototype);
NotFoundError.prototype.constructor = NotFoundError;
