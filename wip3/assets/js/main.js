// arc text
$('#subtitle').arctext({radius: 120, dir: -1});

$(function () {
  var austDay = new Date();
  austDay = new Date(2015, 4-1, 11, 18, 0, 0);
  $('#default_countdown').countdown({until: austDay});
});

// initialize google map
function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(-34.397, 150.644),
    zoom: 8
  };
  var map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);

// initialize skrollr
( function( $ ) {
    // Init Skrollr
    var s = skrollr.init({
        render: function(data) {
            //Debugging - Log the current scroll position.
            //console.log(data.curTop);
        }
    });
} )( jQuery );