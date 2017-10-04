var async = require('async');

module.exports = function(app) {
    var path = require('path');
    var models = require(path.resolve(__dirname, '../model-config.json'));
    var datasources = require(path.resolve(__dirname, '../datasources.json'));
    var modelUpdates = [];

    function buildModelListForOperation(){
        Object.keys(models).forEach(function(key) {
            if (typeof models[key].dataSource != 'undefined') {
                if (typeof datasources[models[key].dataSource] != 'undefined') {
                    modelUpdates.push({operation: app.dataSources[models[key].dataSource], key: key});
                }
            }
        });
    }

    function processModelsAndData(operationType) {
        buildModelListForOperation();

        // Create all models
        async.each(modelUpdates, function(item, callback) {
            item.operation[operationType](item.key, function (err) {
                if (err) throw err;
                console.log('Model ' + item.key + ' migrated');
                callback();
            });
        }, function (err) {
            if (err) throw err;
            console.log("Error", err);
        });    
    }

    //TODO: change to 'autoupdate' when ready for CI deployment to production
    processModelsAndData('autoupdate');
};