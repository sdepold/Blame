$(document).ready(function() {
  Frontend.init();
  $(Attendees.list()).each(function(index, name){
    Frontend.renderOrUpdateAttendee(name, jQuery.k(name));
  });
  startTimer(60, function() {
    checkHudson('http://de.testwanda.com:9999/job/DaWandaMaster/api/json');
  });
});




function checkHudson(url) {
  $.ajax({
    url: url,
    cache: false,
    dataType: "json",
    success: function(data){
      if (data.lastSuccessfulBuild != null)
        jQuery.k('lastSuccessfulBuild', parseInt(data.lastSuccessfulBuild.number));
      if (data.lastFailedBuild != null)
        jQuery.k('lastFailedBuild', parseInt(data.lastFailedBuild.number));

      if (data.lastFailedBuild != null && data.lastSuccessfulBuild != null) {
        if (isNewFail()) {
          lookupBuild(jQuery.k('lastFailedBuild'));
        } else {
          console.log('not a new failed build');
        }
      } else {
        console.log('no failed build available');
      }
    },
    error: function(e, xhr){
      console.log('No connection to Hudson.');
    }
  });
}

function isNewFail() { 
  lastSuccessfulBuildNumber = parseInt(jQuery.k('lastSuccessfulBuild'));
  lastFailedBuildNumber = parseInt(jQuery.k('lastFailedBuild'));

  if (lastSuccessfulBuildNumber > lastFailedBuildNumber) {
    // Build is green
    jQuery.k('currentBuildIsBroken', false)
    return false;
  } else {
    // Build is red
    if (jQuery.k('currentBuildIsBroken')) {
      return false;
    } else {
      jQuery.k('currentBuildIsBroken', true)    
      return true;      
    }
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

