var _debounce = require('lodash/debounce');

module.exports = function() {

  // Variable declaration

  // Initiliaze map
  var map;
  var markers = [];
  var marker = [];


  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 34.049652, lng: -118.235157},
      disableDefaultUI: true,
      scrollwheel: false,
      zoom: 8,
    });

    // Fetch features geojson data
    $.getJSON('assets/data/features.geojson', function(data) {

      var markerId;

      // loop through data and place markers on map
      for ( var i = 0 ; i < data.features.length; i++ ) {
        var lat = data.features[i].geometry.coordinates[1];
        var lng = data.features[i].geometry.coordinates[0];
        var latLng = new google.maps.LatLng(lat, lng);

        var id = data.features[i].properties.id;

        marker[i] = new google.maps.Marker({
          map: map,
          position: latLng,
          title: 'test',
          id: id,
        });

        markers.push(marker[i]);

        markerId = data.features[i].properties.id;

        // Create and place corresponding panels in a scrollable sidebar
        $('.panels').append('<li class="panel panel__location" data-id="' + markerId + '"></li>');


        marker[i].addListener('click', function(e) {
          console.log(this.id);
          map.panTo(this.position);
        });


      } // end for loop



    }).done(function() {
      windowScroll();
    });



  }
  initMap();


  



  function windowScroll() {

    var panelsContainer = $('.panels');
    var panels = $('.panel__location');
    var currentId = '';

    function setId(newId) {
      console.log(markers);
      
      if (newId === currentId) {
        return;
      }
      // highlight the current section
      for (var i = 0; i < panels.length; i++) {

          if ( panels.eq(i).attr('data-id') === newId ) {
            panels.eq(i).addClass('panel--active');
            console.log(markers[i].position);
            map.panTo(markers[i].position);


          } else {
            panels.eq(i).removeClass('panel--active');
          }
      }

      currentId = newId;

    };


    var panDebounce = _debounce(function() {

      var panelsContainerHeight = panelsContainer.height();
      var newId = currentId;

      for ( var i = panels.length - 1; i >= 0; i-- ) {

        var thisPanelOffset = panels.eq(i).offset();

        var scrolled = $(window).scrollTop();

        if (thisPanelOffset.top >= 0 && thisPanelOffset.top >= scrolled) {
          newId = panels.eq(i).attr('data-id');
        }



      }

      setId(newId);
    }, 250)
    

    $(window).on('scroll', function(e) {
      panDebounce();
    });

  }

  $('.map-toggle').on('click', function(e) {
      e.preventDefault();
      $('.panels').toggleClass('panels--hidden');
      $('.map-mobile-controls').toggleClass('map-mobile-controls--compressed');
      $('.map-container').toggleClass('map-container--compressed');
      google.maps.event.trigger(map, "resize");
  });

} // end module exports