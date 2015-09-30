var nodegit     = require("nodegit");
var Promise     = require("bluebird");
var _           = require('lodash');

var conf        = require('./config');
var repo        = null;
// TODO: make this plugin-able so it can support other version control types

var filesCache = {};

module.exports = {

    hasRepo: function(){
        return nodegit.Repository.open(conf.get('root'));
    },

    getRepo: function(){
        if (repo) return repo;
        repo = nodegit.Repository.open(conf.get('root')).then(function(r){
            return r;
        });
        // .catch(function(reason){
        //     console.log('ERROR');
        //     console.log(reason);
        // });
        return repo;
    },

    getCurrentBranchName: function(){
        return this.getRepo().then(function(r){
            return r.getCurrentBranch().then(function(branch){
                return branch.name();
            });
        });
    },

    getLatestCommits: function(num){
        num = num || 10000000;
        return this.getRepo().then(function(repo) {
            return repo.getMasterCommit();
        }).then(function(firstCommitOnMaster) {
            var history = firstCommitOnMaster.history(nodegit.Revwalk.SORT.Time);
            history.start();
            return new Promise(function(resolve, reject){
                history.on("end", function(commits){
                    commits = commits.slice(0,num);
                    resolve(commits);
                });
                history.on("error", reject);
            });
        });
    },

    getLatestCommitsForFile: function(filePath, num){
        if (filesCache[filePath]) return filesCache[filePath];
        num = num || 10000000;
        return this.getRepo().then(function(repo) {
            return repo.getMasterCommit();
        }).then(function(firstCommitOnMaster){
            var history = firstCommitOnMaster.history(nodegit.Revwalk.SORT.Time);
            history.start();
            return new Promise(function(resolve, reject){
                var fileCommits = [];
                history.on("end", function(commits){
                    _.each(commits, function(commit){
                        var prom = commit.getDiff().then(function(diffList) {
                            var diffCommits = [];
                            _.each(diffList, function(diff, i){
                                diffCommits.push(diff.patches().then(function(patches) {
                                    var addCommit = false;
                                    _.each(patches, function(patch){
                                        if (!!~patch.oldFile().path().indexOf(filePath) || !!~patch.newFile().path().indexOf(filePath)) {
                                            addCommit = true;
                                        }
                                    });
                                    return addCommit ? commit : null;
                                }));
                            });
                            return Promise.all(diffCommits);
                        });
                        fileCommits.push(prom);
                    });
                    filesCache[filePath] = Promise.all(fileCommits).then(function(commits){
                        return _.compact(_.flatten(commits)).slice(0, num);
                    })
                    resolve(filesCache[filePath]);
                });
                history.on("error", reject);
            });
          });
    }

};
