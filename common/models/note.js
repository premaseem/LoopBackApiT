'use strict';

var app = require('../../server/server');

module.exports = function(Notes) {
  Notes.afterRemote('create', function(context, note, next) {
    var noteReq = context.req.body;
    if (noteReq && !noteReq.driverId){
      next(new Error("Note should always belong to a Company. Please specify."));
      return;
    }

    app.models.DriverNoteTieup.create({
      driverId: noteReq.driverId,
      noteId: note.id
    }, function(err, result){
      if (err){
        next(err);
        return;
      }
      next(null, result);
    });

  });

  Notes.beforeRemote('replaceById', function(context, note, next) {
    var noteReq = context.req.body;
    console.log("Chcking noteReq", noteReq);

    app.models.DriverNoteTieup.upsertWithWhere({
      noteId: noteReq.id
    },{
      driverId: noteReq.driverId,
      noteId: noteReq.id
    }, function(err, results){
      if (err){
        next(err);
        return;
      }
      next();
    });
  });
};
