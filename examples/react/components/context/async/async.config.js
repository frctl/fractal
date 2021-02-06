const fetch = require('node-fetch');

const response = fetch('https://xkcd.com/149/info.0.json').then((response) => response.json());

module.exports = {
    context: {
        xkcd: response,
    },
};
