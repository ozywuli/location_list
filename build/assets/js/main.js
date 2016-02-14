var panels = $('.panels');
var panel = $('.panel');

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.049652, lng: -118.235157},
    scrollwheel: false,
    zoom: 8
  });
  map.data.loadGeoJson('assets/data/features.geojson');

}



$.getJSON('assets/data/features.geojson', function(data) {
  console.log(data);
});

$(window).on('scroll', function() {
  $('.panel').each(function() {
    if ( $(this).offset().top >= $(window).scrollTop() ) {
      console.log( $(this).attr('id') );
    }
  });
});
