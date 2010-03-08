String.prototype.capitalize = function(){
   return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
  };

function checkHudson(url) {
  $.ajax({
    url: url,
    cache: false,
    dataType: "json",
    success: function(data){
      if (data.lastFailedBuild != null) {
        if (parseInt(data.lastFailedBuild.number) != parseInt(lastFailedBuild)) {
          //hit
          lookupBuild(data.lastFailedBuild.number);
          lastFailedBuild = parseInt(data.lastFailedBuild.number);
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
    url: "http://de.testwanda.com:9999/job/DaWandaMaster/"+number+"/api/json",
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
  increaseDebt(name);
  playJingle();
  splash(name);
}

function increaseDebt(name) {
  attendee = $('ul#attendees li#attendee-'+name.toLowerCase());
  if (attendee.length != 0) {
    attendee.data('fails', attendee.data('fails')+1);
  } else {
    attendee = insertAttendee(name, 1);
  }
  renderDebt(attendee);
}

function insertAttendee(name, fails) {
  attendee = $('<li>')
    .attr('id', 'attendee-'+name.toLowerCase())
    .attr('class', 'attendee')
    .text(name.capitalize())
    .data('fails', fails);
  $('ul#attendees').append(attendee);

  renderDebt(attendee);
  return attendee;
}

function renderDebt(attendee) {
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
}