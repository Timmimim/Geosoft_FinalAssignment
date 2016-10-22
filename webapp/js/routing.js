/**
 * Created by timmimim on 12.09.16.
 */
var parkingToEntranceRouted = false;
var fromParkingToEntrance;

var GIGtoCurrentRouted = false;
var SDUtoCurrentRouted = false;

var costing;

var airportRoute;
var currentVenueParking;


/**
 * semi-hardcoded pedestrian routing between parking and entrance
 * @param data
 * @param latlon
 */
function pedestrianRouting(data, latlon) {

    if (parkingToEntranceRouted) {
        fromParkingToEntrance.spliceWaypoints(0, 2); // <-- removes your route;
        map.closePopup();
    }

    fromParkingToEntrance = new L.Routing.control({
        waypoints: [
            convertToArray(data.data.properties.parking),
            latlon
        ],
        router: L.Routing.mapzen('valhalla-bMHZK98', {costing: 'pedestrian'}),
        formatter: new L.Routing.mapzenFormatter()
    }).addTo(map);
    parkingToEntranceRouted = true;
}

/**
 * semi-hardcoded routing between airports and venue parking
 * possible to switch between automobile and multimodal public transport
 */

function airportRouting() {

    if (GIGtoCurrentRouted || SDUtoCurrentRouted) {
        airportRoute.spliceWaypoints(0, 2); // <-- removes your route;
    }

    var GIGtoCurrent = CoordDistances(currentVenueParking[0], currentVenueParking[1], airportACJ.geometry.coordinates[0], airportACJ.geometry.coordinates[1]);
    var SDUtoCurrent = CoordDistances(currentVenueParking[0], currentVenueParking[1], airportSDU.geometry.coordinates[0], airportSDU.geometry.coordinates[1]);
    if (GIGtoCurrent < SDUtoCurrent) {

        airportRoute = new L.Routing.control({
            waypoints: [
                airportACJ.geometry.coordinates,
                currentVenueParking
            ],
            router: L.Routing.mapzen('valhalla-bMHZK98', {costing: 'auto'}),
            formatter: new L.Routing.mapzenFormatter()
        }).addTo(map);
        GIGtoCurrentRouted = true;
    }
    else {
        airportRoute = new L.Routing.control({
            waypoints: [
                airportSDU.geometry.coordinates,
                currentVenueParking
            ],
            router: L.Routing.mapzen('valhalla-bMHZK98', {costing: 'auto'}),
            formatter: new L.Routing.mapzenFormatter()
        }).addTo(map);
        costing = auto;
        SDUtoCurrentRouted = true;
    }

    L.easyButton('<i class="fa fa-car"></i>', function(btn,map){
        if(costing == "auto") {
            airportRoute.getRouter().options.costing = "multimodal";
            airportRoute.route();
            costing = "multimodal";
        }
        else if (costing = "multimodal"){
            airportRoute.getRouter().options.costing = "auto";
            airportRoute.route();
            costing = "auto";
        }
    }).addTo(map);
    alert("<b>Change between automobile and multimodal public transport navigation, <br> using the button without icon on the left side of the map.</b>");
}

/**
 * calculates the distance between venue entrance and airport coordinates
 *
 * @param lat1
 * @param lon1
 * @param lat2
 * @param lon2
 * @returns {number}
 * @constructor
 */

function CoordDistances (lat1, lon1, lat2, lon2){
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    };
    var a = lat1.toRad(), b = lat2.toRad(), c = (lon2-lon1).toRad(), R = 6371e3; // gives d in metres
    var d = Math.acos( Math.sin(a)*Math.sin(b) + Math.cos(a)*Math.cos(b) * Math.cos(c) ) * R;
    return d;
}