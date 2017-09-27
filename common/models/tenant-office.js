'use strict';

var app = require('../../server/server');

module.exports = function(Tenantoffice) {
  Tenantoffice.afterRemote('create', function(context, tenantoffice, next) {
    var req = context.req.body;
    if (req && !req.tenantId){
      next(new Error("Tenantoffice should always belong to a tenant. Please specify."));
      return;
    }

    app.models.TenantTenantOfficeTieup.create({
      tenantId: req.tenantId,
      tenantofficeId: tenantoffice.id
    }, function(err, result){
      if (err){
        next(err);
        return;
      }
      next(null, result);
    });

  });

  Tenantoffice.beforeRemote('replaceById', function(context, tenantoffice, next) {
    var req = context.req.body;
    console.log("Chcking req", req);

    app.models.TenantTenantOfficeTieup.upsertWithWhere({
      tenantofficeId: req.id
    },{
      tenantId: req.tenantId,
      tenantofficeId: req.id
    }, function(err, results){
      if (err){
        next(err);
        return;
      }
      next();
    });
  });



};
