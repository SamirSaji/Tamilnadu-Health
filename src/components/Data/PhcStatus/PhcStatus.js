import React from "react";
import Header from "../../common/Header/Header";
import StatusContent from "./PhcStatusContent";

// import { Redirect } from 'react-router-dom';
// import Spinner from '../../common/Spinner/Spinner';
import { withApollo } from "react-apollo";
import gql from "graphql-tag";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { phcStatusList } from '../../../utils/writeToOffline';
import { getDataFromIndexedDB, getAllkey } from "../../../indexeDB/getData";
// const PHC_STATUS = 'phc_status';
class UserProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = { offlineData: {}, data: {} }
  }
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

  phcStatusQuery = user => gql`{
    getPhcData(user_id:"${user.user_id}") {
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

  renderPhcStatus = (data, refetch) => {
    if (navigator.onLine) phcStatusList(data)
    return (
      <div>
        <Header />
        <StatusContent
          phcStatus={data.getPhcData}
          refetch={refetch}
        />
      </div>
    )
  }

  async componentDidMount() {
    const { user } = this.props.auth;
    if (navigator.onLine) {
      this.props.client.query({
        query: this.phcStatusQuery(user)
      }).then(res => {
        this.setState({
          data: res.data
        })
      }).catch(err => { })
    } else {
      let keys = await getAllkey(["phc_status"]);
      let values = await getDataFromIndexedDB(["phc_status"]);
      var getPhcData = {}
      keys[0].map((val, i) => {
        getPhcData = {
          ...getPhcData,
          [val]: values[0][i] !== undefined ? values[0][i] : null
        }
      })
      if (getPhcData.__typename) {
        delete getPhcData.__typename
      }
      this.setState({
        data: {
          getPhcData
        }
      })
    }

  }

  render() {
    let { data } = this.state;
    return this.renderPhcStatus(data, () => { });
  }
}
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {})(withRouter(withApollo(UserProfile)))