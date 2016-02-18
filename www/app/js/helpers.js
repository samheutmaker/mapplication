module.exports = exports = {
  diff: function(a, b) {
    var seen = [],
      diff = [];
    for (var i = 0; i < b.length; i++)
      seen[b[i]] = true;
    for (var i = 0; i < a.length; i++)
      if (!seen[a[i]])
        diff.push(a[i]);
    return diff;
  },
  modified: function(mapped, incoming) {
    var toRemove = [];
    var toAdd = [];
    var inBoth = [];
    var h = {};
    incoming.forEach(function(marker, markerIndex){
      h[marker._id] = true;
      toAdd.push(marker);
    });

    mapped.forEach(function(marker, markerIndex) {
      if(h.hasOwnProperty(marker._id)) {
        toAdd.splice(toAdd.indexOf(marker), 1);
      } else {

        toRemove.push(marker);
      }
    });
    return {
      remove: toRemove,
      add: toAdd
    }
  }
};



// If there is one in the mapped markers but not incoming, delete it
// If there is one in the incoming markers but not mapped, delete it
// If it is present in both, dotnfuckwithit
