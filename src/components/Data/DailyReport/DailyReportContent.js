import React from "react";
import { Col, Row, Table, Container, Button, Input } from "reactstrap";
import PropTypes from "prop-types";
import { ApolloConsumer, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import DisplayPages from "../../common/PageList/PageList";
import SelectList from "../../common/fields/CustomSelectGroup/CustomSelectGroup";
import Inputtext from "../../common/fields/TextFieldGroup/TextFieldGroup";
// datapicker
import DatePicker from "react-datepicker";
import moment from "moment";
//styling datapicker
import "react-datepicker/dist/react-datepicker.css";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
// styles
import styles from "./stylesheet/DailyReport.less";

//custom
import { commonArrayCreatorForSelect } from "../../../utils/Common";

// actions
import {
  submitReport,
  downloadDailyReport
} from "../../../actions/reportActions.js";
import PageList from "../../common/PageList/PageList";

class DailyReportContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaults: {
        isInstitutionDisabled: false,
        downloadNow: false,
        reportType: null,
        institutionId: null,
        reportDate: moment().subtract("1", "days"),
        feverCase: {
          total: { child: 0, adult: 0 },
          admittedYesterday: { child: 0, adult: 0 },
          dischargedYesterday: { child: 0, adult: 0 }
        },
        dengueCase: {
          total: { ns: 0, lgM: 0 },
          admittedYesterday: { ns: 0, lgM: 0 },
          dischargedYesterday: { ns: 0, lgM: 0 }
        },
        outPatient: {
          total: {
            child: 0,
            adult: 0
          }
        }
      }
    };

    // added by sandeep
    this.submitReport = this.submitReport.bind(this);
    this.generateReport = this.generateReport.bind(this);
    this.commonUpdate = this.commonUpdate.bind(this);
    this.onReportDateChange = this.onReportDateChange.bind(this);
    this.changeInstitution = this.changeInstitution.bind(this);
    this.initiateDownloadDailyReport = this.initiateDownloadDailyReport.bind(
      this
    );
    this.currentUserUpdate = this.currentUserUpdate.bind(this);
  }
  async currentUserUpdate(userData) {
    if (
      userData.role &&
      (userData.role === 1 ||
        userData.role === 2 ||
        userData.role === 3 ||
        userData.role === 7) &&
      userData.phc_id !== undefined &&
      userData.phc_id !== null
    ) {
      //set all blocks here
      
      const myInstiutionData = this.props.institutions.filter(
        institute => institute.phc_id === userData.phc_id
      );
      if (myInstiutionData) {
        this.changeInstitution(myInstiutionData[0]);
        const changes = this.state;
        changes.defaults.isInstitutionDisabled = true;
        this.setState({
          changes
        });
      }
    }
  }
  componentDidMount() {
    this.currentUserUpdate(this.props.auth.user ? this.props.auth.user : {});
  }
  componentWillMount() {}
  componentWillReceiveProps(newProps) {
    // error handler for creating report;
    if (newProps.errors && newProps.errors.createDailyReport) {
      const errors = newProps.errors.createDailyReport;
      this.setState({
        errors
      });
    }
    // error handler for downloading report
    if (newProps.errors && newProps.errors.dwnldDailyRepAction) {
      const errors = newProps.errors.dwnldDailyRepAction;
      this.setState({
        errors
      });
    }
    //download report validator
    if (Object.keys(newProps.reports).length > 0) {
      this.generateReport(newProps.reports);
    }
  }
  async generateReport(report) {
    if(this.props.auth.user.alias === 'block' || this.props.auth.user.alias === 'district' || this.props.auth.user.alias === 'state') {
      if(this.props.auth.user.alias === 'district' || this.props.auth.user.alias === 'block') {
    const { data } = await this.props.client.query({
      query: gql`query{
        getDailyReportDataByCond(type:"${'district_id'}",value:${this.props.auth.user.district_id}) {
        institution_id dengueCase feverCase outPatient reportDate reportType
        Report_By_Institution{
          name
          gp_type
          phc_id
          hud
          hud_id
          block
          block_id
        }
        }
      }`
    });
    const changes = this.state;
    changes.defaults.downloadNow = true;
    changes.downloadContent = data.getDailyReportDataByCond;
    this.setState({
      changes
    });
    this.forceUpdate();
      }
     } else {
      const { data } = await this.props.client.query({
        query: gql`query{
          getDailyReportData(institution_id:${
            report.institutionId
          },created_at:"${moment(report.reportDate).format("YYYY-MM-DD")}") {
          institution_id dengueCase feverCase outPatient reportDate reportType
          Report_By_Institution{
            name
            gp_type
            phc_id
            hud
            hud_id
            block
            block_id
          }
          }
        }`
      });
      const changes = this.state;
      changes.defaults.downloadNow = true;
      changes.downloadContent = data.getDailyReportData;
      this.setState({
        changes
      });
      this.forceUpdate();
     } 
  }
  initiateDownloadDailyReport() {
    const { institutionId, reportDate } = this.state.defaults;
    const reportReqData = {
      institutionId,
      reportDate
    };
    if(this.props.auth.user.alias === 'district' || this.props.auth.user.alias==='state' || this.props.auth.user.alias === 'block') {
      this.generateReport ({});
    } else {
      this.props.downloadDailyReport(reportReqData);
    }
    
  }
  submitReport = (type = "nil") => {
    const changes = this.state.defaults;
    changes.reportType = type;
    this.props.submitReport(changes);
  };
  commonUpdate = (value, param1, param2, param3) => {
    if (Number(value) <= 0) {
      value = 0;
    }
    const changes = this.state.defaults;
    changes[param1][param2][param3] = parseInt(value, 10);
    this.setState({
      changes
    });
  };
  onReportDateChange = e => {
    if (e._isAMomentObject) {
      const changes = this.state;
      changes.defaults.reportDate = e;
      this.setState({
        changes
      });
    } else {
      e.preventDefault();
      return false;
    }
  };
  changeInstitution = currentInstitution => {
    const changes = this.state;
    changes.defaults.institutionId = currentInstitution;
    changes.defaults.downloadNow = true;
    this.setState({
      changes
    });
  };

  render() {
    const { defaults, errors } = this.state;
    const institutions = commonArrayCreatorForSelect(
      this.props.institutions,
      "institution_id",
      "name"
    );
    return (
      <ApolloConsumer>
        {DailyReport => (
          <Container fluid className={styles.bgcontent}>
            <Row className={styles.subHeader}>
              {/* <Col lg="6" md="9" className={styles.pageMenu}> */}
                {/* <DisplayPages currentURL="dailyreport" userData = {this.props.auth.user}/> */}
                <Col md="12" style={{ padding: "15px 10px", boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.1), 0 0px 20px 0 rgba(0, 0, 0, 0.19)" }} >
                  <PageList currentUrl={window.location.pathname.split('/')[2]} userData={this.props.auth.user} />
                </Col>
              {/* </Col> */}
            </Row>
            <Row>
              <Col md="12" className={styles.dailyTital}>
                <Container fluid>
                  <Row>
                    <Col md="12" style={{ height: "45px" }}>
                      <span className={styles.tagg}>Daily Report</span>
                    </Col>
                    <Col md="12" lg="12">
                      <Container fluid>
                        <Row>
                          <Col
                            md="12"
                            lg="12"
                            className={styles.reportFilter}
                            style={{ borderTopLeftRadius: "0" }}
                          >
                            <Row>
                              <Col md="2">
                                <label>Date of report</label>
                                <span
                                  style={{ fontWeight: "950", color: "red" }}
                                >
                                  {"*"}
                                </span>
                                <DatePicker
                                  minDate={moment().subtract(13, "days")}
                                  maxDate={moment()}
                                  placeholderText="DD/MM/YYYY"
                                  dateFormat="DD/MM/YYYY"
                                  className={styles.datePicker}
                                  selected={defaults.reportDate}
                                  onChangeRaw={this.onReportDateChange}
                                  onChange={this.onReportDateChange}
                                />
                              </Col>
                              <Col md="4">
                                <SelectList
                                  star="*"
                                  Disabled={defaults.isInstitutionDisabled}
                                  label={"Institution Name"}
                                  placeholder="Select Institution"
                                  value={
                                    defaults.institutionId
                                      ? institutions.filter(
                                          institute =>
                                            defaults.institutionId
                                              .institution_id ===
                                            institute.institution_id
                                        )
                                      : null
                                  }
                                  options={institutions}
                                  onChange={this.changeInstitution}
                                  classNamePrefix={styles.test}
                                  className={
                                    defaults.institutionId !== null
                                      ? ` asdas `
                                      : ` ${styles.changedClass} `
                                  }
                                  // applyErrorClass={errors.patientDetails && errors.patientDetails.origin ? true : false}
                                />
                                <span className={styles.errorClass}>
                                  {errors && errors.institutionId}
                                </span>
                              </Col>
                              <Col md="3" className={styles.instType}>
                                <Inputtext
                                  star="*"
                                  label={"Institution ID"}
                                  type="text"
                                  disable="disabled"
                                  classname={styles.instId}
                                  placeholder={
                                    defaults.institutionId
                                      ? institutions.filter(
                                          institute =>
                                            defaults.institutionId
                                              .institution_id ===
                                            institute.institution_id
                                        )[0].phc_id
                                      : "Institution ID"
                                  }
                                />
                              </Col>
                              <Col md="3" className={styles.instTypeName}>
                                <Inputtext
                                  star="*"
                                  label={"Institution Type"}
                                  type="text"
                                  disable="disabled"
                                  classname={styles.instType}
                                  placeholder={
                                    defaults.institutionId
                                      ? institutions.filter(
                                          institute =>
                                            defaults.institutionId
                                              .institution_id ===
                                            institute.institution_id
                                        )[0].gp_type
                                      : "Institution Type"
                                  }
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Container>
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <Container fluid>
                  <Row>
                    {/* Inpatient */}

                    <Col md="12" lg="6">
                      <Container fluid className={styles.inpatient}>
                        <h6>Inpatient</h6>
                        <Table bordered responsive>
                          <thead>
                            <tr>
                              <th className={styles.tHeader}>IP Fever Cases</th>
                              <th className={styles.tableHead}>
                                {" "}
                                {"<"}
                                12 Children
                              </th>
                              <th className={styles.tableHead}>Adult</th>
                              <th className={styles.tableHead}>Total</th>
                            </tr>
                          </thead>
                          <tbody className={styles.mainTD}>
                            <tr>
                              <td>
                                Total&nbsp;No.of&nbsp;IP&nbsp;Fever&nbsp;Cases&nbsp;in&nbsp;Hospitals
                                Yesterday
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  value={
                                    defaults.feverCase.total.child
                                      ? defaults.feverCase.total.child
                                      : ``
                                  }
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "feverCase",
                                      "total",
                                      "child"
                                    );
                                  }}
                                  className={styles.inputFiled}
                                />
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  value={
                                    defaults.feverCase.total.adult
                                      ? defaults.feverCase.total.adult
                                      : ``
                                  }
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "feverCase",
                                      "total",
                                      "adult"
                                    );
                                  }}
                                  className={styles.inputFiled}
                                />
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  disabled
                                  className={
                                    styles.inputFiled + " " + styles.Total
                                  }
                                  value={
                                    defaults.feverCase.total.child +
                                    defaults.feverCase.total.adult
                                  }
                                  onChange={this.changeFeverTotal}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                No.of Fever Cases admitted in last 24hrs.
                                (between 8 AM to 8 AM)
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  value={
                                    defaults.feverCase.admittedYesterday.child
                                      ? defaults.feverCase.admittedYesterday
                                          .child
                                      : ``
                                  }
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "feverCase",
                                      "admittedYesterday",
                                      "child"
                                    );
                                  }}
                                  className={styles.inputFiled}
                                />
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="number"
                                  name="admitAdult"
                                  value={
                                    defaults.feverCase.admittedYesterday.adult
                                      ? defaults.feverCase.admittedYesterday
                                          .adult
                                      : ``
                                  }
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "feverCase",
                                      "admittedYesterday",
                                      "adult"
                                    );
                                  }}
                                  className={styles.inputFiled}
                                />
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  disabled
                                  className={
                                    styles.inputFiled + " " + styles.Total
                                  }
                                  value={
                                    defaults.feverCase.admittedYesterday.child +
                                    defaults.feverCase.admittedYesterday.adult
                                  }
                                  onChange={this.changeAdmitTotal}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                No.of Fever Cases discharged in last 24hrs.
                                (between 8 AM to 8 AM)
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  value={
                                    defaults.feverCase.dischargedYesterday.child
                                      ? defaults.feverCase.dischargedYesterday
                                          .child
                                      : ``
                                  }
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "feverCase",
                                      "dischargedYesterday",
                                      "child"
                                    );
                                  }}
                                  className={styles.inputFiled}
                                />
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  value={
                                    defaults.feverCase.dischargedYesterday.adult
                                      ? defaults.feverCase.dischargedYesterday
                                          .adult
                                      : ``
                                  }
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "feverCase",
                                      "dischargedYesterday",
                                      "adult"
                                    );
                                  }}
                                  className={styles.inputFiled}
                                />
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  disabled
                                  value={
                                    defaults.feverCase.dischargedYesterday
                                      .child +
                                    defaults.feverCase.dischargedYesterday.adult
                                  }
                                  className={
                                    styles.inputFiled + " " + styles.Total
                                  }
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Total No.of IP Fever Cases in Hospitals Today
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  disabled
                                  value={
                                    defaults.feverCase.total.child +
                                    defaults.feverCase.admittedYesterday.child -
                                    defaults.feverCase.dischargedYesterday.child
                                  }
                                  className={
                                    styles.inputFiled + " " + styles.Total
                                  }
                                />
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  value={
                                    defaults.feverCase.total.adult +
                                    defaults.feverCase.admittedYesterday.adult -
                                    defaults.feverCase.dischargedYesterday.adult
                                  }
                                  disabled
                                  className={
                                    styles.inputFiled + " " + styles.Total
                                  }
                                />
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  value={
                                    defaults.feverCase.total.adult +
                                    defaults.feverCase.admittedYesterday.adult -
                                    defaults.feverCase.dischargedYesterday
                                      .adult +
                                    defaults.feverCase.total.child +
                                    defaults.feverCase.admittedYesterday.child -
                                    defaults.feverCase.dischargedYesterday.child
                                  }
                                  disabled
                                  className={
                                    styles.inputFiled + " " + styles.Total
                                  }
                                />
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Container>
                    </Col>
                    {/* Dengue Positive cases */}
                    <Col md="12" lg="6">
                      <Container fluid className={styles.inpatient}>
                        <br />
                        <Table bordered responsive>
                          <tbody className={styles.mainTD}>
                            <tr>
                              <th rowSpan="2" className={styles.tHeader}>
                                Dengue Positive cases
                              </th>
                              <th
                                colSpan="3"
                                style={{
                                  textAlign: "center",
                                  padding: "5px 0px"
                                }}
                              >
                                Elisa
                              </th>
                            </tr>
                            <tr>
                              <th
                                scope="row"
                                className={styles.tableHead}
                                style={{ padding: "3px" }}
                              >
                                NS1
                              </th>
                              <th
                                className={styles.tableHead}
                                style={{ padding: "3px" }}
                              >
                                lgM
                              </th>
                              <th
                                className={styles.tableHead}
                                style={{ padding: "3px" }}
                              >
                                Total
                              </th>
                            </tr>
                            <tr>
                              <td>
                                {" "}
                                Dengue&nbsp;+ve&nbsp;cases&nbsp;in&nbsp;Hospitals&nbsp;Yesterday
                                (out of Total IP)
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  value={
                                    defaults.dengueCase.total.ns
                                      ? defaults.dengueCase.total.ns
                                      : ``
                                  }
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "dengueCase",
                                      "total",
                                      "ns"
                                    );
                                  }}
                                  className={styles.inputFiled}
                                />
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  value={
                                    defaults.dengueCase.total.lgM
                                      ? defaults.dengueCase.total.lgM
                                      : ``
                                  }
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "dengueCase",
                                      "total",
                                      "lgM"
                                    );
                                  }}
                                  className={styles.inputFiled}
                                />
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  value={
                                    defaults.dengueCase.total.lgM +
                                    defaults.dengueCase.total.ns
                                  }
                                  disabled
                                  className={
                                    styles.inputFiled + " " + styles.Total
                                  }
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                No.of Dengue Cases detected in last 24hrs.
                                (between 8 AM to 8 AM)
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  value={
                                    defaults.dengueCase.admittedYesterday.ns
                                      ? defaults.dengueCase.admittedYesterday.ns
                                      : ``
                                  }
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "dengueCase",
                                      "admittedYesterday",
                                      "ns"
                                    );
                                  }}
                                  className={styles.inputFiled}
                                />
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  value={
                                    defaults.dengueCase.admittedYesterday.lgM
                                      ? defaults.dengueCase.admittedYesterday
                                          .lgM
                                      : ``
                                  }
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "dengueCase",
                                      "admittedYesterday",
                                      "lgM"
                                    );
                                  }}
                                  className={styles.inputFiled}
                                />
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  value={
                                    defaults.dengueCase.admittedYesterday.lgM +
                                    defaults.dengueCase.admittedYesterday.ns
                                  }
                                  disabled
                                  className={
                                    styles.inputFiled + " " + styles.Total
                                  }
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                No.of Fever Cases discharged in last 24hrs.
                                (between 8 AM to 8 AM)
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  value={
                                    defaults.dengueCase.dischargedYesterday.ns
                                      ? defaults.dengueCase.dischargedYesterday
                                          .ns
                                      : ``
                                  }
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "dengueCase",
                                      "dischargedYesterday",
                                      "ns"
                                    );
                                  }}
                                  className={styles.inputFiled}
                                />
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  value={
                                    defaults.dengueCase.dischargedYesterday.lgM
                                      ? defaults.dengueCase.dischargedYesterday
                                          .lgM
                                      : ``
                                  }
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "dengueCase",
                                      "dischargedYesterday",
                                      "lgM"
                                    );
                                  }}
                                  className={styles.inputFiled}
                                />
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  value={
                                    defaults.dengueCase.dischargedYesterday.ns +
                                    defaults.dengueCase.dischargedYesterday.lgM
                                  }
                                  disabled
                                  className={
                                    styles.inputFiled + " " + styles.Total
                                  }
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Dengue&nbsp;+ve&nbsp;cases&nbsp;in&nbsp;Hospitals&nbsp;Today
                                <br />
                                (out of Total IP){" "}
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  value={
                                    defaults.dengueCase.total.ns +
                                    defaults.dengueCase.admittedYesterday.ns -
                                    defaults.dengueCase.dischargedYesterday.ns
                                  }
                                  disabled
                                  className={
                                    styles.inputFiled + " " + styles.Total
                                  }
                                />
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  value={
                                    defaults.dengueCase.total.lgM +
                                    defaults.dengueCase.admittedYesterday.lgM -
                                    defaults.dengueCase.dischargedYesterday.lgM
                                  }
                                  disabled
                                  className={
                                    styles.inputFiled + " " + styles.Total
                                  }
                                />
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  disabled
                                  value={
                                    defaults.dengueCase.total.lgM +
                                    defaults.dengueCase.admittedYesterday.lgM -
                                    defaults.dengueCase.dischargedYesterday
                                      .lgM +
                                    defaults.dengueCase.total.ns +
                                    defaults.dengueCase.admittedYesterday.ns -
                                    defaults.dengueCase.dischargedYesterday.ns
                                  }
                                  className={
                                    styles.inputFiled + " " + styles.Total
                                  }
                                />
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Container>
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Row>
            {/* Outpatient */}
            <Row>
              <Col md="12">
                <Container fluid>
                  <Row>
                    <Col md="12" lg="6">
                      <Container fluid className={styles.inpatient}>
                        <h6>Outpatient</h6>
                        <Table bordered responsive>
                          <thead>
                            <tr>
                              <th className={styles.tHeader}>
                                All outpatient cases
                              </th>
                              <th className={styles.tableHead}>
                                {" "}
                                {`< 12 Children`}
                              </th>
                              <th className={styles.tableHead}>Adult</th>
                              <th className={styles.tableHead}>Total</th>
                            </tr>
                          </thead>
                          <tbody className={styles.mainTD}>
                            <tr>
                              <td>
                                Total&nbsp;No.of&nbsp;OPD&nbsp;Attendance
                                (between 8 AM to 8 AM)
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  className={styles.inputFiled}
                                  value={
                                    defaults.outPatient.total.child
                                      ? defaults.outPatient.total.child
                                      : ``
                                  }
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "outPatient",
                                      "total",
                                      "child"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  className={styles.inputFiled}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "outPatient",
                                      "total",
                                      "adult"
                                    );
                                  }}
                                  value={
                                    defaults.outPatient.total.adult
                                      ? defaults.outPatient.total.adult
                                      : ``
                                  }
                                />
                              </td>
                              <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  disabled
                                  value={
                                    defaults.outPatient.total.child +
                                    defaults.outPatient.total.adult
                                  }
                                  className={
                                    styles.inputFiled + " " + styles.Total
                                  }
                                />
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Container>
                    </Col>
                    <Col md="12" lg="6">
                    <p style={{ color: "#524b4b", fontSize: "14px" }}>
                        Note:
                        <br />
                        1) Submit: All unentered field will be saved as "0"
                        <br />
                        2) Submit Nil Report: All the fields will be saved as
                        "0"
                      </p>
                      <Row>
                        <Col md="12" className={styles.submitReport}>
                        <Button
                        className={styles.btnSubmit}
                        color={"primary"}
                        onClick={() => {
                          this.submitReport("filled");
                        }}
                      >
                        {"Submit"}
                      </Button>{" "}
                      <Button
                        className={styles.btnSubmit}
                        color={"primary"}
                        onClick={() => {
                          this.submitReport("nil");
                        }}
                      >
                        {"Submit Nil Report"}
                      </Button>
                        </Col>
                      </Row>
                      
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>
        )}
      </ApolloConsumer>
    );
  }
}

DailyReportContent.propTypes = {
  submitReport: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  language: state.language,
  reports: state.reports
});

export default connect(
  mapStateToProps,
  { submitReport, downloadDailyReport }
)(withRouter(withApollo(DailyReportContent)));
