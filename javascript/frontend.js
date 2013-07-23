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
          .append($('<div>').attr('id', 'countdown').attr('class', 'counter')
            .click(function(){
              jQuery.k('polling_time',prompt('Enter polling time:'))
            })
          )
        )
      )
      .append('<audio src="static/slot.wav" id="sound1" preload="auto">')
  },
  splash: function (name, repo) {
    if ($('#splash_container').size() == 0) {
      $('body')
        .append($('<div>').attr('id', 'splash_container')
          .append($('<div>').attr('id', 'splash').click(function() {$('#splash_container').remove();})
            .append($('<span>').text(name))
            .append($('<small>').html(' on '+repo))

            .append($('<div>').attr('id', 'appendix'))
          )
        )
    } else {
      $('#splash_container #splash #appendix').append('<hr /><small>'+name+' on '+repo+'</small>')
    }

  },
  playJingle: function () {
    $('#sound1').get(0).play();
  },
  renderDebt: function (attendee) {
    fails = attendee.data('fails');
    full = parseInt(fails / 5);
    rest = (fails % 5);

    span = $('<span>').attr('class', 'debt');
    for(var i = 1; i < full; i++) {
      span.append($('<img>').attr('src', 'static/5.gif'));
    }
    if (rest > 0)
      span.append($('<img>').attr('src', 'static/'+rest+'.gif'));

    $(attendee).find('.debt').remove();
    $(attendee).append(span);
  },
  renderOrUpdateAttendee: function (name, fails) {
    attendee = $('ul#attendees li#attendee-'+name.toLowerCase().replace(/ /g,''));
    if (attendee.length != 0) {
      attendee.data('fails', fails);
    } else {
      attendee = $('<li>')
        .attr('id', 'attendee-'+name.toLowerCase().replace(/ /g,''))
        .attr('class', 'attendee')
        .text(name.capitalize())
        .data('fails', fails);
      $('ul#attendees').append(attendee);
    }
    Frontend.renderDebt(attendee);
    return attendee;
  }
}
