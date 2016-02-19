// Mapbox Directive
const _ = require('staff');

module.exports = function(app) {
  app.directive('mapbox', ['EE',
    function(EE) {
      return {
        restrict: 'EA',
        replace: true,
        template: '<div ng-class="{pinning: actions.pinning}"></div>',
        link: function(scope, element, attributes) {
          L.mapbox.accessToken =
            'pk.eyJ1Ijoic2FtaGV1dG1ha2VyIiwiYSI6ImNpa25qcXV3eTBzcGJ2a2ttbnV6OXJtNzEifQ.8faX-FF4gPTe8WFrf24reg';
          // All Markers on map
          var markers = [];
          // Marker being created
          var tempMarker = {};
          // Init Map
          var map = L.mapbox.map(element[0], 'mapbox.emerald');
          // Controls
          new L.Control.Zoom({
            position: 'topright'
          }).addTo(map);

          // Map Click Event
          map.on('click', function(e) {
            var coords = e.latlng;
            scope.$apply(function() {
              scope.actions.detail = false;
            });

            if (scope.actions.pinning) {
              scope.$apply(function() {
                // Hide Pinning Message
                scope.actions.pinning = false;
                // Add Pin To Map
                var newMarker = L.marker([coords.lat, coords.lng], {
                  icon: L.mapbox.marker.icon({
                    'marker-size': 'large',
                    'marker-color': '#e74c3c'
                  })
                }).addTo(map);
                tempMarker = newMarker;
                //Display 'Creating New' Message
                scope.actions.creating = true;
                // Add Coords to new pin
                scope.pinData.coords = {
                  lat: coords.lat,
                  lng: coords.lng
                };
              });
            }
          });

          // Diff markers and update
          scope.updateMap = function(arrToMap, shouldDif) {


            if (shouldDif) {

              //Dif Map
              var markerdifInfo = _.modified(markers, arrToMap);
              // Markers to add
              var toAdd = markerdifInfo.add;


              // Markers to remove
              var toRemove = markerdifInfo.remove;

              // Remove unwanted markers
              toRemove.forEach(function(markerToRemove, markerIndex) {
                var willBeRemoved = markers.splice(markers.indexOf(
                  markerToRemove), 1);
                map.removeLayer(willBeRemoved[0].newMarker);
              });
              // Add new markers
              toAdd.forEach(function(markerToAdd, pinIndex) {
                scope.addSingleMarker(markerToAdd);
              });
            } else {

              // Clear entire map
              markers.forEach(function(markerToRemove, markerIndex) {
                // Remove marker from markers
                var willBeRemoved = markers.splice(markers.indexOf(
                  markerToRemove), 1);
                // Remove markers from map
                map.removeLayer(willBeRemoved[0].newMarker);

              });
              // Map New Pins
              arrToMap.forEach(function(markerToAdd, markerIndex) {
                scope.addSingleMarker(markerToAdd);
              });
            }
          };


          // Add single marker to map
          scope.addSingleMarker = function(pin) {
            pin.newMarker = L.marker([pin.coords.lat, pin.coords.lng], {
              icon: L.mapbox.marker.icon({
                'marker-size': 'large',
                'marker-color': '#e74c3c'
              })
            }).addTo(map);

            pin.newMarker.on('click', function(event) {
              EE.emit('MARKER_CLICKED', pin._id);
            });

            // Save pin in current markers
            markers.push(pin);
          };

          //============  EVENT LISTENERS ===========//

          // Update Map Markers
          scope.$on('MARKERS_CHANGED', function(event, data) {
            scope.updateMap(data.newMarkers, data.shouldDif);
          });
          // Clear Temp Marker
          scope.$on('REMOVE_TEMP_MARKER', function() {
            map.removeLayer(tempMarker)
            tempMarker = {};
          });
          // Intialize map in parent scope
          scope.callback(map);
        }
      };
    }
  ]);
}