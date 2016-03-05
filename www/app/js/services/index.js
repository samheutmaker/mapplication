module.exports = function(app) {
	require('./auth-interceptor')(app);
	require('./auth-service')(app);
	require('./comment-service')(app);
	require('./ee-service')(app);
	require('./pin-service')(app);
	require('./search-service')(app);
	require('./socket-io-service')(app);
}