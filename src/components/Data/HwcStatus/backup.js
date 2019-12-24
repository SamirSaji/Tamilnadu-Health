import React from "react";
import {
  Col,
  Row,
  Container,
  Button,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import gql from "graphql-tag";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withApollo } from "react-apollo";
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

class Status extends React.Component {
  constructor(props) {
    super(props);
    const { getPhcData } = this.props; 
    this.submitData = this.submitData.bind(this);
    this.state =  {
      hwcStatus:{
        user_id:this.props.auth.user.user_id,
        building_type:getPhcData ? getPhcData.building_type : null,
        in_aug_date:getPhcData ? getPhcData.in_aug_date : null,
        total_hr:getPhcData ? getPhcData.total_hr : null,
        mbbs_ms:getPhcData ? getPhcData.mbbs_ms : null,
        staff_nurse:getPhcData ? getPhcData.staff_nurse : null,
        no_anm_mpw :getPhcData ? getPhcData.no_anm_mpw  : null,
        no_of_lab_tech :getPhcData ? getPhcData.no_of_lab_tech  : null,
        no_of_pharm :getPhcData ? getPhcData.no_of_pharm  : null,
        asha :getPhcData ? getPhcData.asha  : null,
        staff_nurse_com:getPhcData ? getPhcData.staff_nurse_com : null,
        staff_nurse_under :getPhcData ? getPhcData.staff_nurse_under  : null,
        mo_ncd :getPhcData ? getPhcData.mo_ncd  : null,
        staff_nurse_ncd :getPhcData ? getPhcData.staff_nurse_ncd  : null,
        anm_mpw_ncd :getPhcData ? getPhcData.anm_mpw_ncd  : null,
        ashs_ncd:getPhcData ? getPhcData.ashs_ncd : null,
        pop_enum_started :getPhcData ? getPhcData.pop_enum_started  : null,
        pop_coverage :getPhcData ? getPhcData.pop_coverage  : null,
        indi_enum_till :getPhcData ? getPhcData.indi_enum_till  : null,
        screen_start_diabetes:getPhcData ? getPhcData.screen_start_diabetes : null,
        screen_diabetes_examined :getPhcData ? getPhcData.screen_diabetes_examined  : null,
        screen_start_hyperten :getPhcData ? getPhcData.screen_start_hyperten  : null,
        screen_hyperten_examined:getPhcData ? getPhcData.screen_hyperten_examined : null,
        screen_start_oral_can :getPhcData ? getPhcData.screen_start_oral_can  : null,
        screen_oral_can_examined :getPhcData ? getPhcData.screen_oral_can_examined  : null,
        screen_start_breast_can:getPhcData ? getPhcData.screen_start_breast_can : null,
        screen_breast_can_examined :getPhcData ? getPhcData.screen_breast_can_examined  : null,
        screen_start_cervical_can :getPhcData ? getPhcData.screen_start_cervical_can  : null,
        screen_cervical_can_examined:getPhcData ? getPhcData.screen_cervical_can_examined : null,
        yoga_session :getPhcData ? getPhcData.yoga_session  : null,
        med_edl_avail :getPhcData ? getPhcData.med_edl_avail  : null,
        diag_avail :getPhcData ? getPhcData.diag_avail  : null,
        bp_app_count:getPhcData ? getPhcData.bp_app_count : null,
        fsaa_app_count :getPhcData ? getPhcData.fsaa_app_count  : null,
        tab_avail :getPhcData ? getPhcData.tab_avail  : null,
        desktop_avail :getPhcData ? getPhcData.desktop_avail  : null,
        laptop_avail :getPhcData ? getPhcData.laptop_avail  : null,
        ncd_nic_app_used:getPhcData ? getPhcData.ncd_nic_app_used : null,
        net_connect :getPhcData ? getPhcData.net_connect  : null,
        isp :getPhcData ? getPhcData.isp  : null,
        infra_completed :getPhcData ? getPhcData.infra_completed  : null,
        building_type :getPhcData ? getPhcData.building_type  : null,
        phc_painted:getPhcData ? getPhcData.phc_painted : null,
        chairs_avail :getPhcData ? getPhcData.chairs_avail  : null,
        wellness_room_avail :getPhcData ? getPhcData.wellness_room_avail  : null,
        phc_biomed_fac :getPhcData ? getPhcData.phc_biomed_fac  : null,
        two_lang_phc:getPhcData ? getPhcData.two_lang_phc : null,
        male_toilet :getPhcData ? getPhcData.male_toilet  : null,
        female_toilet :getPhcData ? getPhcData.female_toilet  : null,
        water_avail :getPhcData ? getPhcData.water_avail  : null,
        power_backup :getPhcData ? getPhcData.power_backup  : null,
        mpw:getPhcData ? getPhcData.mpw : null,
      }
    }
  }
  componentDidMount(){
    setTimeout(() => {
      console.clear();
    },1000)
  }
  async submitData (userData) {    
    //     const { data } = await this.props.client.mutate({
    //   mutation: gql`mutation {
    //     hwcUpdate( id:"${this.props.auth.user.user_id}", value:"'${String(userData)}'") {
    //       id 
    //     }}`
    // });
    const { hwcStatus } = this.state;
    const { data } = await this.props.client.mutate({
      mutation:gql`
      mutation(
        $in_aug_date:in_aug_date
        $total_hr:total_hr
        $vhn_in_pos:vhn_in_pos
        $name_vhn:name_vhn
        $mode_of_vhn:mode_of_vhn
        $gender_mhlp:gender_mhlp
        $type_of_mhlp:type_of_mhlp
        $mpw_f:mpw_f
        $mpw_m:mpw_m
        $asha:asha
        $no_fem_health_vol:no_fem_health_vol
        $mlp_training_status:mlp_training_status
        $vhn_one_train_stat:vhn_one_train_stat
        $asha_traing_status:asha_traing_status
        $pop_enum_started:pop_enum_started
        $pop_coverage:pop_coverage
        $indi_enum_till:indi_enum_till
        $screen_start_diabetes:screen_start_diabetes
        $screen_diabetes_examined:screen_diabetes_examined
        $screen_start_hyperten:screen_start_hyperten
        $screen_hyperten_examined:screen_hyperten_examined
        $screen_start_oral_can:screen_start_oral_can
        $screen_oral_can_examined:screen_oral_can_examined
        $screen_start_breast_can:screen_start_breast_can
        $screen_breast_can_examined:screen_breast_can_examined
        $screen_start_cervical_can:screen_start_cervical_can
        $screen_cervical_can_examined:screen_cervical_can_examined
        $yoga_session:yoga_session
        $med_avail:med_avail
        $diag_avail:diag_avail
        $bp_app_count:bp_app_count
        $gluco_app_count:gluco_app_count
        $tab_avail:tab_avail
        $laptop_avail:laptop_avail
        $net_connect:net_connect
        $isp:isp
        $infra_completed:infra_completed
        $building_type:building_type
        $phc_painted:phc_painted
        $chairs_avail:chairs_avail
        $store_med:store_med
        $two_lang_phc:two_lang_phc
        $func_toilet_avail:func_toilet_avail
        $water_avail:water_avail
        $power_backup:power_backup
      ) {
        updateHWCStatus(
          user_id: $user_id
          in_aug_date:$in_aug_date
          total_hr:$total_hr
          vhn_in_pos:$vhn_in_pos
          name_vhn:$name_vhn
          mode_of_vhn:$mode_of_vhn
          gender_mhlp:$gender_mhlp
          type_of_mhlp:$type_of_mhlp
          mpw_f:$mpw_f
          mpw_m:$mpw_m
          asha:$asha
          no_fem_health_vol:$no_fem_health_vol
          mlp_training_status:$mlp_training_status
          vhn_one_train_stat:$vhn_one_train_stat
          asha_traing_status:$asha_traing_status
          pop_enum_started:$pop_enum_started
          pop_coverage:$pop_coverage
          indi_enum_till:$indi_enum_till
          screen_start_diabetes:$screen_start_diabetes
          screen_diabetes_examined:$screen_diabetes_examined
          screen_start_hyperten:$screen_start_hyperten
          screen_hyperten_examined:$screen_hyperten_examined
          screen_start_oral_can:$screen_start_oral_can
          screen_oral_can_examined:$screen_oral_can_examined
          screen_start_breast_can:$screen_start_breast_can
          screen_breast_can_examined:$screen_breast_can_examined
          screen_start_cervical_can:$screen_start_cervical_can
          screen_cervical_can_examined:$screen_cervical_can_examined
          yoga_session:$yoga_session
          med_avail:$med_avail
          diag_avail:$diag_avail
          bp_app_count:$bp_app_count
          gluco_app_count:$gluco_app_count
          tab_avail:$tab_avail
          laptop_avail:$laptop_avail
          net_connect:$net_connect
          isp:$isp
          infra_completed:$infra_completed
          building_type:$building_type
          phc_painted:$phc_painted
          chairs_avail:$chairs_avail
          store_med:$store_med
          two_lang_phc:$two_lang_phc
          func_toilet_avail:$func_toilet_avail
          water_avail:$water_avail
          power_backup:$power_backup
          ) {

        }
      }
      `,
      variables: { hwcStatus }
    });
    console.log()
  }
  render() {
    const trainingStatus = [
      { value: "name1", label: "Undergoing" },
      { value: "name2", label: "Completed" },
      { value: "name4", label: "Yet to be trained" }
    ];
    const serviceProvider = [
      { value: "name1", label: "1.Airtel" },
      { value: "name2", label: "2.BSNL" },
      { value: "name1", label: "3.Idea" },
      { value: "name2", label: "4. Jio" },
      { value: "name4", label: "5.Vodafone" },
      { value: "name4", label: "6.Others" }
    ];
    const mode = [
      { value: "name1", label: "Regular" },
      { value: "name2", label: "Deputation" },
      { value: "name4", label: "Outsourcing" }
    ];
    const { hwcStatus } = this.state;
    setTimeout(() => {
      console.log(hwcStatus);
    },2000)
    return (
      <Container fluid className={styles.bgcontentProf}>
        {/* PHC Users only start */}
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
                    <h6 className={styles.tital}>HSC Status</h6>
                    <hr className={styles.underline} />
                    <span onClick={this.changeValue}>
                      <i
                        className={"fa fa-pencil-square-o " + styles.editIcon}
                      />
                    </span>
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
                          <Col md="12" className={styles.dateWidth} style={{ marginBottom: "15px" }}>
                            <Row>
                              <Col md="6">
                                <label>Date of inauguration</label>
                              </Col>
                              <Col md="6">
                                <DatePicker
                                  minDate={moment().subtract(30, "days")}
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
                                  classname={styles.inputstyle}
                                  placeholder="Enter Total HR"
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
                                        style={{ zoom: "1.6" }}
                                        valid={true}
                                        name="position"
                                      />
                                      <h6>Yes</h6>
                                    </Label>
                                    <Label
                                      check
                                      className={styles.radioBtnStyles}
                                    >
                                      <Input
                                        valid={false}
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
                                  type="text"
                                  classname={styles.inputstyle}
                                  placeholder="Enter Total Name"
                                  name="Name"
                                />
                              </Col>
                              <Col md="6">
                                <label>Mode of 2nd VHN</label>
                              </Col>
                              <Col md="6" className={styles.selectHight}>
                                <SelectList
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
                                        value="GHN"
                                        name="Type"
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
                                        value="GHN"
                                        name="Type"
                                        type="radio"
                                        style={{ zoom: "1.6" }}
                                      />
                                      <h6>Others</h6>
                                    </Label>
                                  </div>
                                </FormGroup>
                              </Col>
                              <Col lg="6" md="6">
                                <label>MPW (F)</label>
                              </Col>
                              <Col md="6">
                                <Inputtext
                                  type="text"
                                  classname={styles.inputstyle}
                                  placeholder="Enter Total MPW (F)"
                                  name="Name"
                                />
                              </Col>
                              <Col md="6">
                                <label>MPW (M)</label>
                              </Col>
                              <Col md="6">
                                <Inputtext
                                  type="text"
                                  classname={styles.inputstyle}
                                  placeholder="Enter Total MPW (M)"
                                  name="Name"
                                />
                              </Col>
                              <Col lg="6" md="6">
                                <label>ASHAs</label>
                              </Col>
                              <Col md="6">
                                <Inputtext
                                  type="text"
                                  classname={styles.inputstyle}
                                  placeholder="Enter Total ASHAs"
                                  name="Name"
                                />
                              </Col>
                              <Col lg="6" md="6">
                                <label>No of Women Health Volunteer</label>
                              </Col>
                              <Col md="6">
                                <Inputtext
                                  type="text"
                                  classname={styles.inputstyle}
                                  placeholder="Enter Total WHVs"
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
                                    <label>MLHP Training status</label>
                                  </Col>
                                  <Col lg="6" className={styles.selectHight}>
                                    <SelectList
                                      showLabel={true}
                                      options={trainingStatus}
                                      // value={null}
                                      placeholder="Select Staus"
                                      name="status"
                                    />
                                  </Col>
                                  <Col lg="6">
                                    <label>1st VHN MPW (F) NCD Training Status</label>
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
                                            style={{ zoom: "1.6" }}
                                            valid={true}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            name="MPW"
                                            valid={false}
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
                                            style={{ zoom: "1.6" }}
                                            valid={true}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            name="ASHAs"
                                            valid={false}
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
                                            style={{ zoom: "1.6" }}
                                            valid={true}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            name="Population"
                                            valid={false}
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
                                  classname={styles.inputstyle}
                                  placeholder="Enter.. "
                                  name="Name"
                                />
                              </Col>
                              <Col md="6">
                                <label>
                                  Individuals enumerated till now
                                    </label>
                              </Col>
                              <Col md="6">
                                <Inputtext
                                  type="text"
                                  classname={styles.inputstyle}
                                  placeholder="Enter.. "
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
                                            valid={true}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            name="Diabetes"
                                            valid={false}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <label>Individuals Examined (Diabetes)</label>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <Inputtext
                                      type="text"
                                      classname={styles.inputstyle}
                                      placeholder="Enter.. "
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
                                            valid={true}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            name="Cancer"
                                            valid={false}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <label>Individuals Examined (Oral Cancer)</label>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <Inputtext
                                      type="text"
                                      classname={styles.inputstyle}
                                      placeholder="Enter.. "
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
                                            valid={true}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            name="BreastCancer"
                                            valid={false}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <label>Individuals Examined (Breast Cancer)</label>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <Inputtext
                                      type="text"
                                      classname={styles.inputstyle}
                                      placeholder="Enter.. "
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
                                            style={{ zoom: "1.6" }}
                                            valid={true}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            name="CervicalCancer"
                                            valid={false}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <label>Individuals Examined (Cervical Cancer)</label>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <Inputtext
                                      type="text"
                                      classname={styles.inputstyle}
                                      placeholder="Enter.. "
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
                                            name="CervicalCancer"
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                            valid={true}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            name="CervicalCancer"
                                            valid={false}
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
                                      classname={styles.inputstyle}
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
                                            style={{ zoom: "1.6" }}
                                            valid={true}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            name="guidlines"
                                            valid={false}
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
                                      Diagnostics/Consumables available as per guidlines
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
                                            name="guidlines"
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                            valid={true}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            name="guidlines"
                                            valid={false}
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
                                            style={{ zoom: "1.6" }}
                                            valid={true}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            name="Glucometer"
                                            valid={false}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <label>No of BP Apparatus</label>
                                  </Col>
                                  <Col lg="6" md="6" sm="12" xs="12">
                                    <Inputtext
                                      type="text"
                                      classname={styles.inputstyle}
                                      placeholder="Enter.. "
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
                                {/* <Row>
                                  <Col lg="6" sm="12" xs="12">
                                    <label>Tablets</label>
                                  </Col>
                                  <Col lg="6" sm="12" xs="12">
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            name="Tablets"
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                            valid={true}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            name="Tablets"
                                            valid={false}
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>No</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                </Row> */}
                              </Col>
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
                                      classname={styles.inputstyle}
                                      placeholder="Enter.. "
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
                                      classname={styles.inputstyle}
                                      placeholder="Enter.. "
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
                                            name="signal"
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                            valid={true}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            name="signal"
                                            valid={false}
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
                                      // value={null}
                                      placeholder="Select service provider"
                                      name="status"
                                    />
                                  </Col>
                                </Row>
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
                                            name="Renovation"
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                            valid={true}
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            name="Renovation"
                                            valid={false}
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
                                            value="Rentfree"
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
                                            valid={true}
                                            name="Chairs"
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            valid={false}
                                            name="Chairs"
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
                                            valid={true}
                                            name="Chairs"
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            valid={false}
                                            name="Chairs"
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
                                            valid={true}
                                            name="registers"
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            valid={false}
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
                                            style={{ zoom: "1.6" }}
                                            valid={true}
                                            name="PHClanguages"
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            valid={false}
                                            name="PHClanguages"
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
                                            valid={true}
                                            name="PHCtoilet"
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            valid={false}
                                            name="PHCtoilet"
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
                                            valid={true}
                                            name="PHCsupply"
                                          />
                                          <h6>Yes</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            valid={false}
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
                                    <FormGroup check>
                                      <div>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                            value="Invertor"
                                            name="PHCpower"
                                          />
                                          <h6>Invertor</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            value="Generator"
                                            name="PHCpower"
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Generator</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            value="Solar"
                                            name="PHCpower"
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Solar</h6>
                                        </Label>
                                        <Label
                                          check
                                          className={styles.radioBtnStyles}
                                        >
                                          <Input
                                            value="Nil"
                                            name="PHCpower"
                                            type="radio"
                                            style={{ zoom: "1.6" }}
                                          />
                                          <h6>Nil</h6>
                                        </Label>
                                      </div>
                                    </FormGroup>
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
                  <Button style={{ float: "right" }} color="success"
                  onClick={() => {
                    this.submitData(hwcStatus);
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
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  {  }
)(withRouter(withApollo(Status)));
