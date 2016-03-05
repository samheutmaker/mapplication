const express = require('express');
const mongoose = require('mongoose');
const mRouter = require('major-a').majorRouter;
const pinRouter = require(__dirname + '/routes/routes.js');
const commentRouter = require(__dirname + '/routes/comment-routes');




// Create new app
const app = express();
const http = require('http').Server(app);
// Comment IO
var io = require('socket.io').listen(http);
// Connect to DB
mongoose.connect('localhost:27017');
// Set up auth routes
app.use('/auth', mRouter);
// Set up pin routes
app.use('/pins', pinRouter);
// Set up pin routes
app.use('/comments', commentRouter);
const commentSocket = require(__dirname + '/routes/comment-io');

io.sockets.on('connection', commentSocket);
// Serve static files
app.use(express.static(__dirname + '/www/build'));
// Deploy server
app.listen(8888, () => {
  console.log('Server up on port' + 8888);
});
