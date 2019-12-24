import { indexedDBversion, indexedDBName } from '../utils/constants';


const getDataFromIndexedDB = (store_names, count) => {
  return new Promise(async (resolve, reject) => {
    var request = window.indexedDB.open(indexedDBName, indexedDBversion);
    request.onsuccess = function (event) {
      var db = event.target.result;
      let calls = store_names.map(val => {
        let objectStore = db.transaction(val).objectStore(val);
        let myIndex = null;
        if (count) {
          myIndex = objectStore.getAll(null, count);
        } else {
          myIndex = objectStore.getAll()
        }
        // let value = [];
        return new Promise(async (resolve, reject) => {
          myIndex.onsuccess = function (event) {
            let result = event.target.result;
            // value = result;
            resolve(result)
          };
        })
      })
      Promise.all(calls).then(data => {
        resolve(data);
      })
        .catch(err => {
          console.log(err);
        })
    };
  })
}



const getDataIndex = () => {
  return new Promise(async (resolve, reject) => {
    var request = window.indexedDB.open(indexedDBName, indexedDBversion);

    request.onsuccess = function (event) {
      var db = event.target.result,
        objectStore = db.transaction('lineList').objectStore('lineList'),
        cursor = objectStore.index('LinelistIndex');
      var myIndex = cursor.getAll()
      myIndex.onsuccess = function (event) {
        let result = event.target.result.reverse()
        resolve(result);
        reject([]);
      };
    };
  })
}


const getDataFromkey = async (store_names, key) => {
  return new Promise(async (resolve, reject) => {
    var request = window.indexedDB.open(indexedDBName, indexedDBversion);
    request.onsuccess = function (event) {
      var db = event.target.result;
      let calls = store_names.map(val => {
        let objectStore = db.transaction(val).objectStore(val);
        let myIndex = objectStore.get(key)
        // let value = [];
        return new Promise(async (resolve, reject) => {
          myIndex.onsuccess = function (event) {
            let result = event.target.result;
            // value = result;
            resolve(result);
          };
        })
      })
      Promise.all(calls).then(data => {
        resolve(data);
      })
        .catch(err => {
          console.log(err);
        })
    };
  })
}


const getAllkey = async (store_names, key) => {
  return new Promise(async (resolve, reject) => {
    var request = window.indexedDB.open(indexedDBName, indexedDBversion);
    request.onsuccess = function (event) {
      var db = event.target.result;
      let calls = store_names.map(val => {
        let objectStore = db.transaction(val).objectStore(val);
        let myIndex = objectStore.getAllKeys();
        // let value = [];
        return new Promise(async (resolve, reject) => {
          myIndex.onsuccess = function (event) {
            let result = event.target.result;
            // value = result;
            resolve(result)
          };
        })
      })
      Promise.all(calls).then(data => {
        resolve(data);
      })
        .catch(err => {
          console.log(err);
        })
    };
  })
}


export {
  getDataFromIndexedDB,
  getDataFromkey,
  getAllkey,
  getDataIndex
}