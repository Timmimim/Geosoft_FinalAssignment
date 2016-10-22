var homepageLink;

/**
 * AJAX function to save input data from inputForm.html
 * @param content
 * @param array
 */

function upload(content, array){
    var content = content;
    $.ajax({
        method: 'POST',
        data: content,
        url: '/addFeature',
        success: function(data, textStatus){
            console.log('saved successfully');
            $.ajax('map.html', {
                success: function(response){{
                    $('#load').html(response);
                    return false;
                }}
            })


            $.ajax('infoBox.html', {
                success: function(response){
                    if(array){
                        $('#infoBox').clear();
                        $('.map').addClass('maplarge');
                        $('.maplarge').removeClass('map')
                    }else {
                        $('#infobox').html(response);
                        $('#editVenue').remove();
                        $('#deleteVenue').remove();
                        $('.maplarge').addClass('map');
                        $('.map').removeClass('maplarge');

                        //currentlyWatchedVenueID = content._id.toString();

                        $('#loadName').append(content.properties.name);
                        $('#loadType').append(content.properties.venue_type);
                        $('#loadCapacity').append(content.properties.capacity);
                        for(var i in content.properties.event){
                            $('#loadEvent').append(
                            '<tr>'
                                + '<td>Event #' + (i+1) + '</td>'
                                + '<td>' + content.properties.event[i].name + '</td>'
                                + '<td>' + content.properties.event[i].date_start + '</td>'
                                + '<td>' + content.properties.event[i].date_end + '</td>'
                            + '</tr>');
                        }
                        for(var i in content.properties.images) {
                            $('#loadImages').after(
                                '<img src="'+ content.properties.images[i] +'" alt="Error: Could not load image. <br> URL might be incorrect."> </img>'
                            );
                        }
                        map.setView(convertToArray(content.properties.coordinate), 10);
                    }
                }
            })
        },
        error: function(xhr, textStatus, errorThrown){
            console.log(errorThrown);
        }
    });
}

/**
 * AJAX getter
 * populates map and permalink list
 * gets all saved venues from db
 */

function getAll(){
    $.ajax({
        method: 'GET',
        url: '/getAllFeatures',
        success: function(data, textStatus){
            console.log('getAll läuft');
            $('#linkList').empty();
            createList(data);
            console.log('LinkList created');
            createObjects(data);
            console.log('MapObjects Created');
            console.log('in getAll() success');
        },
        error: function(xhr, textStatus, errorThrown){
            console.log(errorThrown);
        }
    });
}

/**
 * AJAX getter
 * getting data from server
 * opens infobox.html and populates it with venue data
 * @param element
 */

function getOneObject(element){

    id = element;
    arrayPositionEvent = arrayPositionPhoto = -1;
    $.ajax({
        method: 'GET',
        url: '/getOneFeature/' + id,
        success: function(data, textStatus){
            console.log('in getOne() success '+ data.data.properties.name);
            $.ajax('infoBox.html', {
                success: function(response){{
                    $('#infobox').html(response);
                    $('.maplarge').addClass('map');
                    $('.map').removeClass('maplarge')
                }}
            })
            $.ajax('infoBox.html', {
                success: function(response){
                    if(array){
                        $('#infoBox').clear();
                        $('.map').addClass('maplarge');
                        $('.maplarge').removeClass('map')
                    }else {
                        $('#infobox').html(response);
                        $('.maplarge').addClass('map');
                        $('.map').removeClass('maplarge');

                        currentlyWatchedVenueID = data._id.toString();

                        $('#loadName').append(data.data.properties.name);
                        $('#loadType').append(data.data.properties.venue_type);
                        $('#loadCapacity').append(data.data.properties.capacity);
                        for(var i in data.data.properties.event){
                            j = parseInt(i) +1;
                            $('#loadEvent').append(
                                '<tr>'
                                + '<td>Event #' + j + '</td>'
                                + '<td>' + data.data.properties.event[i].name + '</td>'
                                + '<td>' + data.data.properties.event[i].date_start + '</td>'
                                + '<td>' + data.data.properties.event[i].date_end + '</td>'
                                + '</tr>');
                        }
                        for(var i in data.data.properties.images) {
                            $('#loadImages').after(
                                '<img src="'+ data.data.properties.images[i] +'" alt="Error: Could not load image. URL might be incorrect."> </img>'
                            );
                        }
                        homepageLink = data.data.properties.link;

                    }
                    if(data.data.properties.link != null && data.data.properties.link != "http://www.")
                        $('#buttons').append(   '<a class="btn btn-info" href="'+ data.data.properties.link +'" target="showLink" >Preview Homepage of Venue</a> '+
                                                '<br><b>If preview doesn\'t work: </b> <br><a class="btn btn-info" href="'+ data.data.properties.link +'">Open page in new window</a> ');
                    latlon = convertToArray(data.data.properties.coordinate);


                    pedestrianRouting(data, latlon);
                    currentVenueParking = convertToArray(data.data.properties.parking);
                    airportRouting();

                    map.setView(latlon, 14);
                }
            })
        },
        error: function(xhr, textStatus, errorThrown){
            console.log(errorThrown);
        }

    });
}

/**
 * AJAX getter,
 * loading the input form
 * and populating it with venue data for editing
 * @param element
 */

function getOneObjectForEditing(element) {

    id = element;
    $.ajax({
        method: 'GET',
        url: '/getOneFeature/' + id,
        success: function(data, textStatus){
            console.log('in getOneObjectForEditing() success '+ data.data.properties.name);
            $.ajax('inputForm.html', {
                success: function (response) {
                    $('#infobox').html(response);
                    $('.maplarge').addClass('map');
                    $('.map').removeClass('maplarge');

                    currentlyWatchedVenueID = data._id.toString();

                    /**
                     * Disappointed disclaimer.
                     */
                    $('#inCaseOfEdit').append("I am very sorry, but for some reason I cannot figure out, the edit/update functionality does not work, while delete, with a very similar structure and the same variable for id, does. <br>Curious...")

                    $('#name').val(data.data.properties.name);

                    if (data.data.properties.venue_type == "Indoor stadium") {
                        $('#indoorStadium').prop("checked", true);
                    } else if (data.data.properties.venue_type == "Outdoor stadium") {
                        $("#outdoorStadium").prop("checked", true);
                    } else {
                        $('#outdoorArea').prop("checked", true);
                    }

                    $('#inputCapacity').val(parseInt(data.data.properties.capacity));

                    $('#link').val(data.data.properties.link);

                    for (var i in data.data.properties.event) {
                        $('#enterEvent').append(
                            '<p>Event #' + i+1 + '</p>' +
                            '<ul><li><b>Name of Event: <b> <input type="text" id="eventName[' + i + ']" value="' + data.data.properties.event[i].name + '"/></li>' +
                            '<li><b>Start date (YYYY-MM-DD):  </b><input type="date" id="eventStart[' + i + ']" value="' + data.data.properties.event[i].date_start + '"></li>' +
                            '<li><b>End Date (YYYY-MM-DD):  </b><input type="date" id="eventEnd[' + i + ']" value="' + data.data.properties.event[i].date_end + '"></li> </ul>');
                    }

                    for (var i in data.data.properties.images) {
                        $('#photoURL').after('<input type="url" id="imageInput' + i + '" value="' + data.data.properties.images[i] + '"/>');
                    }
                    currentOutline = data.data.geometry;

                    currentParkingGeoJSON = convertToArray(data.data.properties.parking);
                    currentEntranceGeoJSON = convertToArray(data.data.properties.coordinate);

                    parkingSet = entranceSet = true;

                    console.log("All set for Edit");

                    latlon = convertToArray(data.data.properties.coordinate);
                    map.setView(latlon, 14);
                }
            })

        },

        error: function(xhr, textStatus, errorThrown){
            console.log(errorThrown);
        }

    });
}

/**
 * AJAX call to update DB content through server function findByIdAndUpdate
 *
 * Edit Feature  -- Using existing input form, but already populated with existing data;
 *                  Saving this form with update, i.e. overwrite the existing data.
 *
 *                  !!!! NOT WORKING FOR UNKNOWN REASON !!!!
* @param content
 */

function update(content){
    $.ajax({
        method: 'POST',
        data: content,
        url: '/updateFeature/' + currentlyWatchedVenueID,
        success: function(data, textStatus){
            console.log('updated successfully');
            getOneObject(currentlyWatchedVenueID);
        },
        error: function(xhr, textStatus, errorThrown){
            console.log(errorThrown);
        }
    });
}

/**
 * AJAX call to certain remove DB content
 * removes entry with ID of currently viewed Venue
 */

function removeVenue() {
    var confirmDelete = confirm("Are you sure you want to delete this venue? It will be gone forever.");
    if(confirmDelete) {
        $.ajax({
            method: 'GET',
            url: '/removeFeature/' + currentlyWatchedVenueID,
            success: function (message) {
                console.log(message);
                $('#infobox').empty();
                $('.map').addClass('maplarge');
                $('.maplarge').removeClass('map');
                $('#'+currentlyWatchedVenueID+'').remove();
            }
        })
    }
}