import { GET_ERRORS, NO_ERRORS_DOWNLOAD_REPORT, NO_ERRORS_DOWNLOAD_LINELIST, NO_ERRORS_DOWNLOAD_LAB_REPORT, LINE_ENTRY_LIST, DRUG_INVENTORY_SUBMIT_STATUS } from './types';
import config from '../config';
import axios from 'axios';
import { drugsUtilisationSave, drugsReportSave } from '../utils/writeToOffline';

// const DRUG_REPORTS = 'drug_reports';

export const changePhc = (e, listItem) => dispatch => {
    console.clear();
    const sendobj = {
        phcData: e,
        result: listItem
    };
    axios
        .patch(`${config.apiURL}/api/phcchange`, sendobj)
        .then(data => {
            dispatch({
                type: LINE_ENTRY_LIST,
                payload: {
                    message: data.data.message,
                    status: 200
                }
            });
        })
        .catch(err => {
            dispatch({
                type: LINE_ENTRY_LIST,
                payload: {
                    message: `somethig went wrong`,
                    status: 400
                }
            });
        })
}

export const submitDrugInventory = (drugsList, user, receipt_date) => async dispatch => {
    // const DRUG_RECIEPT = 'drug_reciepts';
    if (navigator.onLine) {
        axios
            .post(`${config.apiURL}/api/druginventory`, { drugsList, user, receipt_date })
            .then(data => {
                dispatch({
                    type: DRUG_INVENTORY_SUBMIT_STATUS,
                    payload: {
                        message: data.data.message,
                        status: 200
                    }
                })
            })
            .catch(err => {
                dispatch({
                    type: DRUG_INVENTORY_SUBMIT_STATUS,
                    payload: {
                        message: "There was a problem in saving your data. Please contact admin",
                        status: 500,
                    }
                })
            })
    } else {
        let reciepts = { drugsList, user, receipt_date, isSyncedOnline: false };
        await drugsReportSave(reciepts);
        alert('Data save offline successfully');
        window.location.reload()
    }
}

export const submitPWCReportDrug = ({ servicesList, drugsList, patientCount, reportDate }) => async dispatch => {
    const newDrugList = drugsList.map((drug, i) => ({
        'drug_id': drug.drug_id,
        'drug_name': drug.drug_name,
        'opening': drug.opening ? drug.opening : 0,
        'received': drug.received ? drug.received : 0,
        'issued': drug.issued ? drug.issued : 0,
    }));
    if (navigator.onLine) {
        await axios
            .post(`${config.apiURL}/api/dailyReport/drug`, { drugsList: newDrugList, reportDate, patientCount })
            .then(data => {
                alert(data.data.response)
                window.location.reload();
            })
            .catch(err => {
                alert('There was a problem in saving the data.');
                window.location.reload();
            })
    } else await storeDrugReport(newDrugList, patientCount, reportDate);
}

export const storeDrugReport = async (newDrugList, patientCount, reportDate) => {
    let drugReports = {};
    drugReports = { newDrugList, patientCount, syncedOnline: false } ;
    await drugsUtilisationSave(drugReports);
    alert("data saved offline successfully");
    window.location.reload();
}

export const submitPWCReport = ({ servicesList, patientCount, reportDate, yogaSessions }) => dispatch => {
    const newServicesList = servicesList.map((service, i) => ({
        'service_id': service.service_id,
        'service_name': service.service_name,
        'male': service.male ? service.male : 0,
        'female': service.female ? service.female : 0,
        'total': service.total ? service.total : 0,
        'referred': service.referred ? service.referred : 0,
        'followup': service.followup ? service.followup : 0,
    }));
    axios
        .post(`${config.apiURL}/api/dailyReport/services`, { servicesList: newServicesList, reportDate, patientCount, yogaSessions })
        .then(data => {
            alert(data.data.response)
            window.location.reload();
        })
        .catch(err => {
            alert('There was a problem in saving the data.');
            window.location.reload();
        })
}
export const submitReport = (data) => dispatch => {
    if (data.reportType === 'nil') {
        data.feverCase.admittedYesterday.adult = 0;
        data.feverCase.admittedYesterday.child = 0;

        data.feverCase.dischargedYesterday.adult = 0;
        data.feverCase.dischargedYesterday.child = 0;

        data.feverCase.total.adult = 0;
        data.feverCase.total.child = 0;

        data.outPatient.total.adult = 0;
        data.outPatient.total.child = 0;

        data.dengueCase.admittedYesterday.lgM = 0;
        data.dengueCase.admittedYesterday.ns = 0;

        data.dengueCase.dischargedYesterday.lgM = 0;
        data.dengueCase.dischargedYesterday.ns = 0;

        data.dengueCase.total.lgM = 0;
        data.dengueCase.total.ns = 0;
    }
    const { dengueCase, feverCase, institutionId, outPatient, reportDate, reportType } = data;
    let errors = { createDailyReport: {} };
    if (reportType === null || reportType === undefined) {
        errors.createDailyReport.reportType = ' Please choose a report type';
    }
    if (institutionId === null || institutionId === undefined) {
        errors.createDailyReport.institutionId = 'Please select a insitution';
    }
    if (Object.keys(errors.createDailyReport).length > 0) {
        dispatch({
            type: GET_ERRORS,
            payload: errors
        });
    } else {
        const finalData = {
            reports: {
                dengueCase, feverCase, institutionId, outPatient, reportDate, reportType
            }
        }
        //send out data
        axios
            .post(`${config.apiURL}/api/dailyReport`, finalData)
            .then(data => {
                alert('success');
                window.location.reload();
            })
            .catch(err => {
                alert('There was a problem in saving the data.');
                // window.location.reload();
            })
    }
}

export const downloadDailyReport = (report) => dispatch => {
    let errors = { dwnldDailyRepAction: {} };
    if (report.institutionId === null || !report.institutionId.institution_id) {
        errors.dwnldDailyRepAction.institutionId = 'Please choose an institution';
    };
    if (Object.keys(errors.dwnldDailyRepAction).length > 0) {
        dispatch({
            type: GET_ERRORS,
            payload: errors
        });
    } else {
        dispatch({
            type: NO_ERRORS_DOWNLOAD_REPORT,
            payload: {
                institutionId: report.institutionId.institution_id,
                reportDate: report.reportDate,
            }
        })
    }
}

export const downloadLineList = (filter) => dispatch => {
    dispatch({
        type: NO_ERRORS_DOWNLOAD_LINELIST,
        payload: filter
    })
}

export const submitLabReport = (data) => dispatch => {
    if (data.reportType === 'nil') {
        data.chikungunya.culture.sample = 0;
        data.chikungunya.culture.positive = 0;

        data.chikungunya.lgmElisa.sample = 0;
        data.chikungunya.lgmElisa.positive = 0;

        data.chikungunya.others.sample = 0;
        data.chikungunya.others.positive = 0;

        data.chikungunya.pcr.sample = 0;
        data.chikungunya.pcr.positive = 0;

        data.dengue.lgmElisa.sample = 0;
        data.dengue.lgmElisa.positive = 0;

        data.dengue.lgmElisaNIV.sample = 0;
        data.dengue.lgmElisaNIV.positive = 0;

        data.dengue.lgmElisaRapid.sample = 0;
        data.dengue.lgmElisaRapid.positive = 0;

        data.dengue.nsElisa.sample = 0;
        data.dengue.nsElisa.positive = 0;

        data.dengue.other.sample = 0;
        data.dengue.other.positive = 0;

        data.leptospirosis.lgmElisa.sample = 0;
        data.leptospirosis.lgmElisa.positive = 0;

        data.leptospirosis.others.sample = 0;
        data.leptospirosis.others.positive = 0;

        data.malaria.peripheralSmearMP.sample = 0;
        data.malaria.peripheralSmearMP.positive = 0;

        data.malaria.rdt.sample = 0;
        data.malaria.rdt.positive = 0;

        data.scrubTyphus.lgmElisa.sample = 0;
        data.scrubTyphus.lgmElisa.positive = 0;

        data.scrubTyphus.others.sample = 0;
        data.scrubTyphus.others.positive = 0;

        data.scrubTyphus.lgmElisa.sample = 0;
        data.scrubTyphus.lgmElisa.positive = 0;

        data.scrubTyphus.others.sample = 0;
        data.scrubTyphus.others.positive = 0;

        data.swineFlu.others.sample = 0;
        data.swineFlu.others.positive = 0;

        data.swineFlu.swabTest.sample = 0;
        data.swineFlu.swabTest.positive = 0;
    }
    const { chikungunya, dengue, institutionId, leptospirosis, malaria, scrubTyphus, reportDate, reportType, swineFlu } = data;
    let errors = { createDailyLabReport: {} };
    if (institutionId === null || institutionId === undefined) {
        errors.createDailyLabReport.institutionId = 'Please select a insitution';
    }
    if (Object.keys(errors.createDailyLabReport).length > 0) {
        dispatch({
            type: GET_ERRORS,
            payload: errors
        });
    } else {
        const finalData = {
            reports: {
                chikungunya, dengue, institutionId, leptospirosis, malaria, scrubTyphus, reportDate, reportType, swineFlu
            }
        }
        //send out data
        axios
            .post(`${config.apiURL}/api/dailyReport/labreport`, finalData)
            .then(data => {
                alert('success');
                window.location.reload();
            })
            .catch(err => {
                alert('There was a problem in saving the data.');
                // window.location.reload();
            })
    }
}

export const downloadDailyLabReport = (report) => dispatch => {
    let errors = { dwnldDailyLabRepAction: {} };
    if (report.institutionId === null || !report.institutionId.institution_id) {
        errors.dwnldDailyLabRepAction.institutionId = 'Please choose an institution';
    };
    if (Object.keys(errors.dwnldDailyLabRepAction).length > 0) {
        dispatch({
            type: GET_ERRORS,
            payload: errors
        });
    } else {
        dispatch({
            type: NO_ERRORS_DOWNLOAD_LAB_REPORT,
            payload: {
                institutionId: report.institutionId.institution_id,
                reportDate: report.reportDate,
            }
        })
    }
}