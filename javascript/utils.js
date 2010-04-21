String.prototype.capitalize = function(){
  return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
};

// define get and set function
jQuery.k = function(key, value){
  if (value === undefined){
    return JSON.parse(localStorage.getItem(key));
  } else {
    return localStorage.setItem(key, JSON.stringify(value));
  }
};
