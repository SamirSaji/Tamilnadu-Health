import { indexedDBversion, indexedDBName } from '../utils/constants'


const deleteData = (store_name, deleteId) => {
    return new Promise(async (resolve, reject) => {
        var request = window.indexedDB.open(indexedDBName, indexedDBversion);
        request.onsuccess = function (event) {
            var db = event.target.result,
                objectStore = db.transaction(store_name, 'readwrite').objectStore(store_name);
            var myIndex = objectStore.delete(deleteId)
            myIndex.onsuccess = function (event) {
                resolve(true);
            };
        };
    })
}


export {
    deleteData
}