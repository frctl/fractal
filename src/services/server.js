var promise = require("bluebird");
var merge   = require("deepmerge");
var _       = require("lodash");
var express = require('express');
var exphbs  = require('express-handlebars');
var path    = require('path');
var swag    = require('swag');
var fractal = require('../../fractal');

var config  = fractal.getConfig();

module.exports = function(){

    var port = config.get('port');
    var app = express();
    var hbs = exphbs.create({
        extname: 'hbs',
        partialsDir: [
            config.get('theme.views')
        ],
        helpers: {
            nav: navHelper,
        }
    });

    swag.registerHelpers(hbs.handlebars);

    var tplData = {
        config: config.all(),
    };

    app.engine('hbs', hbs.engine);
    app.set('views', config.get('theme.views'))
    app.set('view engine', 'hbs');

    app.use(express.static(config.get('theme.assets')));

    app.use(function (req, res, next) {
        req.segments = _.compact(req.originalUrl.split('/'));
        tplData.req = req;
        fractal.getStructure().then(function(structure){
            tplData.structure = structure;
            next();
        });
    });

    app.get('/components', function (req, res) {
        res.render('components', merge(tplData, {
            sectionName: 'UI Components'
        }));
    });

    app.get('/components/*', function (req, res) {    
        res.render('components/component', merge(tplData, {
            sectionName: 'UI Components'
        }));
    });

    app.get('/assets', function (req, res) {
        res.render('assets', merge(tplData, {
            sectionName: 'Assets'
        }));
    });

    app.get('/assets/*', function (req, res) {
        res.render('assets/asset', merge(tplData, {
            sectionName: 'Assets'
        }));
    });

    // Page request
    app.get('(/*)?', function (req, res) {
        if (tplData.structure.pages.files.length) {
            var page = _.find(tplData.structure.pages.files, function(p){
                return p.urlPath == req.originalUrl;
            });
            return res.json(makeFileTree(_.filter(tplData.structure.pages.files, function(file){
                                    return file.parentUrlDirs[0] == req.segments[0];
                                })));
            if (page) {
                return res.render(req.originalUrl === '/' ? 'index' : 'pages/page', merge(tplData, {
                    page: page,
                    sectionName: req.segments[0],
                    sectionPages: makeFileTree(_.filter(tplData.structure.pages.files, function(file){
                        return file.parentUrlDirs[0] == req.segments[0];
                    }))
                }));
            }
        }
        res.render('404', merge(tplData, {
        }));      
    });

    app.listen(port, function () {
        console.log('Fractal server is running at http://localhost:%s', port);
    });

    return app;
};

function navHelper(context, options){
    var ret = "";
    var nestedItems = {};
    // context = _.sortByAll(files, ['relDir', 'order']);

    // context.forEach(function(){

    // });


    for(var i=0, j=context.length; i<j; i++) {

        ret = ret + options.fn(context[i]);
    }

    return ret;
}

/******

test.md
another.html
/foo/bar/baz.md
/foo/bar/index.md
/foo/test/index.md
/foo/test/bar.md
/foo/index.md

******/

// {
//     name: 'implementation'
//     files: [
//         {
//             ...
//         },
//         {
//             ...
//         }
//     ],
//     children: [
//         {
//             name: 'client-side',
//             files: [
//                 {
//                     ...
//                 },
//                 {
//                     ...
//                 }
//             ],
//             children: [

//             ]
//         },
//         {
//             name: 'server-side',
//             files: [
//                 {
//                     ...
//                 },
//                 {
//                     ...
//                 }
//             ],
//             children: [
                
//             ]
//         }
//     ]
// }
// 

function makeFileTree(files){
    var tree = {};
    
    return convertToHierarchy([["1","2"], ["1"], ["1","2","3"]]);
}

function convertToHierarchy(arry) 
{
    var item, path;

    // Discard duplicates and set up parent/child relationships
    var children = {};
    var hasParent = {};
    for (var i = 0; i < arry.length; i++) 
    {
        var path = arry[i];
        var parent = null;
        for (var j = 0; j < path.length; j++) 
        {
            var item = path[j];
            if (!children[item]) {
                children[item] = {};
            }
            if (parent) {
                children[parent][item] = true; /* dummy value */
                hasParent[item] = true;
            }
            parent = item;
        }
    }

    // Now build the hierarchy
    var result = [];
    for (item in children) {
        if (!hasParent[item]) {
            result.push(buildNodeRecursive(item, children));
        }
    }
    return result;
}

function buildNodeRecursive(item, children)
{
    var node = {id:item, children:[]};
    for (var child in children[item]) {
        node.children.push(buildNodeRecursive(child, children));
    }
    return node;
}



