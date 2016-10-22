$(document).on('click', '#addVenue', function(e){
    e.preventDefault();
    $.ajax('inputForm.html', {
        success: function(response){{
            $('#infobox').html(response);
            $('.maplarge').addClass('map');
            $('.map').removeClass('maplarge')
        }}
    })
});
$(document).on('click', '#loadFile', function(e){
    e.preventDefault();
    $.ajax('infoBox.html', {
        success: function(response){{
            $('#infobox').html(response);
            $('.maplarge').addClass('map');
            $('.map').removeClass('maplarge')
        }}
    })
});