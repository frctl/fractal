'use strict';

const Path = require('path');
const app  = require('./src/fractal');
require(Path.join(process.cwd(), 'fractal.js'));

app.run();
