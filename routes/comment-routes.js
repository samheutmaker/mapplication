const express = require('express');
const jsonParser = require('body-parser').json()
const mAuth = require('major-a').majorAuth;
const dbError = require(__dirname + '/../lib/errors/handle-db-error');
const Comment = require(__dirname + '/../models/comment');


const commentRouter = module.exports = exports = express.Router();

commentRouter.post('/:id/new', mAuth(), jsonParser, (req, res) => {
  
  var newComment = new Comment(req.body);
  newComment.content = req.body.content;
  newComment.owner_id = req.user.id;
  newComment.pin_id = req.params.id;
  newComment.save((err, data) => {
    if (err) return dbError(err, res);

    res.status(200).json(data);
  });
});


commentRouter.get('/:id', mAuth(),jsonParser, (req, res) => {
  Comment.find({
    pin_id: req.params.id
  }, (err, data) => {
    if (err) return dbError(err, res);

    if (!data) {
      return res.status(200).json({
        msg: 'No Commments'
      })
    }

    res.status(200).json(data);

  });
});