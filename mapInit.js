/**
 * Created by Timm Kühnel on 18.08.2016.
 */

'use strict';
/**
 * global parameters
 */
var map;
var leafletRouting;
var status = "false";
var myLayerControl;
var myGeocoderControl;
var tripRoute;

/**
 * function to build the map
 */
var mapBuild = function () {
    // initial View and zoom settings for the map
    map = L.map('map').setView([51.96, 7.61], 13);

    // Create a layer from an OpenStreetMap base map and add it to the map object
    var osmColor = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    osmColor.addTo(map);

    // make routing availabel
    // routing();

};