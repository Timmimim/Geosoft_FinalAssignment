var array = false;
var currentlyWatchedVenueID;
var editingVenue = false;

/**
 * Navbar and Routing
 * AJAX calls to html files, loading them into divs
 */

$(document).on('click', '#homenav', function(e){
    e.preventDefault();
    $.ajax('home.html', {
        success: function(response){{
            $('#load').html(response);
        }}
    })
})

$(document).on('click', '#mapnav', function(e){
    e.preventDefault();
    $.ajax('map.html', {
        success: function(response){{
            console.log('jabbadabbaduuuu!!');
            $('#load').html(response);
        }}
    })
})

$(document).on('click', '#impressumnav', function(e){
    e.preventDefault();
    $.ajax('impressum.html', {
        success: function(response){{
            $('#load').html(response);
        }}
    })
})

/**
 * trigger in map.js
 * onload: creates a List of permalinks to every item stored in DB
 * @param data
 */
function createList (data) {
    for (var i in data) {
        $('#featureList').append(
            '<li><button class="btn btn-sm btn-default" id="'+data[i]._id+'" onclick="getOneObject(this.id.toString())">' + data[i].data.properties.name + '</button></li>'
        );
    }
}

$(document).on('click', '#showlist', function(e){
    e.preventDefault();
    $('#featureList').slideToggle();
})


/**
 * Input Form Button Handlers
 */

$(document).on('click', '#cancelAdding', function () {
    $('#infobox').empty();
    $('.map').addClass('maplarge');
    $('.maplarge').removeClass('map');
    arrayPositionEvent = arrayPositionPhoto = -1;
    entranceSet = parkingSet = false;
})

$(document).on('click', '#closeInfo', function () {
    $('#infobox').empty();
    $('.map').addClass('maplarge');
    $('.maplarge').removeClass('map');
})

$(document).on('click', '#editVenue', function () {
    getOneObjectForEditing(currentlyWatchedVenueID);
    editingVenue = true;
})

$(document).on('click', '#deleteVenue', function () {
    removeVenue();
})
