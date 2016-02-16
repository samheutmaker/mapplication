const express = require('express');
const mongoose = require('mongoose');
const mRouter = require('major-a').majorRouter;
const pinRouter = require(__dirname + '/routes/routes.js');
// Create new app
const app = express();
mongoose.connect('localhost:27017');
// Set up auth routes
app.use('/auth', mRouter);
// Set up pin routes
app.use('/pins', pinRouter);
// Serve static files
app.use(express.static(__dirname + '/www/build'));
// Deploy server
app.listen(8888, () => {
  console.log('Server up on port' + 8888);
});
