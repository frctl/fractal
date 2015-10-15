

var app = exports = module.exports = {};

app.init = function(){
    this.settings = {};
    this.defaultConfig();
};

app.defaultConfig = function(){

};

app.set = function(setting, val){
    this.settings[setting] = val;
    return this;
};

app.enable = function(setting){
    return this.set(setting, true);
};

app.disable = function(setting){
    return this.set(setting, false);
};

app.get = function(setting){
    return this.settings[setting];
};

app.enabled = function(setting){
    return !!this.get(setting);
};

app.disabled = function(setting){
    return !this.get(setting);
};