'use strict';

const Path        = require('path');
const Theme       = require('../theme');

module.exports = function(){

    const theme = new Theme(Path.join(__dirname, 'views'));

    theme.addRoute('/', {
        handle: 'overview',
        view: 'index.nunj',
    });
    
    //
    // theme.route('/foo/:foo?', {
    //     handle: 'foo',
    //     view: 'index.nunj',
    //     build: function() {
    //         return [{
    //             foo: 'one'
    //         },{
    //             foo: 'two'
    //         },
    //         {}]
    //     }
    // });


    // theme.on('init', function(env, app){
    //     env.engine.addGlobal('foobar', 'PPPPP');
    //     env.engine.addFilter('wow', function(str){
    //         return str + 'wow';
    //     });
    // });

    return theme;

};

// for (let comp of components.flatten()) {
//     if (!comp.isHidden){
//         builder.addRoute('preview', {'handle':comp.handle});
//         builder.addRoute('component', {'handle':comp.handle});
//     }
//     for (let variant of comp.variants()) {
//         builder.addRoute('preview', {'handle':variant.handle});
//         if (!comp.isCollated){
//             builder.addRoute('component', {'handle':variant.handle});
//         }
//     }
// }
//
// builder.addRoute('overview');
// for (let page of docs.flatten()) {
//     if (!page.isHidden && page.path !== '') {
//         builder.addRoute('page', {'path':page.path});
//     }
// }
