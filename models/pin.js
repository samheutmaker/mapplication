const mongoose = require('mongoose');

// Pin Schema
const pinSchema = mongoose.Schema({
  name: String,
  coords: {
  	lat: Number,
  	lng: Number
  },
  content: String,
  partOf: String,
  tags: Array,
  public: Boolean,
  owner_id: String,
  expires: Date,
  postedOn: Date
});


// Export Pin Schema
module.exports = exports = mongoose.model('Pin', pinSchema);
