function checkHudson(url) {
  $.ajax({
    url: url,
    cache: false,
    dataType: "json",
    success: function(data){
      if (data.lastFailedBuild != null) {
        if (data.lastFailedBuild =! lastFailedBuild) {
          //hit
          lookupBuild(data.lastFailedBuild.number)
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

function lookupBuild(number) {
  $.ajax({
    url: "http://de.testwanda.com:9999/job/DaWanda_Imageable/"+number+"/api/json",
    cache: false,
    dataType: "json",
    success: function(data){
      name = data.culprits[0].fullName;
      
      insertFailedBuild(number, name)
      fail(number, name);
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

function splash(name) {
  $('body')
    .append($('<div>').attr('id', 'splash_container')
      .append($('<div>').attr('id', 'splash').text(name).click(function() {
        $('#splash_container').remove();
      }))
    )
}

function playJingle() {
  document.getElementById('sound1').Play();
}

function fail(number, name) {
  playJingle();
  splash(name);
}

function insertAttendee(name) {
  $('ul#attendees').append($('<li>').attr('id', 'attendee-'+name.toLowerCase()).attr('class', 'attendee').text(name.toLowerCase()))
}