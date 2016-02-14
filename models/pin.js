const mongoose = require('mongoose');

// Pin Schema
const pinSchema = mongoose.Schema({
  text: String,
  owner_id: String,
  postedOn: Date,
  expires: Boolean,
  location: {
    lat: String,
    lng: String
  }
});


// Export Pin Schema
module.exports = exports = mongoose.model('Pin', pinSchema);
