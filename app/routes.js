// app/routes.js

// grab the nerd model we just created
var Event = require('./models/events');
var Users = require('./models/user');

// app/routes.js
module.exports = function(app, passport) {

   

    // =====================================
    // EVENTS ==============================
    // =====================================


        app.get('/api/events', function(req, res) {

            // use mongoose to get all todos in the database
            Event.find(function(err, ecevents) {

                // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                if (err)
                    res.send(err)
                console.log(ecevents);
                res.json(ecevents); // return all todos in JSON format
            });
        });

        app.post('/api/events/user', function(req, res) {

                Event.find( {'owner_id' : req.user._id}, function(err, events) {
                    if (err)
                        res.send(err)

                    res.json(events);
                });

        })

     // POST =================

      app.post('/api/events', function(req, res) {

    if(req.body.user_id) {

        geocoder.geocode(req.body.address).then(function(result) {
        // create event from AJAX data
        Event.create({
            owner_id        : req.body.user_id,
            eventName       : req.body.eventName,
            eventDate       : req.body.eventDate,
            eventStart      : req.body.eventStart,
            eventEnd        : req.body.eventEnd,
            locationName    : req.body.locationName,
            address         : req.body.address,
            cost            : req.body.cost,
            url             : req.body.url,
            phone           : req.body.phone,
            tags            : req.body.tags,
            descript        : req.body.descript,
            iconSettings    : { 'marker-size': 'large',
                                'marker-symbol': 'school',
                                'marker-color': '#FFFFFF'},
            latlng          : [result[0].latitude, result[0].longitude],
        
        
        }, function(err) {
            if (err)
                res.send(err);
       

         Event.find( {'owner_id' : req.body.user_id}, function(err, events) {
                if (err)
                    res.send(err)

                res.json(events);
            });

          });
        
        }).catch(function(err){console.log(err)});
    }

        

          
    });

    // =====================================
    // USERS ==============================
    // =====================================

    app.get('/api/users', function(req, res) {

        // use mongoose to get all todos in the database
        Users.find(function(err, users) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
            console.log(users);
            res.json(users); // return all todos in JSON format
        });
    });



    // =====================================
    // LOGIN ==============================
    // =====================================

    app.get('/loggedin', function(req, res) { 
        res.send(req.isAuthenticated() ? req.user : '0'); 
    });

    // process the login form
     // process the login form
    app.post('/login', passport.authenticate('local-login'), function(req, res) { 
         res.send(req.user); 
    });  

    // =====================================
    // SIGNUP ==============================
    // =====================================

    app.post('/register', passport.authenticate('local-signup'), function(req, res) { 
         res.send(req.user); 
    });
  

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logOut();
        res.send(200);
    });

     app.get('*', function(req, res) {
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}