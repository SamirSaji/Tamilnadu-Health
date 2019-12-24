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
import { optionFinder } from "../../../utils/Common";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withApollo } from "react-apollo";
import Download from "../Template/HWCStatus/Report";
import { withAlert } from "react-alert";
import {
  equipmentStatus,
  // furnitureStatus
} from "../../../static/EquipmentList";
//custom components
import SelectList from "../../common/fields/CustomSelectGroup/CustomSelectGroup";
import Inputtext from "../../common/fields/TextFieldGroup/TextFieldGroup";

// styles
import styles from "./stylesheet/hwcstyles.less";
//datapicker
import DatePicker from "react-datepicker";
import moment from "moment";

//datapicker styles
import "react-datepicker/dist/react-datepicker.css";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import PageList from "../../common/PageList/PageList";
import { hscProfileSave } from '../../../utils/writeToOffline';


const HSC_STATUS = 'hsc_profile';
class Status extends React.Component {
  constructor(props) {
    super(props);
    const { hwcStatus } = this.props;
    this.submitData = this.submitData.bind(this);
    this.generateReport = this.generateReport.bind(this);
    this.commonSelectUpdate = this.commonSelectUpdate.bind(this);
    this.commonNumberUpdate = this.commonNumberUpdate.bind(this);
    this.commonStringUpdate = this.commonStringUpdate.bind(this);
    this.commonBoolenUpdate = this.commonBoolenUpdate.bind(this);
    this.commonDateUpdate = this.commonDateUpdate.bind(this);
    this.commonSelectUpdateNew = this.commonSelectUpdateNew.bind(this);
    this.state = {
      hwcStatus: {
        user_id: this.props.auth.user.user_id,
        in_aug_date: hwcStatus.in_aug_date
          ? moment(
            moment.unix(hwcStatus.in_aug_date / 1000).format("MM/DD/YYYY")
          )
          : null,
        total_hr: hwcStatus ? hwcStatus.total_hr ? hwcStatus.total_hr : null : null,
        vhn_in_pos: hwcStatus ? hwcStatus.vhn_in_pos : null,
        name_vhn: hwcStatus ? hwcStatus.name_vhn : null,
        mode_of_vhn: hwcStatus ? hwcStatus.mode_of_vhn : null,
        gender_mhlp: hwcStatus ? hwcStatus.gender_mhlp : null,
        type_of_mhlp: hwcStatus ? hwcStatus.type_of_mhlp : null,
        mpw_f: hwcStatus ? hwcStatus.mpw_f : null,
        mpw_m: hwcStatus ? hwcStatus.mpw_m : null,
        asha: hwcStatus ? hwcStatus.asha : null,
        no_fem_health_vol: hwcStatus ? hwcStatus.no_fem_health_vol : null,
        mlp_training_status: hwcStatus ? hwcStatus.mlp_training_status : null,
        vhn_one_train_stat: hwcStatus ? hwcStatus.vhn_one_train_stat : null,
        asha_traing_status: hwcStatus ? hwcStatus.asha_traing_status : null,
        pop_enum_started: hwcStatus ? hwcStatus.pop_enum_started : null,
        pop_coverage: hwcStatus ? hwcStatus.pop_coverage : null,
        indi_enum_till: hwcStatus ? hwcStatus.indi_enum_till : null,
        screen_start_diabetes: hwcStatus
          ? hwcStatus.screen_start_diabetes
          : null,
        screen_diabetes_examined: hwcStatus
          ? hwcStatus.screen_diabetes_examined
          : null,
        screen_start_hyperten: hwcStatus
          ? hwcStatus.screen_start_hyperten
          : null,
        screen_hyperten_examined: hwcStatus
          ? hwcStatus.screen_hyperten_examined
          : null,
        screen_start_oral_can: hwcStatus
          ? hwcStatus.screen_start_oral_can
          : null,
        screen_oral_can_examined: hwcStatus
          ? hwcStatus.screen_oral_can_examined
          : null,
        screen_start_breast_can: hwcStatus
          ? hwcStatus.screen_start_breast_can
          : null,
        screen_breast_can_examined: hwcStatus
          ? hwcStatus.screen_breast_can_examined
          : null,
        screen_start_cervical_can: hwcStatus
          ? hwcStatus.screen_start_cervical_can
          : null,
        screen_cervical_can_examined: hwcStatus
          ? hwcStatus.screen_cervical_can_examined
          : null,
        yoga_session: hwcStatus ? hwcStatus.yoga_session : null,
        med_avail: hwcStatus ? hwcStatus.med_avail : null,
        diag_avail: hwcStatus ? hwcStatus.diag_avail : null,
        bp_app_count: hwcStatus ? hwcStatus.bp_app_count : null,
        gluco_app_count: hwcStatus ? hwcStatus.gluco_app_count : null,
        tab_avail: hwcStatus ? hwcStatus.tab_avail : null,
        laptop_avail: hwcStatus ? hwcStatus.laptop_avail : null,
        net_connect: hwcStatus ? hwcStatus.net_connect : null,
        isp: hwcStatus ? hwcStatus.isp : null,
        infra_completed: hwcStatus ? hwcStatus.infra_completed : null,
        building_type: hwcStatus ? hwcStatus.building_type : null,
        phc_painted: hwcStatus ? hwcStatus.phc_painted : null,
        chairs_avail: hwcStatus ? hwcStatus.chairs_avail : null,
        store_med: hwcStatus ? hwcStatus.store_med : null,
        two_lang_phc: hwcStatus ? hwcStatus.two_lang_phc : null,
        func_toilet_avail: hwcStatus ? hwcStatus.func_toilet_avail : null,
        water_avail: hwcStatus ? hwcStatus.water_avail : null,
        power_backup: hwcStatus ? hwcStatus.power_backup : null,
        bpApparatusManual: hwcStatus ? hwcStatus.bpApparatusManual : null,
        bpApparatusElectronic: hwcStatus ? hwcStatus.bpApparatusElectronic : null,
        bpPregnancyLargecuff: hwcStatus ? hwcStatus.bpPregnancyLargecuff : null,
        stethoscope: hwcStatus ? hwcStatus.stethoscope : null,
        inchTape: hwcStatus ? hwcStatus.inchTape : null,
        weighingMachineAdult: hwcStatus ? hwcStatus.weighingMachineAdult : null,
        weighingMachinePaediatric: hwcStatus ? hwcStatus.weighingMachinePaediatric : null,
        heightScale: hwcStatus ? hwcStatus.heightScale : null,
        torchLight: hwcStatus ? hwcStatus.torchLight : null,
        thermometerMercury: hwcStatus ? hwcStatus.thermometerMercury : null,
        thermometerElectronic: hwcStatus ? hwcStatus.thermometerElectronic : null,
        hubCutter: hwcStatus ? hwcStatus.hubCutter : null,
        bowls: hwcStatus ? hwcStatus.bowls : null,
        plasticTray: hwcStatus ? hwcStatus.plasticTray : null,
        fetoscope: hwcStatus ? hwcStatus.fetoscope : null,
        fetalDoppler: hwcStatus ? hwcStatus.fetalDoppler : null,
        glucometer: hwcStatus ? hwcStatus.glucometer : null,
        haemoglobinometer: hwcStatus ? hwcStatus.haemoglobinometer : null,
        doubleRackSterilizer: hwcStatus ? hwcStatus.doubleRackSterilizer : null,
        stainlessSteelTray: hwcStatus ? hwcStatus.stainlessSteelTray : null,
        stainlessSteelTrayCover: hwcStatus ? hwcStatus.stainlessSteelTrayCover : null,
        kidneyTray: hwcStatus ? hwcStatus.kidneyTray : null,
        arteryForceps: hwcStatus ? hwcStatus.arteryForceps : null,
        dissectingForceps: hwcStatus ? hwcStatus.dissectingForceps : null,
        spongeHoldingForceps: hwcStatus ? hwcStatus.spongeHoldingForceps : null,
        vulsellum: hwcStatus ? hwcStatus.vulsellum : null,
        scissors: hwcStatus ? hwcStatus.scissors : null,
        speculumBig: hwcStatus ? hwcStatus.speculumBig : null,
        speculumSmall: hwcStatus ? hwcStatus.speculumSmall : null,
        silverBasin: hwcStatus ? hwcStatus.silverBasin : null,
        mucusSucker: hwcStatus ? hwcStatus.mucusSucker : null,
        spiritLamp: hwcStatus ? hwcStatus.spiritLamp : null,
        breastPump: hwcStatus ? hwcStatus.breastPump : null,
        examinationTable: hwcStatus ? hwcStatus.examinationTable : null,
        steelBench: hwcStatus ? hwcStatus.steelBench : null,
        plasticchair: hwcStatus ? hwcStatus.plasticchair : null,
        table: hwcStatus ? hwcStatus.table : null,
        almirahBureau: hwcStatus ? hwcStatus.almirahBureau : null,
        stool: hwcStatus ? hwcStatus.stool : null,
        footStool: hwcStatus ? hwcStatus.footStool : null,
        dustbinBMWMRed: hwcStatus ? hwcStatus.dustbinBMWMRed : null,
        bustbinBMWMBlack: hwcStatus ? hwcStatus.bustbinBMWMBlack : null,
        dustbinBMWMYellow: hwcStatus ? hwcStatus.dustbinBMWMYellow : null,
        dustbinBMWMBlue: hwcStatus ? hwcStatus.dustbinBMWMBlue : null,
        dustbinOthers: hwcStatus ? hwcStatus.dustbinOthers : null,
        cot: hwcStatus ? hwcStatus.cot : null,
        gasStove: hwcStatus ? hwcStatus.gasStove : null,
        gasCyclinder: hwcStatus ? hwcStatus.gasCyclinder : null,
        emergnecyChargerLight: hwcStatus ? hwcStatus.emergnecyChargerLight : null
      }
    };
  }

  saveHscStatusOffline = () => {
    const { hwcStatus: getHWCData } = this.state;
    // let statusData = JSON.parse(localStorage.getItem(HSC_STATUS));
    // statusData = JSON.stringify({ ...statusData, status: { getHWCData } })
    try {
      hscProfileSave({getHWCData});
      // localStorage.setItem(HSC_STATUS, statusData);
      // this.props.refetch();
      this.props.alert.success("Saved offline");
    } catch (error) {
      this.props.alert.success("Error saving offline");
    }
  }

  async commonSelectUpdateNew(e, type) {
    const changes = this.state;
    let test = e.map(te => te.value).toString();
    changes.hwcStatus[type] = test;
    this.setState(changes);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    // COMPARE AND CHECK;
    console.info('nextProps.hwcStatus', nextProps);
    let update = false;
    if (nextProps.hwcStatus) {
      Object
        .keys(nextProps.hwcStatus)
        .map(k => {
          if (nextProps.hwcStatus[k] !== this.state.hwcStatus[k]) {
            update = true;
          }
        });
      if (update) {
        console.info('nextProps.hwcStatus', nextProps.hwcStatus);
        this.setState({ hwcStatus: nextProps.hwcStatus }, () => console.info('this.state', this.state))
      }
    }
  }

  async generateReport() {
    try {
      const alias = this.props.auth.user.alias;
      if (alias === "district" || alias === 'hud' || alias === 'block' || alias === 'state') {
        const { data } = await this.props.client.query({
          query: gql`{
                getHWCstatus(
                  created_by:"${this.props.auth.user.user_id}",
                alias:"${this.props.auth.user.alias}"
                district_id:${this.props.auth.user.district_id}
                )
              {
                hwc_user{
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
                  { hud_id hud_name hud_gis_id  }
                }
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
        this.state.downloadContent = data.getHWCstatus;
        this.setState(this.state);
        this.forceUpdate();
      } else {
        const { data } = await this.props.client.query({
          query: gql`{
            getHWCstatus(
                  created_by:"${this.props.auth.user.user_id}",
                alias:"${this.props.auth.user.alias}"
                )
              {
                hwc_user{
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
                  { block_id block_name block_gis_id  }
                  user_to_hud
                  { hud_id hud_name hud_gis_id }
                }
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
        this.state.downloadContent = data.getHWCstatus;
        this.setState(this.state);
        this.forceUpdate();
      }
    } catch (e) {
      this.props.alert.error("No data available to pull");
    }
  }

  async commonSelectUpdate(e, name) {
    const changes = this.state;
    changes.hwcStatus[name] = e.value;
    this.setState(changes);
  }

  async commonStringUpdate(e, name) {
    const changes = this.state;
    changes.hwcStatus[name] = e.target.value;
    this.setState(changes);
  }

  async commonBoolenUpdate(e, name) {
    const changes = this.state;
    changes.hwcStatus[name] = e.target.value;
    this.setState(changes);
  }

  async commonNumberUpdate(e, name) {
    // if (e.target.value >= 0) {
    const changes = this.state;
    changes.hwcStatus[name] = e.target.value;
    this.setState(changes);
    // }
  }
  async commonDateUpdate(e) {
    const changes = this.state;
    changes.hwcStatus["in_aug_date"] = e;
    this.setState(changes);
  }
  componentDidMount() {
    setTimeout(() => {
      // console.clear();
    }, 1000);
  }
  async submitData(userData) {

    const { hwcStatus } = this.state;
    console.log(hwcStatus);
    try {
      let mutationQuery = {
        mutation: gql`
        mutation{
          updateHWCStatus(
            user_id:"${this.props.auth.user.user_id}"
            in_aug_date:${
          hwcStatus.in_aug_date
            ? `"${hwcStatus.in_aug_date.toDate()}"`
            : null
          }
            total_hr:${hwcStatus.total_hr ? hwcStatus.total_hr : null}
            vhn_in_pos:${
          hwcStatus.vhn_in_pos ? `"${hwcStatus.vhn_in_pos}"` : null
          }
            name_vhn:"${hwcStatus.name_vhn}"
            gender_mhlp:${
          hwcStatus.gender_mhlp ? `"${hwcStatus.gender_mhlp}"` : null
          }
            type_of_mhlp:${
          hwcStatus.type_of_mhlp ? `"${hwcStatus.type_of_mhlp}"` : null
          }
            mpw_f:${hwcStatus.mpw_f}
            mpw_m:${hwcStatus.mpw_m}
            asha:${hwcStatus.asha}
            no_fem_health_vol:${hwcStatus.no_fem_health_vol}
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
            pop_coverage:${hwcStatus.pop_coverage}
            indi_enum_till:${hwcStatus.indi_enum_till}
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
            screen_diabetes_examined:${hwcStatus.screen_diabetes_examined}
            screen_oral_can_examined:${hwcStatus.screen_oral_can_examined}
            screen_breast_can_examined:${hwcStatus.screen_breast_can_examined}
            screen_cervical_can_examined:${hwcStatus.screen_cervical_can_examined}
            diag_avail:${
          hwcStatus.diag_avail ? `"${hwcStatus.diag_avail}"` : null
          }
            gluco_app_count:${
          hwcStatus.gluco_app_count
            ? `"${hwcStatus.gluco_app_count}"`
            : null
          }
            bp_app_count:${hwcStatus.bp_app_count}
            tab_avail:${hwcStatus.tab_avail}
            laptop_avail:${hwcStatus.laptop_avail}
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
            bpApparatusManual : ${hwcStatus.bpApparatusManual}
            bpApparatusElectronic : ${hwcStatus.bpApparatusElectronic}
            bpPregnancyLargecuff : ${hwcStatus.bpPregnancyLargecuff}
            stethoscope : ${hwcStatus.stethoscope}
            inchTape : ${hwcStatus.inchTape}
            weighingMachineAdult : ${hwcStatus.weighingMachineAdult}
            weighingMachinePaediatric : ${hwcStatus.weighingMachinePaediatric}
            heightScale : ${hwcStatus.heightScale}
            torchLight : ${hwcStatus.torchLight}
            thermometerMercury : ${hwcStatus.thermometerMercury}
            thermometerElectronic : ${hwcStatus.thermometerElectronic}
            hubCutter : ${hwcStatus.hubCutter}
            bowls : ${hwcStatus.bowls}
            plasticTray : ${hwcStatus.plasticTray}
            fetoscope : ${hwcStatus.fetoscope}
            fetalDoppler : ${hwcStatus.fetalDoppler}
            haemoglobinometer : ${hwcStatus.haemoglobinometer}
            doubleRackSterilizer : ${hwcStatus.doubleRackSterilizer}
            stainlessSteelTray : ${hwcStatus.stainlessSteelTray}
            stainlessSteelTrayCover : ${hwcStatus.stainlessSteelTrayCover}
            kidneyTray : ${hwcStatus.kidneyTray}
            arteryForceps : ${hwcStatus.arteryForceps}
            dissectingForceps : ${hwcStatus.dissectingForceps}
            spongeHoldingForceps : ${hwcStatus.spongeHoldingForceps}
            vulsellum : ${hwcStatus.vulsellum}
            scissors : ${hwcStatus.scissors}
            speculumBig : ${hwcStatus.speculumBig}
            speculumSmall : ${hwcStatus.speculumSmall}
            silverBasin : ${hwcStatus.silverBasin}
            mucusSucker : ${hwcStatus.mucusSucker}
            spiritLamp : ${hwcStatus.spiritLamp}
            breastPump : ${hwcStatus.breastPump}
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
        `
      }

      console.info('MUTATION QUERY', mutationQuery);
      const { data } = await this.props.client.mutate(mutationQuery);
      if (data) {
        this.props.refetch();
        this.props.alert.success("Saved successfully");
      } else {
        this.props.refetch();
        this.props.alert.error("Error while saving");
      }
    } catch (e) {
      console.log(e);
      // this.props.alert.error(e);
    }
  }
  render() {
    const powerBackOptions = [
      { value: "invertor", label: "Invertor" },
      { value: "generator", label: "Generator" },
      { value: "solar", label: "Solar" },
      { value: "nil", label: "Nil" }
    ];
    const trainingStatus = [
      { value: "Undergoing", label: "Undergoing" },
      { value: "Completed", label: "Completed" },
      { value: "Yet to be trained", label: "Yet to be trained" }
    ];
    const serviceProvider = [
      { value: "Airtel", label: "1.Airtel" },
      { value: "BSNL", label: "2.BSNL" },
      { value: "Idea", label: "3.Idea" },
      { value: "Jio", label: "4. Jio" },
      { value: "Vodafone", label: "5.Vodafone" },
      { value: "Others", label: "6.Others" }
    ];
    const mode = [
      { value: "Regular", label: "Regular" },
      { value: "Deputation", label: "Deputation" },
      { value: "Outsourcing", label: "Outsourcing" }
    ];
    const { hwcStatus, downloadContent } = this.state;
    const userData = this.props.auth.user;
    console.log(hwcStatus)
    return (
      <Container fluid className={styles.bgcontentProf}>
        {/* PHC Users only start */}
        <Row>
          <Col lg="12" style={{ padding: "10px 0px", boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.1), 0 0px 20px 0 rgba(0, 0, 0, 0.19)", marginBottom: "30px" }} >
            <Container fluid >
              <Row>
                <Col lg="10" ><PageList currentUrl={window.location.pathname.split('/')[2]} userData={this.props.auth.user} /></Col>
                <Col md='4' xs='4' lg='2' style={{ textAlign: 'right', float: 'right' }} className={styles.dwnldbtn}>
                  { navigator.onLine &&
                    <span
                      onClick={this.changeValue}
                      className={styles.dwnldbtn}
                    >
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
                    </span>
                  }
                </Col>
              </Row>
            </Container>
          </Col>
          <Col md="12" lg="12">
            <Container fluid>
              <Row>
                <Col md="12" lg={{ size: 10, offset: 1 }}>
                  <Container
                    fluid
                    className={styles.inpatient}
                    style={{ marginBottom: "50px" }}
                  >
                    {/* <h6 className={styles.tital}>HSC Status</h6>
                    <hr className={styles.underline} /> */}
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
                                {console.info('AUG_DATE', typeof hwcStatus.in_aug_date, hwcStatus.in_aug_date)}
                                <DatePicker
                                  selected={isNaN(Number(hwcStatus.in_aug_date)) ? hwcStatus.in_aug_date : moment((new Date()))}
                                  onChange={e => {
                                    this.commonDateUpdate(e, "in_aug_date");
                                  }}
                                  // minDate={moment().subtract(1091, "days")}
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
                                  type="number"
                                  onChange={e => {
                                    this.commonNumberUpdate(e, "total_hr");
                                  }}
                                  value={hwcStatus.total_hr}
                                  className={styles.inputstyle}
                                  placeholder="Enter No of Total HR"
                                  name="Name"
                                />
                              </Col>
                              <Col lg="6" md="6">
                                <label>2nd VHN MLHP in position</label>
                              </Col>
                              <Col md="6">
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
                                            "vhn_in_pos"
                                          );
                                        }}
                                        checked={
                                          hwcStatus.vhn_in_pos === "true"
                                            ? true
                                            : false
                                        }
                                        style={{ zoom: "1.6" }}
                                        value={true}
                                        name="position"
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
                                            "vhn_in_pos"
                                          );
                                        }}
                                        checked={
                                          hwcStatus.vhn_in_pos === "false"
                                            ? true
                                            : false
                                        }
                                        name="position"
                                        type="radio"
                                        style={{ zoom: "1.6" }}
                                      />
                                      <h6>No</h6>
                                    </Label>
                                  </div>
                                </FormGroup>
                              </Col>
                              <Col md="6">
                                <label>Name of 2nd VHN</label>
                              </Col>
                              <Col md="6">
                                <Inputtext
                                  onChange={e => {
                                    this.commonStringUpdate(e, "name_vhn");
                                  }}
                                  value={hwcStatus.name_vhn}
                                  type="text"
                                  className={styles.inputstyle}
                                  placeholder="Enter No of Name of 2nd VHN"
                                  name="Name"
                                />
                              </Col>
                              <Col md="6">
                                <label>Mode of 2nd VHN</label>
                              </Col>
                              <Col md="6" className={styles.selectHight}>
                                <SelectList
                                  onChange={e => {
                                    this.commonSelectUpdate(e, "mode_of_vhn");
                                  }}
                                  value={
                                    hwcStatus.mode_of_vhn
                                      ? mode.filter(
                                        service =>
                                          service.value ===
                                          hwcStatus.mode_of_vhn
                                      )
                                      : null
                                  }
                                  showLabel={true}
                                  options={mode}
                                  // value={null}
                                  placeholder="Select mode"
                                  name="mode"
                                />
                              </Col>
                              <Col lg="6" md="6">
                                <label>Gender MLHP</label>
                              </Col>
                              <Col md="6">
                                <FormGroup check>
                                  <div>
                                    <Label
                                      check
                                      className={styles.radioBtnStyles}
                                    >
                                      <Input
                                        type="radio"
                                        style={{ zoom: "1.6" }}
                                        value="Male"
                                        onChange={e => {
                                          this.commonBoolenUpdate(
                                            e,
                                            "gender_mhlp"
                                          );
                                        }}
                                        checked={
                                          hwcStatus.gender_mhlp === "Male"
                                            ? true
                                            : false
                                        }
                                        name="Gender"
                                      />
                                      <h6>Male</h6>
                                    </Label>
                                    <Label
                                      check
                                      className={styles.radioBtnStyles}
                                    >
                                      <Input
                                        value="Female"
                                        name="Gender"
                                        type="radio"
                                        onChange={e => {
                                          this.commonBoolenUpdate(
                                            e,
                                            "gender_mhlp"
                                          );
                                        }}
                                        checked={
                                          hwcStatus.gender_mhlp === "Female"
                                            ? true
                                            : false
                                        }
                                        style={{ zoom: "1.6" }}
                                      />
                                      <h6>Female</h6>
                                    </Label>
                                  </div>
                                </FormGroup>
                              </Col>
                              <Col lg="6" md="6">
                                <label>Type of MLHP</label>
                              </Col>
                              <Col md="6">
                                <FormGroup check>
                                  <div>
                                    <Label
                                      check
                                      className={styles.radioBtnStyles}
                                    >
                                      <Input
                                        type="radio"
                                        style={{ zoom: "1.6" }}
                                        onChange={e => {
                                          this.commonBoolenUpdate(
                                            e,
                                            "type_of_mhlp"
                                          );
                                        }}
                                        checked={
                                          hwcStatus.type_of_mhlp === "ANM"
                                            ? true
                                            : false
                                        }
                                        value="ANM"
                                        name="Type"
                                      />
                                      <h6>ANM</h6>
                                    </Label>
                                    <Label
                                      check
                                      className={styles.radioBtnStyles}
                                    >
                                      <Input
                                        value="VHN"
                                        name="Type"
                                        onChange={e => {
                                          this.commonBoolenUpdate(
                                            e,
                                            "type_of_mhlp"
                                          );
                                        }}
                                        checked={
                                          hwcStatus.type_of_mhlp === "VHN"
                                            ? true
                                            : false
                                        }
                                        type="radio"
                                        style={{ zoom: "1.6" }}
                                      />
                                      <h6>VHN</h6>
                                    </Label>
                                    <Label
                                      check
                                      className={styles.radioBtnStyles}
                                    >
                                      <Input
                                        value="GNM"
                                        name="Type"
                                        onChange={e => {
                                          this.commonBoolenUpdate(
                                            e,
                                            "type_of_mhlp"
                                          );
                                        }}
                                        checked={
                                          hwcStatus.type_of_mhlp === "GNM"
                                            ? true
                                            : false
                                        }
                                        type="radio"
                                        style={{ zoom: "1.6" }}
                                      />
                                      <h6>GNM</h6>
                                    </Label>
                                    <Label
                                      check
                                      className={styles.radioBtnStyles}
                                    >
                                      <Input
                                        value="OTHERS"
                                        name="Type"
                                        onChange={e => {
                                          this.commonBoolenUpdate(
                                            e,
                                            "type_of_mhlp"
                                          );
                                        }}
                                        checked={
                                          hwcStatus.type_of_mhlp === "OTHERS"
                                            ? true
                                            : false
                                        }
                                        type="radio"
                                        style={{ zoom: "1.6" }}
                                      />
                                      <h6>Others</h6>
                                    </Label>
                                  </div>
                                </FormGroup>
                              </Col>
                              <Col lg="6" md="6">
                                <label>1st VHN</label>
                                {/* text here was changed. but not in template. Once everything is confirmed, has to be done everywhere */}
                              </Col>
                              <Col md="6">
                                <Inputtext
                                  type="text"
                                  onChange={e => {
                                    this.commonNumberUpdate(e, "mpw_f");
                                  }}
                                  value={hwcStatus.mpw_f}
                                  className={styles.inputstyle}
                                  placeholder="Enter No of 1st VHN"
                                  name="Name"
                                />
                              </Col>
                              <Col md="6">
                                <label>Health Inspector</label>
                                {/* text here was changed. but not in template. Once everything is confirmed, has to be done everywhere */}
                              </Col>
                              <Col md="6">
                                <Inputtext
                                  type="text"
                                  onChange={e => {
                                    this.commonNumberUpdate(e, "mpw_m");
                                  }}
                                  value={hwcStatus.mpw_m}
                                  className={styles.inputstyle}
                                  placeholder="Enter No of Health Inspector"
                                  name="Name"
                                />
                              </Col>
                              <Col lg="6" md="6">
                                <label>ASHAs</label>
                              </Col>
                              <Col md="6">
                                <Inputtext
                                  type="text"
                                  onChange={e => {
                                    this.commonNumberUpdate(e, "asha");
                                  }}
                                  value={hwcStatus.asha}
                                  className={styles.inputstyle}
                                  placeholder="Enter No of Total ASHAs"
                                  name="Name"
                                />
                              </Col>
                              <Col lg="6" md="6">
                                <label>No of Women Health Volunteer</label>
                              </Col>
                              <Col md="6">
                                <Inputtext
                                  type="text"
                                  onChange={e => {
                                    this.commonNumberUpdate(
                                      e,
                                      "no_fem_health_vol"
                                    );
                                  }}
                                  value={hwcStatus.no_fem_health_vol}
                                  className={styles.inputstyle}
                                  placeholder="Enter No of No of Women Health Volunteer"
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
                                      MLHP Training status of 2nd VHN
                                    </label>
                                    {/* text here was changed. but not in template. Once everything is confirmed, has to be done everywhere */}
                                  </Col>
                                  <Col lg="6" className={styles.selectHight}>
                                    <SelectList
                                      onChange={e => {
                                        this.commonSelectUpdate(
                                          e,
                                          "mlp_training_status"
                                        );
                                      }}
                                      value={
                                        hwcStatus.mlp_training_status
                                          ? trainingStatus.filter(
                                            service =>
                                              service.value ===
                                              hwcStatus.mlp_training_status
                                          )
                                          : null
                                      }
                                      showLabel={true}
                                      options={trainingStatus}
                                      // value={null}
                                      placeholder="Select Status"
                                      name="status"
                                    />
                                  </Col>
                                  <Col lg="6">
                                    <label>
                                      1st VHN MPW (F) NCD Training Status
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
                                            name="MPW"
                                            type="radio"
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "vhn_one_train_stat"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.vhn_one_train_stat ===
                                                "true"
                                                ? true
                                                : false
                                            }
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
                                            name="MPW"
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "vhn_one_train_stat"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.vhn_one_train_stat ===
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
                                            name="ASHAs"
                                            type="radio"
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "asha_traing_status"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.asha_traing_status ===
                                                "true"
                                                ? true
                                                : false
                                            }
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
                                            name="ASHAs"
                                            value={false}
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "asha_traing_status"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.asha_traing_status ===
                                                "false"
                                                ? true
                                                : false
                                            }
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
                                            name="Population"
                                            type="radio"
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "pop_enum_started"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.pop_enum_started ===
                                                "true"
                                                ? true
                                                : false
                                            }
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
                                            name="Population"
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "pop_enum_started"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.pop_enum_started ===
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
                                  type="text"
                                  className={styles.inputstyle}
                                  onChange={e => {
                                    this.commonNumberUpdate(e, "pop_coverage");
                                  }}
                                  value={hwcStatus.pop_coverage}
                                  placeholder="Enter No of Population Coverge "
                                  name="Name"
                                />
                              </Col>
                              <Col md="6">
                                <label>Individuals enumerated till now</label>
                              </Col>
                              <Col md="6">
                                <Inputtext
                                  type="text"
                                  onChange={e => {
                                    this.commonNumberUpdate(
                                      e,
                                      "indi_enum_till"
                                    );
                                  }}
                                  value={hwcStatus.indi_enum_till}
                                  className={styles.inputstyle}
                                  placeholder="Enter No of Individuals enumerated till now "
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
                                            name="Diabetes"
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "screen_start_diabetes"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.screen_start_diabetes ===
                                                "true"
                                                ? true
                                                : false
                                            }
                                            value={true}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            name="Diabetes"
                                            value={false}
                                            type="radio"
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "vhn_in_pos"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.screen_start_diabetes ===
                                                "false"
                                                ? true
                                                : false
                                            }
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
                                      type="text"
                                      className={styles.inputstyle}
                                      onChange={e => {
                                        this.commonNumberUpdate(
                                          e,
                                          "screen_diabetes_examined"
                                        );
                                      }}
                                      value={hwcStatus.screen_diabetes_examined}
                                      placeholder="Enter No of Individuals Examined (Diabetes)"
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
                                            name="Cancer"
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "screen_start_oral_can"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.screen_start_oral_can ===
                                                "true"
                                                ? true
                                                : false
                                            }
                                            value={true}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            name="Cancer"
                                            value={false}
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "screen_start_oral_can"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.screen_start_oral_can ===
                                                "false"
                                                ? true
                                                : false
                                            }
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
                                      type="text"
                                      className={styles.inputstyle}
                                      onChange={e => {
                                        this.commonNumberUpdate(
                                          e,
                                          "screen_oral_can_examined"
                                        );
                                      }}
                                      value={hwcStatus.screen_oral_can_examined}
                                      placeholder="Enter No of Individuals Examined (Oral Cancer)"
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
                                            name="BreastCancer"
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "screen_start_breast_can"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.screen_start_breast_can ===
                                                "true"
                                                ? true
                                                : false
                                            }
                                            value={true}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            name="BreastCancer"
                                            value={false}
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "screen_start_breast_can"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.screen_start_breast_can ===
                                                "false"
                                                ? true
                                                : false
                                            }
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
                                      type="text"
                                      className={styles.inputstyle}
                                      onChange={e => {
                                        this.commonNumberUpdate(
                                          e,
                                          "screen_breast_can_examined"
                                        );
                                      }}
                                      value={hwcStatus.screen_breast_can_examined}
                                      placeholder="Enter No of Individuals Examined (Breast Cancer) "
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
                                            name="CervicalCancer"
                                            type="radio"
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "screen_start_cervical_can"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.screen_start_cervical_can ===
                                                "true"
                                                ? true
                                                : false
                                            }
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
                                            name="CervicalCancer"
                                            value={false}
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "screen_start_cervical_can"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.screen_start_cervical_can ===
                                                "false"
                                                ? true
                                                : false
                                            }
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
                                      type="text"
                                      className={styles.inputstyle}
                                      onChange={e => {
                                        this.commonNumberUpdate(
                                          e,
                                          "screen_cervical_can_examined"
                                        );
                                      }}
                                      value={hwcStatus.screen_cervical_can_examined}
                                      placeholder="Enter No of Individuals Examined (Cervical Cancer) "
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
                                            name="CervicalCancer1"
                                            type="radio"
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "yoga_session"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.yoga_session === "true"
                                                ? true
                                                : false
                                            }
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
                                            name="CervicalCancer1"
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "yoga_session"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.yoga_session === "false"
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
                              {/* <Col md="12">
                                <Row>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <label>Individuals Examined(DM)</label>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <Inputtext
                                      type="text"
                                      className={styles.inputstyle}
                                      placeholder="Enter.. "
                                      name="Name"
                                    />
                                  </Col>
                                </Row>
                              </Col> */}
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
                                      27 Medicines available as per guidlines
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
                                            name="guidlines"
                                            type="radio"
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "med_avail"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.med_avail === "true"
                                                ? true
                                                : false
                                            }
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
                                            name="guidlines"
                                            value={false}
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "med_avail"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.med_avail === "false"
                                                ? true
                                                : false
                                            }
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
                                            name="guidlines1"
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "diag_avail"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.diag_avail === "true"
                                                ? true
                                                : false
                                            }
                                            value={true}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            name="guidlines1"
                                            value={false}
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "diag_avail"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.diag_avail === "false"
                                                ? true
                                                : false
                                            }
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <label>Glucometer</label>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            name="Glucometer"
                                            type="radio"
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "gluco_app_count"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.gluco_app_count ===
                                                "true"
                                                ? true
                                                : false
                                            }
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
                                            name="Glucometer"
                                            value={false}
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "gluco_app_count"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.gluco_app_count ===
                                                "false"
                                                ? true
                                                : false
                                            }
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
                                      type="text"
                                      className={styles.inputstyle}
                                      onChange={e => {
                                        this.commonNumberUpdate(
                                          e,
                                          "bp_app_count"
                                        );
                                      }}
                                      value={hwcStatus.bp_app_count}
                                      placeholder="Enter.. "
                                      name="Name"
                                    />
                                  </Col> */}
                                </Row>
                              </Col>
                              {/* end */}
                              {/* Function IT equipment */}
                              <Col lg="12" className={styles.titalHeader}>
                                <h5>
                                  <p>Function IT equipment</p>
                                </h5>
                              </Col>
                              <Col md="12" lg="12" sm="12" xs="12" />
                              <Col md="12" lg="12" sm="12" xs="12">
                                <Row>
                                  <Col lg="6" sm="12" xs="12">
                                    <label>
                                      No of Functional Tablet-PC Available
                                    </label>
                                  </Col>

                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <Inputtext
                                      type="text"
                                      className={styles.inputstyle}
                                      onChange={e => {
                                        this.commonNumberUpdate(e, "tab_avail");
                                      }}
                                      value={hwcStatus.tab_avail}
                                      placeholder="Enter No of Functional Tablet-PC Available "
                                      name="Name"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col md="12" lg="12" sm="12" xs="12">
                                <Row>
                                  <Col lg="6" sm="12" xs="12">
                                    <label>
                                      No of Functional Laptop-PC Available
                                    </label>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <Inputtext
                                      type="text"
                                      className={styles.inputstyle}
                                      placeholder="Enter No of Functional Laptop-PC Available "
                                      onChange={e => {
                                        this.commonNumberUpdate(
                                          e,
                                          "laptop_avail"
                                        );
                                      }}
                                      value={hwcStatus.laptop_avail}
                                      name="Name"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col md="12" lg="12" sm="12" xs="12">
                                <Row>
                                  <Col lg="6" sm="12" xs="12">
                                    <label>
                                      Net Connectivity at the HSC based on
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
                                            name="signalsign"
                                            type="radio"
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "net_connect"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.net_connect === "true"
                                                ? true
                                                : false
                                            }
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
                                            name="signalsign"
                                            value={false}
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "net_connect"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.net_connect === "false"
                                                ? true
                                                : false
                                            }
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
                                      showLabel={true}
                                      options={serviceProvider}
                                      onChange={e => {
                                        this.commonSelectUpdate(e, "isp");
                                      }}
                                      value={
                                        hwcStatus.isp
                                          ? serviceProvider.filter(
                                            service =>
                                              service.value === hwcStatus.isp
                                          )
                                          : null
                                      }
                                      // value={null}
                                      placeholder="Select service provider"
                                      name="status"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              {/* end */}
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
                                        return (value.type === 'All' || value.type === 'Hsc') && <tr key={i}>
                                          <td>
                                            <label>{value.label}</label>
                                          </td>
                                          <td>
                                            <Inputtext
                                              type="number"
                                              autoComplete="off"
                                              className={styles.tableInput}
                                              onChange={e => {
                                                console.info('CHANGE', e.target.value);
                                                this.commonNumberUpdate(e, `${value.varName}`);
                                              }}
                                              value={hwcStatus[value.varName]}
                                              placeholder={`Enter No of ${
                                                value.label
                                                }`}
                                              name="Name"
                                            />
                                          </td>
                                        </tr>
                                      }
                                      )}
                                  </tbody>
                                </Table>
                              </Col>
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
                                            name="Renovation"
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "infra_completed"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.infra_completed ===
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
                                            name="Renovation"
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "infra_completed"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.infra_completed ===
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
                                            name="building"
                                            type="radio"
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "building_type"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.building_type ===
                                                "Government"
                                                ? true
                                                : false
                                            }
                                            style={{ zoom: "1.6" }}
                                            value="Government"
                                          />
                                          <h6>Government</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            name="building"
                                            value="Rent Free"
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "building_type"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.building_type ===
                                                "Rent Free"
                                                ? true
                                                : false
                                            }
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
                                            name="building"
                                            value="Rented"
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "building_type"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.building_type ===
                                                "Rented"
                                                ? true
                                                : false
                                            }
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Rented</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" sm="12" xs="12">
                                    <label>HSC painted as per norms</label>
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
                                            style={{ zoom: "1.6" }}
                                            value={true}
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "phc_painted"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.phc_painted === "true"
                                                ? true
                                                : false
                                            }
                                            name="Chairs"
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            value={false}
                                            name="Chairs"
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "phc_painted"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.phc_painted === "false"
                                                ? true
                                                : false
                                            }
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
                                      Whether HSC been provided with Patient
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
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "chairs_avail"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.chairs_avail === "true"
                                                ? true
                                                : false
                                            }
                                            value={true}
                                            name="Chair1s"
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            value={false}
                                            name="Chair1s"
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "chairs_avail"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.chairs_avail === "false"
                                                ? true
                                                : false
                                            }
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
                                      Whether HSC been provided with racks for
                                      storing medicines/
                                      equipment/documenst/health cards /
                                      registers?
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
                                            style={{ zoom: "1.6" }}
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "store_med"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.store_med === "true"
                                                ? true
                                                : false
                                            }
                                            value={true}
                                            name="registers"
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
                                                "store_med"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.store_med === "false"
                                                ? true
                                                : false
                                            }
                                            value={false}
                                            name="registers"
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
                                      Whether HSC branded in 2 languages as per
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
                                            type="radio"
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "two_lang_phc"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.two_lang_phc === "true"
                                                ? true
                                                : false
                                            }
                                            style={{ zoom: "1.6" }}
                                            value={true}
                                            name="PHClanguages"
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            value={false}
                                            name="PHClanguages"
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "two_lang_phc"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.two_lang_phc === "false"
                                                ? true
                                                : false
                                            }
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
                                      Whether functional toilet available?
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
                                            style={{ zoom: "1.6" }}
                                            value={true}
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "func_toilet_avail"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.func_toilet_avail ===
                                                "true"
                                                ? true
                                                : false
                                            }
                                            name="PHCtoilet"
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            value={false}
                                            name="PHCtoilet"
                                            type="radio"
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "func_toilet_avail"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.func_toilet_avail ===
                                                "false"
                                                ? true
                                                : false
                                            }
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <label>
                                      Whether HSC has running water supply
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
                                            style={{ zoom: "1.6" }}
                                            value={true}
                                            onChange={e => {
                                              this.commonBoolenUpdate(
                                                e,
                                                "water_avail"
                                              );
                                            }}
                                            checked={
                                              hwcStatus.water_avail === "true"
                                                ? true
                                                : false
                                            }
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
                                              hwcStatus.water_avail === "false"
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
                                      Whether HSC has power back up?
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
                                        hwcStatus.power_backup
                                      )}
                                      options={powerBackOptions}
                                      placeholder="Select Power backup Type"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              {/* end */}
                              {/* <Col lg="12" style={{ padding: "0px" }}>
                                <Col lg="12" className={styles.titalHeader}>
                                  <h5 style={{ display: "inline-block" }}>
                                    <p style={{ marginBottom: "5px" }}>
                                      Furniture
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
                                    {furnitureStatus &&
                                      furnitureStatus.map((value, i) => 
                                        {return (value.type === 'All' || value.type === 'Hsc') && 
                                        <tr>
                                          <td>
                                            <label>{value.label}</label>
                                          </td>
                                          <td>
                                            <Inputtext
                                              type="text"
                                              className={styles.tableInput}
                                              onChange={e => {
                                                this.commonNumberUpdate(e, `${value.varName}`);
                                              }}
                                              value={hwcStatus[value.varName] ? hwcStatus[value.varName] : ""}
                                              placeholder={`Enter ${
                                                value.label
                                              }`}
                                              name="Name"
                                            />
                                          </td>
                                        </tr>
                                        }
                                    )}
                                  </tbody>
                                </Table>
                              </Col> */}
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
                      if (navigator.onLine) this.submitData(hwcStatus);
                      else this.saveHscStatusOffline();
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
;