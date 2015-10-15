var app = require("./application");

exports = module.exports = createApplication;

function createApplication(){
    app.init();
    return app;
};