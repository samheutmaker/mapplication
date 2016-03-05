const User = require(__dirname + '/../node_modules/major-a/models/user');
const jwt = require('jsonwebtoken');

// Socket Middle Ware
module.exports = exports = function(data) {
  // Create Promise
  return new Promise(function(resolve, reject) {
    // Decoded Token
    var decoded;
    try {
      // Decode Token
      decoded = jwt.verify(data.token, process.env.TOKEN_SECRET ||
        'CHANGE_ME');
    } catch (e) {
      // Reject with err
      reject(e);
    }
    // Find user document
    User.findOne({
      _id: decoded._id
    }, (err, data) => {
      // Reject with err
      if (err) return reject(err);

      // Resolve with user data
      resolve(data);
    });
  });
}