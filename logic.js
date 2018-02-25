
var queryUrl = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-31&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  createFeatures(data.features);
});

function getColor(d) {
    if (d < 1) {        
        return '#ec8a2e'
    }
    else if (d < 2) {
        return '#a0353a'
    }
    else if (d < 3) {
        return '#f4ba48'
    }    
    else if (d < 4) {
        return '#1b904f'
    }    
    else if (d < 5) {
        return '#007dff'
    }
    else if (d < 6) {
        return '#007dff'
    }        
    else { 
        return '250c42';
    
    };
};

function createFeatures(earthquakeData) {
    
  // Define a function to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
    "<p>" + feature.properties.mag + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 5*(feature.properties.mag), fillOpacity: 0.30, weight: 1, color:(getColor(feature.properties.mag))});
    },
        onEachFeature: onEachFeature
  });

  // Sending the earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
    "T6YbdDixkOBWH_k9GbS8JQ");

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
    "T6YbdDixkOBWH_k9GbS8JQ");

  var quake_layer = L.layerGroup(earthquakes);  

  // Define a baseMaps object to hold base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold the overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };


  // Create the map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Create a legend to display information about the map
    var info = L.control({
        position: "bottomright"
  });

  // When the layer control is added, insert a div with the class of "legend"
    info.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "legend");




        categories = [0,1,2,3,4,5,6],
        labels =[];

        for (var i = 0; i < categories.length; i++) {
            div.innerHTML +=
             '<i style="background:' + getColor(categories[i]) + '"></i> ' +
                (categories[i] + categories[i+1]? + categories[i+1] +'<br>' : '+');
            } 
        return div;

  };
  // Add the info legend to the map
  info.addTo(myMap);
};