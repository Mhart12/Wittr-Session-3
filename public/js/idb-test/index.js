import idb from 'idb';

var dbPromise = idb.open('text-db', 1, function(upgradeDb) {
  var keyValStore = upgradeDb.createObjectStore('keyval');
  keyValStore.put('world', 'hello');
});
//necessary code to create database for IDB

dbPromise.then(function(db) {
  var tx = db.transaction('keyval');
  var keyValStore = tx.objectStore('keyval');
  return keyValStore.get('hello');
}).then(function(val) {
  console.log('The value of "hello" is:', val);
});
//allows us to read from the database. creating path to object, passing in key

//adding another value to the objectStore.
dbPromise.then(function(db) {
  var tx = db.transaction('keyval', 'readwrite');
  var keyValStore = tx.objectStore('keyval');
  keyValStore.put('bar', 'foo');
  //calling .put to set the value to it's assigned key
  return tx.complete;
  //returns a promise if and when that tx(transaction) completes and rejects it if it fails
}).then(function() {
  console.log('Added foo:bar to keyval');
});
