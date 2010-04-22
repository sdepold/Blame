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
    if ($('#splash_container').size() == 0) {
      $('body')
        .append($('<div>').attr('id', 'splash_container')
          .append($('<div>').attr('id', 'splash').click(function() {$('#splash_container').remove();})
            .append($('<span>').text(name))
            .append($('<div>').attr('id', 'appendix'))         
          )
        )      
    } else {
      $('#splash_container #splash #appendix').append('<hr /><small>'+name+'</small>')
    }

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
