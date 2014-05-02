// arc text
$('#subtitle').arctext({radius: 120, dir: -1});

$(function () {
  var austDay = new Date();
  austDay = new Date(2015, 4-1, 11, 18, 0, 0);
  $('#default_countdown').countdown({until: austDay});
});

// initialize google maps
function initialize() {
  var styles = [
    {
      stylers: [
        { hue: "#00ffe6" },
        { saturation: -20 }
      ]
    },{
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { lightness: 100 },
        { visibility: "simplified" }
      ]
    },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];
  
  
  var mapOptions = {
    center: new google.maps.LatLng(34.029162, -84.360716),
    zoom: 14,
    styles: styles,
  };
  var map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);
      
      var marker = new google.maps.Marker({
            position: new google.maps.LatLng(34.029162, -84.360716),
            map: map,
            title: 'Naylor Hall'
        })
        
        var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">Naylor Hall</h1>'+
            '<div id="bodyContent">'+
            '<p><b>Naylor Hall</b>, is where we\'ll tie the knot!'
            '</div>'+
            '</div>';
        
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
          });
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