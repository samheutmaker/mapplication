const express = require('express');
const mongoose = require('mongoose');
const jsonParser = require('body-parser').json();
const mAuth = require('major-a').majorAuth;
const dbError = require(__dirname + '/../lib/errors/handle-db-error');
const Pin = require(__dirname + '/../models/pin.js');

// Create new router and export it
const pinRouter = module.exports = exports = express.Router();

// Find pin based on direct query match
pinRouter.get('/search/:query', jsonParser, (req, res) => {
  Pin.find({
    name: req.params.query
  }, (err, data) => {

    if (!data.length) {
      return res.status(200).json({
        msg: 'No pin found.'
      });
    }
    res.status(200).json(data);
  });
});


// Create new pin
pinRouter.post('/new', mAuth(), jsonParser, (req, res) => {
  var newPin = new Pin();
  newPin.name = req.body.name;
  newPin.content = req.body.content;
  newPin.coords = req.body.coords;
  newPin.partOf = req.body.collection;
  newPin.tags = req.body.tags;
  newPin.public = req.body.public;
  newPin.expires = req.body.expires;
  newPin.owner_id = req.user._id;
  newPin.postedOn = new Date();
  newPin.save((err, data) => {
    if (err) {
      return dbError(err, res);
    }
    res.status(200).json(data);
  });
});

// Get all of a users pins
pinRouter.get('/all', mAuth(), (req, res) => {
  Pin.find({
    owner_id: req.user._id
  }, (err, data) => {
    if (err) return dbError(err, res);
    if (!data) {
      return res.status(200).json({
        msg: 'User does not have any pins.'
      });
    }
    res.status(200).json(data);
  });
});

// Update Pin
pinRouter.put('/:id/update', mAuth(), (req, res) => {
  Pin.update({
    owner_id: req.user._id,
    _id: req.params.id
  }, req.body, (err, data) => {
    if (err) return dbError(err, res);

    res.status(200).json(data);
  });
});

// Remove Pin
pinRouter.delete('/:id/delete', mAuth(), (req, res) => {
  Pin.remove({
    owner_id: req.user._id,
    _id: req.params.id
  }, (err, data) => {
    if (err) return dbError(err, res);

    res.status(200).json(data);
  });
});
