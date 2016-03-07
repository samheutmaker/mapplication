module.exports = function(app) {
  app.directive('pinDetail', function() {
    return {
      restrict: 'AEC',
      replace: true,
      templateUrl: 'templates/detail.html',
      scope: {
        activePin: '=',
        lastPin: '=',
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

        // Emit new comment event
        $scope.postComment = function(newComment, pinId) {
          SocketIO.emit('POST_NEW_COMMENT', newComment);
        }

        // Get new comment events from server
        SocketIO.on('PUSH_NEW_COMMENT', function(data) {
          if (data.pin_id === $scope.activePin._id && data.owner_id && data.content) {
            $scope.activePin.comments.push(data);
          }
        });

        // Leave Room
        $scope.leaveRoom = function(pinId) {
          SocketIO.emit('LEAVE_ROOM', pinId);
          SocketIO.removeListener('PUSH_NEW_COMMENT', function(data) {
          });
        };

        // Get all comments for a post
        $scope.getComments = function(pinId) {
          // Leave current room
          if($scope.activePin._id){
            $scope.leaveRoom($scope.lastPin._id);  
          }
          // Join new room
          SocketIO.emit('JOIN_ROOM', pinId);
          // Get and set comments
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