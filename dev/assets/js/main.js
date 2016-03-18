var panels = $('.panels');
var panel = $('.panel');

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.049652, lng: -118.235157},
    disableDefaultUI: true,
    scrollwheel: false,
    zoom: 8
  });


  $.getJSON('assets/data/features.geojson', function(data) {
    // console.log(data);
    console.log(data.features[0].properties.id);

    var markerId;

    for ( var i = 0 ; i < data.features.length; i++ ) {
      var lat = data.features[i].geometry.coordinates[1];
      var lng = data.features[i].geometry.coordinates[0];
      var latLng = new google.maps.LatLng(lat, lng);
      var marker = new google.maps.Marker({
        map: map,
        position: latLng,
        title: 'test'
      });

      markerId = data.features[i].properties.id;


      $('.panels').append('<li class="panel" data-id="' + markerId + '"></li>');

    } // end for loop

  }).done(function() {
    windowScroll();
  });


}





function windowScroll() {

  var panelsContainer = $('.panels');
  var panels = $('.panel');
  var currentId = '';

  function setId(newId) {
    if (newId === currentId) {
      return;
    }
    // highlight the current section
    for (var i = 0; i < panels.length; i++) {

        if ( panels.eq(i).attr('data-id') === newId ) {
          panels.eq(i).addClass('panel--active');
          console.log(1);
        } else {
          panels.eq(i).removeClass('panel--active');
          console.log(0);
        }
    }

    currentId = newId;
  };

  $(window).on('scroll', function(e) {
    var panelsContainerHeight = panelsContainer.height();
    var newId = currentId;

    // console.log(panels.eq(1).offset().top);

    for ( var i = panels.length - 1; i >= 0; i-- ) {

      var thisPanelOffset = panels.eq(i).offset();

      var scrolled = $(window).scrollTop();

      if (thisPanelOffset.top >= 0 && thisPanelOffset.top >= scrolled - 150) {
        newId = panels.eq(i).attr('data-id');
      }
      setId(newId);

    }

  });

}



$('.map-toggle').on('click', function(e) {
  e.preventDefault();
  $('.panels').toggleClass('panels--hidden');
  $('.map-mobile-controls').toggleClass('map-mobile-controls--compressed');
  $('.map-container').toggleClass('map-container--compressed');
  google.maps.event.trigger(map, "resize");
});
