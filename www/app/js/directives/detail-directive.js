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
			link: function(scope, elems, attr){
				scope.$watch(function() {
					return scope.activePin;
				}, function() {
					console.log(scope.activePin);
				});
			},
			controller: function($scope) {
				console.log($scope.show);
			}
		}
	});
}