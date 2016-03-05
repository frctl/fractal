'use strict';

const fs = require('fs');

const schemes = [{
    name: 'default',
    accent: '#0074d9',
    palette: 'cool'
},{
    name: 'blue',
    accent: '#0074d9',
    palette: 'cool'
},{
    name: 'aqua',
    accent: '#7fdbff',
    palette: 'cool'
}];
 //
 //
 // {
 //    aqua:    '#7fdbff',
 //    blue:    '#0074d9',
 //    lime:    '#01ff70',
 //    navy:    '#001f3f',
 //    teal:    '#39cccc',
 //    olive:   '#3d9970',
 //    green:   '#2ecc40',
 //    red:     '#ff4136',
 //    maroon:  '#85144b',
 //    orange:  '#ff851b',
 //    purple:  '#b10dc9',
 //    yellow:  '#ffdc00',
 //    fuchsia: '#f012be',
 //    gray:    '#aaaaaa',
 //    white:   '#ffffff',
 //    black:   '#111111',
 //    silver:  '#dddddd'
 // };

 for (let scheme of schemes) {
     fs.writeFile(`./assets/scss/schemes/${scheme.name}.scss`,
`
 $color-accent: ${scheme.accent};
 @import '../palettes/${scheme.palette}';
 @import '../core/all';
 @import "../components/**/*.scss";`);
 }
