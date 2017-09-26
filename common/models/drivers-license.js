'use strict';
var app = require('../../server/server');

module.exports = function (Driverslicense) {
  Driverslicense.afterRemote('create', function(context, driversLicense, next) {
    var req = context.req.body;
    if (req && !req.driverId){
      next(new Error("contact should always belong to a Driver. Please specify."));
      return;
    }

    app.models.DriverDriverslicenseTieup .create({
      driverId: req.driverId,
      driversLicenseId: driversLicense.id
    }, function(err, result){
      if (err){
        next(err);
        return;
      }
      next(null, result);
    });

  });

  Driverslicense.beforeRemote('replaceById', function(context, driversLicense, next) {
    var req = context.req.body;
    console.log("Chcking req", req);

    app.models.DriverDriverslicenseTieup .upsertWithWhere({
      driversLicenseId: req.id
    },{
      driverId: req.driverId,
      driversLicenseId: req.id
    }, function(err, results){
      if (err){
        next(err);
        return;
      }
      next();
    });
  });
};
