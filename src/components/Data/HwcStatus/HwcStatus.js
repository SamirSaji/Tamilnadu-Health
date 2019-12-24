import React from "react";
import Header from "../../common/Header/Header";
import StatusContent from "./HwcStatusContent";
import Spinner from "../../common/Spinner/Spinner";
import { withApollo } from "react-apollo";
import gql from "graphql-tag";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { hscStatusList } from '../../../utils/writeToOffline';
import { getDataFromIndexedDB, getAllkey } from '../../../indexeDB/getData';
class UserProfile extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      offlineStatus: {},
      data: {}
    };
  }


  hwcQuery = (user) => gql`{
    getHWCData(user_id:"${user.user_id}") {
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
  }
  `
  offlineKeys = () => {
    return ["in_aug_date", "total_hr", "vhn_in_pos", "name_vhn", "mode_of_vhn", "gender_mhlp",
      "type_of_mhlp", "mpw_f", "mpw_m", "asha", "no_fem_health_vol", "mlp_training_status",
      "vhn_one_train_stat", "asha_traing_status", "pop_enum_started", "pop_coverage", "indi_enum_till",
      "screen_start_diabetes", "screen_diabetes_examined", "screen_start_hyperten",
      "screen_hyperten_examined", "screen_start_oral_can", "screen_oral_can_examined",
      "screen_start_breast_can", "screen_breast_can_examined", "screen_start_cervical_can",
      "screen_cervical_can_examined", "yoga_session", "med_avail", "diag_avail", "bp_app_count",
      "gluco_app_count", "tab_avail", "laptop_avail", "net_connect", "isp", "infra_completed",
      "building_type", "phc_painted", "chairs_avail", "store_med", "two_lang_phc", "func_toilet_avail",
      "water_avail", "power_backup", "bpApparatusManual", "bpApparatusElectronic", "bpPregnancyLargecuff",
      "stethoscope", "inchTape", "weighingMachineAdult", "weighingMachinePaediatric", "heightScale",
      "torchLight", "thermometerMercury", "thermometerElectronic", "hubCutter", "bowls", "plasticTray",
      "fetoscope", "fetalDoppler", "haemoglobinometer", "doubleRackSterilizer", "stainlessSteelTray",
      "stainlessSteelTrayCover", "kidneyTray", "arteryForceps", "dissectingForceps", "spongeHoldingForceps",
      "vulsellum", "scissors", "speculumBig", "speculumSmall", "silverBasin", "mucusSucker", "spiritLamp",
      "breastPump", "examinationTable", "steelBench", "plasticchair", "table", "almirahBureau", "stool",
      "footStool", "dustbinBMWMRed", "bustbinBMWMBlack", "dustbinBMWMYellow", "dustbinBMWMBlue",
      "dustbinOthers", "cot", "gasStove", "gasCyclinder", "emergnecyChargerLight"]
  }
  renderProfile = (data, refetch) => {
    // const syncdate = new Date().toString();
    if (navigator.onLine) hscStatusList(data);
    return (
      <div>
        {
          Object.keys(data).length > 0 ?
            <React.Fragment>
              <Header />
              <StatusContent
                hwcStatus={data.getHWCData}
                refetch={refetch}
              />
            </React.Fragment>
            :
            <React.Fragment>
              <Header />
              <Spinner />
            </React.Fragment>
        }
      </div>
    )
  }

  async componentDidMount() {
    const { user } = this.props.auth;
    if (navigator.onLine) {
      this.props.client.query({
        query: this.hwcQuery(user)
      }).then(res => {
        this.setState({
          data: res.data
        })
      }).catch(err => { })
    } else {
      let keys = await getAllkey(["hsc_status"]);
      let values = await getDataFromIndexedDB(["hsc_status"]);
      var getHWCData = {}
      keys[0].map((val, i) => {
        getHWCData = {
          ...getHWCData,
          [val]: values[0][i] !== undefined ? values[0][i] : null
        }
      })
      let offlinevalues = await getDataFromIndexedDB(["offlineHscProfile"]);
      if (offlinevalues[0].length > 0) {
        offlinevalues = offlinevalues[0].map(val => JSON.parse(val));
        offlinevalues = offlinevalues[0].getHWCData;
        delete offlinevalues.user_id;
        getHWCData = { ...getHWCData, ...offlinevalues }
      }
      this.setState({
        data: {
          getHWCData
        }
      })
    }

  }

  // updateOfflineStatus = () => {
  //   const { status } = localStorage.getItem(HSC_PROFILE) ? JSON.parse(localStorage.getItem(HSC_PROFILE)) : { status: {}, date: null };
  //   console.info('status', status);
  //   this.setState({ offlineStatus: status }, () => console.info('UPDATE OFFLINE', this.state.offlineStatus));
  // }

  render() {
    let { data } = this.state;
    return this.renderProfile(data, () => { });
  }
}
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(withRouter(withApollo(UserProfile)));
