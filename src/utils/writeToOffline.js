import { addData, clearStore } from '../indexeDB/addData';

export const LINEENTRIES = 'lineEntries', DRUG_REPORTS = 'drug_reports',
    REPORT_LIST = 'report_list', ALLHEADS = 'allHeads',
    ALLUSERS = 'allUsers', DRUG_LIST = 'drugsList', DRUG_RECIEPT = 'drug_reciepts',
    PHC_STATUS = 'phc_status', HSC_STATUS = 'hsc_profile',
    APP_LAST_ONLINE = 'last_time', LINE_ENRIES = 'line_entry_list', REPORTDATA = 'report_data',
    DRUGREPORTDATA = 'drugreportdata', DATA = 'data',
    LOCATIONDATA = 'locationdata', LISTDATA = 'listData';

const setLocalData = (key, data) => localStorage.setItem(key, JSON.stringify((data)));

const writeToOffline = async  ({ data }) => {
    // console.info('OFFLINEDATA', data)
    let { getPreviousServices, getpatientcount, getDrugCount, getPhcData, getHWCData } = data;
    await addData('getPreviousServices', getPreviousServices, "diagnosis_id");
    await addData('getpatientcount', getpatientcount, "", 1);
    await clearStore(["getDrugCount"]);
    await addData('getDrugCount', getDrugCount, "drug_id");
    await addData('phc_status', getPhcData, "", 1);
    await addData('hsc_status', getHWCData, "", 1);
    // setLocalData(DRUGREPORTDATA, { getIssuesDrugCount })
    // setLocalData(LINE_ENRIES, lineListNew);
    // ENTRY VITALS
    // setLocalData(HSC_STATUS, {
    //     status: {},
    //     syncdate: new Date()
    // })
}

// store master datas

export const storeMasterDatas = (data) => {
    let {
        countriesList, diagnosis_masters, drugsList,
        labtest_masters, phc_list, servicesList,
        specimensList, symptomsList, syndromeList
    } = data;
    if (Object.keys(data).length > 0) {
        addData('countriesList', countriesList, "country_id");
        addData('diagnosis_masters', diagnosis_masters, "diagnosis_id");
        addData('drugsList', drugsList, "drug_id");
        addData('labtest_masters', labtest_masters, "test_id");
        addData('phc_list', phc_list, "phc_id");
        addData('servicesList', servicesList, "service_id");
        addData('specimensList', specimensList, "specimen_id");
        addData('symptomsList', symptomsList, "symptom_id");
        addData('syndromeList', syndromeList, "syndrome_id");
    }

}


export const dataList = async (data) => {
    let { getValidMessages, phc_masters, get_all_phc, districtsList } = data;
    if (Object.keys(data).length > 0) {
        await clearStore(["phc_masters"])
        await addData('phc_masters', phc_masters, "phc_id");
        await addData('get_all_phc', get_all_phc, "phc_id");
        await addData('getValidMessages', getValidMessages, "validation_id");
        await addData('districtsList', districtsList, "district_id");
    }
}

//lineListPage get offlien list
export const lineEntryList = async (lineList) => {
    await addData('lineList', lineList, "entry_id", 4);
}
//lineListPage get offlien vitals
export const lineEntryVitals = async (vitals) => {
    await addData('lineEntryVitals', vitals, "entry_id");
}


// report page get all data
export const reportPageStoreData = async (data) => {
    let { drugsList, servicesList, getPreviousServices, getpatientcount } = data;
    if (Object.keys(data).length > 0) {
        addData('drugsList', drugsList, "drug_id");
        if (getPreviousServices.length > 0) {
            addData('getPreviousServices', getPreviousServices, "diagnosis_id");
        } else {
            await clearStore(["getPreviousServices"])
        }
        addData('getpatientcount', getpatientcount, "", 1);
        addData('servicesList', servicesList, "service_id");
    }
}

// drugreceipt page get all list
export const drugReceiptList = (drugsList) => {
    addData('drugsList', drugsList, "drug_id");
}


//drugreport list data
export const drugReportData = async (data) => {
    let { servicesList, getpatientcount, drugsList, yesterdayIssuesCount, getIssuesDrugCount, getDrugCount } = data;
    if (Object.keys(data).length > 0) {
        await addData('servicesList', servicesList, "service_id");
        await addData('drugsList', drugsList, "drug_id");
        await clearStore(["getpatientcount"]);
        await addData('getpatientcount', getpatientcount, "", 1);
        await clearStore(["yesterdayIssuesCount"]);
        await addData('yesterdayIssuesCount', yesterdayIssuesCount, "drug_id", 3);
        await clearStore(["getIssuesDrugCount"]);
        await addData('getIssuesDrugCount', getIssuesDrugCount, "drug_id");
        await clearStore(["getDrugCount"]);
        await addData('getDrugCount', getDrugCount, "drug_id");
    }
}

//phcStatus to get list
export const phcStatusList = async (data) => {
    let { getPhcData } = data;
    await clearStore(["phc_status"]);
    await addData('phc_status', getPhcData, "", 1);
}


// hscStatus to get list
export const hscStatusList = async (data) => {
    let { getHWCData } = data;
    await clearStore(["hsc_status"]);
    await addData('hsc_status', getHWCData, "", 1);
}
// offline new entries
export const NewOflineEntry = async (entries, storeKeyName) => {
    await addData('newOfflineEntry', JSON.stringify(entries), storeKeyName, 2);
}

// offline report page submit 
export const ReportDataSave = async (entries, storeKeyName = "onlineSync") => {
    await addData('offlineReportData', JSON.stringify(entries), storeKeyName, 2);
}

// offline hsc profile update
export const hscProfileSave = async (entries, storeKeyName = "onlineSync") => {
    await addData('offlineHscProfile', JSON.stringify(entries), storeKeyName, 2);
}

// offline phc profile update
export const phcProfileSave = async (entries, storeKeyName = "onlineSync") => {
    await addData('offlinePhcProfile', JSON.stringify(entries), storeKeyName, 2);
}

// offline Drug Utilisation
export const drugsUtilisationSave = async (entries, storeKeyName = "onlineSync") => {
    await addData('offlineDrugUtilisation', JSON.stringify(entries), storeKeyName, 2);
}

// offline Drug Report
export const drugsReportSave = async (entries, storeKeyName = "onlineSync") => {
    await addData('offlineDrugReport', JSON.stringify(entries), storeKeyName, 2);
}

export default writeToOffline;