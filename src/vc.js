var nodegit = require("nodegit");

var conf = require('./config');
var repo = null;
// TODO: make this plugin-able so it can support other version control types

module.exports = {

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
        return this.getRepo().then(function(repo) {
            return repo.getMasterCommit();
        }).then(function(firstCommitOnMaster) {
            var history = firstCommitOnMaster.history();
            var count = 0;
            var commits = [];

            history.on("commit", function(commit) {
                if (++count >= num) {
                    return;
                }
                commits.push(commit);
            });
            history.start();

            return new Promise(function(resolve, reject){
                history.on("end", resolve);
                history.on("error", reject);
            });
        });
    }

};
