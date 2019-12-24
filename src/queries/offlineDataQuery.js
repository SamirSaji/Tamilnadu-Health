import moment from "moment";
import { jwt_decode } from '../utils/Common';
import gql from "graphql-tag";

const getYesterdaysDate = () => {
  var date = new Date();
  date.setDate(date.getDate() - 1);
  return date;
}

export const dataQuery = (distId) => `{
  phc_list: get_all_phc(district_id: ${distId}) {
    phc_name
    phc_id
    type
    institution_name
  }
  symptomsList {
    symptom_id
    name
  }
  drugsList(display_for_user: true) {
    drug_name
    drug_id
    type
    strength
    quantity
    update_quantity
  }
  specimensList {
    specimen_id
    specimen_name
  }
  diagnosis_masters {
    diagnosis_id
    diagnosis_name
    service_id
    ser_diag {
      service_id
      service_name
      disable_for_men
    }
  }
  servicesList {
    service_id
    service_name
  }
  countriesList {
    country_id
    country_name
  }
  labtest_masters(alias: "phc") {
    test_id
    test_name
    options
    result_type
  }
  syndromeList {
    syndrome_id
    syndrome_name
    syndrome_code
  }
}
`;

const offlineDataQuery = gql`query offlineCachingQuery($phcId:Int!, $username: String!, $createdBy: String!, $districtId:Int, $alias: String!, $startDate: String!, $endDate: String!, $currentDate: String!, $type: String!) {
  lineListNew(offset: 0, limit: 6, phc_id: $phcId, username: $username, created_by: $createdBy, district_id: $districtId, alias: $alias, startDate: $startDate, endDate: $endDate) {
    id
    entry_id
    visit_date
    outcome
    validity
    outcome_date
    visit_id
    referred_phc
    patient_diagnos_entry {
      diagnosis_id
      patient_diagno {
        diagnosis_name
      }
    }
    phc_id
    user_pds_line {
      constructed_address
      age
      gender
      name
      aadhar_no
      mobileno
      district_name_user {
        district_name
      }
      hab_name_user {
        habitation_name
      }
      village_name_user {
        village_name
      }
    }
  }
  servicesList {
    service_id
    service_name
    disable_for_men
  }
  getPreviousServices(user_id: $createdBy, alias: $alias, report_date: $currentDate) {
    diagnosis_id
    male
    female
    patient_diagno {
      ser_diag {
        service_id
      }
    }
  }
  getpatientcount(user_id: $createdBy, type: $type, report_date: $currentDate) {
    male
    female
    referred_out
    follow_up
    total
  }
  drugsList {
    drug_id
    drug_name
    strength
    type
  }
  servicesList {
    service_id
    service_name
  }
  drugsList {
    drug_id
    drug_name
    strength
    type
  }
  yesterdayIssuesCount(user_id: $createdBy, alias: $type, created_date: $currentDate) {
    drug_id
    quantity
  }
  getIssuesDrugCount(user_id: $createdBy, alias: $type, created_max_date: $endDate, created_date: $currentDate) {
    quantity
    drug_id
  }
  getDrugCount(user_id: $createdBy, date: $currentDate) {
    quantity
    drug_id
  }
  getHWCData(user_id:$createdBy) {
    in_aug_date
    total_hr
    vhn_in_pos
    name_vhn
    mode_of_vhn
    gender_mhlp
    type_of_mhlp
    mpw_f
    mpw_m
    asha
    no_fem_health_vol
    mlp_training_status
    vhn_one_train_stat
    asha_traing_status
    pop_enum_started
    pop_coverage
    indi_enum_till
    screen_start_diabetes
    screen_diabetes_examined
    screen_start_hyperten
    screen_hyperten_examined
    screen_start_oral_can
    screen_oral_can_examined
    screen_start_breast_can
    screen_breast_can_examined
    screen_start_cervical_can
    screen_cervical_can_examined
    yoga_session
    med_avail
    diag_avail
    bp_app_count
    gluco_app_count
    tab_avail
    laptop_avail
    net_connect
    isp
    infra_completed
    building_type
    phc_painted
    chairs_avail
    store_med
    two_lang_phc
    func_toilet_avail
    water_avail
    power_backup
    bpApparatusManual
    bpApparatusElectronic
    bpPregnancyLargecuff
    stethoscope
    inchTape
    weighingMachineAdult
    weighingMachinePaediatric
    heightScale
    torchLight
    thermometerMercury
    thermometerElectronic
    hubCutter
    bowls
    plasticTray
    fetoscope
    fetalDoppler
    haemoglobinometer
    doubleRackSterilizer
    stainlessSteelTray
    stainlessSteelTrayCover
    kidneyTray
    arteryForceps
    dissectingForceps
    spongeHoldingForceps
    vulsellum
    scissors
    speculumBig
    speculumSmall
    silverBasin
    mucusSucker
    spiritLamp
    breastPump
    examinationTable
    steelBench
    plasticchair
    table
    almirahBureau
    stool
    footStool
    dustbinBMWMRed
    bustbinBMWMBlack
    dustbinBMWMYellow
    dustbinBMWMBlue
    dustbinOthers
    cot
    gasStove
    gasCyclinder
    emergnecyChargerLight
  }
  getPhcData(user_id: $createdBy) {
    building_type
    in_aug_date
    total_hr
    mbbs_ms
    staff_nurse
    no_anm_mpw
    no_of_lab_tech
    no_of_pharm
    asha
    staff_nurse_com
    staff_nurse_under
    mo_ncd
    staff_nurse_ncd
    anm_mpw_ncd
    ashs_ncd
    pop_enum_started
    pop_coverage
    indi_enum_till
    screen_start_diabetes
    screen_diabetes_examined
    screen_start_hyperten
    screen_hyperten_examined
    screen_start_oral_can
    screen_oral_can_examined
    screen_start_breast_can
    screen_breast_can_examined
    screen_start_cervical_can
    screen_cervical_can_examined
    yoga_session
    med_edl_avail
    diag_avail
    bp_app_count
    fsaa_app_count
    tab_avail
    desktop_avail
    laptop_avail
    ncd_nic_app_used
    net_connect
    isp
    infra_completed
    building_type
    phc_painted
    chairs_avail
    wellness_room_avail
    phc_biomed_fac
    two_lang_phc
    male_toilet
    female_toilet
    water_avail
    power_backup
    mpw
    bpApparatusManual
    bpApparatusElectronic
    bpPregnancyLargecuff
    stethoscope
    inchTape
    weighingMachineAdult
    weighingMachinePaediatric
    heightScale
    torchLight
    thermometerMercury
    thermometerElectronic
    hubCutter
    bowls
    plasticTray
    fetoscope
    fetalDoppler
    glucometer
    haemoglobinometer
    doubleRackSterilizer
    stainlessSteelTray
    stainlessSteelTrayCover
    kidneyTray
    arteryForceps
    dissectingForceps
    spongeHoldingForceps
    vulsellum
    scissors
    speculumBig
    speculumSmall
    silverBasin
    mucusSucker
    spiritLamp
    breastPump
    examinationTable
    steelBench
    plasticchair
    table
    almirahBureau
    stool
    footStool
    dustbinBMWMRed
    bustbinBMWMBlack
    dustbinBMWMYellow
    dustbinBMWMBlue
    dustbinOthers
    cot
    gasStove
    gasCyclinder
    emergnecyChargerLight
  }
}
`

export const offlineVars = () => {
  if(!localStorage.jwtToken) return
  const {
    alias, district_id, phcId,  user_id, username
  } = jwt_decode(localStorage.jwtToken);
  const currentDate = Math.round(new Date().getTime()/1000).toString();
  const endDate = Math.round(new Date(moment().add(1, 'month')).getTime()).toString();
  return {
    phcId,
    username,
    "createdBy": user_id,
    "districtId": district_id,
    alias,
    "startDate": currentDate,
    endDate,
    currentDate,
    "type": alias
  }
}

export const _offlineDataQuery = `query offlineCachingQuery {
    lineListNew(offset: 0, limit: 6, phc_id: 17561, username: "uhcitspmu", created_by: "be8d6f84-5de0-11e9-944c-96bc6282e18f", district_id: 16, alias: "state", startDate: "2019-08-04T11:28:07.838Z", endDate: "2019-10-04T11:28:07.838Z") {
      id
      entry_id
      visit_date
      outcome
      validity
      outcome_date
      visit_id
      referred_phc
      patient_diagnos_entry {
        diagnosis_id
        patient_diagno {
          diagnosis_name
        }
      }
      phc_id
      user_pds_line {
        constructed_address
        age
        gender
        name
        aadhar_no
        mobileno
        district_name_user {
          district_name
        }
        hab_name_user {
          habitation_name
        }
        village_name_user {
          village_name
        }
      }
    }
    servicesList {
      service_id
      service_name
      disable_for_men
    }
    getPreviousServices(user_id: "be8d6f84-5de0-11e9-944c-96bc6282e18f", alias: "state", report_date: "1570102662.849") {
      diagnosis_id
      male
      female
      patient_diagno {
        ser_diag {
          service_id
        }
      }
    }
    getpatientcount(user_id: "be8d6f84-5de0-11e9-944c-96bc6282e18f", type: "state", report_date: "1570102662.849") {
      male
      female
      referred_out
      follow_up
      total
    }
    drugsList {
      drug_id
      drug_name
      strength
      type
    }
    servicesList {
      service_id
      service_name
    }
    drugsList {
      drug_id
      drug_name
      strength
      type
    }
    yesterdayIssuesCount(user_id: "be8d6f84-5de0-11e9-944c-96bc6282e18f", alias: "state", created_date: "1570103040.282") {
      drug_id
      quantity
    }
    getIssuesDrugCount(user_id: "be8d6f84-5de0-11e9-944c-96bc6282e18f", alias: "state", created_max_date: "1570213799", created_date: "1570127400") {
      quantity
      drug_id
    }
    getDrugCount(user_id: "be8d6f84-5de0-11e9-944c-96bc6282e18f", date: "1570189440.282") {
      quantity
      drug_id
    }
    getPhcData(user_id: "be6e1ffe-5ddf-11e9-944c-96bc6282e18f") {
      building_type
      in_aug_date
      total_hr
      mbbs_ms
      staff_nurse
      no_anm_mpw
      no_of_lab_tech
      no_of_pharm
      asha
      staff_nurse_com
      staff_nurse_under
      mo_ncd
      staff_nurse_ncd
      anm_mpw_ncd
      ashs_ncd
      pop_enum_started
      pop_coverage
      indi_enum_till
      screen_start_diabetes
      screen_diabetes_examined
      screen_start_hyperten
      screen_hyperten_examined
      screen_start_oral_can
      screen_oral_can_examined
      screen_start_breast_can
      screen_breast_can_examined
      screen_start_cervical_can
      screen_cervical_can_examined
      yoga_session
      med_edl_avail
      diag_avail
      bp_app_count
      fsaa_app_count
      tab_avail
      desktop_avail
      laptop_avail
      ncd_nic_app_used
      net_connect
      isp
      infra_completed
      building_type
      phc_painted
      chairs_avail
      wellness_room_avail
      phc_biomed_fac
      two_lang_phc
      male_toilet
      female_toilet
      water_avail
      power_backup
      mpw
      bpApparatusManual
      bpApparatusElectronic
      bpPregnancyLargecuff
      stethoscope
      inchTape
      weighingMachineAdult
      weighingMachinePaediatric
      heightScale
      torchLight
      thermometerMercury
      thermometerElectronic
      hubCutter
      bowls
      plasticTray
      fetoscope
      fetalDoppler
      glucometer
      haemoglobinometer
      doubleRackSterilizer
      stainlessSteelTray
      stainlessSteelTrayCover
      kidneyTray
      arteryForceps
      dissectingForceps
      spongeHoldingForceps
      vulsellum
      scissors
      speculumBig
      speculumSmall
      silverBasin
      mucusSucker
      spiritLamp
      breastPump
      examinationTable
      steelBench
      plasticchair
      table
      almirahBureau
      stool
      footStool
      dustbinBMWMRed
      bustbinBMWMBlack
      dustbinBMWMYellow
      dustbinBMWMBlue
      dustbinOthers
      cot
      gasStove
      gasCyclinder
      emergnecyChargerLight
    }
  }
  `

export const drugReportQuery = (user_id, alias) => gql`
  query{
    servicesList {
      service_id service_name
    }
    getpatientcount(user_id:"${user_id}", type:"${alias}" report_date:"${Number(new Date( getYesterdaysDate().getTime() / 1000))}"){
      male female referred_out follow_up total
    }
    drugsList {
      drug_id drug_name strength type
    }
    yesterdayIssuesCount(user_id:"${user_id}" alias:"${alias}" created_date:"${Number(new Date(getYesterdaysDate()).getTime() / 1000)}"){
      drug_id quantity
    }
      getIssuesDrugCount(user_id:"${user_id}" alias:"${alias}" created_max_date:"${Number(new Date(new Date().setHours(23, 59, 59, 0)) / 1000)}" created_date:"${Number(new Date(new Date().setHours(0, 0, 0, 0)) / 1000)}")
      {
        quantity
        drug_id
      }
      getDrugCount(user_id: "${user_id}", date: "${Number(new Date().getTime() / 1000)}") {
        quantity
        drug_id
      }
  }
  `

export default offlineDataQuery;