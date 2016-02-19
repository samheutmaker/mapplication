const mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
	content: String,
	postedOn: Date,
	owner_id: String,
	pin_id: String
});


module.exports = mongoose.model('Comment', commentSchema);


