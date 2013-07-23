$(document).ready(function() {
  // setup
  if (jQuery.k('polling_time') == null)
    jQuery.k('polling_time', 60);

  if (jQuery.k('attendees') == null)
    jQuery.k('attendees', []);

  if (jQuery.k('urls') == null) {
    url = prompt('Enter you Hudson project URL (e.g. "http://your.server.com:1234/job/MyProject/"):').trim()
    url = (url[url.length-1] == '/') ? url : url+'/'
    jQuery.k('urls',{ 'default': url });
  }

  Frontend.init();
  $(Attendees.list()).each(function(index, name){
    if(name != undefined && name != null && name != window.document)
      Frontend.renderOrUpdateAttendee(name, jQuery.k(name));
  });

  var check = function() {
    jQuery.each(jQuery.k('urls'), function(repo, url) {
      checkHudson(repo, url);
    });
  };

  startTimer(jQuery.k('polling_time'), check);
  check();
});

function checkHudson(repo, url) {
  $.getJSON(url+'api/json?jsonp=?', function (data){
    if (isNewFail(repo, url, data.color)) {
      lookupBuild(repo, url, data.lastBuild.number);
    } else {
      debug('not a new failed build');
    }
  });
}

function isNewFail(repo, url, color) {
  if (color == 'blue' || color == 'red') {
    key = repo + '_color'

    if (jQuery.k(key) == null)
      jQuery.k(key, 'blue');

    if(color == 'red' && jQuery.k(key) == 'blue' ) {
      jQuery.k(key, 'red');
      return true;
    } else {
      jQuery.k(key, color);
      return false;
    }
  }
}

function lookupBuild(repo, url, number) {
  $.getJSON(url+number+"/api/json?jsonp=?", function (data){
    badBoys = jQuery.unique(data.culprits)
    jQuery.each(badBoys, function(index, attendee) {
      Attendees.blame(attendee.fullName.normalize(), repo);
    })
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

