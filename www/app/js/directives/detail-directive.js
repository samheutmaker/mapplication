module.exports = function(app) {
  app.directive('pinDetail', function() {
    return {
      restrict: 'AEC',
      replace: true,
      templateUrl: 'templates/detail.html',
      scope: {
        activePin: '=',
        show: '='
      },
      link: function($scope, elems, attr) {
        $scope.$watch(function() {
          return $scope.activePin
        }, function() {
          $scope.getComments($scope.activePin._id);
        });
      },
      controller: function($scope, Comment, SocketIO) {
        // // Post new comment
        // $scope.postComment = function(newComment, pinId) {
        //   if (newComment.content.length > 7) {
        //     Comment.postComment(newComment, pinId).then(function(res) {
        //       if ($scope.activePin.comments)
        //         $scope.activePin.comments.push(res.data);
        //     });
        //   }
        // }

        // Emit new comment event
        $scope.postComment = function(newComment, pinId) {
          SocketIO.emit('POST_NEW_COMMENT', newComment);
        }

        // Get new comment events from server
        SocketIO.on('PUSH_NEW_COMMENT', function(data) {
          if (data.pin_id && data.owner_id && data.content) {
            $scope.activePin.comments.push(data);
          }
        });

        // Leave Room
        $scope.leaveRoom = function(pinId) {
          SocketIO.emit('LEAVE_ROOM', pinId);
        };

        // Get all comments for a post
        $scope.getComments = function(pinId) {
          SocketIO.emit('JOIN_ROOM', pinId);
          $scope.activePin.comments = [];
          Comment.getComments(pinId).then(function(res) {
            $scope.activePin.comments = res.data
          });
        };

        // Remove comment from DB
        $scope.removeComment = function(comment) {
          Comment.removeComment(comment._id).then(function(res) {})
        }
      }
    }
  });
}