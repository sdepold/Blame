var Attendees = {
  add: function (name) {
    attendees = Attendees.list();
    attendees.push(name);
    jQuery.k(name, 0);
    jQuery.k('attendees', attendees);
  },
  exists: function (name) {
    names = jQuery.grep(Attendees.list(), function(n, index) {
      return name == n;
    });
    return names.length > 0;
  },
  list: function () {
    return jQuery.k('attendees');
  },
  blame: function(name, repo) {
    if (!Attendees.exists(name)) {
      Attendees.add(name);
    }
    jQuery.k(name, parseInt(jQuery.k(name))+1);
    
    Frontend.renderOrUpdateAttendee(name, jQuery.k(name))
    Frontend.playJingle();
    Frontend.splash(name, repo);
  }
}
