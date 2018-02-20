import idb from 'idb';

var dbPromise = idb.open('test-db', 3, function(upgradeDb) {
  switch(upgradeDb.oldVersion) {
    case 0:
      var keyValStore = upgradeDb.createObjectStore('keyval');
      keyValStore.put("world", "hello");
//original objectStore
    case 1:
      upgradeDb.createObjectStore('people', { keyPath: 'name' });
  //creating another objectStore, have to change version of database too. name is the key
    case 2:
      var peopleStore = upgradeDb.transaction.objectStore('people');
      peopleStore.createIndex('animal', 'favoriteAnimal');
  }
});

// read "hello" in "keyval"
dbPromise.then(function(db) {
  var tx = db.transaction('keyval');
  var keyValStore = tx.objectStore('keyval');
  return keyValStore.get('hello');
}).then(function(val) {
  console.log('The value of "hello" is:', val);
});

// set "foo" to be "bar" in "keyval"
dbPromise.then(function(db) {
  var tx = db.transaction('keyval', 'readwrite');
  var keyValStore = tx.objectStore('keyval');
  keyValStore.put('bar', 'foo');
  return tx.complete;
}).then(function() {
  console.log('Added foo:bar to keyval');
});

dbPromise.then(function(db) {
  var tx = db.transaction('keyval', 'readwrite');
  var keyValStore = tx.objectStore('keyval');
  keyValStore.put('horse', 'favoriteAnimal');
  return tx.complete;
}).then(function() {
  console.log('Added your favorite animal');
});

dbPromise.then(function(db) {
  var tx = db.transaction('people', 'readwrite');
  var peopleStore = tx.objectStore('people');

  peopleStore.put({
    name: 'Sam Munoz',
    age: 25,
    favoriteAnimal: 'dog'
  });
  peopleStore.put({
    name: 'Samantha Walsworth',
    age: 25,
    favoriteAnimal: 'cat'
  });
  peopleStore.put({
    name: 'Samson Wright',
    age: 25,
    favoriteAnimal: 'unicorn'
  });
  //.put is calling name property, instead of keystore

  return tx.complete;
}).then(function() {
  console.log('People added');
});

dbPromise.then(function(db) {
  var tx = db.transaction('people');
  var peopleStore = tx.objectStore('people');
  var animalIndex = peopleStore.index('animal');
  //pulls up animals alphabetically when making another case above for 'animal'

  return animalIndex.getAll('cat');//you can pass queries like 'cat'
}).then(function(people) {
  console.log('People:', people);
});
//reading people in the store, in alphabetical order since name is the key in this instance
