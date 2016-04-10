  var panels = $('.panels');
  var panel = $('.panel');

  // Initiliaze map
  var map;
  var marker;
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

        marker = new google.maps.Marker({
          map: map,
          position: latLng,
          title: 'test'
        });

        markerId = data.features[i].properties.id;

        // Create and place corresponding panels in a scrollable sidebar
        $('.panels').append('<li class="panel" data-id="' + markerId + '"></li>');

      } // end for loop

      marker.addListener('click', function(e) {
        console.log(this);
      })

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
