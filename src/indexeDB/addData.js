import { indexedDBversion, indexedDBName } from '../utils/constants'

const addData = (store_name, array, saveData, type) => {

  return new Promise(async (resolve, reject) => {
    var request = window.indexedDB.open(indexedDBName, indexedDBversion);
    request.onsuccess = function (event) {
      var db = event.target.result;
      // let calls = store_names.map(val => {
      let objectStore = db.transaction(store_name, 'readwrite').objectStore(store_name);
      if (type === 1) {
        if (array) {
          Object.keys(array).map(async (val, i) => {
            objectStore.put(array[val], val).onsuccess = function (event) {
              resolve(true);
            };
          })
        }
      } else if (type === 2) {
        objectStore.put(array, saveData).onsuccess = function (event) {
          resolve(true);
        };
      } else if (type === 3) {
        if (array) {
          array.map(async (val, i) => {
            objectStore.put(val, i).onsuccess = function (event) {
              resolve(true);
            };
          })
        }
      } else {
        if (array) {
          array.map(async (val) => {
            if (type === 4) {
              val.updated_at = new Date(Number(val.updated_at));
            }
            objectStore.put(val, val[saveData]).onsuccess = function (event) {
              resolve(true);
            };
          })
        }
      }
    };
  })


}



const clearStore = async (store_names) => {
  return new Promise(async (resolve, reject) => {
    var request = window.indexedDB.open(indexedDBName, indexedDBversion);
    request.onsuccess = function (event) {
      var db = event.target.result;
      let calls = store_names.map(val => {
        let objectStore = db.transaction(val, 'readwrite').objectStore(val);
        let myIndex = objectStore.clear()
        let value = [];
        return new Promise(async (resolve, reject) => {
          myIndex.onsuccess = function (event) {
            resolve(true);
          };
        })
      })
      Promise.all(calls).then(data => {
        resolve(true);
      })
        .catch(err => {
          console.log(err);
        })
    };
  })
}


export {
  addData,
  clearStore
}