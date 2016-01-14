module.exports = ExistsError;

function ExistsError(message, previous) {
    var error = Error.call(this, message);

    this.name = 'ExistsError';
    this.message = error.message;
    this.stack = previous ? previous.stack : error.stack;
    this.previous = previous;
}

ExistsError.prototype = Object.create(Error.prototype);
ExistsError.prototype.constructor = ExistsError;
