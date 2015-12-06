var mongoose = require('mongoose');


// define model =================
    module.exports = mongoose.model('Event', {
        owner_id     : String,
        eventName    : String,
        eventDate    : String,
        eventStart   : String,
        eventEnd     : String,
        locationName : String,
        address      : String,
        cost         : String,
        url          : String,
        phone        : String,
        descript     : String,
        latlng       : Array,
        tags         : Array,
        iconSettings: Object
});