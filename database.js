// define get and set function
var $K = function(key, value){
  if (value === undefined){
    return localStorage.getItem(key);
  } else {
    return localStorage.setItem(key, value);
  }
};

var Attendees = {
  add: function (name) {
    attendees = Attendees.list();
    attendees.push(name);
    $K(name, 0);
    $K('attendees', attendees);
  },
  exists: function (name) {
    names = jQuery.grep(Attendees.list(), function(n, index) {
      return name == n;
    });
    return names.length > 0;
  },
  list: function () {
    return $K('attendees').split(',');
  },
  blame: function(name) {
    if (!Attendees.exists(name)) {
      Attendees.add(name);
    }
    $K(name, parseInt($K(name))+1);
    
    Frontend.renderOrUpdateAttendee(name, $K(name))
    Frontend.renderDebt(name);
    Frontend.playJingle();
    Frontend.splash(name);
  }
}
