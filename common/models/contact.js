'use strict';

var app = require('../../server/server');

module.exports = function (Contact) {
  Contact.afterRemote('create', function(context, contact, next) {
    var req = context.req.body;
    if (req && !req.driverId){
      next(new Error("contact should always belong to a Driver. Please specify."));
      return;
    }

    app.models.DriverContactTieup.create({
      driverId: req.driverId,
      contactId: contact.id
    }, function(err, result){
      if (err){
        next(err);
        return;
      }
      next(null, result);
    });

  });

  Contact.beforeRemote('replaceById', function(context, contact, next) {
    var req = context.req.body;
    console.log("Chcking req", req);

    app.models.DriverContactTieup.upsertWithWhere({
      contactId: req.id
    },{
      driverId: req.driverId,
      contactId: req.id
    }, function(err, results){
      if (err){
        next(err);
        return;
      }
      next();
    });
  });
};
