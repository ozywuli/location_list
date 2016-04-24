var _debounce = require('lodash/debounce');

module.exports = function() {

  var deviceState;
  var newDeviceState;

  function getDeviceState() {
    deviceState = window.getComputedStyle(document.querySelector('.state-indicator'), ':before').getPropertyValue('content');

    // return state;
    return deviceState;
  }

  getDeviceState();
  var lastDeviceState = getDeviceState();

  window.addEventListener('resize', function() {
    newDeviceState = getDeviceState();

    if (newDeviceState !== lastDeviceState) {
      lastDeviceState = deviceState;
    }
    console.log(lastDeviceState);
  });



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
          icon: "http://placehold.it/50x50"
        });

        markers.push(marker[i]);

        markerId = data.features[i].properties.id;

        // Create and place corresponding panels in a scrollable sidebar
        $('.panels').append('<li class="panel panel__location" data-id="' + markerId + '"></li>');


        marker[i].addListener('click', function(e) {
          map.panTo(this.position);
          var activeMarker = this.id;
          var panelHeight = $('.panel').height();
          
          for (var i = 0; i < markers.length; i++) {
            markers[i].setIcon('http://placehold.it/50x50');
          }
          this.setIcon('http://placehold.it/100x100');

          $('html, body').animate({
            scrollTop: $('[data-id="' + activeMarker + '"]').offset().top - (panelHeight / 2),
          }, 150);
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

      if (newId === currentId) {
        return;
      }

      // highlight the current section
      for (var i = 0; i < panels.length; i++) {
          if ( panels.eq(i).attr('data-id') === newId ) {
            panels.eq(i).addClass('panel--active');
            map.panTo(markers[i].position);
          } else {
            panels.eq(i).removeClass('panel--active');
          }
      }

      currentId = newId;

      // Set highlighted marker
      var activePanelIndex = $('.panel--active').index();

      for (var i = 0; i < markers.length; i++) {
        markers[i].setIcon('http://placehold.it/50x50');
      }      
      markers[activePanelIndex - 1].setIcon('http://placehold.it/100x100');

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
    }, 150)
    

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