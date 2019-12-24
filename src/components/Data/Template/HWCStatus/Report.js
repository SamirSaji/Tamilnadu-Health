import React from "react";
import ReactExport from "react-data-export";
import { getReadableDateFormat1,TrueOrFalse } from '../../../../utils/Common';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class Download extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataToPrint: undefined
        };
    }
    componentWillReceiveProps(newProps) {
        if (newProps.content) {
            const newList = newProps.content.map((list, i) => {
                const localObj = {
                    username:list.hwc_user.username,
                    'Created Institution Name': (list.hwc_user && list.hwc_user.phc_User && list.hwc_user.phc_User.institution_name) ?list.hwc_user.phc_User.institution_name : '',
                    'Institution GP Type':(list.hwc_user && list.hwc_user.phc_User && list.hwc_user.phc_User.gp_type) ?list.hwc_user.phc_User.gp_type : '',
                    'Institution Type':(list.hwc_user && list.hwc_user.phc_User && list.hwc_user.phc_User.institution_type) ?list.hwc_user.phc_User.institution_type : '',
                    district_name:list.hwc_user ? list.hwc_user.User_to_district.district_name : '',
                    district_id:list.hwc_user ? list.hwc_user.User_to_district.district_id : '',
                    block_name:list.hwc_user.user_to_block ? list.hwc_user.user_to_block.block_name : '',
                    block_id:list.hwc_user.user_to_block ? list.hwc_user.user_to_block.block_gis_id : '',
                    hud_name:list.hwc_user.user_to_hud ? list.hwc_user.user_to_hud.hud_name : '',
                    hud_id:list.hwc_user.user_to_hud ? list.hwc_user.user_to_hud.hud_gis_id : '',
                    in_aug_date: list.in_aug_date ? getReadableDateFormat1(list.in_aug_date) : '',
                    total_hr: list.total_hr,
                    vhn_in_pos: TrueOrFalse(list.vhn_in_pos),
                    name_vhn: list.name_vhn,
                    mode_of_vhn: list.mode_of_vhn,
                    gender_mhlp: list.gender_mhlp,
                    type_of_mhlp: list.type_of_mhlp,
                    mpw_f: list.mpw_f,
                    mpw_m: list.mpw_m,
                    asha:TrueOrFalse(list.asha),
                    no_fem_health_vol: list.no_fem_health_vol,
                    mlp_training_status: list.mlp_training_status,
                    vhn_one_train_stat: TrueOrFalse(list.vhn_one_train_stat),
                    asha_traing_status: TrueOrFalse(list.asha_traing_status),
                    pop_enum_started: TrueOrFalse(list.pop_enum_started),
                    pop_coverage: list.pop_coverage,
                    indi_enum_till: list.indi_enum_till,
                    screen_start_diabetes: TrueOrFalse(list.screen_start_diabetes),
                    screen_diabetes_examined: list.screen_diabetes_examined,
                    screen_start_hyperten: list.screen_start_hyperten,
                    screen_hyperten_examined: list.screen_hyperten_examined,
                    screen_start_oral_can:TrueOrFalse(list.screen_start_oral_can),
                    screen_oral_can_examined: list.screen_oral_can_examined,
                    screen_start_breast_can: TrueOrFalse(list.screen_start_breast_can),
                    screen_breast_can_examined: list.screen_breast_can_examined,
                    screen_start_cervical_can: TrueOrFalse(list.screen_start_cervical_can),
                    screen_cervical_can_examined: list.screen_cervical_can_examined,
                    yoga_session: TrueOrFalse(list.yoga_session),
                    med_avail: TrueOrFalse(list.med_avail),
                    diag_avail: TrueOrFalse(list.diag_avail),
                    bp_app_count: list.bp_app_count,
                    gluco_app_count: TrueOrFalse(list.gluco_app_count),
                    tab_avail: list.tab_avail,
                    laptop_avail: list.laptop_avail,
                    net_connect: TrueOrFalse(list.net_connect),
                    isp: list.isp,
                    infra_completed: TrueOrFalse(list.infra_completed),
                    building_type: list.building_type,
                    phc_painted: TrueOrFalse(list.phc_painted),
                    chairs_avail: TrueOrFalse(list.chairs_avail),
                    store_med: TrueOrFalse(list.store_med),
                    two_lang_phc: TrueOrFalse(list.two_lang_phc),
                    func_toilet_avail: TrueOrFalse(list.func_toilet_avail),
                    water_avail: TrueOrFalse(list.water_avail),
                    power_backup: list.power_backup,
                    bpApparatusManual : list.bpApparatusManual,
                    bpApparatusElectronic : list.bpApparatusElectronic,
                    bpPregnancyLargecuff : list.bpPregnancyLargecuff,
                    stethoscope : list.stethoscope,
                    inchTape : list.inchTape,
                    weighingMachineAdult : list.weighingMachineAdult,
                    weighingMachinePaediatric : list.weighingMachinePaediatric,
                    heightScale : list.heightScale,
                    torchLight : list.torchLight,
                    thermometerMercury : list.thermometerMercury,
                    thermometerElectronic : list.thermometerElectronic,
                    hubCutter : list.hubCutter,
                    bowls : list.bowls,
                    plasticTray : list.plasticTray,
                    fetoscope : list.fetoscope,
                    fetalDoppler : list.fetalDoppler,
                    glucometer : list.glucometer,
                    haemoglobinometer : list.haemoglobinometer,
                    doubleRackSterilizer : list.doubleRackSterilizer,
                    stainlessSteelTray : list.stainlessSteelTray,
                    stainlessSteelTrayCover : list.stainlessSteelTrayCover,
                    kidneyTray : list.kidneyTray,
                    arteryForceps : list.arteryForceps,
                    dissectingForceps : list.dissectingForceps,
                    spongeHoldingForceps : list.spongeHoldingForceps,
                    vulsellum : list.vulsellum,
                    scissors : list.scissors,
                    speculumBig : list.speculumBig,
                    speculumSmall : list.speculumSmall,
                    silverBasin : list.silverBasin,
                    mucusSucker : list.mucusSucker,
                    spiritLamp : list.spiritLamp,
                    breastPump : list.breastPump,
                };
                return localObj;
            });

            this.setState({
                newList
            })
        }
    }
    render() {
        const { newList } = this.state;
        let d = new Date();
        let h = d.getHours(), m = d.getMinutes();
        let _time = (h > 12) ? (h - 12 + ':' + m + ' PM') : (h + ':' + m + ' AM');
        const fileName = `${this.props.user.username}_HSC_Status_${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}_${_time}`;
        if (newList === undefined) {
            return <button>Download</button>
        } else {
            return (
                <ExcelFile filename={fileName}>
                        <ExcelSheet data={newList} name='HWC Status'>
                        <ExcelColumn label='Name of HSC' value='username' />
                        <ExcelColumn label='District Name' value='district_name' />
                        <ExcelColumn label='District ID' value='district_id' />
                        <ExcelColumn label='Created Institution Name' value='Created Institution Name' />
                        <ExcelColumn label='Institution GP Type' value='Institution GP Type' />
                        <ExcelColumn label='Institution Type' value='Institution Type' />
                        <ExcelColumn label='HUD Name' value='hud_name' />
                        <ExcelColumn label='HUD ID' value='hud_id' />
                        <ExcelColumn label='Block Name' value='block_name' />
                        <ExcelColumn label='Block ID' value='block_id' />
                        <ExcelColumn label='Date of inauguration' value='in_aug_date' />
                        <ExcelColumn label='Total HR under the facility' value='total_hr' />
                        <ExcelColumn label='2nd VHN MLHP in position' value='vhn_in_pos' />
                        <ExcelColumn label='Name of 2nd VHN' value='name_vhn' />
                        <ExcelColumn label='Mode of 2nd VHN' value='mode_of_vhn' />
                        <ExcelColumn label='Gender MLHP' value='gender_mhlp' />
                        <ExcelColumn label='Type of MLHP' value='type_of_mhlp' />
                        <ExcelColumn label='MPW (F)' value='mpw_f' />
                        <ExcelColumn label='MPW (M)' value='mpw_m' />
                        <ExcelColumn label='ASHAs' value='asha' />
                        <ExcelColumn label='No of Women Health Volunteer' value='no_fem_health_vol' />
                        <ExcelColumn label='MLHP Training status' value='mlp_training_status' />
                        <ExcelColumn label='1st VHN MPW (F) NCD Training Status' value='vhn_one_train_stat' />
                        <ExcelColumn label='ASHAs NCD Training Status' value='asha_traing_status' />
                        <ExcelColumn label='Population enumeration started' value='pop_enum_started' />
                        <ExcelColumn label='Population Coverge' value='pop_coverage' />
                        <ExcelColumn label='Individuals enumerated till now' value='indi_enum_till' />
                        <ExcelColumn label='Universal Screening of NCD Started for Diabetes' value='screen_start_diabetes' />
                        <ExcelColumn label='Individuals Examined (Diabetes)' value='screen_diabetes_examined' />
                        {/* <ExcelColumn label='screen_start_hyperten' value='screen_start_hyperten' />
                        <ExcelColumn label='screen_hyperten_examined' value='screen_hyperten_examined' /> */}
                        <ExcelColumn label='Universal Screening of NCD Started for Oral Cancer' value='screen_start_oral_can' />
                        <ExcelColumn label='Individuals Examined (Oral Cancer)' value='screen_oral_can_examined' />
                        <ExcelColumn label='Universal Screening of NCD Started for Breast Cancer' value='screen_start_breast_can' />
                        <ExcelColumn label='Individuals Examined (Breast Cancer)' value='screen_breast_can_examined' />
                        <ExcelColumn label='Universal Screening of NCD Started for Cervical Cancer' value='screen_start_cervical_can' />
                        <ExcelColumn label='Individuals Examined (Cervical Cancer)' value='screen_cervical_can_examined' />
                        <ExcelColumn label='Yoga session / Wellness activity initiated' value='yoga_session' />
                        <ExcelColumn label='27 Medicines available as per guidlines' value='med_avail' />
                        <ExcelColumn label='Diagnostics/Consumables available as per guidlines' value='diag_avail' />
                        <ExcelColumn label='No of BP Apparatus' value='bp_app_count' />
                        <ExcelColumn label='Glucometer' value='gluco_app_count' />
                        <ExcelColumn label='No of Functional Tablet-PC Available' value='tab_avail' />
                        <ExcelColumn label='No of Functional Laptop-PC Available' value='laptop_avail' />
                        <ExcelColumn label='Net Connectivity at the HSC based on signal feasibilty of that area' value='net_connect' />
                        <ExcelColumn label='If Yes, pl mention the name of the Service Provider' value='isp' />
                        <ExcelColumn label='Infrastructure Repair / Renovation completed' value='infra_completed' />
                        <ExcelColumn label='Type of building' value='building_type' />
                        <ExcelColumn label='HSC painted as per norms' value='phc_painted' />
                        <ExcelColumn label='Whether HSC been provided with Patient Waiting area with 10-15 Chairs' value='chairs_avail' />
                        <ExcelColumn label='Whether HSC been provided with racks for storing medicines/equipment/documenst/health cards / registers' value='store_med' />
                        <ExcelColumn label='Whether HSC branded in 2 languages as per specs communicated by O/o DPH&PM' value='two_lang_phc' />
                        <ExcelColumn label='Whether functional toilet available' value='func_toilet_avail' />
                        <ExcelColumn label='Whether HSC has running water supply available' value='water_avail' />
                        <ExcelColumn label='Whether HSC has power back up' value='power_backup' />
                        <ExcelColumn label='BP Apparatus (Manual)' value='bpApparatusManual' />
                        <ExcelColumn label='BP Apparatus (Electronic)' value='bpApparatusElectronic' />
                        <ExcelColumn label='BP Pregnancy Large cuff' value='bpPregnancyLargecuff' />
                        <ExcelColumn label='Stethoscope' value='stethoscope' />
                        <ExcelColumn label='Inch tape' value='inchTape' />
                        <ExcelColumn label='Weighing machine (Adult)' value='weighingMachineAdult' />
                        <ExcelColumn label='Weighing machine (Paediatric)' value='weighingMachinePaediatric' />
                        <ExcelColumn label='Height scale' value='heightScale' />
                        <ExcelColumn label='Torch Light' value='torchLight' />
                        <ExcelColumn label='Thermometer (Mercury)' value='thermometerMercury' />
                        <ExcelColumn label='Thermometer (Electronic)' value='thermometerElectronic' />
                        <ExcelColumn label='Hub Cutter' value='hubCutter' />
                        <ExcelColumn label='Bowls' value='bowls' />
                        <ExcelColumn label='Plastic tray' value='plasticTray' />
                        <ExcelColumn label='Fetoscope' value='fetoscope' />
                        <ExcelColumn label='Fetal Doppler' value='fetalDoppler' />
                        <ExcelColumn label='Glucometer' value='glucometer' />
                        <ExcelColumn label='Haemoglobinometer' value='haemoglobinometer' />
                        <ExcelColumn label='Double rack sterilizer' value='doubleRackSterilizer' />
                        <ExcelColumn label='Stainless Steel Tray' value='stainlessSteelTray' />
                        <ExcelColumn label='Stainless Steel Tray- Cover' value='stainlessSteelTrayCover' />
                        <ExcelColumn label='Kidney Tray' value='kidneyTray' />
                        <ExcelColumn label='Artery forceps' value='arteryForceps' />
                        <ExcelColumn label='Dissecting forceps' value='dissectingForceps' />
                        <ExcelColumn label='Sponge holding forceps' value='spongeHoldingForceps' />
                        <ExcelColumn label='Vulsellum' value='vulsellum' />
                        <ExcelColumn label='Scissors' value='scissors' />
                        <ExcelColumn label='Speculum Big' value='speculumBig' />
                        <ExcelColumn label='Speculum Small' value='speculumSmall' />
                        <ExcelColumn label='Silver Basin' value='silverBasin' />
                        <ExcelColumn label='Mucus sucker' value='mucusSucker' />
                        <ExcelColumn label='Spirit Lamp' value='spiritLamp' />
                        <ExcelColumn label='Breast Pump' value='breastPump' />
                        {/* <ExcelColumn label='Examination Table' value='examinationTable' />
                        <ExcelColumn label='Steel bench' value='steelBench' />
                        <ExcelColumn label='Plastic Chair' value='plasticchair' />
                        <ExcelColumn label='Table' value='table' />
                        <ExcelColumn label='Almirah (bureau)' value='almirahBureau' />
                        <ExcelColumn label='Stool' value='stool' />
                        <ExcelColumn label='Foot stool' value='footStool' />
                        <ExcelColumn label='Dust bin (BMWM)-Red' value='dustbinBMWMRed' />
                        <ExcelColumn label='Dust bin (BMWM)-Black' value='bustbinBMWMBlack' />
                        <ExcelColumn label='Dust bin (BMWM)-Yellow' value='dustbinBMWMYellow' />
                        <ExcelColumn label='Dust bin (BMWM)-Blue' value='dustbinBMWMBlue' />
                        <ExcelColumn label='Dust bin Others' value='dustbinOthers' />
                        <ExcelColumn label='Cot' value='cot' />
                        <ExcelColumn label='Gas Stove' value='gasStove' />
                        <ExcelColumn label='Gas Cyclinder' value='gasCyclinder' />
                        <ExcelColumn label='Emergnecy Charger Light' value='emergnecyChargerLight' /> */}
                    </ExcelSheet>
                </ExcelFile>
            );
        }

    }
}

export default Download;