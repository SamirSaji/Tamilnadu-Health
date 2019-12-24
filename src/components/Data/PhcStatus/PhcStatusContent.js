import React from "react";
import {
  Col,
  Row,
  Container,
  Button,
  FormGroup,
  Label,
  Input,
  Table
} from "reactstrap";
import gql from "graphql-tag";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Download from "../Template/PHCStatus/Report";
import { withApollo } from "react-apollo";
import { withAlert } from "react-alert";
import {
  equipmentStatus,
  // furnitureStatus
} from "../../../static/EquipmentList";

//custom components
import SelectList from "../../common/fields/CustomSelectGroup/CustomSelectGroup";
import Inputtext from "../../common/fields/TextFieldGroup/TextFieldGroup";
import { optionFinder } from "../../../utils/Common";

// styles
import styles from "./stylesheet/phcstyles.less";
//datapicker
import DatePicker from "react-datepicker";
import moment from "moment";

//datapicker styles
import "react-datepicker/dist/react-datepicker.css";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import PageList from "../../common/PageList/PageList";
// import { isDate } from "util";
import { phcProfileSave } from '../../../utils/writeToOffline';

// const PHC_STATUS = 'phc_status';

class Status extends React.Component {
  constructor(props) {
    super(props);
    const { phcStatus } = this.props;
    this.generateReport = this.generateReport.bind(this);
    this.submitData = this.submitData.bind(this);
    this.commonSelectUpdate = this.commonSelectUpdate.bind(this);
    this.commonSelectUpdateNew = this.commonSelectUpdateNew.bind(this);
    this.commonNumberUpdate = this.commonNumberUpdate.bind(this);
    this.commonStringUpdate = this.commonStringUpdate.bind(this);
    this.commonBoolenUpdate = this.commonBoolenUpdate.bind(this);
    this.commonDateUpdate = this.commonDateUpdate.bind(this);
    this.state = {
      phcStatus: {
        in_aug_date: phcStatus
          ? moment(
            moment.unix(phcStatus.in_aug_date / 1000).format("MM/DD/YYYY")
          )
          : null,
        total_hr: phcStatus ? phcStatus.total_hr : null,
        mbbs_ms: phcStatus ? phcStatus.mbbs_ms : null,
        staff_nurse: phcStatus ? phcStatus.staff_nurse : null,
        no_anm_mpw: phcStatus ? phcStatus.no_anm_mpw : null,
        mpw: phcStatus ? phcStatus.mpw : null,
        no_of_lab_tech: phcStatus ? phcStatus.no_of_lab_tech : null,
        no_of_pharm: phcStatus ? phcStatus.no_of_pharm : null,
        asha: phcStatus ? phcStatus.asha : null,
        staff_nurse_com: phcStatus ? phcStatus.staff_nurse_com : null,
        staff_nurse_under: phcStatus ? phcStatus.staff_nurse_under : null,
        mo_ncd: phcStatus ? phcStatus.mo_ncd : null,
        staff_nurse_ncd: phcStatus ? phcStatus.staff_nurse_ncd : null,
        anm_mpw_ncd: phcStatus ? phcStatus.anm_mpw_ncd : null,
        ashs_ncd: phcStatus ? phcStatus.ashs_ncd : null,
        pop_enum_started: phcStatus ? phcStatus.pop_enum_started : null,
        pop_coverage: phcStatus ? phcStatus.pop_coverage : null,
        indi_enum_till: phcStatus ? phcStatus.indi_enum_till : null,
        screen_start_diabetes: phcStatus
          ? phcStatus.screen_start_diabetes
          : null,
        screen_diabetes_examined: phcStatus
          ? phcStatus.screen_diabetes_examined
          : null,
        screen_start_hyperten: phcStatus
          ? phcStatus.screen_start_hyperten
          : null,
        screen_hyperten_examined: phcStatus
          ? phcStatus.screen_hyperten_examined
          : null,
        screen_start_oral_can: phcStatus
          ? phcStatus.screen_start_oral_can
          : null,
        screen_oral_can_examined: phcStatus
          ? phcStatus.screen_oral_can_examined
          : null,
        screen_start_breast_can: phcStatus
          ? phcStatus.screen_start_breast_can
          : null,
        screen_breast_can_examined: phcStatus
          ? phcStatus.screen_breast_can_examined
          : null,
        screen_start_cervical_can: phcStatus
          ? phcStatus.screen_start_cervical_can
          : null,
        screen_cervical_can_examined: phcStatus
          ? phcStatus.screen_cervical_can_examined
          : null,
        yoga_session: phcStatus ? phcStatus.yoga_session : null,
        med_edl_avail: phcStatus ? phcStatus.med_edl_avail : null,
        diag_avail: phcStatus ? phcStatus.diag_avail : null,
        bp_app_count: phcStatus ? phcStatus.bp_app_count : null,
        fsaa_app_count: phcStatus ? phcStatus.fsaa_app_count : null,
        tab_avail: phcStatus ? phcStatus.tab_avail : null,
        desktop_avail: phcStatus ? phcStatus.desktop_avail : null,
        laptop_avail: phcStatus ? phcStatus.laptop_avail : null,
        ncd_nic_app_used: phcStatus ? phcStatus.ncd_nic_app_used : null,
        net_connect: phcStatus ? phcStatus.net_connect : null,
        isp: phcStatus ? phcStatus.isp : null,
        infra_completed: phcStatus ? phcStatus.infra_completed : null,
        building_type: phcStatus ? phcStatus.building_type : null,
        phc_painted: phcStatus ? phcStatus.phc_painted : null,
        chairs_avail: phcStatus ? phcStatus.chairs_avail : null,
        wellness_room_avail: phcStatus ? phcStatus.wellness_room_avail : null,
        phc_biomed_fac: phcStatus ? phcStatus.phc_biomed_fac : null,
        two_lang_phc: phcStatus ? phcStatus.two_lang_phc : null,
        male_toilet: phcStatus ? phcStatus.male_toilet : null,
        female_toilet: phcStatus ? phcStatus.female_toilet : null,
        water_avail: phcStatus ? phcStatus.water_avail : null,
        power_backup: phcStatus ? phcStatus.power_backup : null,
        bpApparatusManual: phcStatus ? phcStatus.bpApparatusManual : null,
        bpApparatusElectronic: phcStatus ? phcStatus.bpApparatusElectronic : null,
        bpPregnancyLargecuff: phcStatus ? phcStatus.bpPregnancyLargecuff : null,
        stethoscope: phcStatus ? phcStatus.stethoscope : null,
        inchTape: phcStatus ? phcStatus.inchTape : null,
        weighingMachineAdult: phcStatus ? phcStatus.weighingMachineAdult : null,
        weighingMachinePaediatric: phcStatus ? phcStatus.weighingMachinePaediatric : null,
        heightScale: phcStatus ? phcStatus.heightScale : null,
        torchLight: phcStatus ? phcStatus.torchLight : null,
        thermometerMercury: phcStatus ? phcStatus.thermometerMercury : null,
        thermometerElectronic: phcStatus ? phcStatus.thermometerElectronic : null,
        hubCutter: phcStatus ? phcStatus.hubCutter : null,
        bowls: phcStatus ? phcStatus.bowls : null,
        plasticTray: phcStatus ? phcStatus.plasticTray : null,
        fetoscope: phcStatus ? phcStatus.fetoscope : null,
        fetalDoppler: phcStatus ? phcStatus.fetalDoppler : null,
        glucometer: phcStatus ? phcStatus.glucometer : null,
        haemoglobinometer: phcStatus ? phcStatus.haemoglobinometer : null,
        doubleRackSterilizer: phcStatus ? phcStatus.doubleRackSterilizer : null,
        stainlessSteelTray: phcStatus ? phcStatus.stainlessSteelTray : null,
        stainlessSteelTrayCover: phcStatus ? phcStatus.stainlessSteelTrayCover : null,
        kidneyTray: phcStatus ? phcStatus.kidneyTray : null,
        arteryForceps: phcStatus ? phcStatus.arteryForceps : null,
        dissectingForceps: phcStatus ? phcStatus.dissectingForceps : null,
        spongeHoldingForceps: phcStatus ? phcStatus.spongeHoldingForceps : null,
        vulsellum: phcStatus ? phcStatus.vulsellum : null,
        scissors: phcStatus ? phcStatus.scissors : null,
        speculumBig: phcStatus ? phcStatus.speculumBig : null,
        speculumSmall: phcStatus ? phcStatus.speculumSmall : null,
        silverBasin: phcStatus ? phcStatus.silverBasin : null,
        mucusSucker: phcStatus ? phcStatus.mucusSucker : null,
        spiritLamp: phcStatus ? phcStatus.spiritLamp : null,
        breastPump: phcStatus ? phcStatus.breastPump : null,
        examinationTable: phcStatus ? phcStatus.examinationTable : null,
        steelBench: phcStatus ? phcStatus.steelBench : null,
        plasticchair: phcStatus ? phcStatus.plasticchair : null,
        table: phcStatus ? phcStatus.table : null,
        almirahBureau: phcStatus ? phcStatus.almirahBureau : null,
        stool: phcStatus ? phcStatus.stool : null,
        footStool: phcStatus ? phcStatus.footStool : null,
        dustbinBMWMRed: phcStatus ? phcStatus.dustbinBMWMRed : null,
        bustbinBMWMBlack: phcStatus ? phcStatus.bustbinBMWMBlack : null,
        dustbinBMWMYellow: phcStatus ? phcStatus.dustbinBMWMYellow : null,
        dustbinBMWMBlue: phcStatus ? phcStatus.dustbinBMWMBlue : null,
        dustbinOthers: phcStatus ? phcStatus.dustbinOthers : null,
        cot: phcStatus ? phcStatus.cot : null,
        gasStove: phcStatus ? phcStatus.gasStove : null,
        gasCyclinder: phcStatus ? phcStatus.gasCyclinder : null,
        emergnecyChargerLight: phcStatus ? phcStatus.emergnecyChargerLight : null
      }
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    // COMPARE AND CHECK;
    let update = false;
    if (nextProps.phcStatus) {
      Object
        .keys(nextProps.phcStatus)
        .map(k => {
          if (nextProps.phcStatus[k] !== this.state.phcStatus[k]) {
            update = true;
          }
        });
      if (update) {
        console.info('nextProps.phcStatus', nextProps.phcStatus);
        this.setState({ phcStatus: nextProps.phcStatus }, () => console.info('this.state', this.state))
      }
    }
  }

  async commonSelectUpdateNew(e, type) {
    const changes = this.state;
    let test = e.map(te => te.value).toString();
    changes.phcStatus[type] = test;
    this.setState(changes);
  }
  async commonSelectUpdate(e, name) {
    const changes = this.state;
    changes.phcStatus[name] = e.value;
    this.setState(changes);
  }
  async commonStringUpdate(e, name) {
    const changes = this.state;
    changes.phcStatus[name] = e.target.value;
    this.setState(changes);
  }

  async commonBoolenUpdate(e, name) {
    const changes = this.state;
    changes.phcStatus[name] = e.target.value;
    this.setState(changes);
  }

  async commonNumberUpdate(e, name) {
    if (e.target.value >= 0) {
      const changes = this.state;
      changes.phcStatus[name] = e.target.value;
      this.setState(changes);
    }
  }
  async commonDateUpdate(e) {
    const changes = this.state;
    changes.phcStatus["in_aug_date"] = e;
    this.setState(changes);
  }
  async generateReport() {
    try {
      const alias = this.props.auth.user.alias;
      if (alias === "district" || alias === 'hud' || alias === 'block' || alias === 'state') {
        const { data } = await this.props.client.query({
          query: gql`{
            getPHCstatus(
                  created_by:"${this.props.auth.user.user_id}",
                alias:"${this.props.auth.user.alias}"
                district_id:${this.props.auth.user.district_id}
                )
              {
                phc_user{
                  phc_User {
                    phc_name
              institution_name
              gp_type
              institution_type
              type_id
                  }
                  username
                  User_to_district
                  { district_id district_name }
                  user_to_block
                  { block_id block_name block_gis_id }
                  user_to_hud
                  { hud_id hud_name hud_gis_id }
                }
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
              }`
        });
        this.state.downloadContent = data.getPHCstatus;
        this.setState(this.state);
        this.forceUpdate();
      } else {
        const { data } = await this.props.client.query({
          query: gql`{
            getPHCstatus(
                  created_by:"${this.props.auth.user.user_id}",
                alias:"${this.props.auth.user.alias}"
                )
              {
                phc_user{
                  username
                  phc_User {
                    phc_name
              institution_name
              gp_type
              institution_type
              type_id
                  }
                  User_to_district
                  { district_id district_name }
                  user_to_block
                  { block_id block_name block_gis_id }
                  user_to_hud
                  { hud_id hud_name hud_gis_id }
                }
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
              }`
        });
        this.state.downloadContent = data.getPHCstatus;
        this.setState(this.state);
        this.forceUpdate();
      }
    } catch (e) {
      this.props.alert.error("No data available to pull");
    }
  }
  async submitData() {
    const { phcStatus } = this.state;
    const { data } = await this.props.client.mutate({
      mutation: gql`
      mutation{
        updatePHCStatus(
          user_id:"${this.props.auth.user.user_id}"
          in_aug_date:${
        phcStatus.in_aug_date ? `"${phcStatus.in_aug_date.toDate()}"` : null
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
      `
    });
    if (data) {
      this.props.refetch();
      this.props.alert.success("Saved");
    } else {
      this.props.refetch();
      this.props.alert.success("Error while saving");
    }
  }
  componentDidMount() {
    setTimeout(() => {
      // console.clear();
    }, 1000);
  }

  savePhcStatusOffline = async () => {
    const { phcStatus: getPhcData } = this.state;
    try {
      await phcProfileSave(getPhcData);
      this.props.refetch();
      this.props.alert.success("Saved offline");
    } catch (error) {
      this.props.alert.success("Error saving offline");
    }
  }

  render() {
    const serviceProvider = [
      { value: "Airtel", label: "1.Airtel" },
      { value: "BSNL", label: "2.BSNL" },
      { value: "Idea", label: "3.Idea" },
      { value: "Jio", label: "4. Jio" },
      { value: "Vodafone", label: "5.Vodafone" },
      { value: "Others", label: "6.Others" }
    ];
    const powerBackOptions = [
      { value: "invertor", label: "Invertor" },
      { value: "generator", label: "Generator" },
      { value: "solar", label: "Solar" },
      { value: "nil", label: "Nil" }
    ];
    const { phcStatus, downloadContent } = this.state;
    const userData = this.props.auth.user;
    return (
      <Container fluid className={styles.bgcontentProf}>
        {/* PHC Users only start */}
        <Row className={styles.subHeader} style={{ backgroundColor: '#f8f8f8' }} >
          <Col lg="10" md="10" xs="6" className={styles.pageMenu}>
            <PageList currentURL={window.location.pathname.split("/")[2]} userData={this.props.auth.user} />
            {/* <DisplayPages currentURL={pageType === 'labList' ? 'lablist' : 'linelist'} userData={this.props.auth.user} /> */}
          </Col>
          <Col lg="2" md="2" xs="6" >
            <span
              onClick={this.changeValue}
              className={styles.dwnldbtn}
            >
              {/* <i
                  className={"fa fa-pencil-square-o " + styles.editIcon}
                /> */}
              {/* <Col md='4' xs='4' lg='4' style={{ textAlign: 'right',float:'right' }} className={styles.dwnldbtn}> */}
              {!downloadContent && (
                <button
                  className={styles.btn}
                  onClick={() => {
                    this.generateReport();
                  }}
                >
                  <i className="fa fa-download" />
                  <span className={styles.reportText}>
                    Generate Report
                    </span>
                </button>
              )}
              {downloadContent && (
                <span className={styles.dwnldbtn} onClick={() => { }}>
                  <Download content={downloadContent} user={userData} />
                </span>
              )}
              {/* </Col> */}
            </span>
          </Col>
        </Row>
        <Row>
          <Col md="12" lg="12">
            <Container fluid>
              <Row>
                <Col md="12" lg={{ size: 10, offset: 1 }}>
                  <Container
                    fluid
                    className={styles.inpatient}
                    style={{ marginBottom: "50px" }}
                  >
                    {/* <h6 className={styles.tital}>PHC Status</h6>
                    <hr className={styles.underline} />  */}
                    <Row>
                      <Col
                        md={{ size: 10, offset: 1 }}
                        className={styles.inputOffset}
                      >
                        <Row>
                          <Col lg="12" className={styles.titalHeader}>
                            <h5 style={{ display: "inline-block" }}>
                              <p style={{ marginBottom: "5px" }}>General</p>
                            </h5>
                          </Col>
                          <Col
                            md="12"
                            className={styles.dateWidth}
                            style={{ marginBottom: "15px" }}
                          >
                            <Row>
                              <Col md="6">
                                <label>Date of inauguration</label>
                              </Col>
                              <Col md="6">
                                <DatePicker
                                  selected={ phcStatus.in_aug_date ? Number(phcStatus.in_aug_date) ?  moment(Number(phcStatus.in_aug_date)) :  phcStatus.in_aug_date : ''}
                                  onChange={e => {
                                    this.commonDateUpdate(e, "in_aug_date");
                                  }}
                                  maxDate={moment()}
                                  placeholderText="DD/MM/YYYY"
                                  dateFormat="DD/MM/YYYY"
                                  className={styles.databorder}
                                />
                              </Col>
                            </Row>
                          </Col>
                          {/* Human Resource in position */}
                          <Col lg="12" className={styles.titalHeader}>
                            <h5>
                              <p>Human Resource in position</p>
                            </h5>
                          </Col>
                          <Col md="12">
                            <Row>
                              <Col lg="6" md="6">
                                <label>Total HR under the facility</label>
                              </Col>
                              <Col md="6">
                                <Inputtext
                                  type="text"
                                  onChange={e => {
                                    this.commonNumberUpdate(e, "total_hr");
                                  }}
                                  value={
                                    phcStatus.total_hr ? phcStatus.total_hr : ""
                                  }
                                  classname={styles.inputstyle}
                                  placeholder="Enter total no of HR"
                                  name="Name"
                                />
                              </Col>
                              <Col lg="6" md="6">
                                <label>MBBS-MO in position</label>
                              </Col>
                              <Col md="6">
                                <Inputtext
                                  onChange={e => {
                                    this.commonNumberUpdate(e, "mbbs_ms");
                                  }}
                                  value={
                                    phcStatus.mbbs_ms ? phcStatus.mbbs_ms : ""
                                  }
                                  type="text"
                                  classname={styles.inputstyle}
                                  placeholder="Enter total no of MBBS-MO"
                                  name="Name"
                                />
                              </Col>
                              <Col lg="6" md="6">
                                <label>Staff Nurse</label>
                              </Col>
                              <Col md="6">
                                <Inputtext
                                  onChange={e => {
                                    this.commonNumberUpdate(e, "staff_nurse");
                                  }}
                                  value={
                                    phcStatus.staff_nurse
                                      ? phcStatus.staff_nurse
                                      : ""
                                  }
                                  type="text"
                                  classname={styles.inputstyle}
                                  placeholder="Enter no of Staff Nurse"
                                  name="Name"
                                />
                              </Col>
                              <Col lg="6" md="6">
                                <label>No of ANM/MPW(F)</label>
                              </Col>
                              <Col md="6">
                                <Inputtext
                                  onChange={e => {
                                    this.commonNumberUpdate(e, "no_anm_mpw");
                                  }}
                                  value={
                                    phcStatus.no_anm_mpw
                                      ? phcStatus.no_anm_mpw
                                      : ""
                                  }
                                  type="text"
                                  classname={styles.inputstyle}
                                  placeholder="Enter Total no of ANM/MPW(F)"
                                  name="Name"
                                />
                              </Col>
                              <Col lg="6" md="6">
                                <label>Health Inspector</label>
                              </Col>
                              <Col md="6">
                                <Inputtext
                                  onChange={e => {
                                    this.commonNumberUpdate(e, "mpw");
                                  }}
                                  value={phcStatus.mpw ? phcStatus.mpw : ""}
                                  type="text"
                                  classname={styles.inputstyle}
                                  placeholder="Enter total no of Health Inspector"
                                  name="Name"
                                />
                              </Col>
                              <Col md="6">
                                <label>No. of Lab technician</label>
                              </Col>
                              <Col md="6">
                                <Inputtext
                                  onChange={e => {
                                    this.commonNumberUpdate(
                                      e,
                                      "no_of_lab_tech"
                                    );
                                  }}
                                  value={
                                    phcStatus.no_of_lab_tech
                                      ? phcStatus.no_of_lab_tech
                                      : ""
                                  }
                                  type="text"
                                  classname={styles.inputstyle}
                                  placeholder="Enter no of lab technician"
                                  name="Name"
                                />
                              </Col>
                              <Col md="6">
                                <label>No. of Pharmacist</label>
                              </Col>
                              <Col md="6">
                                <Inputtext
                                  onChange={e => {
                                    this.commonNumberUpdate(e, "no_of_pharm");
                                  }}
                                  value={
                                    phcStatus.no_of_pharm
                                      ? phcStatus.no_of_pharm
                                      : ""
                                  }
                                  type="text"
                                  classname={styles.inputstyle}
                                  placeholder="Enter no of pharmacist"
                                  name="Name"
                                />
                              </Col>
                              <Col lg="6" md="6">
                                <label>ASHAs</label>
                              </Col>
                              <Col md="6">
                                <Inputtext
                                  onChange={e => {
                                    this.commonNumberUpdate(e, "asha");
                                  }}
                                  value={phcStatus.asha ? phcStatus.asha : ""}
                                  type="text"
                                  classname={styles.inputstyle}
                                  placeholder="Enter Total no of ASHAs"
                                  name="Name"
                                />
                              </Col>
                              {/* end */}
                              {/* Training of  Human Resource completed on NCDs as per training strategy */}
                              <Col lg="12" className={styles.titalHeader}>
                                <h5>
                                  <p>
                                    Training of Human Resource completed on NCDs
                                    as per training strategy
                                  </p>
                                </h5>
                              </Col>
                              <Col md="12">
                                <Row>
                                  <Col lg="6">
                                    <label>
                                      No of Staff Nurses Completed (1 month CPHC
                                      Training)
                                    </label>
                                  </Col>
                                  <Col md="6">
                                    <Inputtext
                                      onChange={e => {
                                        this.commonNumberUpdate(
                                          e,
                                          "staff_nurse_com"
                                        );
                                      }}
                                      value={
                                        phcStatus.staff_nurse_com
                                          ? phcStatus.staff_nurse_com
                                          : ""
                                      }
                                      type="text"
                                      classname={styles.inputstyle}
                                      placeholder="Enter No of Staff Nurses Completed (1 month CPHC Training)"
                                      name="Name"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col md="12">
                                <Row>
                                  <Col lg="6">
                                    <label>
                                      No of Staff Nurses Undergoing (1 month
                                      CPHC Training)
                                    </label>
                                  </Col>
                                  <Col md="6">
                                    <Inputtext
                                      onChange={e => {
                                        this.commonNumberUpdate(
                                          e,
                                          "staff_nurse_under"
                                        );
                                      }}
                                      value={
                                        phcStatus.staff_nurse_under
                                          ? phcStatus.staff_nurse_under
                                          : ""
                                      }
                                      type="text"
                                      classname={styles.inputstyle}
                                      placeholder="Enter No of Staff Nurses Undergoing (1 month CPHC Training)"
                                      name="Name"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col md="12">
                                <Row>
                                  <Col lg="6">
                                    <label>MOs NCD Training Status</label>
                                  </Col>

                                  <Col lg="6">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "mo_ncd"
                                              );
                                            }}
                                            checked={
                                              phcStatus.mo_ncd === "true"
                                                ? true
                                                : false
                                            }
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                            value={true}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "mo_ncd"
                                              );
                                            }}
                                            checked={
                                              phcStatus.mo_ncd === "false"
                                                ? true
                                                : false
                                            }
                                            value={false}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Col>
                              <Col md="12">
                                <Row>
                                  <Col lg="6">
                                    <label>Staff Nurses NCD Training Status</label>
                                  </Col>

                                  <Col lg="6">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "staff_nurse_ncd"
                                              );
                                            }}
                                            checked={
                                              phcStatus.staff_nurse_ncd ===
                                                "true"
                                                ? true
                                                : false
                                            }
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                            value={true}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "staff_nurse_ncd"
                                              );
                                            }}
                                            checked={
                                              phcStatus.staff_nurse_ncd ===
                                                "false"
                                                ? true
                                                : false
                                            }
                                            value={false}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Col>
                              <Col md="12">
                                <Row>
                                  <Col lg="6">
                                    <label>ANM/MPW(F) NCD Training Status</label>
                                  </Col>

                                  <Col lg="6">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "anm_mpw_ncd"
                                              );
                                            }}
                                            checked={
                                              phcStatus.anm_mpw_ncd === "true"
                                                ? true
                                                : false
                                            }
                                            value={true}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                            valid="yes"
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "anm_mpw_ncd"
                                              );
                                            }}
                                            checked={
                                              phcStatus.anm_mpw_ncd === "false"
                                                ? true
                                                : false
                                            }
                                            value={false}
                                            name="MPW"
                                            valid="no"
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Col>
                              <Col md="12">
                                <Row>
                                  <Col lg="6">
                                    <label>ASHAs NCD Training Status</label>
                                  </Col>

                                  <Col lg="6">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "ashs_ncd"
                                              );
                                            }}
                                            checked={
                                              phcStatus.ashs_ncd === "true"
                                                ? true
                                                : false
                                            }
                                            value={true}
                                            name="ASHAs"
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "ashs_ncd"
                                              );
                                            }}
                                            checked={
                                              phcStatus.ashs_ncd === "false"
                                                ? true
                                                : false
                                            }
                                            value={false}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Col>
                              {/* end */}
                              {/* Community Outreach */}
                              <Col lg="12" className={styles.titalHeader}>
                                <h5>
                                  <p>Community Outreach</p>
                                </h5>
                              </Col>
                              <Col md="12">
                                <Row>
                                  <Col lg="6">
                                    <label>
                                      Population enumeration started
                                    </label>
                                  </Col>
                                  <Col lg="6">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "pop_enum_started"
                                              );
                                            }}
                                            checked={
                                              phcStatus.pop_enum_started ===
                                                "true"
                                                ? true
                                                : false
                                            }
                                            value={true}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "pop_enum_started"
                                              );
                                            }}
                                            checked={
                                              phcStatus.pop_enum_started ===
                                                "false"
                                                ? true
                                                : false
                                            }
                                            value={false}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg="6">
                                <label>Population Coverge</label>
                              </Col>
                              <Col lg="6">
                                <Inputtext
                                  onChange={e => {
                                    this.commonNumberUpdate(e, "pop_coverage");
                                  }}
                                  value={
                                    phcStatus.pop_coverage
                                      ? phcStatus.pop_coverage
                                      : ""
                                  }
                                  type="text"
                                  classname={styles.inputstyle}
                                  placeholder="Enter Number of Population Coverge "
                                  name="Name"
                                />
                              </Col>
                              <Col md="6">
                                <label>Individuals enumerated till now</label>
                              </Col>
                              <Col md="6">
                                <Inputtext
                                  onChange={e => {
                                    this.commonNumberUpdate(
                                      e,
                                      "indi_enum_till"
                                    );
                                  }}
                                  value={
                                    phcStatus.indi_enum_till
                                      ? phcStatus.indi_enum_till
                                      : ""
                                  }
                                  type="text"
                                  classname={styles.inputstyle}
                                  placeholder="Enter no of Individuals enumerated till now "
                                  name="Name"
                                />
                              </Col>
                              {/* end */}
                              {/* Service Delivery */}
                              <Col lg="12" className={styles.titalHeader}>
                                <h5>
                                  <p>Service Delivery</p>
                                </h5>
                              </Col>
                              <Col md="12">
                                <Row>
                                  <Col lg="6">
                                    <label>
                                      Universal Screening of NCD Started for
                                      Diabetes
                                    </label>
                                  </Col>
                                  <Col lg="6">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "screen_start_diabetes"
                                              );
                                            }}
                                            checked={
                                              phcStatus.screen_start_diabetes ===
                                                "true"
                                                ? true
                                                : false
                                            }
                                            value={true}
                                            name="Diabetes"
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                            valid="yes"
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "screen_start_diabetes"
                                              );
                                            }}
                                            checked={
                                              phcStatus.screen_start_diabetes ===
                                                "false"
                                                ? true
                                                : false
                                            }
                                            value={false}
                                            name="Diabetes"
                                            valid="no"
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <label>
                                      Individuals Examined (Diabetes)
                                    </label>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <Inputtext
                                      onChange={e => {
                                        this.commonNumberUpdate(
                                          e,
                                          "screen_diabetes_examined"
                                        );
                                      }}
                                      value={
                                        phcStatus.screen_diabetes_examined
                                          ? phcStatus.screen_diabetes_examined
                                          : ""
                                      }
                                      type="text"
                                      classname={styles.inputstyle}
                                      placeholder="Enter Individuals no of Examined (Diabetes) "
                                      name="Name"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col md="12">
                                <Row>
                                  <Col lg="6">
                                    <label>
                                      Universal Screening of NCD Start for
                                      Hypertension
                                    </label>
                                  </Col>
                                  <Col lg="6">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "screen_start_hyperten"
                                              );
                                            }}
                                            name="hypertension"
                                            checked={
                                              phcStatus.screen_start_hyperten ===
                                                "true"
                                                ? true
                                                : false
                                            }
                                            value={true}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "screen_start_hyperten"
                                              );
                                            }}
                                            name="hypertension"
                                            checked={
                                              phcStatus.screen_start_hyperten ===
                                                "false"
                                                ? true
                                                : false
                                            }
                                            value={false}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <label>
                                      Individuals Examined (Hypertension)
                                    </label>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <Inputtext
                                      onChange={e => {
                                        this.commonNumberUpdate(
                                          e,
                                          "screen_hyperten_examined"
                                        );
                                      }}
                                      value={
                                        phcStatus.screen_hyperten_examined
                                          ? phcStatus.screen_hyperten_examined
                                          : ""
                                      }
                                      type="text"
                                      classname={styles.inputstyle}
                                      placeholder="Enter Individuals no of Examined (Hypertension) "
                                      name="Name"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col md="12">
                                <Row>
                                  <Col lg="6">
                                    <label>
                                      Universal Screening of NCD Started for
                                      Oral Cancer
                                    </label>
                                  </Col>
                                  <Col lg="6">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "screen_start_oral_can"
                                              );
                                            }}
                                            checked={
                                              phcStatus.screen_start_oral_can ===
                                                "true"
                                                ? true
                                                : false
                                            }
                                            value={true}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "screen_start_oral_can"
                                              );
                                            }}
                                            checked={
                                              phcStatus.screen_start_oral_can ===
                                                "false"
                                                ? true
                                                : false
                                            }
                                            value={false}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <label>
                                      Individuals Examined (Oral Cancer)
                                    </label>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <Inputtext
                                      onChange={e => {
                                        this.commonNumberUpdate(
                                          e,
                                          "screen_oral_can_examined"
                                        );
                                      }}
                                      value={
                                        phcStatus.screen_oral_can_examined
                                          ? phcStatus.screen_oral_can_examined
                                          : ""
                                      }
                                      type="text"
                                      classname={styles.inputstyle}
                                      placeholder="Enter Individuals no of Examined (Oral Cancer)"
                                      name="Name"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col md="12">
                                <Row>
                                  <Col lg="6">
                                    <label>
                                      Universal Screening of NCD Started for
                                      Breast Cancer
                                    </label>
                                  </Col>
                                  <Col lg="6">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "screen_start_breast_can"
                                              );
                                            }}
                                            checked={
                                              phcStatus.screen_start_breast_can ===
                                                "true"
                                                ? true
                                                : false
                                            }
                                            value={true}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "screen_start_breast_can"
                                              );
                                            }}
                                            checked={
                                              phcStatus.screen_start_breast_can ===
                                                "false"
                                                ? true
                                                : false
                                            }
                                            value={false}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <label>
                                      Individuals Examined (Breast Cancer)
                                    </label>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <Inputtext
                                      onChange={e => {
                                        this.commonNumberUpdate(
                                          e,
                                          "screen_breast_can_examined"
                                        );
                                      }}
                                      value={
                                        phcStatus.screen_breast_can_examined
                                          ? phcStatus.screen_breast_can_examined
                                          : ""
                                      }
                                      type="text"
                                      classname={styles.inputstyle}
                                      placeholder="Enter Individuals no of Examined (Breast Cancer) "
                                      name="Name"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col md="12">
                                <Row>
                                  <Col lg="6">
                                    <label>
                                      Universal Screening of NCD Started for
                                      Cervical Cancer
                                    </label>
                                  </Col>
                                  <Col lg="6">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "screen_start_cervical_can"
                                              );
                                            }}
                                            checked={
                                              phcStatus.screen_start_cervical_can ===
                                                "true"
                                                ? true
                                                : false
                                            }
                                            value={true}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "screen_start_cervical_can"
                                              );
                                            }}
                                            checked={
                                              phcStatus.screen_start_cervical_can ===
                                                "false"
                                                ? true
                                                : false
                                            }
                                            value={false}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <label>
                                      Individuals Examined (Cervical Cancer)
                                    </label>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <Inputtext
                                      onChange={e => {
                                        this.commonNumberUpdate(
                                          e,
                                          "screen_cervical_can_examined"
                                        );
                                      }}
                                      value={
                                        phcStatus.screen_cervical_can_examined
                                          ? phcStatus.screen_cervical_can_examined
                                          : ""
                                      }
                                      type="text"
                                      classname={styles.inputstyle}
                                      placeholder="Enter Individuals no of Examined (Cervical Cancer) "
                                      name="Name"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col md="12">
                                <Row>
                                  <Col lg="6">
                                    <label>
                                      Yoga session / Wellness activity initiated
                                    </label>
                                  </Col>
                                  <Col lg="6">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "yoga_session"
                                              );
                                            }}
                                            checked={
                                              phcStatus.yoga_session === "true"
                                                ? true
                                                : false
                                            }
                                            value={true}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "yoga_session"
                                              );
                                            }}
                                            checked={
                                              phcStatus.yoga_session === "false"
                                                ? true
                                                : false
                                            }
                                            value={false}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Col>
                              {/* end */}
                              {/* Medicines */}
                              <Col lg="12" className={styles.titalHeader}>
                                <h5>
                                  <p>Medicines</p>
                                </h5>
                              </Col>
                              <Col md="12">
                                <Row>
                                  <Col lg="6">
                                    <label>
                                      Medicines available as per EDL list
                                    </label>
                                  </Col>
                                  <Col lg="6">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "med_edl_avail"
                                              );
                                            }}
                                            checked={
                                              phcStatus.med_edl_avail === "true"
                                                ? true
                                                : false
                                            }
                                            value={true}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "med_edl_avail"
                                              );
                                            }}
                                            checked={
                                              phcStatus.med_edl_avail ===
                                                "false"
                                                ? true
                                                : false
                                            }
                                            value={false}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Col>
                              {/* end */}
                              {/* Diagnostics */}
                              <Col lg="12" className={styles.titalHeader}>
                                <h5>
                                  <p>Diagnostics</p>
                                </h5>
                              </Col>
                              <Col md="12" lg="12" sm="12" xs="12">
                                <Row>
                                  <Col lg="6" sm="12" xs="12">
                                    <label>
                                      Diagnostics/Consumables available as per
                                      guidlines
                                    </label>
                                  </Col>
                                  <Col lg="6" sm="12" xs="12">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "diag_avail"
                                              );
                                            }}
                                            checked={
                                              phcStatus.diag_avail === "true"
                                                ? true
                                                : false
                                            }
                                            value={true}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "diag_avail"
                                              );
                                            }}
                                            checked={
                                              phcStatus.diag_avail === "false"
                                                ? true
                                                : false
                                            }
                                            value={false}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  {/* <Col lg="6" md="6" sm="12" xs="12">
                                    <label>No of BP Apparatus</label>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <Inputtext
                                      onChange={e => {
                                        this.commonNumberUpdate(
                                          e,
                                          "bp_app_count"
                                        );
                                      }}
                                      value={
                                        phcStatus.bp_app_count
                                          ? phcStatus.bp_app_count
                                          : ""
                                      }
                                      type="text"
                                      classname={styles.inputstyle}
                                      placeholder="Enter No of BP Apparatus "
                                      name="Name"
                                    />
                                  </Col> */}
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <label>
                                      No of Functional Semi Auto Analyzer
                                    </label>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <Inputtext
                                      onChange={e => {
                                        this.commonNumberUpdate(
                                          e,
                                          "fsaa_app_count"
                                        );
                                      }}
                                      value={
                                        phcStatus.fsaa_app_count
                                          ? phcStatus.fsaa_app_count
                                          : ""
                                      }
                                      type="text"
                                      classname={styles.inputstyle}
                                      placeholder="Enter No of Functional Semi Auto Analyzer "
                                      name="Name"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              {/* end */}
                              {/* Function IT equipment */}
                              <Col lg="12" className={styles.titalHeader}>
                                <h5>
                                  <p>Function IT equipment</p>
                                </h5>
                              </Col>
                              <Col md="12" lg="12" sm="12" xs="12">
                                <Row>
                                  <Col lg="6" sm="12" xs="12">
                                    <label>No of Functional Tablets-PC</label>
                                  </Col>
                                  <Col md="6">
                                    <Inputtext
                                      onChange={e => {
                                        this.commonNumberUpdate(e, "tab_avail");
                                      }}
                                      value={
                                        phcStatus.tab_avail
                                          ? phcStatus.tab_avail
                                          : ""
                                      }
                                      type="text"
                                      classname={styles.inputstyle}
                                      placeholder="Enter No of Functional Tablets-PC"
                                      name="Name"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col md="12" lg="12" sm="12" xs="12">
                                <Row>
                                  <Col lg="6" sm="12" xs="12">
                                    <label>No of Functional Desktop-PC</label>
                                  </Col>
                                  <Col md="6">
                                    <Inputtext
                                      onChange={e => {
                                        this.commonNumberUpdate(
                                          e,
                                          "desktop_avail"
                                        );
                                      }}
                                      value={
                                        phcStatus.desktop_avail
                                          ? phcStatus.desktop_avail
                                          : ""
                                      }
                                      type="text"
                                      classname={styles.inputstyle}
                                      placeholder="Enter No of Functional Desktop-PC"
                                      name="Name"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col md="12" lg="12" sm="12" xs="12">
                                <Row>
                                  <Col lg="6" sm="12" xs="12">
                                    <label>No of functional Laptop-PC</label>
                                  </Col>
                                  <Col md="6">
                                    <Inputtext
                                      onChange={e => {
                                        this.commonNumberUpdate(
                                          e,
                                          "laptop_avail"
                                        );
                                      }}
                                      value={
                                        phcStatus.laptop_avail
                                          ? phcStatus.laptop_avail
                                          : ""
                                      }
                                      type="text"
                                      classname={styles.inputstyle}
                                      placeholder="Enter No of functional Laptop-PC"
                                      name="Name"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col md="12" lg="12" sm="12" xs="12">
                                <Row>
                                  <Col lg="6" sm="12" xs="12">
                                    <label>
                                      NCD NIC application being used
                                    </label>
                                  </Col>
                                  <Col lg="6" sm="12" xs="12">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "ncd_nic_app_used"
                                              );
                                            }}
                                            checked={
                                              phcStatus.ncd_nic_app_used ===
                                                "true"
                                                ? true
                                                : false
                                            }
                                            value={true}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "ncd_nic_app_used"
                                              );
                                            }}
                                            checked={
                                              phcStatus.ncd_nic_app_used ===
                                                "false"
                                                ? true
                                                : false
                                            }
                                            value={false}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Col>
                              <Col md="12" lg="12" sm="12" xs="12">
                                <Row>
                                  <Col lg="6" sm="12" xs="12">
                                    <label>
                                      Net Connectivity at the HWCS based on
                                      signal feasibilty of that area
                                    </label>
                                  </Col>
                                  <Col lg="6" sm="12" xs="12">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "net_connect"
                                              );
                                            }}
                                            checked={
                                              phcStatus.net_connect === "true"
                                                ? true
                                                : false
                                            }
                                            value={true}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "net_connect"
                                              );
                                            }}
                                            checked={
                                              phcStatus.net_connect === "false"
                                                ? true
                                                : false
                                            }
                                            value={false}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Col>
                              <Col
                                md="12"
                                style={{
                                  padding: "15px",
                                  backgroundColor: "#ddd",
                                  marginBottom: "15px"
                                }}
                              >
                                <label>
                                  If Yes, pl mention the name of the Service
                                  Provider.
                                </label>
                                <Row>
                                  <Col lg="6" className={styles.selectHight}>
                                    <SelectList
                                      onChange={e => {
                                        this.commonSelectUpdate(e, "isp");
                                      }}
                                      value={
                                        phcStatus.isp
                                          ? serviceProvider.filter(
                                            service =>
                                              service.value === phcStatus.isp
                                          )
                                          : null
                                      }
                                      options={serviceProvider}
                                      placeholder="Select service provider"
                                      name="status"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg="12" style={{ padding: "0px" }}>
                                <Col lg="12" className={styles.titalHeader}>
                                  <h5 style={{ display: "inline-block" }}>
                                    <p style={{ marginBottom: "5px" }}>
                                      Equipment
                                    </p>
                                  </h5>
                                </Col>
                                <Table className={styles.tableAccess}>
                                  <thead>
                                    <tr>
                                      <th>Name of item</th>
                                      <th>Nos</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {equipmentStatus &&
                                      equipmentStatus.map((value, i) => {
                                        return (value.type === 'All' || value.type === 'Phc') &&
                                          <tr>
                                            <td>
                                              <label>{value.label}</label>
                                            </td>
                                            <td>
                                              <Inputtext
                                                type="text"
                                                classname={styles.tableInput}
                                                onChange={e => {
                                                  this.commonNumberUpdate(e, `${value.varName}`);
                                                }}
                                                value={phcStatus[value.varName] ? phcStatus[value.varName] : ""}
                                                placeholder={`Enter no of ${
                                                  value.label
                                                  }`}
                                                name="Name"
                                              />
                                            </td>
                                          </tr>
                                      })}
                                  </tbody>
                                </Table>
                              </Col>
                              {/* end */}
                              {/* Infrastructure */}
                              <Col lg="12" className={styles.titalHeader}>
                                <h5>
                                  <p>Infrastructure</p>
                                </h5>
                              </Col>
                              <Col md="12" lg="12" sm="12" xs="12">
                                <Row>
                                  <Col lg="6" sm="12" xs="12">
                                    <label>
                                      Infrastructure Repair / Renovation
                                      completed
                                    </label>
                                  </Col>
                                  <Col lg="6" sm="12" xs="12">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "infra_completed"
                                              );
                                            }}
                                            checked={
                                              phcStatus.infra_completed ===
                                                "true"
                                                ? true
                                                : false
                                            }
                                            value={true}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "infra_completed"
                                              );
                                            }}
                                            checked={
                                              phcStatus.infra_completed ===
                                                "false"
                                                ? true
                                                : false
                                            }
                                            value={false}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" sm="12" xs="12">
                                    <label>Type of building</label>
                                  </Col>
                                  <Col lg="6" sm="12" xs="12">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "building_type"
                                              );
                                            }}
                                            checked={
                                              phcStatus.building_type ===
                                                "Government"
                                                ? true
                                                : false
                                            }
                                            value={"Government"}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Government</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "building_type"
                                              );
                                            }}
                                            checked={
                                              phcStatus.building_type ===
                                                "Rentfree"
                                                ? true
                                                : false
                                            }
                                            value={"Rentfree"}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Rentfree</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "building_type"
                                              );
                                            }}
                                            checked={
                                              phcStatus.building_type ===
                                                "Rented"
                                                ? true
                                                : false
                                            }
                                            value={"Rented"}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Rented</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" sm="12" xs="12">
                                    <label>PHC painted as per norms</label>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "phc_painted"
                                              );
                                            }}
                                            checked={
                                              phcStatus.phc_painted === "true"
                                                ? true
                                                : false
                                            }
                                            value={true}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "phc_painted"
                                              );
                                            }}
                                            checked={
                                              phcStatus.phc_painted === "false"
                                                ? true
                                                : false
                                            }
                                            value={false}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <label>
                                      Whether PHC been provided with Patient
                                      Waiting area with 10-15 Chairs?
                                    </label>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "chairs_avail"
                                              );
                                            }}
                                            checked={
                                              phcStatus.chairs_avail === "true"
                                                ? true
                                                : false
                                            }
                                            value={true}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "chairs_avail"
                                              );
                                            }}
                                            checked={
                                              phcStatus.chairs_avail === "false"
                                                ? true
                                                : false
                                            }
                                            value={false}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <label>
                                      Whether PHC been provided with Wellness
                                      Room for Yoga?
                                    </label>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "wellness_room_avail"
                                              );
                                            }}
                                            checked={
                                              phcStatus.wellness_room_avail ===
                                                "Same"
                                                ? true
                                                : false
                                            }
                                            value={"Same"}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Same building</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "wellness_room_avail"
                                              );
                                            }}
                                            checked={
                                              phcStatus.wellness_room_avail ===
                                                "NIL"
                                                ? true
                                                : false
                                            }
                                            value={"NIL"}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Nil</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <label>
                                      Whether PHC been provided with Biomedical
                                      waste facility?{" "}
                                    </label>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <Label
                                      check
                                      className={styles.radioBtnStyles}
                                    >
                                      <Input
                                        onChange={e => {
                                          this.commonBoolenUpdate(
                                            e,
                                            "phc_biomed_fac"
                                          );
                                        }}
                                        checked={
                                          phcStatus.phc_biomed_fac ===
                                            "Same"
                                            ? true
                                            : false
                                        }
                                        value={"Same"}
                                        type="radio"
                                        style={{ zoom: "1.6" }}
                                      />
                                      <h6>Yes</h6>
                                    </Label>
                                    <Label
                                      check
                                      className={styles.radioBtnStyles}
                                    >
                                      <Input
                                        onChange={e => {
                                          this.commonBoolenUpdate(
                                            e,
                                            "phc_biomed_fac"
                                          );
                                        }}
                                        checked={
                                          phcStatus.phc_biomed_fac ===
                                            "Nil"
                                            ? true
                                            : false
                                        }
                                        value={"Nil"}
                                        type="radio"
                                        style={{ zoom: "1.6" }}
                                      />
                                      <h6>No</h6>
                                    </Label>
                                    {/* <Inputtext
                                      onChange={e => {
                                        this.commonStringUpdate(
                                          e,
                                          "phc_biomed_fac"
                                        );
                                      }}
                                      value={
                                        phcStatus.phc_biomed_fac
                                          ? phcStatus.phc_biomed_fac
                                          : ""
                                      }
                                      type="text"
                                      placeholder={
                                        "Enter Whether PHC been provided with Biomedical waste facility?"
                                      }
                                      classname={styles.inputstyle}
                                    /> */}
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <label>
                                      Whether PHC branded in 2 languages as per
                                      specs communicated by O/o DPH&PM
                                    </label>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "two_lang_phc"
                                              );
                                            }}
                                            checked={
                                              phcStatus.two_lang_phc === "true"
                                                ? true
                                                : false
                                            }
                                            value={true}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "two_lang_phc"
                                              );
                                            }}
                                            checked={
                                              phcStatus.two_lang_phc === "false"
                                                ? true
                                                : false
                                            }
                                            value={false}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <label>
                                      How many  functional toilet(male) available?
                                    </label>
                                  </Col>
                                  <Col md="6">
                                    <Inputtext
                                      type="text"
                                      onChange={e => {
                                        this.commonNumberUpdate(
                                          e,
                                          "male_toilet"
                                        );
                                      }}
                                      value={
                                        phcStatus.male_toilet
                                          ? phcStatus.male_toilet
                                          : ""
                                      }
                                      classname={styles.inputstyle}
                                      placeholder="How many  functional toilet(male) available?"
                                      name="Name"
                                    />
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <label>
                                      How many  functional toilet(female) available?
                                    </label>
                                  </Col>
                                  <Col md="6">
                                    <Inputtext
                                      onChange={e => {
                                        this.commonNumberUpdate(
                                          e,
                                          "female_toilet"
                                        );
                                      }}
                                      value={
                                        phcStatus.female_toilet
                                          ? phcStatus.female_toilet
                                          : ""
                                      }
                                      type="text"
                                      classname={styles.inputstyle}
                                      placeholder="How many  functional toilet(female) available?"
                                      name="Name"
                                    />
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <label>
                                      Whether PHC has running water supply
                                      available?
                                    </label>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            type="radio"
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "water_avail"
                                              );
                                            }}
                                            checked={
                                              phcStatus.water_avail === "true"
                                                ? true
                                                : false
                                            }
                                            style={{ zoom: "1.6" }}
                                            value={true}
                                            name="PHCsupply"
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            value={false}
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "water_avail"
                                              );
                                            }}
                                            checked={
                                              phcStatus.water_avail === "false"
                                                ? true
                                                : false
                                            }
                                            name="PHCsupply"
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <label>
                                      Whether PHC has power back up?
                                    </label>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <SelectList
                                      showLabel={true}
                                      isMulti
                                      onChange={e => {
                                        this.commonSelectUpdateNew(
                                          e,
                                          "power_backup"
                                        );
                                      }}
                                      value={optionFinder(
                                        powerBackOptions,
                                        phcStatus.power_backup
                                      )}
                                      options={powerBackOptions}
                                      placeholder="Select Power backup Type"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              {/* end */}
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Container>
                </Col>
                {/* end card */}
                <Col
                  md="12"
                  lg={{ size: 10, offset: 1 }}
                  style={{ marginBottom: "30px" }}
                >
                  <Button
                    style={{ float: "right" }}
                    color="success"
                    onClick={() => {
                      if (navigator.onLine) this.submitData();
                      else this.savePhcStatusOffline();
                    }}
                  >
                    Submit
                  </Button>{" "}
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
        {/* HSC Users only End */}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(withRouter(withApollo(withAlert(Status))));
