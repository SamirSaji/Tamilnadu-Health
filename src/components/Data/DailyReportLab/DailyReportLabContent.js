import React from "react";
import { Col, Row, Table, Container, Button, Input } from "reactstrap";
import DisplayPages from "../../common/PageList/PageList";
import SelectList from "../../common/fields/CustomSelectGroup/CustomSelectGroup";
import Inputtext from "../../common/fields/TextFieldGroup/TextFieldGroup";
// datapicker
import DatePicker from "react-datepicker";
import moment from "moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { ApolloConsumer, withApollo } from "react-apollo";
import gql from "graphql-tag";
//styling datapicker
import "react-datepicker/dist/react-datepicker.css";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
// styles
import styles from "./stylesheet/DailyReport.less";

import { commonArrayCreatorForSelect } from "../../../utils/Common";
import {
  submitLabReport,
  downloadDailyLabReport
} from "../../../actions/reportActions.js";

class LabReportContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportDate: moment().subtract(1, "days"),
      defaults: {
        isInstitutionDisabled: false,
        downloadNow: false,
        reportType: null,
        institutionId: null,
        reportDate: moment().subtract("1", "days"),
        dengue: {
          nsElisa: { sample: 0, positive: 0 },
          lgmElisa: { sample: 0, positive: 0 },
          lgmElisaNIV: { sample: 0, positive: 0 },
          lgmElisaRapid: { sample: 0, positive: 0 },
          other: { sample: 0, positive: 0 }
        },
        chikungunya: {
          lgmElisa: { sample: 0, positive: 0 },
          culture: { sample: 0, positive: 0 },
          pcr: { sample: 0, positive: 0 },
          others: { sample: 0, positive: 0 }
        },
        swineFlu: {
          swabTest: { sample: 0, positive: 0 },
          others: { sample: 0, positive: 0 }
        },
        scrubTyphus: {
          lgmElisa: { sample: 0, positive: 0 },
          others: { sample: 0, positive: 0 }
        },
        leptospirosis: {
          lgmElisa: { sample: 0, positive: 0 },
          others: { sample: 0, positive: 0 }
        },
        malaria: {
          peripheralSmearMP: { sample: 0, positive: 0 },
          rdt: { sample: 0, positive: 0 }
        }
      }
    };
    this.submitReport = this.submitReport.bind(this);
    this.initiateDownloadDailyReport = this.initiateDownloadDailyReport.bind(
      this
    );
  }
  componentDidMount() {
    this.currentUserUpdate(this.props.auth.user ? this.props.auth.user : {});
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
  initiateDownloadDailyReport() {
    const { institutionId, reportDate } = this.state.defaults;
    const reportReqData = {
      institutionId,
      reportDate
    };
    if (this.props.auth.user.alias === 'district' || this.props.auth.user.alias === 'state' || this.props.auth.user.alias === 'block') {
      this.generateReport({});
    } else {
      this.props.downloadDailyLabReport(reportReqData);
    }

  }
  componentWillReceiveProps(newProps) {
    if (newProps.errors && newProps.errors.createDailyLabReport) {
      const errors = newProps.errors.createDailyLabReport;
      this.setState({
        errors
      });
    }
    if (newProps.errors && newProps.errors.dwnldDailyLabRepAction) {
      const errors = newProps.errors.dwnldDailyLabRepAction;
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
    if (this.props.auth.user.alias === 'block' || this.props.auth.user.alias === 'district' || this.props.auth.user.alias === 'state') {
      if (this.props.auth.user.alias === 'district' || this.props.auth.user.alias === 'block') {
        const { data } = await this.props.client.query({
          query: gql`
        query{
          getDailyLabReportDataByCond(type:"${'district_id'}",value:${this.props.auth.user.district_id}){
            institution_id chikungunya dengue malaria leptospirosis scrubTyphus reportDate swineFlu
            ReportLab_By_Institution{
              name
              phc_id
              gp_type
              hud
              hud_id
              block
              block_id
            }
          }
        }
        `
        });
        const changes = this.state;
        changes.defaults.downloadNow = true;
        changes.downloadContent = data.getDailyLabReportDataByCond;
        this.setState({
          changes
        });
        this.forceUpdate();
      }
    } else {
      const { data } = await this.props.client.query({
        query: gql`query{
          getDailyLabReportData(institution_id:${
          report.institutionId
          }) {
            institution_id chikungunya dengue malaria leptospirosis scrubTyphus reportDate swineFlu
            ReportLab_By_Institution{
              name
              phc_id
              gp_type
              hud
              hud_id
              block
              block_id
            }
          }
        }`
      });
      const newChanges = this.state;
      newChanges.defaults.downloadNow = true;
      newChanges.downloadContent = data.getDailyLabReportData;
      this.setState({
        newChanges
      });
      this.forceUpdate();
    }


  }
  submitReport = (type = "nil") => {
    const changes = this.state.defaults;
    changes.reportType = type;
    this.props.submitLabReport(changes);
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
  commonUpdate = (value, param1, param2, param3, location) => {
    if (location === "up") {
      const changes = this.state.defaults;
      changes[param1][param2][param3] = parseInt(value, 10);
      this.setState({
        changes
      });
    } else {
      const changes = this.state.defaults;
      changes[param1][param2][param3] = parseInt(value, 10);
      this.setState({
        changes
      });
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
        {labreport => (
          <Container fluid className={styles.bgcontent}>
            <Row className={styles.subHeader}>
              <Col lg="6" md="9" xs="6" className={styles.pageMenu}>
                <DisplayPages currentURL="labdailyreport" userData={this.props.auth.user} />
              </Col>
              <Col lg="6" md="3" xs="12" style={{ textAlign: "right" }}>
                {/* <button className={styles.btnDownload}>
              <i className="fa fa-download" /> Download
            </button> */}
              </Col>
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
                    <Col md="12" lg="12">
                      <Container fluid className={styles.inpatient}>
                        <h6>Inpatient</h6>
                        <Table bordered responsive>
                          <tbody>
                            <tr className={styles.tableHeader}>
                              <th colSpan="2">Name of Lab test</th>
                              <th>No of Samples tested</th>
                              <th>No of test positives</th>
                              <th>Percentage %</th>
                            </tr>
                            <tr>
                              <td rowSpan="5">Dengue</td>
                              <td>NS1 Elisa</td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.dengue.nsElisa.sample}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "dengue",
                                      "nsElisa",
                                      "sample",
                                      "up"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.dengue.nsElisa.positive}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "dengue",
                                      "nsElisa",
                                      "positive",
                                      "down"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.Total}>
                                {Number(
                                  defaults.dengue.nsElisa.sample /
                                  defaults.dengue.nsElisa.positive
                                ) > 0 &&
                                  Number(
                                    defaults.dengue.nsElisa.sample /
                                    defaults.dengue.nsElisa.positive
                                  ) < 100
                                  ? Number(
                                    defaults.dengue.nsElisa.positive /
                                    defaults.dengue.nsElisa.sample
                                  ).toFixed(2) * 100
                                  : 0}
                              </td>
                            </tr>
                            <tr>
                              <td>IgM Elisa</td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.dengue.lgmElisa.sample}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "dengue",
                                      "lgmElisa",
                                      "sample",
                                      "up"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.dengue.lgmElisa.positive}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "dengue",
                                      "lgmElisa",
                                      "positive",
                                      "down"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.Total}>
                                {Number(
                                  defaults.dengue.lgmElisa.sample /
                                  defaults.dengue.lgmElisa.positive
                                ) > 0 &&
                                  Number(
                                    defaults.dengue.lgmElisa.sample /
                                    defaults.dengue.lgmElisa.positive
                                  ) < 100
                                  ? Number(
                                    defaults.dengue.lgmElisa.positive /
                                    defaults.dengue.lgmElisa.sample
                                  ).toFixed(2) * 100
                                  : 0}
                              </td>
                            </tr>
                            <tr>
                              <td>IgM Elisa (NIV Kit)</td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.dengue.lgmElisaNIV.sample}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "dengue",
                                      "lgmElisaNIV",
                                      "sample",
                                      "up"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.dengue.lgmElisaNIV.positive}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "dengue",
                                      "lgmElisaNIV",
                                      "positive",
                                      "down"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.Total}>
                                {Number(
                                  defaults.dengue.lgmElisaNIV.sample /
                                  defaults.dengue.lgmElisaNIV.positive
                                ) > 0 &&
                                  Number(
                                    defaults.dengue.lgmElisaNIV.sample /
                                    defaults.dengue.lgmElisaNIV.positive
                                  ) < 100
                                  ? Number(
                                    defaults.dengue.lgmElisaNIV.positive /
                                    defaults.dengue.lgmElisaNIV.sample
                                  ).toFixed(2) * 100
                                  : 0}
                              </td>
                            </tr>
                            <tr>
                              <td>IgG Elisa/Rapid kit</td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.dengue.lgmElisaRapid.sample}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "dengue",
                                      "lgmElisaRapid",
                                      "sample",
                                      "up"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.dengue.lgmElisaRapid.positive}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "dengue",
                                      "lgmElisaRapid",
                                      "positive",
                                      "down"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.Total}>
                                {Number(
                                  defaults.dengue.lgmElisaRapid.sample /
                                  defaults.dengue.lgmElisaRapid.positive
                                ) > 0 &&
                                  Number(
                                    defaults.dengue.lgmElisaRapid.sample /
                                    defaults.dengue.lgmElisaRapid.positive
                                  ) < 100
                                  ? Number(
                                    defaults.dengue.lgmElisaRapid.positive /
                                    defaults.dengue.lgmElisaRapid.sample
                                  ).toFixed(2) * 100
                                  : 0}
                              </td>
                            </tr>
                            <tr>
                              <td>Other kits</td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.dengue.other.sample}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "dengue",
                                      "other",
                                      "sample",
                                      "up"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.dengue.other.positive}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "dengue",
                                      "other",
                                      "positive",
                                      "up"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.Total}>
                                {Number(
                                  defaults.dengue.other.sample /
                                  defaults.dengue.other.positive
                                ) > 0 &&
                                  Number(
                                    defaults.dengue.other.sample /
                                    defaults.dengue.other.positive
                                  ) < 100
                                  ? Number(
                                    defaults.dengue.other.positive /
                                    defaults.dengue.other.sample
                                  ).toFixed(2) * 100
                                  : 0}
                              </td>
                            </tr>
                            <tr>
                              <td rowSpan="4">Chikungunya</td>

                              <td>IgM ELISA</td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.chikungunya.lgmElisa.sample}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "chikungunya",
                                      "lgmElisa",
                                      "sample",
                                      "up"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.chikungunya.lgmElisa.positive}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "chikungunya",
                                      "lgmElisa",
                                      "positive",
                                      "down"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.Total}>
                                {Number(
                                  defaults.chikungunya.lgmElisa.sample /
                                  defaults.chikungunya.lgmElisa.positive
                                ) > 0 &&
                                  Number(
                                    defaults.chikungunya.lgmElisa.sample /
                                    defaults.chikungunya.lgmElisa.positive
                                  ) < 100
                                  ? Number(
                                    defaults.chikungunya.lgmElisa.positive /
                                    defaults.chikungunya.lgmElisa.sample
                                  ).toFixed(2) * 100
                                  : 0}
                              </td>
                            </tr>
                            <tr>
                              <td>Culture</td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.chikungunya.culture.sample}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "chikungunya",
                                      "culture",
                                      "sample",
                                      "up"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.chikungunya.culture.positive}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "chikungunya",
                                      "culture",
                                      "positive",
                                      "down"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.Total}>
                                {Number(
                                  defaults.chikungunya.culture.sample /
                                  defaults.chikungunya.culture.positive
                                ) > 0 &&
                                  Number(
                                    defaults.chikungunya.culture.sample /
                                    defaults.chikungunya.culture.positive
                                  ) < 100
                                  ? Number(
                                    defaults.chikungunya.culture.positive /
                                    defaults.chikungunya.culture.sample
                                  ).toFixed(2) * 100
                                  : 0}
                              </td>
                            </tr>
                            <tr>
                              <td>PCR</td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.chikungunya.pcr.sample}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "chikungunya",
                                      "pcr",
                                      "sample",
                                      "up"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.chikungunya.pcr.positive}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "chikungunya",
                                      "pcr",
                                      "positive",
                                      "down"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.Total}>
                                {Number(
                                  defaults.chikungunya.pcr.sample /
                                  defaults.chikungunya.pcr.positive
                                ) > 0 &&
                                  Number(
                                    defaults.chikungunya.pcr.sample /
                                    defaults.chikungunya.pcr.positive
                                  ) < 100
                                  ? Number(
                                    defaults.chikungunya.pcr.positive /
                                    defaults.chikungunya.pcr.sample
                                  ).toFixed(2) * 100
                                  : 0}
                              </td>
                            </tr>
                            <tr>
                              <td>Any other test</td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.chikungunya.others.sample}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "chikungunya",
                                      "others",
                                      "sample",
                                      "up"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.chikungunya.others.positive}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "chikungunya",
                                      "others",
                                      "positive",
                                      "down"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.Total}>
                                {Number(
                                  defaults.chikungunya.others.sample /
                                  defaults.chikungunya.others.positive
                                ) > 0 &&
                                  Number(
                                    defaults.chikungunya.others.sample /
                                    defaults.chikungunya.others.positive
                                  ) < 100
                                  ? Number(
                                    defaults.chikungunya.others.positive /
                                    defaults.chikungunya.others.sample
                                  ).toFixed(2) * 100
                                  : 0}
                              </td>
                            </tr>
                            <tr>
                              <td rowSpan="2">Scrub Typhus</td>
                              <td>IgM ELISA</td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.scrubTyphus.lgmElisa.sample}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "scrubTyphus",
                                      "lgmElisa",
                                      "sample",
                                      "up"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.scrubTyphus.lgmElisa.positive}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "scrubTyphus",
                                      "lgmElisa",
                                      "positive",
                                      "down"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.Total}>
                                {Number(
                                  defaults.scrubTyphus.lgmElisa.sample /
                                  defaults.scrubTyphus.lgmElisa.positive
                                ) > 0 &&
                                  Number(
                                    defaults.scrubTyphus.lgmElisa.sample /
                                    defaults.scrubTyphus.lgmElisa.positive
                                  ) < 100
                                  ? Number(
                                    defaults.scrubTyphus.lgmElisa.positive /
                                    defaults.scrubTyphus.lgmElisa.sample
                                  ).toFixed(2) * 100
                                  : 0}
                              </td>
                            </tr>
                            <tr>
                              <td>Others</td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.scrubTyphus.others.sample}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "scrubTyphus",
                                      "others",
                                      "sample",
                                      "up"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.scrubTyphus.others.positive}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "scrubTyphus",
                                      "others",
                                      "positive",
                                      "down"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.Total}>
                                {Number(
                                  defaults.scrubTyphus.others.sample /
                                  defaults.scrubTyphus.others.positive
                                ) > 0 &&
                                  Number(
                                    defaults.scrubTyphus.others.sample /
                                    defaults.scrubTyphus.others.positive
                                  ) < 100
                                  ? Number(
                                    defaults.scrubTyphus.others.positive /
                                    defaults.scrubTyphus.others.sample
                                  ).toFixed(2) * 100
                                  : 0}
                              </td>
                            </tr>
                            <tr>
                              <td rowSpan="2">Leptospirosis</td>
                              <td>IgM ELISA</td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.leptospirosis.lgmElisa.sample}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "leptospirosis",
                                      "lgmElisa",
                                      "sample",
                                      "up"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={
                                    defaults.leptospirosis.lgmElisa.positive
                                  }
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "leptospirosis",
                                      "lgmElisa",
                                      "positive",
                                      "down"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.Total}>
                                {Number(
                                  defaults.leptospirosis.lgmElisa.sample /
                                  defaults.leptospirosis.lgmElisa.positive
                                ) > 0 &&
                                  Number(
                                    defaults.leptospirosis.lgmElisa.sample /
                                    defaults.leptospirosis.lgmElisa.positive
                                  ) < 100
                                  ? Number(
                                    defaults.leptospirosis.lgmElisa.positive /
                                    defaults.leptospirosis.lgmElisa.sample
                                  ).toFixed(2) * 100
                                  : 0}
                              </td>
                            </tr>
                            <tr>
                              <td>Others</td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.leptospirosis.others.sample}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "leptospirosis",
                                      "others",
                                      "sample",
                                      "up"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.leptospirosis.others.positive}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "leptospirosis",
                                      "others",
                                      "positive",
                                      "down"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.Total}>
                                {Number(
                                  defaults.leptospirosis.others.sample /
                                  defaults.leptospirosis.others.positive
                                ) > 0 &&
                                  Number(
                                    defaults.leptospirosis.others.sample /
                                    defaults.leptospirosis.others.positive
                                  ) < 100
                                  ? Number(
                                    defaults.leptospirosis.others.positive /
                                    defaults.leptospirosis.others.sample
                                  ).toFixed(2) * 100
                                  : 0}
                              </td>
                            </tr>
                            <tr>
                              <td rowSpan="2">Malaria</td>
                              <td>Peripheral Smear for MP</td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={
                                    defaults.malaria.peripheralSmearMP.sample
                                  }
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "malaria",
                                      "peripheralSmearMP",
                                      "sample"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={
                                    defaults.malaria.peripheralSmearMP.positive
                                  }
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "malaria",
                                      "peripheralSmearMP",
                                      "positive",
                                      "down"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.Total}>
                                {Number(
                                  defaults.malaria.peripheralSmearMP.sample /
                                  defaults.malaria.peripheralSmearMP.positive
                                ) > 0 &&
                                  Number(
                                    defaults.malaria.peripheralSmearMP.sample /
                                    defaults.malaria.peripheralSmearMP.positive
                                  ) < 100
                                  ? Number(
                                    defaults.malaria.peripheralSmearMP
                                      .positive /
                                    defaults.malaria.peripheralSmearMP
                                      .sample
                                  ).toFixed(2) * 100
                                  : 0}
                              </td>
                            </tr>
                            <tr>
                              <td>Rapid Diagnostic Kit (RDT)</td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.malaria.rdt.sample}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "malaria",
                                      "rdt",
                                      "sample",
                                      "up"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.malaria.rdt.positive}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "malaria",
                                      "rdt",
                                      "positive",
                                      "down"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.Total}>
                                {Number(
                                  defaults.malaria.rdt.sample /
                                  defaults.malaria.rdt.positive
                                ) > 0 &&
                                  Number(
                                    defaults.malaria.rdt.sample /
                                    defaults.malaria.rdt.positive
                                  ) < 100
                                  ? Number(
                                    defaults.malaria.rdt.positive /
                                    defaults.malaria.rdt.sample
                                  ).toFixed(2) * 100
                                  : 0}
                              </td>
                            </tr>
                            {/* new secruib */}
                            <tr>
                              <td rowSpan="2">Swine Flu</td>
                              <td>Swab Test</td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={
                                    defaults.swineFlu.swabTest.sample
                                  }
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "swineFlu",
                                      "swabTest",
                                      "sample",
                                      "up"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={
                                    defaults.swineFlu.swabTest.positive
                                  }
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "swineFlu",
                                      "swabTest",
                                      "positive",
                                      "down"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.Total}>
                                {Number(
                                  defaults.swineFlu.swabTest.sample /
                                  defaults.swineFlu.swabTest.positive
                                ) > 0 &&
                                  Number(
                                    defaults.swineFlu.swabTest.sample /
                                    defaults.swineFlu.swabTest.positive
                                  ) < 100
                                  ? Number(
                                    defaults.swineFlu.swabTest
                                      .positive /
                                    defaults.swineFlu.swabTest
                                      .sample
                                  ).toFixed(2) * 100
                                  : 0}
                              </td>
                            </tr>
                            <tr>
                              <td>Others</td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.swineFlu.others.sample}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "swineFlu",
                                      "others",
                                      "sample",
                                      "up"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.inputField}>
                                <Input
                                  type="text"
                                  value={defaults.swineFlu.others.positive}
                                  onChange={e => {
                                    this.commonUpdate(
                                      e.target.value,
                                      "swineFlu",
                                      "others",
                                      "positive",
                                      "down"
                                    );
                                  }}
                                />
                              </td>
                              <td className={styles.Total}>
                                {Number(
                                  defaults.swineFlu.others.sample /
                                  defaults.swineFlu.others.positive
                                ) > 0 &&
                                  Number(
                                    defaults.swineFlu.others.sample /
                                    defaults.swineFlu.others.positive
                                  ) < 100
                                  ? Number(
                                    defaults.swineFlu.others.positive /
                                    defaults.swineFlu.others.sample
                                  ).toFixed(2) * 100
                                  : 0}
                              </td>
                            </tr>
                            {/* new section */}
                          </tbody>
                        </Table>
                      </Container>
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Row>
            <Row>
              <Col md="12" lg="12">
                <Container fluid>
                  <Row>
                    <Col md="12" lg="6">
                      <p style={{ color: "#524b4b", fontSize: "14px" }}>
                        Note:
                        <br />
                        1) Submit: All unentered field will be saved as "0"
                        <br />
                        2) Submit Nil Report: All the fields will be saved as
                        "0"
                      </p>
                    </Col>
                    <Col md="12" lg="6" className={styles.btnSubmit}>
                      <Button
                        color="primary"
                        onClick={() => {
                          this.submitReport("filled");
                        }}
                      >
                        Submit
                </Button>
                      <Button
                        color="primary"
                        onClick={() => {
                          this.submitReport("nil");
                        }}
                      >
                        Submit Nil Report
                </Button>
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
// export default DailyReportContent;

LabReportContent.propTypes = {
  submitLabReport: PropTypes.func.isRequired,
  downloadDailyLabReport: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  language: state.language,
  reports: state.reports
});

export default connect(
  mapStateToProps,
  { submitLabReport, downloadDailyLabReport }
)(withRouter(withApollo(LabReportContent)));
