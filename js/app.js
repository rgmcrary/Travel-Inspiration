// Google Slick
$(document).ready(function() {
  $("#carousel").slick({
    dots: true,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: "linear",
    autoplay: true,
    autoplaySpeed: 3000
  });
});

$(document).ready(function() {
  $(".searchBtn").on("click", function() {
    getImages($("input").val());
  });
  $(".saveSearchBtn").on("click", function() {
    //  Firebase logic to save input (Would need user login)
  });
  $("input").keydown(function(e) {
    if (e.keyCode === 13) {
      getImages($("input").val());
    }
  });
});

function getImages(search) {
  $("#output").html("");
  var pixabayUrl = "https://pixabay.com/api/";
  pixabayUrl +=
    "?" +
    $.param({
      key: "6114248-3201904a0454e01f4e0f4344f",
      q: search,
      image_type: "photo",
      safesearch: true,
      per_page: 10,
      category: "travel"
    });

  $.getJSON(pixabayUrl).done(function(response) {
    console.log(pixabayUrl);

    console.log(response);

    for (var i = 0; i < response.hits.length; i++) {
      $("#output").append('<img src="' + response.hits[i].webformatURL + '"/>');
    }

    console.log();
  });
}

// Possibilities:  Write searches to Firebase and have repeated inputs increment. 
// Return inputs over a certain incremented amount as a "Popular Destination"
// Use this instead of saved searches to bypass having to create authentication scenerios