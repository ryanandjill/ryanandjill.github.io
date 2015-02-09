var openInfoWindow = -1;
var infoWindows = [];
var markers = [];
var scene = null;
var scroll_controller = null;
var RSVP_CONFIRMED = '<p>We received your RSVP!</p><p>Need to make a change? <a href="mailto:ryanl.jillw@gmail.com">Contact Ryan</a>';

function get_attending_radio(id) {
  var name = "rsvp_name_attend_"+id;
  radio = '<span class="rsvp_radio">'
  radio += '<input type="radio" id="'+name+'1" name="'+name+'" value="True"><label for="'+name+'1">Can\'t Wait!</label>';
  radio += '<input type="radio" id="'+name+'2" name="'+name+'" value="False"><label for="'+name+'2">Wish I Could Be There</label>';
  radio += '</span>'
  return radio;
}

$("#rsvp_confirm_form").submit(function(e) {
  var data = {};
  $.each($('#rsvp_confirm_form').serializeArray(), function(i, field) {
      data[field.name] = field.value;
  });

  var error = '';
  var attendees = [];
  for (var i=0; i<data['invite_count']; ++i) {
    var person_key = "rsvp_name_"+i;
    var person_attending_key = "rsvp_name_attend_"+i;
    if (data[person_key] != "") {
      if (person_attending_key in data) {
        attending = (data[person_attending_key] == "True" ? true : false);
        not = (attending) ? '' : 'not ';
        //console.log(data[person_key] + ' is ' + not + 'attending.');
        attendees.push({'name': data[person_key], 'attending': attending});
        error = '';
      } else {
        error = 'We need to know if ' + data[person_key] + ' will attend!';
        break;
      }
    }
  }

  $("#rsvp_validate_error").text(error);
  if (error == '') {
    //console.log('Valid form let\'s submit!');
    email = data['email']
    if (email == "Insert your email address") {
      email = '';
    }
    submit = {'names': attendees, 'email': email};
    //console.log(submit);

    // valid form, go ahead and submit
    var formURL = "http://app.jillandryan.us/invitation/";
    $.ajax(
      {
        url : formURL + $('#rsvp_code').val(),
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(submit),
        success:function(data, textStatus, jqXHR)
        {
          jdata = JSON.parse(data);
          //console.log(jdata);
          //console.log('RSVP Processed!');
          $('#rsvp_code_message').html(RSVP_CONFIRMED);
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
          //console.log('Error processing RSVP :-\\');
          $('#rsvp_content_initial').hide();
          $('#rsvp_content_error').css("display","inline-block");
        }
      });
  }

  // submit rsvp

  e.preventDefault();
});

// handle rsvp submission
//callback handler for form submit
$("#rsvp_code_form").submit(function(e)
{
  var formURL = "http://app.jillandryan.us/invitation/";
  $.ajax(
    {
      url : formURL + $('#rsvp_code').val(),
      type: "GET",
      success:function(data, textStatus, jqXHR)
      {
        jdata = JSON.parse(data);
        //console.log(jdata);
        //console.log(jdata['rsvp_names']);
        $('#rsvp_content_initial').hide();
        $('#rsvp_content_confirm').css("display","inline-block");
        confirm_pane = ''
        if (jdata['rsvp_complete'] == false) {
          confirm_pane = '<p>Thanks for coming to the website! Will we be seeing you at the wedding?</p>';
          i = 0;
          $.each(jdata['rsvp_names'], function(idx, val) {
            var id = "rsvp_name_" + i;
            name = val['name'];
            confirm_pane += '<p><input type="text" id="' + id + '" name="' + id + '" value="' + name + '"></input>';
            confirm_pane += get_attending_radio(i);
            confirm_pane += '</p>';
            i += 1;
          });
          while (i < jdata['max_invites']) {
            var id = "rsvp_name_" + i;
            confirm_pane += '<p><input type="text" id="' + id + '" name="' + id + '" value=""></input>'
            confirm_pane += get_attending_radio(i)
            confirm_pane += '</p>';
            i += 1;
          }
          confirm_pane += '<input type="hidden" id="invite_count" name="invite_count" value="'+jdata['max_invites']+'"></input>';
          confirm_pane += '<p>Let us keep you updated as the big day gets closer!</p><input type="text" id="email" name="email" value="Insert your email address" onfocus="if (this.value==\'Insert your email address\') this.value=\'\';"></input>'
          confirm_pane += '<input type="submit" value="RSVP!"></input>';
        } else {
          confirm_pane = RSVP_CONFIRMED;
        }
        $('#rsvp_code_message').html(confirm_pane);
      },
      error: function(jqXHR, textStatus, errorThrown)
      {
        $('#rsvp_content_initial').hide();
        $('#rsvp_content_error').css("display","inline-block");
      }
    });
    e.preventDefault(); //STOP default action
    //e.unbind(); //unbind. to stop multiple form submit.
  });

$('#rsvp_retry').click(function(e) {
  e.preventDefault();
  $('#rsvp_content_error').css("display", "none");
  $('#rsvp_content_initial').css("display", "inline-block");
});

// handle the rsvp link(s)
$('#nav_container').click(function(e) {
  if (e.target.id != "") {
    $(document).scrollTo(0, 500);
  }
});
$('#nav_container').hover(
  function(e) {
    // display 'Top'
    $('#nav_label').html('Top');
    $('#nav_label').animate({'top':'40px','opacity':1},{queue: false, duration: 150}).fadeIn(50);
  },
  function(e) {
    // remove 'Top'
    $('#nav_label').html('');
    $('#nav_label').animate({'top':'40px','opacity':1},{queue: false, duration: 150}).fadeOut(50);
  }
);
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
    draggable: false,
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
  //console.log("click event!");
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
});

$(window).load(function() {

    $('#loading').css('display', "none");
    $('#container').css('visibility', "visible");

    var austDay = new Date(2015, 4-1, 11, 17, 30, 0);
    $("div#default_countdown").countdown({until: austDay});

    resizeWindow();
});


function resizeWindow() {
  var bg_height = $("#main_background").outerHeight()
  var window_height = $(window).height()
  var diff = bg_height-window_height;

  scene.remove();
  scene.addTo(scroll_controller);
  $("#main_background").css({"height": window_height, "padding-top": '0px'});
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
      $('#nav_label').animate({'top':'40px','opacity':1},{queue: false, duration: 150}).fadeOut(10);
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
