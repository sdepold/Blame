String.prototype.capitalize = function(){
  return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
};

function checkHudson(url) {
  $.ajax({
    url: url,
    cache: false,
    dataType: "json",
    success: function(data){
      if (data.lastSuccessfulBuild != null)
        $K('lastSuccessfulBuild', parseInt(data.lastSuccessfulBuild.number));
      if (data.lastFailedBuild != null)
        $K('lastFailedBuild', parseInt(data.lastFailedBuild.number));

      if (data.lastFailedBuild != null && data.lastSuccessfulBuild != null) {
        if (isNewFail()) {
          lookupBuild($K('lastFailedBuild'));
        } else {
          console.log('not a new build');
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
  lastSuccessfulBuildNumber = parseInt($K('lastSuccessfulBuild'));
  lastFailedBuildNumber = parseInt($K('lastFailedBuild'));

  if (lastSuccessfulBuildNumber > lastFailedBuildNumber) {
    // Build is green
    $K('currentBuildIsBroken', false)
    return false;
  } else {
    // Build is red
    if ($K('currentBuildIsBroken')) {
      return false;
    } else {
      $K('currentBuildIsBroken', true)    
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

var Frontend = {
  init: function() {
    $('body')
      .append($('<div>').attr('id', 'header')
        .append($('<div>').attr('class', 'center')
          .append($('<h1>').attr('id', 'date').css('float', 'right').text($.format.date(new Date(), 'MMMM')))
          .append($('<h1>').text('Blame'))
        )
      )
      .append($('<div>').attr('class', 'center')
        .append($('<ul>').attr('id', 'attendees'))
      )
      .append($('<div>').attr('id', 'footer')
        .append($('<div>').attr('class', 'center')
          .append($('<div>').attr('id', 'countdown').attr('class', 'counter'))
        )
      )
      .append('<embed src="static/slot.wav" autostart=false width=0 height=0 id="sound1" enablejavascript="true">')
  },
  splash: function (name) {
    $('body')
      .append($('<div>').attr('id', 'splash_container')
        .append($('<div>').attr('id', 'splash').text(name).click(function() {
          $('#splash_container').remove();
        }))
     )
  },
  playJingle: function () {
    document.getElementById('sound1').Play();
  },
  renderDebt: function (attendee) {
    fails = attendee.data('fails');
    full = parseInt(fails / 5);
    rest = (fails % 5);
  
    span = $('<span>').attr('class', 'debt');
    for(var i = 1; i < full; i++) {
      span.append($('<img>').attr('src', 'static/5.gif'));
    }
    span.append($('<img>').attr('src', 'static/'+rest+'.gif'));
    
    $(attendee).find('.debt').remove();
    $(attendee).append(span);
  },
  renderOrUpdateAttendee: function (name, fails) {
    attendee = $('ul#attendees li#attendee-'+name.toLowerCase());
    if (attendee.length != 0) {
      attendee.data('fails', fails);
    } else {
      attendee = $('<li>')
        .attr('id', 'attendee-'+name.toLowerCase())
        .attr('class', 'attendee')
        .text(name.capitalize())
        .data('fails', fails);
      $('ul#attendees').append(attendee);
    }
    Frontend.renderDebt(attendee);
    return attendee;
  }
}
