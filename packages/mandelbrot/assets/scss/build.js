'use strict';

const fs = require('fs');

const schemes = [{
    name: 'default',
    accent: '#0074d9',
    palette: 'cool'
},{
    name: 'aqua',
    accent: '#7fdbff',
    palette: 'cool'
},{
    name: 'blue',
    accent: '#0074d9',
    palette: 'cool'
},{
    name: 'lime',
    accent: '#01ff70',
    palette: 'cool'
},{
    name: 'navy',
    accent: '#001f3f',
    palette: 'cool'
},{
    name: 'teal',
    accent: '#39cccc',
    palette: 'cool'
},{
    name: 'olive',
    accent: '#3d9970',
    palette: 'cool'
},{
    name: 'green',
    accent: '#2ecc40',
    palette: 'cool'
},{
    name: 'red',
    accent: '#ff4136',
    palette: 'cool'
},{
    name: 'maroon',
    accent: '#85144b',
    palette: 'cool'
},{
    name: 'orange',
    accent: '#ff851b',
    palette: 'cool'
},{
    name: 'purple',
    accent: '#b10dc9',
    palette: 'cool'
},{
    name: 'yellow',
    accent: '#ffdc00',
    palette: 'cool'
},{
    name: 'fuchsia',
    accent: '#f012be',
    palette: 'cool'
},{
    name: 'grey',
    accent: '#aaaaaa',
    palette: 'cool'
}];

 for (let scheme of schemes) {
     fs.writeFile(`./assets/scss/schemes/${scheme.name}.scss`,
`
 $color-accent: ${scheme.accent};
 @import '../palettes/${scheme.palette}';
 @import '../core/all';
 @import "../components/**/*.scss";`);
 }
