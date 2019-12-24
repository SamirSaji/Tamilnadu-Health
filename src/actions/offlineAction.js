import { entryListMapper } from "../utils/Common";
import { NewOflineEntry } from '../utils/writeToOffline';
import { getDataFromIndexedDB, getDataFromkey, getDataIndex } from '../indexeDB/getData';
const LINEENTRIES = 'lineEntries', ALLHEADS = 'allHeads', ALLUSERS = 'allUsers', ENTRYVISIT = 'entry_vitals';

export const getFamilyMembers = async (e, changes) => {
    console.error(new Date().getTime())
    let list = await getDataFromIndexedDB(["allHeads"], 100);
    let filteredHeads = [], filteredMembers = [];
    if (list) {
        filteredHeads = list[0];
    }
    let byEnglishHead = { nodes: filteredHeads }, byEnglishMember = { nodes: filteredMembers };
    return { byEnglishHead, byEnglishMember }
}

export const getSelectedFamilyMembers = async (headId) => {
    let familyMembers = [];
    let list = await getDataFromIndexedDB(["allHeads"], 100);
    let hData = list[0];
    hData = hData.find(_ => _.headId === headId);
    return { memData: familyMembers, hData };
}

export const getMemberDetails = (id, type = '') => {
    if (type === 'entrydata') {
        const entry = JSON.parse(localStorage.getItem(LINEENTRIES))[id];
        id = entry ? entry.memberData.nodeId ? entry.memberData.nodeId : entry.newVisitMemberData.nodeId : id;
    }
    const heads = JSON.parse(localStorage.getItem(ALLHEADS)), users = JSON.parse(localStorage.getItem(ALLUSERS));
    const headUser = heads.nodes.find(_ => _.nodeId === id),
        user = users.nodes.find(_ => _.nodeId === id);
    if (headUser) {
        if (type === 'entrydata') {
            return {
                user_pds_line: {
                    ...headUser,
                    name: `${headUser.headEngName}/${headUser.headName}`,
                    type: 'head',
                    master_registry_user_id: headUser.headId,
                }
            }
        } else return headUser;
    } else {
        if (type === 'entrydata') {
            return {
                user_pds_line: {
                    ...user,
                    name: `${user.memberName}/${user.memberEngName}`,
                    type: 'member',
                    master_registry_user_id: user.memberId,
                }
            }
        } else return user;
    }
}

export const getMembernodeId = (id, type = '') => {
    let vitals = JSON.parse(localStorage.getItem(ENTRYVISIT));
    let entryVital = vitals.vitals.find(k => k.entry_id === id);
    let user_pds_line = entryVital ? entryVital.user_pds_line : {}
    let value = {
        user_pds_line: {
            ...user_pds_line,
            entry_id: id,
        }
    }
    return value;
}

export const updateEntryOffline = async (lineEntry) => {
    try {
        let entryId = lineEntry.entry_id ? lineEntry.entry_id : lineEntry.id_number;
        let lineEntryEdit = await getDataFromkey(["lineList"], entryId)
        if (lineEntryEdit[0]) {
            lineEntry.syncedOnline = false;
        }
        await NewOflineEntry(lineEntry, entryId)
        return true;
    } catch (err) { alert('Erro inserting offline'); return false; }
}
export const saveEntryOffline = async (lineEntry) => {
    try {
        if (lineEntry.newVisitMemberData) {
            if (!lineEntry.memberData || (lineEntry.memberData && !lineEntry.memberData.name)) {
                let entryId = document.location ? document.location.pathname.replace('/UHC/newvisit/', '') : lineEntry.id_number;
                let entryData = await getDataFromkey(["lineList"], entryId)
                if (entryData[0]) {
                    entryData = entryData[0].user_pds_line
                    lineEntry.memberData = {
                        ...lineEntry.memberData,
                        name: entryData.name,
                        label: entryData.name,
                        engName: entryData.name,
                        gender: entryData.gender,
                        aadharCard: entryData.aadhar_no,
                        age: entryData.age,
                        addressLine: entryData.constructed_address,
                        mobileNo: entryData.mobileno
                    }
                    if (lineEntry.newVisitMemberData.addressLine) {
                        lineEntry.newVisitMemberData.addressLine = entryData.constructed_address;
                        lineEntry.newVisitMemberData.name = entryData.name;
                    }
                } else {
                    let offlineentry = await getDataFromkey(["newOfflineEntry"], entryId);
                    if (offlineentry[0]) {
                        offlineentry = JSON.parse(offlineentry[0]);
                        lineEntry.memberData = offlineentry.memberData;
                    }
                }
            }
            lineEntry.memberData = { ...lineEntry.newVisitMemberData, ...lineEntry.memberData }
        } else {
            let CountryName = "", stateName = "", districtName = "", VillageName = "";
            if (document.getElementsByClassName("getCountry").length > 0) {
                CountryName = document.getElementsByClassName("getCountry")[0].firstElementChild.firstElementChild.firstElementChild.innerText
            }
            if (document.getElementsByClassName("getState").length > 0) {
                stateName = document.getElementsByClassName("getState")[0].firstElementChild.firstElementChild.firstElementChild.innerText
            }
            if (document.getElementsByClassName("getDistrict").length > 0) {
                districtName = document.getElementsByClassName("getDistrict")[0].firstElementChild.firstElementChild.firstElementChild.innerText
            }
            VillageName = lineEntry.addressDetails.permanentAddress.village ? lineEntry.addressDetails.permanentAddress.village[0].label : "";
            let addressDetails = `${VillageName ? VillageName : ""},${districtName ? districtName : ""},${stateName ? stateName : ""},${CountryName ? CountryName : ""}`
            lineEntry.memberData = {
                ...lineEntry.memberData,
                name: lineEntry.patientDetails.patientTamilName,
                label: lineEntry.patientDetails.patientName,
                engName: lineEntry.patientDetails.patientName,
                gender: lineEntry.patientDetails.gender,
                age: lineEntry.patientDetails.age,
                addressLine: addressDetails
            }
        }
        let saveId = lineEntry.entry_id ? lineEntry.entry_id : lineEntry.id_number
        await NewOflineEntry(lineEntry, saveId)
        return true
    }
    catch (err) { alert('Error inserting offline'); return false; }
}

export const offlineEntryList = async () => {
    const entriesMapper = (entry) => {
        const { memberData, diseaseCondition } = entry;
        let patient_diagnos_entry = diseaseCondition.map(patient_diagno => ({ patient_diagno }));
        return entryListMapper(entry, memberData, patient_diagnos_entry);
    }
    let listItem = await getDataIndex();
    // let listItem = await getDataFromIndexedDB(["lineList"]);
    let OffLineEntry = await getDataFromIndexedDB(['newOfflineEntry']);
    if (Object.entries(OffLineEntry).length > 0) {
        OffLineEntry = OffLineEntry[0].map(val => JSON.parse(val))
        OffLineEntry = OffLineEntry.map(entriesMapper);
    }
    let list = OffLineEntry.concat(listItem)
    return list
}

export const mapOfflineEntryToEdit = async (entryId, userName, type) => {
    let entry = {};
    let offlinelistData = null;
    offlinelistData = await getDataFromkey(["newOfflineEntry"], entryId)
    offlinelistData = offlinelistData[0]
    if (offlinelistData) {
        offlinelistData = JSON.parse(offlinelistData)
    }
    entry = offlinelistData;
    if (entry) {
        entry = {
            user_pds_line: {
                name: entry.memberData.headEngName,
                type: entry.memberData.type,
                master_registry_user_id: entry.memberData.nodeId
            },
            visit_date: entry.visitDate,
            outcome: entry.diagnosisDetails.outcome,
            general_remarks: entry.generalRemarks,
            outcome_date: entry.diagnosisDetails.outComeDate,
            visit_id: entry.id_number,
            vital_weight: entry.vitalsDef.weight,
            id: entry.generated_ID,
            entry_id: entry.id_number,
            advices: entry.remarks ? entry.remarks.map(rem => rem.value).join('**') : "",
            vital_hip: entry.vitalsDef.hip,
            vital_waist: entry.vitalsDef.waist,
            vital_resprate: entry.vitalsDef.resprate,
            rfrd_phc_name: {
                phc_name: entry.referredPhc ? entry.referredPhc.institution_name : userName ? userName : null
            },
            phc_patient_det: {
                phc_name: userName ? userName : null
            },
            vital_height: entry.vitalsDef.height,
            vital_pulse: entry.vitalsDef.pulse,
            vital_temperature: entry.vitalsDef.temperature,
            vital_bloodPressureUp: entry.vitalsDef.bloodPressureUp,
            vital_bloodPressureDown: entry.vitalsDef.bloodPressureDown,
            patient_diagnos_entry: entry.diseaseCondition ? entry.diseaseCondition : [],
            patient_drug_entry: entry.drugsList ? entry.drugsList : [],
            patient_lab_entry: entry.labResultDetails.listOfResults.map
                ? entry.labResultDetails
                    .listOfResults.map(_ => ({
                        ..._,
                        test_date: _.userData.dateOfAdmission ? _.userData.dateOfAdmission : entry.visitDate,
                        result: _.userData.labResult,
                        remarks: _.userData.remarks ? _.userData.remarks : ''
                    }))
                : []
        }
    } else {
        let linelistData = await getDataFromkey(["lineList"], entryId);
        let lineentryVitals = await getDataFromkey(["lineEntryVitals"], entryId);
        debugger
        linelistData = linelistData[0];
        lineentryVitals = lineentryVitals[0];
        let user_pds_line = lineentryVitals ? lineentryVitals.user_pds_line : linelistData.user_pds_line ? linelistData.user_pds_line : {};
        entry = {
            ...linelistData,
            user_pds_line: {
                ...user_pds_line
            },
            visit_date: linelistData.visitDate,
            rfrd_phc_name: {
                phc_name: linelistData.referred_phc
            },
            ...lineentryVitals,
        }
    }
    if (type === "newVisit") {
        let user_pds_line = entry.user_pds_line;
        let memberNode = {
            user_pds_line: {
                ...user_pds_line,
                entry_id: entryId,
            }
        }
        return { entry, memberNode };
    } else {
        return entry;
    }
}