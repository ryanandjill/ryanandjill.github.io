var openInfoWindow = -1;
var infoWindows = [];
var markers = [];
var scene = null;
var scroll_controller = null;

// handle the rsvp link(s)
$('#rsvp_link').click(function() {
		$(document).scrollTo($('#rsvp'), 500, {axis:'y'});
});
$("#rsvp_link").hover(
  function() {
    $("#rsvp_carrot").css("background-position","-356px -315px");
  },
  function() {
    $("#rsvp_carrot").css("background-position","-360px -315px");
  }
);

function getMarker(map, name, lat, long, icon) {
  ic = icon;
  if (typeof icon == 'undefined') {
    ic = 'marker_pin.png';
  }
  return new google.maps.Marker({
      position: new google.maps.LatLng(lat, long),
      map: map,
      title: name,
      icon: 'img/'+ic});
}

function getInfoWindow(name, desc) {
  var contentString = '<div class="content">'+
      '<h1 class="gmap_marker_heading">'+name+'</h1>'+
      '<div id="gmap_marker_content">'+
      '<p>'+desc+'</p>'
      '</div>'+
      '</div>';
  return new google.maps.InfoWindow({
      content: contentString,
      maxwidth: 200
  });
}

function doOpenInfoWindow(map, i) {
  return function() {
    if (openInfoWindow != -1) {
      infoWindows[openInfoWindow].close();
    }
    infoWindows[i].open(map, markers[i]);
    openInfoWindow = i;
  }
}


// initialize google maps
function initialize() {
  var styles = [
  {
    "featureType":"water",
    "elementType":"geometry",
    "stylers":[
      {
        "color":"#000000"
      },
      {
        "lightness":17
      }
    ]
  },
  {
    "featureType":"landscape",
    "elementType":"geometry",
    "stylers":[
      {
        "color":"#000000"
      },
      {
        "lightness":20
      }
    ]
  },
  {
    "featureType":"road.highway",
    "elementType":"geometry.fill",
    "stylers":[
      {
        "color":"#b19260"
      },
      {
        "lightness":17
      }
    ]
  },
  {
    "featureType":"road.highway",
    "elementType":"geometry.stroke",
    "stylers":[
      {
        "color":"#b19260"
      },
      {
        "lightness":29
      },
      {
        "weight":0.1
      }
    ]
  },
  {
    "featureType":"road.arterial",
    "elementType":"geometry",
    "stylers":[
      {
        "color":"#b19260"
      },
      {
        "lightness":18
      }
    ]
  },
  {
    "featureType":"road.local",
    "elementType":"geometry",
    "stylers":[
      {
        "color":"#464036"
      },
      {
        "lightness":10
      }
    ]
  },
  {
    "featureType":"poi",
    "elementType":"geometry",
    "stylers":[
      {
        "color":"#000000"
      },
      {
        "lightness":21
      }
    ]
  },
  {
    "elementType":"labels.text.stroke",
    "stylers":[
      {
        "visibility":"on"
      },
      {
        "color":"#000000"
      },
      {
        "lightness":16
      }
    ]
  },
  {
    "elementType":"labels.text.fill",
    "stylers":[
      {
        "saturation":36
      },
      {
        "color":"#000000"
      },
      {
        "lightness":40
      }
    ]
  },
  {
    "elementType":"labels.icon",
    "stylers":[
      {
        "visibility":"off"
      }
    ]
  },
  {
    "featureType":"transit",
    "elementType":"geometry",
    "stylers":[
      {
        "color":"#000000"
      },
      {
        "lightness":19
      }
    ]
  },
  {
    "featureType":"administrative",
    "elementType":"geometry.fill",
    "stylers":[
      {
        "color":"#000000"
      },
      {
        "lightness":20
      }
    ]
  },
  {
    "featureType":"administrative",
    "elementType":"geometry.stroke",
    "stylers":[
      {
        "color":"#000000"
      },
      {
        "lightness":17
      },
      {
        "weight":1.2
      }
    ]
  }
];


  var mapOptions = {
    center: new google.maps.LatLng(34.029162, -84.360716),
    zoom: 13,
    styles: styles,
    scrollwheel: false,
    panControl: false,
    streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL,
      position: google.maps.ControlPosition.RIGHT_TOP
    }
  };

  var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  $.getJSON( "data/locations.json", function( data ) {
    var items = [];
    var i = 0;
    $.each( data.locs, function( key, val ) {
      markers.push(getMarker(map, val.name, val.lat, val.long, val.icon));
      infoWindows.push(getInfoWindow(val.name, val.desc));

      google.maps.event.addListener(markers[i], 'click', doOpenInfoWindow(map, i));
      i += 1;
    });
  });
}

function handleMapLocationClick() {
  console.log("click event!");
}

google.maps.event.addDomListener(window, 'load', initialize);
//google.maps.event.addDomListener(document.getElementById('loc-1'), 'click', handleMapLocationClick);
//google.maps.event.addDomListener($(".map-location"), 'click', handleMapLocationClick);

$(document).ready(function($) {
  sideNav.init();


	// init controller
	scroll_controller = new ScrollMagic();
	// build scenes
	scene = new ScrollScene({triggerElement: "#main_background", triggerHook: "onLeave"})
					.setTween(TweenLite.to("#scroll_contents", 1, {ease: Linear.easeNone}))
					.addTo(scroll_controller)
          .setPin("#main_background");
					//.addIndicators({zindex: 1, suffix: "1"});

  // move the home section to the right place
  resizeWindow();

  $('#loading').css('display', "none");
  $('#container').css('visibility', "visible");

    var austDay = new Date(2015, 4-1, 11, 18, 0, 0);
    $("div#default_countdown").countdown({until: austDay});
});

function resizeWindow() {
  var bg_height = $("#main_background").outerHeight()
  var window_height = $(window).height()
  var diff = bg_height-window_height;

  console.log("resizeWindow() called: " + diff);
  scene.remove();
  scene.addTo(scroll_controller);
  $("#home").css({"margin-top": -(120 + diff)});
}

$(window).resize(resizeWindow);

var sideNav = function() {
	var $navLinks;

	var init = function() {
		$navLinks = $('#nav_links li');
		// navigation button hover effects
		$navLinks.hover(function() {
			$(this).children().stop().animate({'top':'40px','opacity':1},{queue: false, duration: 150}).fadeIn(150);
		}, function() {
			$(this).children().stop().animate({'top':'55px','opacity':1},{queue: false, duration: 150}).fadeOut(150);
		});

		// when you click on the link elements within the scroll the the slide that has the same index value as the element you clicked
		$navLinks.click(function() {
			var index = $navLinks.index(this);
			$(document).scrollTo('section:eq('+(index+1)+')', 500, {axis:'y', easing:'easeInOutQuart'});
		});
	};

	var navIndicator = function(input) {
		if (input === 1)
		{
			$navLinks.removeClass('selected');
		} else
		{
			$navLinks.removeClass('selected');
			$navLinks.eq(input-2).addClass('selected');
		}
	};

	var mobile = function() {
		$navLinksMobile = $('#mobile_menu ol li');

		$navLinksMobile.click(function() {
			var index = $navLinksMobile.index(this);
			$('#mobile_menu ol').css({'display':'none'});
			$(document).scrollTo('section:eq('+(index+1)+')', 500, {axis:'y', easing:'easeInOutQuart'});
		});
	}

	return {
		init: init,
		navIndicator: navIndicator,
		mobile: mobile
	};
}();
