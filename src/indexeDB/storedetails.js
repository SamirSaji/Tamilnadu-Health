import { indexedDBversion, indexedDBName } from '../utils/constants'

const storeDetails = (store_name) => {
  return new Promise(async (resolve, reject) => {
    var request = window.indexedDB.open(indexedDBName, indexedDBversion);
    request.onupgradeneeded = function (event) {
      var db = event.target.result;
      let storeList = Object.assign([], event.target.result.objectStoreNames, []);
      if (storeList.indexOf("countriesList") === -1) {
        db.createObjectStore("countriesList");
      }
      if (storeList.indexOf("diagnosis_masters") === -1) {
        db.createObjectStore("diagnosis_masters");
      }
      if (storeList.indexOf("drugsList") === -1) {
        db.createObjectStore("drugsList");
      }
      if (storeList.indexOf("labtest_masters") === -1) {
        db.createObjectStore("labtest_masters");
      }
      if (storeList.indexOf("phc_list") === -1) {
        db.createObjectStore("phc_list");
      }
      if (storeList.indexOf("servicesList") === -1) {
        db.createObjectStore("servicesList");
      }
      if (storeList.indexOf("specimensList") === -1) {
        db.createObjectStore("specimensList");
      }
      if (storeList.indexOf("symptomsList") === -1) {
        db.createObjectStore("symptomsList");
      }
      if (storeList.indexOf("allHeads") === -1) {
        const allheads = db.createObjectStore("allHeads");
        allheads.createIndex('allHeadsindex', "updated_at", { unique: false });
      }
      if (storeList.indexOf("allMembers") === -1) {
        const allmembers = db.createObjectStore("allMembers");
        allmembers.createIndex('allMembersindex', "updated_at", { unique: false });
      }
      if (storeList.indexOf("allCountriesMasters") === -1) {
        db.createObjectStore("allCountriesMasters");
      }
      if (storeList.indexOf("allDistrictsMasters") === -1) {
        db.createObjectStore("allDistrictsMasters");
      }
      if (storeList.indexOf("allStatesMasters") === -1) {
        db.createObjectStore("allStatesMasters");
      }
      if (storeList.indexOf("allVillagesMasters") === -1) {
        db.createObjectStore("allVillagesMasters");
      }

      if (storeList.indexOf("phc_masters") === -1) {
        db.createObjectStore("phc_masters");
      }
      if (storeList.indexOf("get_all_phc") === -1) {
        db.createObjectStore("get_all_phc");
      }
      if (storeList.indexOf("getValidMessages") === -1) {
        db.createObjectStore("getValidMessages");
      }
      if (storeList.indexOf("districtsList") === -1) {
        db.createObjectStore("districtsList");
      }
      if (storeList.indexOf("getPreviousServices") === -1) {
        db.createObjectStore("getPreviousServices");
      }
      if (storeList.indexOf("getpatientcount") === -1) {
        db.createObjectStore("getpatientcount");
      }
      if (storeList.indexOf("getDrugCount") === -1) {
        db.createObjectStore("getDrugCount");
      }
      if (storeList.indexOf("phc_status") === -1) {
        db.createObjectStore("phc_status");
      }
      if (storeList.indexOf("hsc_status") === -1) {
        db.createObjectStore("hsc_status");
      }
      if (storeList.indexOf("lineList") === -1) {
        const store = db.createObjectStore("lineList");
        store.createIndex('LinelistIndex', "updated_at", { unique: false });

      }
      if (storeList.indexOf("lineEntryVitals") === -1) {
        const lineEntry = db.createObjectStore("lineEntryVitals");
        lineEntry.createIndex('lineEntryVitalsIndex', "updated_at", { unique: false });
      }
      if (storeList.indexOf("syndromeList") === -1) {
        db.createObjectStore("syndromeList");
      }

      // offline lineEntry Data Store
      if (storeList.indexOf("newOfflineEntry") === -1) {
        db.createObjectStore("newOfflineEntry");
      }

      // drugreport store
      if (storeList.indexOf("yesterdayIssuesCount") === -1) {
        db.createObjectStore("yesterdayIssuesCount");
      }
      if (storeList.indexOf("getIssuesDrugCount") === -1) {
        db.createObjectStore("getIssuesDrugCount");
      }
      // offline save report
      if (storeList.indexOf("offlineReportData") === -1) {
        db.createObjectStore("offlineReportData");
      }

      // offline save hsc profile
      if (storeList.indexOf("offlineHscProfile") === -1) {
        db.createObjectStore("offlineHscProfile");
      }

      // offline phc profile update
      if (storeList.indexOf("offlinePhcProfile") === -1) {
        db.createObjectStore("offlinePhcProfile");
      }

      // offline Drug Utilisation
      if (storeList.indexOf("offlineDrugUtilisation") === -1) {
        db.createObjectStore("offlineDrugUtilisation");
      }

      // offline Drug Report
      if (storeList.indexOf("offlineDrugReport") === -1) {
        db.createObjectStore("offlineDrugReport");
      }
    }
    request.onsuccess = function (event) {
      var db = event.target.result;
      if (store_name) {
        let objectStore = db.transaction(store_name, 'readwrite').objectStore(store_name);
        let getCount = objectStore.count()
        resolve(new Promise(async (resolve, reject) => {
          getCount.onsuccess = function (event) {
            resolve({ storeCount: event.target.result });
          };
        }))
      } else {
        resolve({ "dbCount": event.target.result.objectStoreNames.length })
      }
    }
  })
}


export {
  storeDetails
}