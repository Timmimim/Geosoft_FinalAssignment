/**
 * Created by timmimim on 11.09.16.
 */
function convertToArray(string) {
    var coordinates = string.split(/[\s,]+/);

    for (i = 0; i < coordinates.length; i++) {
        if (isNaN(coordinates[i])) {
            delete coordinates[i];
        }
    }

    var coordinatesFloat = [];
    for (i = 0; i < coordinates.length; i++) {
        if (isNaN(coordinates[i])) {} else {
            coordinatesFloat.push(coordinates[i]);
        }
    }

    for (var i=0; i<2; i++){
        coordinatesFloat[i] = parseFloat(coordinatesFloat[i]);
    }
    switcharoo(coordinatesFloat);
    return coordinatesFloat;
}