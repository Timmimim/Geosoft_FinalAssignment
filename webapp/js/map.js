'use strict';
/**
 * global parameters
 */
var map;

//var drawnItems;
var searchLayer = new L.LayerGroup;
var loadedItems = new L.LayerGroup;
var markers = new L.LayerGroup;
var polygon = new L.LayerGroup;

var addingEntrance = false;
var addingParking = false;
var addingOutlines = false;

var currentEntrance, currentParking;
var currentParkingGeoJSON, currentEntranceGeoJSON;

var polygon_options = {
    shapeOptions: {
        color: 'green'
    },
    allowIntersection: false,
    drawError: {
        color: 'orange',    // lines must not overlap, error signal is line coloured in orange
        timeout: 1000       // Colour remains error colour orange for 1 second
    },
    showArea: true,         // area included in shape is coloured
    metric: true,
    repeatMode: false
};

var airportACJ = {
    "type": "Address Marker",
    "properties": {
        "Description": "Rio de Janeiro - Antônio Carlos Jobim Airport",
        "IATA-Code": "GIG"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [
            -22.808903,
            -43.243647
        ]
    }
};

var airportSDU = {
    "type": "Address Marker",
    "properties": {
        "Description": "Rio de Janeiro - Santos Dumont Airport",
        "IATA-Code": "SDU"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [
            -22.910461,
            -43.163133
        ]
    }
};


var airports  = new L.LayerGroup;
var acj = L.marker(airportACJ.geometry.coordinates).bindPopup("<b>Galeao - Antonio Carlos Jobim Airport <br> <a href='http://www.aeroportogaleao.net/en/rio-de-janeiro-galeao-flight-timetable-schedules'>View Flight Schedules</a></b>");
acj.addTo(airports);
var sdu  = L.marker(airportSDU.geometry.coordinates).bindPopup("<b>Santos Dumont Airport <br> <a href='http://www.aeroportosantosdumont.net/en/santos-dumont-rio-de-janeiro-flight-timetable-schedules'>View Flight Schedules</a></b>");
sdu.addTo(airports);

/**
 * function to build the map
 */
var mapBuild;
mapBuild = function () {
    // initial View and zoom settings for the map
    $('#map').empty();
    map = L.map('map').setView([-22.970722, -43.182365], 11);


    // Create a layer from an OpenStreetMap base map and add it to the map object
    var osmColor = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    osmColor.addTo(map);

    // external variable searchLayer with search result markers added to
    map.addLayer(searchLayer);
    new L.Control.GeoSearch({
        provider: new L.GeoSearch.Provider.OpenStreetMap(),
        position: 'topleft',
        showMarker: false,
        retainZoomLevel: false
    }).addTo(map);

    // AJAX call for all Objects in Database
    getAll();
    airports.addTo(map);

    map.on('click', function (e) {

        //adding Entrance, if already added, overwrite
        if(addingEntrance == true) {

            map.removeLayer(markers);

            var entrance = new L.Marker(e.latlng, {draggable: false});
            entrance.bindPopup('If you are unhappy with this marker, simply place a new one. <br> But you\'ll need to press the Add Entrance button first.');

            if (entranceSet) {
                var confEntr = confirm('Replace previously set Entrance?');
                if (confEntr) {
                    addingEntrance = false;
                    markers = new L.layerGroup();
                    entrance.addTo(markers);
                    if (currentParking != null) {
                        currentParking.addTo(markers);
                    }
                    map.addLayer(markers);

                    currentEntrance = entrance;
                    currentEntranceGeoJSON = currentEntrance.toGeoJSON();

                    return false;
                } else {
                    map.addLayer(markers);
                    return false;
                }
            } else {
                entranceSet = true;
                addingEntrance = false;
            }
            entrance.addTo(markers);

            currentEntrance = entrance;
            currentEntranceGeoJSON = currentEntrance.toGeoJSON();

            map.addLayer(markers);
        }

        //adding Parking, if already added, overwrite
        else if(addingParking == true) {

            map.removeLayer(markers);

            var parking = new L.Marker(e.latlng, {draggable: false});
            parking.bindPopup('If you are unhappy with this marker, simply place a new one. <br> But you\'ll need to press the Add Entrance button first.');
            var parkingGeoJSON = parking.toGeoJSON();


            if (parkingSet) {
                var confPark = confirm('Replace previously set Parking?');
                if (confPark) {
                    map.removeLayer(parking);
                    addingParking = false;
                    markers = new L.layerGroup();
                    parking.addTo(markers);
                    if (currentEntrance != null) {
                        currentEntrance.addTo(markers);
                    }
                    map.addLayer(markers);
                    currentParking = parking;
                    currentParkingGeoJSON = currentParking.toGeoJSON();
                    $('#parkingCoordinates').val(currentParkingGeoJSON.geometry.coordinates.toString());

                    return false;
                } else {
                    map.addLayer(markers);
                    return false;
                }
            } else {
                parkingSet = true;
                addingParking = false;
            }


            // write to helper variables, then add Marker Layer to map
            currentParking = parking;
            currentParking.addTo(markers);
            currentParkingGeoJSON = currentParking.toGeoJSON();
            $('#entranceCoordinates').val(currentParkingGeoJSON.geometry.coordinates.toString());
            map.addLayer(markers);
        }

        else if(addingOutlines == true) {
            var polygonDrawer = new L.Draw.Polygon(map, polygon_options);
            polygonDrawer.enable();
        }
        else {}
        addingOutlines = addingEntrance = addingParking = false;
    });//closes the click function


    // creates a new FeatureGroup layer for drawn items and adds it to map
    loadedItems = new L.FeatureGroup();
    map.addLayer(loadedItems);

    /**
     *
     * Leaflet Draw Listener, on draw save Coordinates of Polygon (only polygon possible) and add to map
     */
    map.on('draw:created', function (e) {
        var type = e.layerType,
            layer = e.layer;
        var layerJSON = layer.toGeoJSON();

        if (type = 'polygon') {
            map.removeLayer(polygon);
            if(currentOutline == null) {
                $('#venueOutlinesDoneAdded').append('Outlines added')
            }
            polygon = e.layer;
            currentOutline = layerJSON;

            map.addLayer(polygon);
        }
    });
};


function createObjects(data) {
    loadedItems = new L.LayerGroup;

    for (var i in data) {


        //Polygone
        var flupsi = data[i].data.geometry.coordinates;
        for (var k in flupsi[0]) {


            var interim = parseFloat(flupsi[0][k][1]);
            flupsi[0][k][1] = parseFloat(flupsi[0][k][0]);
            flupsi[0][k][0] = interim;
        }
        var polygons = L.polygon(flupsi[0], {opacity: 0.5, fillOpacity: 0.2});

        polygons.addTo(loadedItems);

        // Marker
        var markerooEntrance = data[i].data.properties.coordinate;
        var markerooParking = data[i].data.properties.parking;

        markerooEntrance = convertToArray(markerooEntrance);
        markerooParking = convertToArray(markerooParking);


        var entranceMarkelishous = L.marker(markerooEntrance);
        entranceMarkelishous.bindPopup('<b><a id="' + data[i]._id + '" onclick="getOneObject(this.id.toString())">' + data[i].data.properties.name + '</a><br><b>Click to view InfoBox for this Venue</b>');
        var parkingMarkelishous = L.marker(markerooParking, {color: "#6495ED"});
        entranceMarkelishous.addTo(loadedItems);
        parkingMarkelishous.addTo(loadedItems);
    }

    loadedItems.addTo(map);
}

// helper variable for switching array positions (only [0] <--> [1])
function switcharoo (givenArray){

    var twist = [];
    twist[0] = givenArray[1];
    twist[1] = givenArray[0];
    return twist;
}