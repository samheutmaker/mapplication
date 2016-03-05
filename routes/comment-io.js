module.exports = exports = function(socket) {

  const Comment = require(__dirname + '/../models/comment');
  const socketAuth = require(__dirname + '/../lib/socket-auth');

    // Leave room with ID
    socket.on('LEAVE_ROOM', function(postId) {
      return socket.leave(postId);
    });

    // Join room with ID
    socket.on('JOIN_ROOM', function(postId) {
      console.log(postId);
      // Join room
      socket.join(postId);
      // New comment for the room
      socket.on('NEW_COMMENT', function(comment) {
        // Check token and store comment
        socketAuth(comment).then(function(user) {
            // Create new comment
            var newComment = new Comment(comment);
            newComment.content = comment.content
            newComment.owner_id = user.id;
            newComment.pin_id = postId;
            newComment.save((err, data) => {
              // Error check and leave room
              if (err) return socket.leave(postId);
              // Send comment to other users;
              io.emit(comment);
            });
          },
          // Error check and leave room
          function(err) {
            socket.leave(postId);
          });
      });
    });
}