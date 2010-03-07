function checkHudson(url) {
  $.ajax({
    url: url,
    cache: false,
    dataType: "json",
    success: function(data){
      if (data.lastFailedBuild != null) {
        console.log(data.lastFailedBuild.number);
        //hit
        lookupBuild(data.lastFailedBuild.number)
      } else {
        console.log('no failed build available');
      }
    },
    error: function(e, xhr){
      alert('No connection to twitter.');
    }
  });
}

function lookupBuild(number) {
  $.ajax({
    url: "http://de.testwanda.com:9999/job/DaWanda_Imageable/"+number+"/api/json",
    cache: false,
    dataType: "json",
    success: function(data){
      name = data.culprits[0].fullName
      fail(number, name)
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

function fail(buildId, name) {
  playJingle();
  splash(name);
}
