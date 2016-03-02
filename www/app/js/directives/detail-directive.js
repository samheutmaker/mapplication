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
      controller: function($scope, Comment) {
        // Post new comment
        $scope.postComment = function(newComment, pinId) {
          if (newComment.content.length > 7) {
            Comment.postComment(newComment, pinId).then(function(res) {
              if ($scope.activePin.comments)
                $scope.activePin.comments.push(res.data);
            });
          }
        }
        // Get all comments for a post
        $scope.getComments = function(pinId) {
          $scope.activePin.comments = [];
          Comment.getComments(pinId).then(function(res) {
            $scope.activePin.comments = res.data
          });
        };

        // Remove comment from DB
        $scope.removeComment = function(comment) {
          $scope.
          Comment.removeComment(comment._id).then(function(res) {

          })
        }

      }
    }
  });
}