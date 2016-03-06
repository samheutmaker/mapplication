module.exports = exports = function(socket) {

  const Comment = require(__dirname + '/../models/comment');
  const socketAuth = require(__dirname + '/../lib/socket-auth');

  // Leave room
  socket.on('LEAVE_ROOM', function(pinId) {
    socket.leave(pinId, function(data, err) {
      console.log(data);
    });
    console.log('Left ' + pinId);
  });



  // Join room with ID
  socket.on('JOIN_ROOM', function(postId) {
    socket.join(postId);
    console.log(postId + " joined");


    socket.on('POST_NEW_COMMENT', function(comment) {

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

            socket.broadcast.to(data.pin_id).emit('PUSH_NEW_COMMENT', data);
          });
        },
        // Error check and leave room
        function(err) {
          console.log('There was an error');
          console.log(err);
          socket.leave(postId);
        });
    });
  });

}