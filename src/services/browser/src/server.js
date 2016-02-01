const express = require('express');
const server  = express();

module.exports = function(config, app){

    const theme = app.theme;

    theme.static().forEach(s => {
        server.use(s.mount, express.static(s.path));
    });

    // try {
    //     if (app.get('static.path')){
    //         var dest = '/' + _.trim(app.get('static.dest'), '/');
    //         server.use(dest, express.static(app.get('static.path')));
    //     }
    // } catch(e){
    //     logger.warn('Static assets path %s does not exist', app.get('static.path'));
    // }

    app.theme.routes().forEach(route => {

        // router.get(route.path, function * (next) {
        //     this.body = route.handle;
        // });

    });



};
