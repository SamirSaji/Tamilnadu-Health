import React from "react";
import ReactExport from "react-data-export";
import { getReadableDateFormat1, TrueOrFalse } from '../../../../utils/Common';
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
                    username: list.phc_user.username,
                    'Created Institution Name': (list.phc_user && list.phc_user.phc_User && list.phc_user.phc_User.institution_name) ?list.phc_user.phc_User.institution_name : '',
                    'Institution GP Type':(list.phc_user && list.phc_user.phc_User && list.phc_user.phc_User.gp_type) ?list.phc_user.phc_User.gp_type : '',
                    'Institution Type':(list.phc_user && list.phc_user.phc_User && list.phc_user.phc_User.institution_type) ?list.phc_user.phc_User.institution_type : '',
                    district_name:list.phc_user ? list.phc_user.User_to_district.district_name : '',
                    district_id:list.phc_user ? list.phc_user.User_to_district.district_id : '',
                    block_name:list.phc_user.user_to_block ? list.phc_user.user_to_block.block_name : '',
                    block_id:list.phc_user.user_to_block ? list.phc_user.user_to_block.block_gis_id : '',
                    hud_name:list.phc_user.user_to_hud ? list.phc_user.user_to_hud.hud_name : '',
                    hud_id:list.phc_user.user_to_hud ? list.phc_user.user_to_hud.hud_gis_id : '',
                    building_type: list.building_type,
                    in_aug_date: list.in_aug_date ? getReadableDateFormat1(list.in_aug_date) : '',
                    total_hr: list.total_hr,
                    mbbs_ms: list.mbbs_ms,
                    staff_nurse: TrueOrFalse(list.staff_nurse),
                    no_anm_mpw: TrueOrFalse(list.no_anm_mpw),
                    no_of_lab_tech: list.no_of_lab_tech,
                    no_of_pharm: list.no_of_pharm,
                    asha: TrueOrFalse(list.asha),
                    staff_nurse_com: list.staff_nurse_com,
                    staff_nurse_under: list.staff_nurse_under,
                    mo_ncd: TrueOrFalse(list.mo_ncd),
                    staff_nurse_ncd: TrueOrFalse(list.staff_nurse_ncd),
                    anm_mpw_ncd: TrueOrFalse(list.anm_mpw_ncd),
                    ashs_ncd: TrueOrFalse(list.ashs_ncd),
                    pop_enum_started: TrueOrFalse(list.pop_enum_started),
                    pop_coverage: list.pop_coverage,
                    indi_enum_till: list.indi_enum_till,
                    screen_start_diabetes: TrueOrFalse(list.screen_start_diabetes),
                    screen_diabetes_examined: list.screen_diabetes_examined,
                    screen_start_hyperten: TrueOrFalse(list.screen_start_hyperten),
                    screen_hyperten_examined: list.screen_hyperten_examined,
                    screen_start_oral_can: TrueOrFalse(list.screen_start_oral_can),
                    screen_oral_can_examined: list.screen_oral_can_examined,
                    screen_start_breast_can: TrueOrFalse(list.screen_start_breast_can),
                    screen_breast_can_examined: list.screen_breast_can_examined,
                    screen_start_cervical_can: TrueOrFalse(list.screen_start_cervical_can),
                    screen_cervical_can_examined: list.screen_cervical_can_examined,
                    yoga_session: TrueOrFalse(list.yoga_session),
                    med_edl_avail: TrueOrFalse(list.med_edl_avail),
                    diag_avail: TrueOrFalse(list.diag_avail),
                    bp_app_count: list.bp_app_count,
                    fsaa_app_count: list.fsaa_app_count,
                    tab_avail: list.tab_avail,
                    desktop_avail: list.desktop_avail,
                    laptop_avail: list.laptop_avail,
                    ncd_nic_app_used: TrueOrFalse(list.ncd_nic_app_used),
                    net_connect: TrueOrFalse(list.net_connect),
                    isp: list.isp,
                    infra_completed: TrueOrFalse(list.infra_completed),
                    phc_painted: TrueOrFalse(list.phc_painted),
                    chairs_avail: TrueOrFalse(list.chairs_avail),
                    wellness_room_avail: list.wellness_room_avail,
                    phc_biomed_fac: list.phc_biomed_fac,
                    two_lang_phc: TrueOrFalse(list.two_lang_phc),
                    male_toilet: list.male_toilet,
                    female_toilet: list.female_toilet,
                    water_avail: TrueOrFalse(list.water_avail),
                    power_backup: list.power_backup,
                    mpw: list.mpw,
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
        const fileName = `${this.props.user.username}_PHC_Statust_${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}_${_time}`;
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
                        <ExcelColumn label='Type of building' value='building_type' />
                        <ExcelColumn label='Date of inauguration' value='in_aug_date' />
                        <ExcelColumn label='Total HR under the facility' value='total_hr' />
                        <ExcelColumn label='MBBS-MO in position' value='mbbs_ms' />
                        <ExcelColumn label='Staff Nurse' value='staff_nurse' />
                        <ExcelColumn label='No of ANM/MPW(F)' value='no_anm_mpw' />
                        <ExcelColumn label='No. of Lab technician' value='no_of_lab_tech' />
                        <ExcelColumn label='No. of Pharmacist' value='no_of_pharm' />
                        <ExcelColumn label='ASHAs' value='asha' />
                        <ExcelColumn label='No of Staff Nurses Completed (1 month CPHC Training)' value='staff_nurse_com' />
                        <ExcelColumn label='No of Staff Nurses Undergoing (1 month CPHC Training)' value='staff_nurse_under' />
                        <ExcelColumn label='MOs (NCD)' value='mo_ncd' />
                        <ExcelColumn label='Staff Nurses (NCD)' value='staff_nurse_ncd' />
                        <ExcelColumn label='ANM/MPW(F) (NCD)' value='anm_mpw_ncd' />
                        <ExcelColumn label='ASHAs (NCD)' value='ashs_ncd' />
                        <ExcelColumn label='Population enumeration started' value='pop_enum_started' />
                        <ExcelColumn label='Population Coverge' value='pop_coverage' />
                        <ExcelColumn label='indi_enum_till' value='indi_enum_till' />
                        <ExcelColumn label='Individuals enumerated till now' value='screen_start_diabetes' />
                        <ExcelColumn label='Individuals Examined (Diabetes)' value='screen_diabetes_examined' />
                        <ExcelColumn label='Universal Screening of NCD Start for Hypertension' value='screen_start_hyperten' />
                        <ExcelColumn label='Individuals Examined (Hypertension)' value='screen_hyperten_examined' />
                        <ExcelColumn label='Universal Screening of NCD Started for Oral Cancer' value='screen_start_oral_can' />
                        <ExcelColumn label='Individuals Examined (Oral Cancer)' value='screen_oral_can_examined' />
                        <ExcelColumn label='Universal Screening of NCD Started for Breast Cancer' value='screen_start_breast_can' />
                        <ExcelColumn label='Individuals Examined (Breast Cancer)' value='screen_breast_can_examined' />
                        <ExcelColumn label='Universal Screening of NCD Started for Cervical Cancer' value='screen_start_cervical_can' />
                        <ExcelColumn label='Individuals Examined (Cervical Cancer)' value='screen_cervical_can_examined' />
                        <ExcelColumn label='Yoga session / Wellness activity initiated' value='yoga_session' />
                        <ExcelColumn label='Medicines available as per EDL list' value='med_edl_avail' />
                        <ExcelColumn label='Diagnostics/Consumables available as per guidlines' value='diag_avail' />
                        <ExcelColumn label='No of BP Apparatus' value='bp_app_count' />
                        <ExcelColumn label='No of Functional Semi Auto Analyzer' value='fsaa_app_count' />
                        <ExcelColumn label='No of Functional Tablets-PC' value='tab_avail' />
                        <ExcelColumn label='No of Functional Desktop-PC' value='desktop_avail' />
                        <ExcelColumn label='No of functional Laptop-PC' value='laptop_avail' />
                        <ExcelColumn label='NCD NIC application being used' value='ncd_nic_app_used' />
                        <ExcelColumn label='Net Connectivity at the HWCS based on signal feasibilty of that area' value='net_connect' />
                        <ExcelColumn label='If Yes, pl mention the name of the Service Provider' value='isp' />
                        <ExcelColumn label='Infrastructure Repair / Renovation completed' value='infra_completed' />
                        <ExcelColumn label='PHC painted as per norms' value='phc_painted' />
                        <ExcelColumn label='Whether PHC been provided with Patient Waiting area with 10-15 Chairs?' value='chairs_avail' />
                        <ExcelColumn label='Whether PHC been provided with Wellness Room for Yoga?' value='wellness_room_avail' />
                        <ExcelColumn label='Whether PHC been provided with Biomedical waste facility?' value='phc_biomed_fac' />
                        <ExcelColumn label='Whether PHC branded in 2 languages as per specs communicated by O/o DPH&PM' value='two_lang_phc' />
                        <ExcelColumn label='Whether functional toilet(male) available?' value='male_toilet' />
                        <ExcelColumn label='Whether functional toilet(Female) available?' value='female_toilet' />
                        <ExcelColumn label='Whether PHC has running water supply available?' value='water_avail' />
                        <ExcelColumn label='Whether PHC has power back up?' value='power_backup' />
                        <ExcelColumn label='Health Inspector' value='mpw' />
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