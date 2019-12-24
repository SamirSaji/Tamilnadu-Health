import config from '../config';
import axios from 'axios';
import { request } from 'graphql-request';
import { getDataFromIndexedDB } from '../indexeDB/getData';
import { deleteData } from '../indexeDB/deleteData';
import { lineEntryAction } from '../components/common/functions/lineentryFunctions';
import { DRUG_REPORTS } from '../utils/constants';

export const upSyncEntries = async () => {
    let offlineEntries = await getDataFromIndexedDB(['newOfflineEntry']), entries = [];
    if (!offlineEntries[0]) {
        return;
    } else {
        entries = offlineEntries[0].map(val => { return JSON.parse(val) });
    }
    const entryPromises = entries.map(async (lineEntry, i) => {
        if (lineEntry.syncedOnline) return;
        const districtId = lineEntry.addressDetails.permanentAddress.district;
        const isMemberCreate = lineEntry.memberData && lineEntry.memberData.isNewMember && lineEntry.memberData.isNewMember === true;
        await lineEntryAction(lineEntry, isMemberCreate, districtId, true);
    });
    return Promise.all(entryPromises).then(() => {
    }).catch(err => {
        console.log(err);
    });
}

export const upsyncReports = async () => {
    let drugReports = await getDataFromIndexedDB(['offlineReportData']),
        entries = [],
        url = `${config.apiURL}/api/dailyReport/services`;
    if (!drugReports[0].length > 0) return
    else {
        entries = drugReports[0];
        entries = entries.map(val => {
            return JSON.parse(val)
        })
    }
    const reportPromises = entries.map((entry, i) => {
        if (entry.syncedOnline) return;
        let { servicesList, patientCount, reportDate, yogaSessions } = entry;
        return axios
            .post(url, { servicesList, patientCount, reportDate, yogaSessions })
            .then(() => {

            })
            .catch(err => {
                console.log(err)
            })
    })

    return Promise.all(reportPromises).then(async () => {
        await deleteData('offlineReportData', 'onlineSync');
    }).catch(err => {
        console.log(err)
    })
}

export const upSyncDrugReciepts = async (authData) => {
    let drugReciepts = await getDataFromIndexedDB(["offlineDrugReport"]);
    let drugList = [], entries = [], keys = [];
    const url = `${config.apiURL}/api/druginventory`;
    if (!drugReciepts[0][0]) return
    else {
        entries = drugReciepts[0].map(val => {
            return JSON.parse(val);
        })
    }
    const recieptPromises = entries.map((entry, i) => {
        return axios.post(url, entry)
            .then(async (data) => {
                await deleteData('offlineDrugReport', 'onlineSync')
                // console.log(`UPSYNCED RECORD ${i} of ${entries.length}`);
            })
            .catch(err => () => {
                console.info('error', err);
            })
    })

    return Promise.all(recieptPromises).then(async (data) => {

    }).catch(err => {
        console.log(err);
    })
}


export const upSyncDrugReports = async (authData) => {
    let drugReports = await getDataFromIndexedDB(["offlineDrugUtilisation"])
    let entries = [], keys = [];
    const url = `${config.apiURL}/api/dailyReport/drug`;
    if (!drugReports[0][0]) return
    else {
        entries = drugReports[0].map(val => {
            return JSON.parse(val)
        })
    }
    const reportPromises = entries.map((entry, i) => {
        return axios.post(url, { ...entry, drugsList: entry.newDrugList, reportDate: new Date() })
            .then(async (data) => {
                // console.log(`UPSYNCED RECORD ${i + 1} of ${entries.length}`);
                await deleteData('offlineDrugUtilisation', 'onlineSync')
            })
            .catch(err => () => {
                console.log(`ERROR UPSYNCING RECORD ${i + 1} of ${entries.length}`);
                console.info('error', err);
            })
    })

    return Promise.all(reportPromises).then(async (data) => {

    }).catch(err => {
        localStorage.setItem(DRUG_REPORTS, JSON.stringify(drugReports))
        console.log('Error Syncing records');
    })
}

export const upSyncPhcEntries = async (user_id) => {
    let phcEntries = await getDataFromIndexedDB(["offlinePhcProfile"]),
        entries = [], key = [];
    const url = `${config.apiURL}/graphql`;
    if (!phcEntries[0][0]) return
    else {
        entries = phcEntries[0].map(val => {
            return JSON.parse(val)
        })
    }

    // const shouldNotSync = new Date(phcEntries.syncDate) > new Date() && !navigator.onLine;

    // if (shouldNotSync) return;

    const phcEntryPromises = entries.map((phcStatus, i) => {
        // if (phcStatus.isSyncedOnline) return;
        const query = phcReportQuery(user_id, phcStatus);
        return request(url, query)
            .then(async () => {
                // console.log("saved sucess")
                await deleteData('offlinePhcProfile', 'onlineSync')
                // phcEntries[key[i]].isSyncedOnline = true;
                // console.info(`INSERTED ${i} of ${entries.length}`)
            })
            .catch(err => console.error('SOMETHING WENT WRONG'));
    })

    return Promise.all(phcEntryPromises)
        .then(() => {
            // console.info('ENTRIES UPDATED FOR ALL');
            // localStorage.setItem(PHC_STATUS, JSON.stringify(phcEntries))
        })
        .catch(err => {
            // console.info('ERROR IN UPDATING ENTRIES')
            // localStorage.setItem(PHC_STATUS, JSON.stringify(phcEntries))
        });

}

export const upSyncHscEntries = async (user_id) => {
    let hscEntries = await getDataFromIndexedDB(['offlineHscProfile']), entries = [];
    const url = `${config.apiURL}/graphql`;
    if (!hscEntries[0][0]) return
    else {
        entries = hscEntries[0];
        entries = entries.map(val => {
            return JSON.parse(val)
        });
    }
    const hsccEntryPromises = entries.map((hscStatus, i) => {
        const query = hscReportQuery(user_id, hscStatus.getHWCData);
        return request(url, query)
            .then(() => { })
            .catch(err => console.error('SOMETHING WENT WRONG'));
    })
    return Promise.all(hsccEntryPromises)
        .then(async () => {
            await deleteData('offlineHscProfile', 'onlineSync')
        })
        .catch(err => {
            console.log("ERROR UPDATING HSC PROFILE" + err);
        });

}


export const hscReportQuery = (user_id, hwcStatus) => `
mutation{
  updateHWCStatus(
    user_id:"${user_id}"
    in_aug_date:${
    hwcStatus.in_aug_date
        ? `"${hwcStatus.in_aug_date}"`
        : null
    }
    total_hr:${hwcStatus.total_hr ? hwcStatus.total_hr : null}
    vhn_in_pos:${
    hwcStatus.vhn_in_pos ? `"${hwcStatus.vhn_in_pos}"` : null
    }
    name_vhn: ${hwcStatus.name_vhn ? ""+hwcStatus.name_vhn : null}
    gender_mhlp:${
    hwcStatus.gender_mhlp ? `"${hwcStatus.gender_mhlp}"` : null
    }
    type_of_mhlp:${
    hwcStatus.type_of_mhlp ? `"${hwcStatus.type_of_mhlp}"` : null
    }
    mpw_f:${hwcStatus.mpw_f ? hwcStatus.mpw_f : null}
    mpw_m:${hwcStatus.mpw_m ? hwcStatus.mpw_m : null}
    asha:${hwcStatus.asha ? hwcStatus.asha : null}
    no_fem_health_vol:${hwcStatus.no_fem_health_vol ? hwcStatus.no_fem_health_vol : null}
    vhn_one_train_stat:${
    hwcStatus.vhn_one_train_stat
        ? `"${hwcStatus.vhn_one_train_stat}"`
        : null
    }
    asha_traing_status:${
    hwcStatus.asha_traing_status
        ? `"${hwcStatus.asha_traing_status}"`
        : null
    }
    pop_enum_started:${
    hwcStatus.pop_enum_started
        ? `"${hwcStatus.pop_enum_started}"`
        : null
    }
    pop_coverage:${hwcStatus.pop_coverage ? hwcStatus.pop_coverage : null}
    indi_enum_till:${hwcStatus.indi_enum_till ? hwcStatus.indi_enum_till : null}
    screen_start_diabetes:${
    hwcStatus.screen_start_diabetes
        ? `"${hwcStatus.screen_start_diabetes}"`
        : null
    }
    screen_start_hyperten:${
    hwcStatus.screen_start_hyperten
        ? `"${hwcStatus.screen_start_hyperten}"`
        : null
    }
    screen_start_oral_can:${
    hwcStatus.screen_start_oral_can
        ? `"${hwcStatus.screen_start_oral_can}"`
        : null
    }
    screen_start_breast_can:${
    hwcStatus.screen_start_breast_can
        ? `"${hwcStatus.screen_start_breast_can}"`
        : null
    }
    screen_start_cervical_can:${
    hwcStatus.screen_start_cervical_can
        ? `"${hwcStatus.screen_start_cervical_can}"`
        : null
    }
    yoga_session:${
    hwcStatus.yoga_session ? `"${hwcStatus.yoga_session}"` : null
    }
    med_avail:${hwcStatus.med_avail ? `"${hwcStatus.med_avail}"` : null}
    screen_diabetes_examined:${hwcStatus.screen_diabetes_examined ? hwcStatus.screen_diabetes_examined : null}
    screen_oral_can_examined:${hwcStatus.screen_oral_can_examined ? hwcStatus.screen_oral_can_examined : null}
    screen_breast_can_examined:${hwcStatus.screen_breast_can_examined ? hwcStatus.screen_breast_can_examined : null}
    screen_cervical_can_examined:${hwcStatus.screen_cervical_can_examined ? hwcStatus.screen_cervical_can_examined : null}
    diag_avail:${
    hwcStatus.diag_avail ? `"${hwcStatus.diag_avail}"` : null
    }
    gluco_app_count:${
    hwcStatus.gluco_app_count
        ? `"${hwcStatus.gluco_app_count}"`
        : null
    }
    bp_app_count:${hwcStatus.bp_app_count ? hwcStatus.bp_app_count : null}
    tab_avail:${hwcStatus.tab_avail ? hwcStatus.tab_avail : null}
    laptop_avail:${hwcStatus.laptop_avail ? hwcStatus.laptop_avail : null}
    net_connect:${
    hwcStatus.net_connect ? `"${hwcStatus.net_connect}"` : null
    }
    infra_completed:${
    hwcStatus.infra_completed
        ? `"${hwcStatus.infra_completed}"`
        : null
    }
    building_type:${
    hwcStatus.building_type ? `"${hwcStatus.building_type}"` : null
    }
    phc_painted:${
    hwcStatus.phc_painted ? `"${hwcStatus.phc_painted}"` : null
    }
    chairs_avail:${
    hwcStatus.chairs_avail ? `"${hwcStatus.chairs_avail}"` : null
    }
    store_med:${hwcStatus.store_med ? `"${hwcStatus.store_med}"` : null}
    two_lang_phc:${
    hwcStatus.two_lang_phc ? `"${hwcStatus.two_lang_phc}"` : null
    }
    func_toilet_avail:${
    hwcStatus.func_toilet_avail
        ? `"${hwcStatus.func_toilet_avail}"`
        : null
    }
    water_avail:${
    hwcStatus.water_avail ? `"${hwcStatus.water_avail}"` : null
    }
    power_backup:${
    hwcStatus.power_backup ? `"${hwcStatus.power_backup}"` : null
    }
    mode_of_vhn:${
    hwcStatus.mode_of_vhn ? `"${hwcStatus.mode_of_vhn}"` : null
    }
    mlp_training_status:${
    hwcStatus.mlp_training_status
        ? `"${hwcStatus.mlp_training_status}"`
        : null
    }
    isp:${hwcStatus.isp ? `"${hwcStatus.isp}"` : null}
    bpApparatusManual : ${hwcStatus.bpApparatusManual ? `"${hwcStatus.bpApparatusManual}"` : null}
    bpApparatusElectronic : ${hwcStatus.bpApparatusElectronic ? `"${hwcStatus.bpApparatusElectronic}"` : null}
    bpPregnancyLargecuff : ${hwcStatus.bpPregnancyLargecuff ? `"${hwcStatus.bpPregnancyLargecuff}"` : null}
    stethoscope : ${hwcStatus.stethoscope ? `"${hwcStatus.stethoscope}"` : null}
    inchTape : ${hwcStatus.inchTape ? `"${hwcStatus.inchTape}"` : null}
    weighingMachineAdult : ${hwcStatus.weighingMachineAdult ? `"${hwcStatus.weighingMachineAdult}"` : null}
    weighingMachinePaediatric : ${hwcStatus.weighingMachinePaediatric ? `"${hwcStatus.weighingMachinePaediatric}"` : null}
    heightScale : ${hwcStatus.heightScale ? `"${hwcStatus.heightScale}"` : null}
    torchLight : ${hwcStatus.torchLight ? `"${hwcStatus.torchLight}"` : null}
    thermometerMercury : ${hwcStatus.thermometerMercury ? `"${hwcStatus.thermometerMercury}"` : null}
    thermometerElectronic : ${hwcStatus.thermometerElectronic ? `"${hwcStatus.thermometerElectronic}"` : null}
    hubCutter : ${hwcStatus.hubCutter ? `"${hwcStatus.hubCutter}"` : null}
    bowls : ${hwcStatus.bowls ? `"${hwcStatus.bowls}"` : null}
    plasticTray : ${hwcStatus.plasticTray ? `"${hwcStatus.plasticTray}"` : null}
    fetoscope : ${hwcStatus.fetoscope ? `"${hwcStatus.fetoscope}"` : null}
    fetalDoppler : ${hwcStatus.fetalDoppler ? `"${hwcStatus.fetalDoppler}"` : null}
    haemoglobinometer : ${hwcStatus.haemoglobinometer ? `"${hwcStatus.haemoglobinometer}"` : null}
    doubleRackSterilizer : ${hwcStatus.doubleRackSterilizer ? `"${hwcStatus.doubleRackSterilizer}"` : null}
    stainlessSteelTray : ${hwcStatus.stainlessSteelTray ? `"${hwcStatus.stainlessSteelTray}"` : null}
    stainlessSteelTrayCover : ${hwcStatus.stainlessSteelTrayCover ? `"${hwcStatus.stainlessSteelTrayCover}"` : null}
    kidneyTray : ${hwcStatus.kidneyTray ? `"${hwcStatus.kidneyTray}"` : null}
    arteryForceps : ${hwcStatus.arteryForceps ? `"${hwcStatus.arteryForceps}"` : null}
    dissectingForceps : ${hwcStatus.dissectingForceps ? `"${hwcStatus.dissectingForceps}"` : null}
    spongeHoldingForceps : ${hwcStatus.spongeHoldingForceps ? `"${hwcStatus.spongeHoldingForceps}"` : null}
    vulsellum : ${hwcStatus.vulsellum ? `"${hwcStatus.vulsellum}"` : null}
    scissors : ${hwcStatus.scissors ? `"${hwcStatus.scissors}"` : null}
    speculumBig : ${hwcStatus.speculumBig ? `"${hwcStatus.speculumBig}"` : null}
    speculumSmall : ${hwcStatus.speculumSmall ? `"${hwcStatus.speculumSmall}"` : null}
    silverBasin : ${hwcStatus.silverBasin ? `"${hwcStatus.silverBasin}"` : null}
    mucusSucker : ${hwcStatus.mucusSucker ? `"${hwcStatus.mucusSucker}"` : null}
    spiritLamp : ${hwcStatus.spiritLamp ? `"${hwcStatus.spiritLamp}"` : null}
    breastPump : ${hwcStatus.breastPump ? `"${hwcStatus.breastPump}"` : null}
    examinationTable : ${
    hwcStatus.examinationTable ? `${hwcStatus.examinationTable}` : null
    }
    steelBench : ${
    hwcStatus.steelBench ? `${hwcStatus.steelBench}` : null
    }
    plasticchair : ${
    hwcStatus.plasticchair ? `${hwcStatus.plasticchair}` : null
    }
    table : ${
    hwcStatus.table ? `${hwcStatus.table}` : null
    }
    almirahBureau : ${
    hwcStatus.almirahBureau ? `${hwcStatus.almirahBureau}` : null
    }
    stool : ${
    hwcStatus.stool ? `${hwcStatus.stool}` : null
    }
    footStool : ${
    hwcStatus.footStool ? `${hwcStatus.footStool}` : null
    }
    dustbinBMWMRed : ${
    hwcStatus.dustbinBMWMRed ? `${hwcStatus.dustbinBMWMRed}` : null
    }
    bustbinBMWMBlack : ${
    hwcStatus.bustbinBMWMBlack ? `${hwcStatus.bustbinBMWMBlack}` : null
    }
    dustbinBMWMYellow : ${
    hwcStatus.dustbinBMWMYellow ? `${hwcStatus.dustbinBMWMYellow}` : null
    }
    dustbinBMWMBlue : ${
    hwcStatus.dustbinBMWMBlue ? `${hwcStatus.dustbinBMWMBlue}` : null
    }
    dustbinOthers : ${
    hwcStatus.dustbinOthers ? `${hwcStatus.dustbinOthers}` : null
    }
    cot : ${
    hwcStatus.cot ? `${hwcStatus.cot}` : null
    }
    gasStove : ${
    hwcStatus.gasStove ? `${hwcStatus.gasStove}` : null
    }
    gasCyclinder : ${
    hwcStatus.gasCyclinder ? `${hwcStatus.gasCyclinder}` : null
    }
    emergnecyChargerLight : ${
    hwcStatus.emergnecyChargerLight ? `${hwcStatus.emergnecyChargerLight}` : null
    }
    ) {
  id
}
}
`;

export const phcReportQuery = (user_id, phcStatus) => `
mutation{
  updatePHCStatus(
    user_id:"${user_id}"
    in_aug_date:${
    phcStatus.in_aug_date ? `"${phcStatus.in_aug_date}"` : null
    }
    total_hr:${phcStatus.total_hr ? phcStatus.total_hr : null}
    mbbs_ms:${phcStatus.mbbs_ms ? phcStatus.mbbs_ms : null}
    staff_nurse:${phcStatus.staff_nurse ? phcStatus.staff_nurse : null}
    no_anm_mpw:${phcStatus.no_anm_mpw ? phcStatus.no_anm_mpw : null}
    mpw:${phcStatus.mpw ? phcStatus.mpw : null}
    no_of_lab_tech:${
    phcStatus.no_of_lab_tech ? phcStatus.no_of_lab_tech : null
    }
    no_of_pharm:${phcStatus.no_of_pharm ? phcStatus.no_of_pharm : null}
    asha:${phcStatus.asha ? phcStatus.asha : null}
    staff_nurse_com:${
    phcStatus.staff_nurse_com ? phcStatus.staff_nurse_com : null
    }
    staff_nurse_under:${
    phcStatus.staff_nurse_under ? phcStatus.staff_nurse_under : null
    }
    pop_coverage:${
    phcStatus.pop_coverage ? phcStatus.pop_coverage : null
    } 
    indi_enum_till:${
    phcStatus.indi_enum_till ? phcStatus.indi_enum_till : null
    } 
    screen_diabetes_examined:${
    phcStatus.screen_diabetes_examined
        ? phcStatus.screen_diabetes_examined
        : null
    } 
    screen_hyperten_examined:${
    phcStatus.screen_hyperten_examined
        ? phcStatus.screen_hyperten_examined
        : null
    } 
    screen_oral_can_examined:${
    phcStatus.screen_oral_can_examined
        ? phcStatus.screen_oral_can_examined
        : null
    } 
    screen_breast_can_examined:${
    phcStatus.screen_breast_can_examined
        ? phcStatus.screen_breast_can_examined
        : null
    }
    screen_cervical_can_examined:${
    phcStatus.screen_cervical_can_examined
        ? phcStatus.screen_cervical_can_examined
        : null
    }
    bp_app_count:${
    phcStatus.bp_app_count ? phcStatus.bp_app_count : null
    } 
    fsaa_app_count:${
    phcStatus.fsaa_app_count ? phcStatus.fsaa_app_count : null
    }
    tab_avail:${phcStatus.tab_avail ? phcStatus.tab_avail : null}
    desktop_avail:${
    phcStatus.desktop_avail ? phcStatus.desktop_avail : null
    }
    laptop_avail:${phcStatus.laptop_avail ? phcStatus.laptop_avail : null}
    mo_ncd:${phcStatus.mo_ncd ? `"${phcStatus.mo_ncd}"` : null}
    staff_nurse_ncd:${
    phcStatus.staff_nurse_ncd ? `"${phcStatus.staff_nurse_ncd}"` : null
    }
    anm_mpw_ncd:${
    phcStatus.anm_mpw_ncd ? `"${phcStatus.anm_mpw_ncd}"` : null
    }
    ashs_ncd:${phcStatus.ashs_ncd ? `"${phcStatus.ashs_ncd}"` : null}
    pop_enum_started:${
    phcStatus.pop_enum_started
        ? `"${phcStatus.pop_enum_started}"`
        : null
    }
    screen_start_diabetes:${
    phcStatus.screen_start_diabetes
        ? `"${phcStatus.screen_start_diabetes}"`
        : null
    }
    screen_start_hyperten:${
    phcStatus.screen_start_hyperten
        ? `"${phcStatus.screen_start_hyperten}"`
        : null
    }
    screen_start_oral_can:${
    phcStatus.screen_start_oral_can
        ? `"${phcStatus.screen_start_oral_can}"`
        : null
    }
    screen_start_breast_can:${
    phcStatus.screen_start_breast_can
        ? `"${phcStatus.screen_start_breast_can}"`
        : null
    }
    screen_start_cervical_can:${
    phcStatus.screen_start_cervical_can
        ? `"${phcStatus.screen_start_cervical_can}"`
        : null
    }
    yoga_session:${
    phcStatus.yoga_session ? `"${phcStatus.yoga_session}"` : null
    }
    med_edl_avail:${
    phcStatus.med_edl_avail ? `"${phcStatus.med_edl_avail}"` : null
    }
    diag_avail:${
    phcStatus.diag_avail ? `"${phcStatus.diag_avail}"` : null
    }
    ncd_nic_app_used:${
    phcStatus.ncd_nic_app_used
        ? `"${phcStatus.ncd_nic_app_used}"`
        : null
    }
    net_connect:${
    phcStatus.net_connect ? `"${phcStatus.net_connect}"` : null
    }
    infra_completed:${
    phcStatus.infra_completed ? `"${phcStatus.infra_completed}"` : null
    }
    building_type:${
    phcStatus.building_type ? `"${phcStatus.building_type}"` : null
    }
    phc_painted:${
    phcStatus.phc_painted ? `"${phcStatus.phc_painted}"` : null
    }
    chairs_avail:${
    phcStatus.chairs_avail ? `"${phcStatus.chairs_avail}"` : null
    }
    wellness_room_avail:${
    phcStatus.wellness_room_avail
        ? `"${phcStatus.wellness_room_avail}"`
        : null
    }
    phc_biomed_fac :${
    phcStatus.phc_biomed_fac ? `"${phcStatus.phc_biomed_fac}"` : null
    }
    two_lang_phc:${
    phcStatus.two_lang_phc ? `"${phcStatus.two_lang_phc}"` : null
    }
    male_toilet :${phcStatus.male_toilet ? phcStatus.male_toilet : null}
    female_toilet :${
    phcStatus.female_toilet ? phcStatus.female_toilet : null
    }
    water_avail :${
    phcStatus.water_avail ? `"${phcStatus.water_avail}"` : null
    }
    power_backup :${
    phcStatus.power_backup ? `"${phcStatus.power_backup}"` : null
    }
    isp :${phcStatus.isp ? `"${phcStatus.isp}"` : null}
    bpApparatusManual : ${
    phcStatus.bpApparatusManual ? `${phcStatus.bpApparatusManual}` : null
    }
    bpApparatusElectronic : ${
    phcStatus.bpApparatusElectronic ? `${phcStatus.bpApparatusElectronic}` : null
    }
    bpPregnancyLargecuff : ${
    phcStatus.bpPregnancyLargecuff ? `${phcStatus.bpPregnancyLargecuff}` : null
    }
    stethoscope : ${
    phcStatus.stethoscope ? `${phcStatus.stethoscope}` : null
    }
    inchTape : ${
    phcStatus.inchTape ? `${phcStatus.inchTape}` : null
    }
    weighingMachineAdult : ${
    phcStatus.weighingMachineAdult ? `${phcStatus.weighingMachineAdult}` : null
    }
    weighingMachinePaediatric : ${
    phcStatus.weighingMachinePaediatric ? `${phcStatus.weighingMachinePaediatric}` : null
    }
    heightScale : ${
    phcStatus.heightScale ? `${phcStatus.heightScale}` : null
    }
    torchLight : ${
    phcStatus.torchLight ? `${phcStatus.torchLight}` : null
    }
    thermometerMercury : ${
    phcStatus.thermometerMercury ? `${phcStatus.thermometerMercury}` : null
    }
    thermometerElectronic : ${
    phcStatus.thermometerElectronic ? `${phcStatus.thermometerElectronic}` : null
    }
    hubCutter : ${
    phcStatus.hubCutter ? `${phcStatus.hubCutter}` : null
    }
    bowls : ${
    phcStatus.bowls ? `${phcStatus.bowls}` : null
    }
    plasticTray : ${
    phcStatus.plasticTray ? `${phcStatus.plasticTray}` : null
    }
    fetoscope : ${
    phcStatus.fetoscope ? `${phcStatus.fetoscope}` : null
    }
    fetalDoppler : ${
    phcStatus.fetalDoppler ? `${phcStatus.fetalDoppler}` : null
    }
    glucometer : ${
    phcStatus.glucometer ? `${phcStatus.glucometer}` : null
    }
    haemoglobinometer : ${
    phcStatus.haemoglobinometer ? `${phcStatus.haemoglobinometer}` : null
    }
    doubleRackSterilizer : ${
    phcStatus.doubleRackSterilizer ? `${phcStatus.doubleRackSterilizer}` : null
    }
    stainlessSteelTray : ${
    phcStatus.stainlessSteelTray ? `${phcStatus.stainlessSteelTray}` : null
    }
    stainlessSteelTrayCover : ${
    phcStatus.stainlessSteelTrayCover ? `${phcStatus.stainlessSteelTrayCover}` : null
    }
    kidneyTray : ${
    phcStatus.kidneyTray ? `${phcStatus.kidneyTray}` : null
    }
    arteryForceps : ${
    phcStatus.arteryForceps ? `${phcStatus.arteryForceps}` : null
    }
    dissectingForceps : ${
    phcStatus.dissectingForceps ? `${phcStatus.dissectingForceps}` : null
    }
    spongeHoldingForceps : ${
    phcStatus.spongeHoldingForceps ? `${phcStatus.spongeHoldingForceps}` : null
    }
    vulsellum : ${
    phcStatus.vulsellum ? `${phcStatus.vulsellum}` : null
    }
    scissors : ${
    phcStatus.scissors ? `${phcStatus.scissors}` : null
    }
    speculumBig : ${
    phcStatus.speculumBig ? `${phcStatus.speculumBig}` : null
    }
    speculumSmall : ${
    phcStatus.speculumSmall ? `${phcStatus.speculumSmall}` : null
    }
    silverBasin : ${
    phcStatus.silverBasin ? `${phcStatus.silverBasin}` : null
    }
    mucusSucker : ${
    phcStatus.mucusSucker ? `${phcStatus.mucusSucker}` : null
    }
    spiritLamp : ${
    phcStatus.spiritLamp ? `${phcStatus.spiritLamp}` : null
    }
    breastPump : ${
    phcStatus.breastPump ? `${phcStatus.breastPump}` : null
    }
    examinationTable : ${
    phcStatus.examinationTable ? `${phcStatus.examinationTable}` : null
    }
    steelBench : ${
    phcStatus.steelBench ? `${phcStatus.steelBench}` : null
    }
    plasticchair : ${
    phcStatus.plasticchair ? `${phcStatus.plasticchair}` : null
    }
    table : ${
    phcStatus.table ? `${phcStatus.table}` : null
    }
    almirahBureau : ${
    phcStatus.almirahBureau ? `${phcStatus.almirahBureau}` : null
    }
    stool : ${
    phcStatus.stool ? `${phcStatus.stool}` : null
    }
    footStool : ${
    phcStatus.footStool ? `${phcStatus.footStool}` : null
    }
    dustbinBMWMRed : ${
    phcStatus.dustbinBMWMRed ? `${phcStatus.dustbinBMWMRed}` : null
    }
    bustbinBMWMBlack : ${
    phcStatus.bustbinBMWMBlack ? `${phcStatus.bustbinBMWMBlack}` : null
    }
    dustbinBMWMYellow : ${
    phcStatus.dustbinBMWMYellow ? `${phcStatus.dustbinBMWMYellow}` : null
    }
    dustbinBMWMBlue : ${
    phcStatus.dustbinBMWMBlue ? `${phcStatus.dustbinBMWMBlue}` : null
    }
    dustbinOthers : ${
    phcStatus.dustbinOthers ? `${phcStatus.dustbinOthers}` : null
    }
    cot : ${
    phcStatus.cot ? `${phcStatus.cot}` : null
    }
    gasStove : ${
    phcStatus.gasStove ? `${phcStatus.gasStove}` : null
    }
    gasCyclinder : ${
    phcStatus.gasCyclinder ? `${phcStatus.gasCyclinder}` : null
    }
    emergnecyChargerLight : ${
    phcStatus.emergnecyChargerLight ? `${phcStatus.emergnecyChargerLight}` : null
    }
) {
  id
}
}
`;