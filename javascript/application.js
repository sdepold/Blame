$(document).ready(function() {
  Frontend.init();
  $(Attendees.list()).each(function(index, name){
    if(name != undefined && name != null && name != window.document)
      Frontend.renderOrUpdateAttendee(name, jQuery.k(name));
  });
  startTimer(60, function() {
    checkHudson(jQuery.k('url')+'api/json');
  });

  // setup
  if (jQuery.k('attendees') == null)
    jQuery.k('attendees', []);

  if (jQuery.k('color') == null)
    jQuery.k('color', 'blue');

  if (jQuery.k('url') == null)    
    jQuery.k('url',prompt('Enter you Hudson project URL (e.g. "http://your.server.com:1234/job/MyProject/"):'));
});

function checkHudson(url) {
  $.getJSON(url, function (data){
    if (isNewFail(data.color)) {
      lookupBuild(data.lastBuild.number);
    } else {
      debug('not a new failed build');
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
  $.getJSON(jQuery.k('url')+number+"/api/json", function (data){
    Attendees.blame(data.culprits[0].fullName);
  });
}

function startTimer(seconds, callback) {
  var timerCounter = seconds;
  var intervalID = window.setInterval(function() {
    timerCounter--;
    if (timerCounter == 0) {
      timerCounter = seconds;
      callback();
      debug('your time is over');
    }
    $('#countdown').text(timerCounter + ' seconds');
  }, 1000);
}

