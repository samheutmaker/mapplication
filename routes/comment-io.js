module.exports = exports = function(app) {
	const io = require('socket.io')(app);
	const Comment = require(__dirname + '/../models/comment');
	

	io.on('connection', function(socket) {
		socket.on('NEW_COMMENT', function(newComment) {

		});
	});
}