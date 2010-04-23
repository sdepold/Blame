String.prototype.capitalize = function(){
  return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
};

// define get and set function
jQuery.k = function(key, value){
  if (value === undefined){
    item = localStorage.getItem(key)
    if (item != null) {
      return JSON.parse(item);
    } else {
      return null
    }
  } else {
    return localStorage.setItem(key, JSON.stringify(value));
  }
};

function debug(text) {
  if (window.console != undefined) {
    console.log(text);
  }
}

