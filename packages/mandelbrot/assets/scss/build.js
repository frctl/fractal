'use strict';

const fs = require('fs');
const schemes = require('../schemes.json');

for (let scheme of schemes) {
    fs.writeFile(`./assets/scss/schemes/${scheme.name}.scss`,
`
$color-accent: ${scheme.accent};

@import '../palettes/${scheme.palette}';
@import '../core/all';
@import "../components/**/*.scss";`);
}
