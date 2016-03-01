module.exports = exports = function(app) {
  const io = require('socket.io')(app);
  const Comment = require(__dirname + '/../models/comment');


  io.sockets.on('connection', function(socket) {
    // Join room based on post Id
    socket.on('JOIN_ROOM', function(postId) {
      // Join room
      socket.join(postId);
      // New comment for the room
      socket.on('NEW_COMMENT', function(comment) {
        io.socemit(comment);
      });
    });
  });
}