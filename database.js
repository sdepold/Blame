var db;
var lastFailedBuild;

try {
  if (window.openDatabase) {
    db = openDatabase("Blame", "1.0", "Blame your colleagues", 200000);
    if (!db) {
      alert("Failed to open the database on disk.  This is probably because the version was bad or there is not enough space left in this domain's quota");
    }
  } else {
    alert("Couldn't open the database.  Please try with a WebKit nightly with this feature enabled");
  }
} catch(err) { }

function loadLastFailedBuild() {
  db.transaction(function(tx) {
    tx.executeSql("SELECT number FROM FailedBuilds ORDER BY number DESC LIMIT 1;", [], function(tx, result) {
      lastFailedBuild = parseInt(result.rows.item(0).number);
    }, function(tx, error) {
      tx.executeSql("CREATE TABLE FailedBuilds (number REAL UNIQUE, name TEXT)", [], function(result) { 
        lastFailedBuild = null;
      });
    });
  });
}

function insertFailedBuild(number, name) {
  db.transaction(function (tx) {
    tx.executeSql("INSERT INTO FailedBuilds (number, name) VALUES (?, ?)", [parseInt(number), name]);
  }); 
}

function loadAttendees() {
  db.transaction(function(tx) {
    tx.executeSql("SELECT DISTINCT name, COUNT(name) as count FROM FailedBuilds ORDER BY COUNT(name) DESC;", [], function(tx, result) {
      for (var i = 0; i < result.rows.length; ++i) {
        insertAttendee(result.rows.item(i).name, result.rows.item(i).count)
      }
    });
  });
  
}