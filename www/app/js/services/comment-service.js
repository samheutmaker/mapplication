// Handles Comment Crud
module.exports = function(app) {
  app.factory('Comment', ['$http',
    function($http) {
      return {
        baseUrl: '/comments',
        getComments: function(pinId) {
          return $http.get(this.baseUrl + '/' + pinId);
        },
        postComment: function(newComment, pinId) {
          return $http.post(this.baseUrl + '/' + pinId + '/new', newComment);
        }
      }
    }
  ]);
}