'use strict';

const fs = require('fs');
const schemes = require('../schemes.json');

for (let scheme of schemes) {
    fs.writeFile(`./assets/scss/schemes/${scheme.name}.scss`,
`
$color-accent: ${scheme.accent};
$color-complement: ${scheme.complement};
$color-link: ${scheme.links};

$hue: hue($color-accent);

$color-alpha: hsl($hue, 10, 20);
$color-alpha-tint-light: rgba($color-alpha, 0.25);
$color-alpha-tint-lighter: rgba($color-alpha, 0.1);
$color-alpha-tint-lightest: rgba($color-alpha, 0.05);
$color-beta: hsl($hue, 10, 35);
$color-gamma: hsl($hue, 10, 97);
$color-delta: hsl($hue, 10, 100);

@import "../core/all";
@import "../components/**/*.scss";
`);
}
