function parseFeed(url) {
  $.ajax({
    url: url,
    cache: false,
    dataType: "json",
    success: function(data){
      if (data.lastFailedBuild != null) {
        console.log(getBuild(data.lastFailedBuild.number));
      } else {
        console.log('no failed build available');
      }
    },
    error: function(e, xhr){
      alert('No connection to twitter.');
    }
  });
}

function getBuild(number) {
  $.ajax({
    url: "http://de.testwanda.com:9999/job/DaWandaMaster/"+number+"/api/json",
    cache: false,
    dataType: "json",
    success: function(data){
      return data;
    },
    error: function(e, xhr){
      return null;
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
 document.getElementById('sound1').Play();
}
