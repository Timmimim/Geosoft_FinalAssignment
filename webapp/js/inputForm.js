var parkingSet, entranceSet;
var currentOutline = null;
var arrayPositionPhoto = -1;
var arrayPositionEvent = -1;
var p, q;


$('#addVenue').on('click', function (event) {
    event.preventDefault();
    $('#infobox').load('../inputForm.html #addVenueForm');
    return false;
});


$(document).on('click', '#eventInput', function () {
    arrayPositionEvent += 1;
    p = arrayPositionEvent;
    $('#enterEvent').append(
        '<p> <b>Event #' + (p+1) +'</b></p>' +
        '<b>Name of Event: </b> <input type="text"  name="eventName['+p+']"/><br>'+
        '<b>Start date (YYYY-MM-DD): </b><input type="date" name="eventStart['+p+']"/><br>'+
        '<b>End Date (YYYY-MM-DD): </b><input type="date" name="eventEnd['+p+']"/><br>' +
        '<b>Event input is, sadly, not working at this point (throws undefined values), so event data will not be saved.</b><br>'
    );

    return false;
});

$(document).on('click', '#photoLinkInput', function () {
    arrayPositionPhoto += 1;
    q = arrayPositionPhoto;
    $('#photoURL').after('<input type="url" id="imageInput'+q+'" value="http://www."/>');
    return false;
});

$(document).on('click', '#addEntrance', function() {
    addingEntrance = true;
    addingParking = addingOutlines = false;
    return false;
});

$(document).on('click', '#addParking', function() {
    addingParking = true;
    addingEntrance = addingOutlines = false;
    return false;
});

$(document).on('click', '#addOutlines', function () {
    addingOutlines = true;
    addingEntrance = addingParking = false;
    return false;
});



$(document).on('submit', 'form', function(e) {

    if(editingVenue == false) {
        e.preventDefault();
        addingEntrance = false;
        addingParking = false;
        addingOutlines = false;

        if (entranceSet == parkingSet && currentOutline != null) {
            e.preventDefault();
            var typeInput = $('#typeInput').val(),
                nameInput = $('#name').val(),
                entranceInput = switcharoo(currentEntranceGeoJSON.geometry.coordinates),
                parkingInput = switcharoo(currentParkingGeoJSON.geometry.coordinates),
                linkInput = $('#link').val(),
                venueTypeInput = $('input[name=venue_type]:checked').val(),
                capacityInput = $('#capacity').val(),
                outlinesInput = currentOutline;

            /**
             * Getting Event Info from document does not work.
             * Fixing did not work either, so it is taken out.
             *
            for (var i = 0; i <= p; i++) {

                var eventInput  = [];
                console.log(p, i);
                eventName = $('eventName[' + i+']' ).val();
                eventStart = $('eventStart[' + i +']').val();
                eventEnd = $('eventEnd[' + i +']').val();
                console.log(eventName);
                console.log(eventStart);
                var eventData = {
                    name: eventName,
                    date_start: eventStart,
                    date_end: eventEnd
                };
                console.log(eventData);
                eventInput.push(eventData);
            }
             */

            var photoUrlInput = [];
            for (var i = 0; i <= q; i++) {
                var photoData = $('#imageInput' + i).val();
                photoUrlInput.push(photoData);
            }
            entranceInput = entranceInput.toString();
            parkingInput = parkingInput.toString();

            var content = {
                type: 'Feature',
                properties: {
                    name: nameInput,
                    coordinate: entranceInput,
                    venue_type: venueTypeInput,
                    // event: eventInput,
                    link: linkInput,
                    images: photoUrlInput,
                    capacity: capacityInput,
                    parking: parkingInput
                },
                geometry: outlinesInput.geometry
            };
            arrayPositionEvent = arrayPositionPhoto = -1;
            upload(content);
        } else {
            return false
        }
    }

    else {
        e.preventDefault();
        addingEntrance = false;
        addingParking = false;
        addingOutlines = false;

        e.preventDefault();
        var typeInput = $('#typeInput').val(),
            nameInput = $('#name').val(),
            entranceInput = switcharoo(currentEntranceGeoJSON).toString(),
            parkingInput = switcharoo(currentParkingGeoJSON).toString(),
            linkInput = $('link').val(),
            venueTypeInput = $('input[name=venue_type]:checked').val(),
            capacityInput = $('#capacity').val(),
            outlinesInput = currentOutline;

        /**
         * Getting Event Info from document does not work.
         * Fixing did not work either, so it is taken out.
         *
        var eventInput = [];
        for (var i = 0; i <= p; i++) {
            var eventData = {
                name: $('#eventName[' + i + ']').val(),
                date_start: $('#eventStart[' + i + ']').val(),
                date_end: $('#eventEnd[' + i + ']').val()
            };
            console.log(eventData);
            eventInput.push(eventData);
        }*/

        var photoUrlInput = [];
        for (var i = 0; i <= q; i++) {
            var eventData = $('#imageInput' + i).val();
            photoUrlInput.push(eventData);
        }

        var content = {
            type: 'Feature',
            properties: {
                name: nameInput,
                coordinate: entranceInput,
                venue_type: venueTypeInput,
                //event: eventInput,
                link: linkInput,
                images: photoUrlInput,
                capacity: capacityInput,
                parking: parkingInput
            },
            geometry: outlinesInput
        };

        arrayPositionEvent = arrayPositionPhoto = -1;
        editingVenue = false;
        update(content);
    }
});
