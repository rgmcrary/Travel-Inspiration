
$(document).ready(function() {

  // Google Slick
  $('#carousel').slick({
    dots: true,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',
    autoplay: true,
    autoplaySpeed: 3000
  });

  // Search Button
  $('.searchBtn').on('click', function () {
    handleClick($('input').val());
  });
  $('input').keydown(function(e) {
    if (e.keyCode === 13) {
      handleClick($('input').val());
    }
  });
});

function handleClick(location) {
  $('.errorText').hide();
  if (location !== '') {
    getImages(location);
    getGeoLocation(location);
    getWeatherData(location);
    saveToFirebase(location);
  } else {
    $('.errorText').show();
  }
}


// Google Maps API

    // Google GeoLocation API
function getGeoLocation(location) {
  $('#output').html('');
  var geoCodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
  geoCodeUrl +=
    '?' +
    $.param({
      address: location
    });

  // call places API when geocode request completes pass long/lat to getPlaces results.geometry.location.lng/ results.geometry.location.lat
  $.getJSON(geoCodeUrl).done(function(response) {
    console.log(geoCodeUrl);

    console.log(response);

    var lng = response.results[0].geometry.location.lng;
    var lat = response.results[0].geometry.location.lat;

    getPlacesData(lng, lat);

    console.log();
  });
}


    // Google Places API
function getPlacesData(lng, lat) {
  // call places api
  var map = new google.maps.Map($('#map')[0], {
    center: { lng: lng, lat: lat },
    zoom: 13,
    mapTypeId: 'roadmap'
  });

  var input = $('#pac-input');
  input.show();
  var searchBox = new google.maps.places.SearchBox(input[0]);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input[0]);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log('Returned place contains no geometry');
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        })
      );

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}


//  Pixabay API
function getImages(location) {
  $('#output').html('');
  var pixabayUrl = 'https://pixabay.com/api/';
  pixabayUrl +=
    '?' +
    $.param({
      key: '6114248-3201904a0454e01f4e0f4344f',
      q: location,
      image_type: 'photo',
      safesearch: true,
      per_page: 10,
      category: 'travel'
    });

  $.getJSON(pixabayUrl).done(function(response) {
    console.log(pixabayUrl);

    console.log(response);

    for (var i = 0; i < response.hits.length; i++) {
      $('#output').append('<img src="' + response.hits[i].webformatURL + '"/>');
    }

    console.log();

  });
}


// Weather API
function getWeatherData(location) {
  var query = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + location + '")';

  var weatherURL = 'https://query.yahooapis.com/v1/public/yql';
  weatherURL +=
  '?' +
  $.param({
    q: query,
    format: 'json',
    env: 'store'
  });

  $.getJSON(weatherURL).done(function(response) {
    console.log(response);
    $('#weather').html('');
    //query.results/channel.item.forcast
    for (var i = 0; i < response.query.results.channel.item.forecast.length; i++) {
      var result = response.query.results.channel.item.forecast[i];
      // $('#weather').append('<li>' + result.date + ': ' + result.text + '</li>');
      var html = '<div class="dayBlock">';
      html += '<div class="dateStyle">' + result.date + '</div>';
      html += '<div class="dayStyle">' + result.day + '</div>';
      html += '<div class="highStyle">' + result.high + '</div>';
      html += '<div class="lowStyle">' + result.low + '</div>';
      html += '<div class="textStyle">' + result.text + '</div>';
      html += '</div>';
      $('#weather').append(html);
    }
  });
}


//Firebase API

function saveToFirebase(location){
  //call Firebase api
}
