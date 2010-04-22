$(document).ready(function() {
  Frontend.init();
  $(Attendees.list()).each(function(index, name){
    Frontend.renderOrUpdateAttendee(name, jQuery.k(name));
  });
  startTimer(60, function() {
    checkHudson('http://de.testwanda.com:9999/job/DaWandaMaster/api/json');
  });
});

// setup
if (jQuery.k('attendees') == null)
  jQuery.k('attendees', []);

function checkHudson(url) {
  $.ajax({
    url: url,
    cache: false,
    dataType: "json",
    success: function(data){
      if (isNewFail(data.color)) {
        lookupBuild(data.lastBuild.number);
      } else {
        console.log('not a new failed build');
      }
    },
    error: function(e, xhr){
      console.log('No connection to Hudson.');
    }
  });
}

function isNewFail(color) {
  if(color == 'red' && jQuery.k('color') == 'blue' ) {
    jQuery.k('color', 'red');
    return true;
  } else {
    jQuery.k('color', color);
    return false;
  }
}

function lookupBuild(number) {
  $.ajax({
    url: "http://de.testwanda.com:9999/job/DaWandaMaster/"+number+"/api/json",
    cache: false,
    dataType: "json",
    success: function(data){
      Attendee.blame(data.culprits[0].fullName);
    },
    error: function(e, xhr){
      console.log('fetching build failed');
    }
  });
}

function startTimer(seconds, callback) {
  var timerCounter = seconds;
  var intervalID = window.setInterval(function() {
    timerCounter--;
    if (timerCounter == 0) {
      timerCounter = seconds;
      callback();
      console.log('your time is over');
    }
    $('#countdown').text(timerCounter + ' seconds');
  }, 1000);
}

