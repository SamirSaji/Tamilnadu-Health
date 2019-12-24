import React from "react";
import { Col, Row, Table, Container, Input, Button } from "reactstrap";
import { submitPWCReportDrug } from '../../../actions/reportActions';
import moment from 'moment';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withApollo } from "react-apollo";
import gql from "graphql-tag";
import { withAlert } from "react-alert";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
// styles
import Download from "../Template/HWCReportDrug/Report";
import styles from "./stylesheet/Report.less";
import "react-datepicker/dist/react-datepicker.css";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import PageList from "../../common/PageList/PageList";

class Report extends React.Component {

  constructor(props) {
    super(props);
    this.changeBenefic = this.changeBenefic.bind(this);
    this.saveReport = this.saveReport.bind(this);
    this.commonChange = this.commonChange.bind(this);
    this.generateReport = this.generateReport.bind(this);
    this.reportDateChange = this.reportDateChange.bind(this);
    this.state = {
      drugsList: [],
      reportDate: moment(),
    }
  }
  async changeBenefic(value, varName) {
    const { patientCount } = this.state;
    patientCount[varName] = value;
    patientCount['total'] = Number(patientCount['male']) + Number(patientCount['female']);
    this.setState({ patientCount });
  }

  genreportQuery = (isDistrict) => {
    if (isDistrict) {
      return gql`{
        getHWCReport(
          created_by:"${this.props.auth.user.user_id}",
        district_id:${this.props.auth.user.district_id},
        alias:"${this.props.auth.user.alias}"
        )
      {
        report_date drugsList patient_count
        User_report_district 
        { username 
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
      }
    }`
    } else {
      return gql`{
          getHWCReport(
            created_by:"${this.props.auth.user.user_id}",
          district_id:${this.props.auth.user.district_id},
          alias:"${this.props.auth.user.alias}"
          )
        {
          report_date drugsList patient_count
          User_report_district 
          { username 
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
        }
        }`
    }
  }

  generateLocalReport = (dist_id, phc_id) => {
    console.info('DIST', dist_id, phc_id);
    const getItems = (key) => JSON.parse(localStorage.getItem(key));
    const locs = getItems('locationdata');
    const uhc_data = getItems('data');
    const drug_reports = getItems('drug_reports');
    const reports_data = Object.keys(drug_reports).map(report_date => {
      const report = drug_reports[report_date];
      const report_template = {
        report_date,
        drugsList: report.newDrugList,
        patient_count: report.patientCount,
        User_report_district: {
          username: '',
          phc_User: uhc_data.phc_list.find(_ => _.phc_id === phc_id),
          // {
          //   phc_name: '',
          //   institution_name: '',
          //   gp_type: '',
          //   institution_type: '',
          //   type_id: '',
          // },
          User_to_district: locs.allDistrictsMasters.nodes.find(_ => _.districtId === dist_id),
          user_to_block: { block_id: '', block_name: '', block_gis_id: '' },
          user_to_hud: { hud_id: '', hud_name: '', hud_gis_id: '' }
        }
      }

      return report_template;
    })
    return { getHWCReport: reports_data };
  }

  async generateReport() {
    try {
      if (navigator.onLine) {
        await this.props.client.query({ query: this.genreportQuery(this.props.auth.user.alias === 'district') }).then(data => {
          let changes = { ...this.state, downloadContent: data.data.getHWCReport };
          this.setState(changes, () => this.forceUpdate());
        }).catch(err => {
          this.props.alert.error('No data available to pull');
        })
      } else {
        let data = this.generateLocalReport(this.props.auth.user.district_id, this.props.auth.user.phcId);
        let changes = { ...this.state, downloadContent: data.getHWCReport };
        this.setState(changes, () => this.forceUpdate());
      }
    } catch (e) {
      this.props.alert.error('No data available to pull');
    }
  }

  async commonChange(value, i, varName, varName2, service) {
    if (varName === 'referred' || varName === 'followup') {
      let total = (service.male ? Number(service.male) : 0) + (service.female ? Number(service.female) : 0);
      let referred = varName === 'referred' ? Number(value) : (service.referred ? Number(service.referred) : 0);
      let followup = varName === 'followup' ? Number(value) : (service.followup ? Number(service.followup) : 0);
      if (total < (referred + followup)) {
        return false;
      } else {
        const changes = this.state;
        changes[varName2][i][varName] = Number(value);
        this.setState(changes);
      }
    } else {
      const changes = this.state;
      changes[varName2][i][varName] = Number(value);
      this.setState(changes);
    }
  }
  async reportDateChange(e) {
    this.state.reportDate = e;
    this.setState(this.state);
  }
  async saveReport() {
    this.props.submitPWCReportDrug(this.state);
  }
  componentDidMount() {
    let { drugsList, getDrugCount, patientCount, issuedDrugCount, yesterdayIssuesCount, offlineData } = this.props;
    drugsList = drugsList.map(drug => ({
      ...drug,
      issued: Number(getDrugCount.filter(count => count.drug_id === drug.drug_id).map(current => current.quantity).reduce((a, b) => a + b, 0)),
      received: Number(issuedDrugCount.filter(count => count.drug_id === drug.drug_id).map(current => current.quantity).reduce((a, b) => a + b, 0)),
      opening: yesterdayIssuesCount ? yesterdayIssuesCount.filter(count => count.drug_id === drug.drug_id).map(current => current.quantity).reduce((a, b) => a + b, 0) : null,
    }));
    if (offlineData && offlineData[0].length > 0) {
      JSON.parse(offlineData).newDrugList.map((val, i) => {
        drugsList[i] = {
          ...drugsList[i],
          issued: drugsList[i].issued + val.issued,
          received: drugsList[i].received + val.received,
          opening: drugsList[i].opening + val.opening,
        }
      })
    }
    this.setState({ drugsList, patientCount });
  }
  render() {
    const { drugsList, downloadContent, reportDate } = this.state;
    const userData = this.props.auth.user;
    return (
      <Container fluid className={styles.bgcontent}>
        <Row>
          <Col md="12" style={{ padding: "10px 0px", boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.1), 0 0px 20px 0 rgba(0, 0, 0, 0.19)" }} >
            <Container fluid >
              <Row>
                <Col md="10" ><PageList currentUrl={window.location.pathname.split('/')[2]} userData={this.props.auth.user} /></Col>
                <Col md='3' xs='12' lg='2' style={{ textAlign: 'right' }} className={styles.dwnldbtn}>
                  {navigator.onLine &&
                    <span>
                      {!downloadContent && (
                        <button
                          className={styles.btn}
                          onClick={this.generateReport}
                        >
                          <i className="fa fa-download" />
                          Generate Report
                          </button>
                      )}
                      {downloadContent && (
                        <span
                          className={styles.dwnldbtn}
                          onClick={() => {
                          }}
                        >
                          <Download
                            content={downloadContent}
                            user={userData}
                            drugsList={drugsList}
                          />
                        </span>
                      )}
                    </span>
                  }
                </Col>
              </Row>
            </Container>
          </Col>
          <Col md="12">
            <Container fluid>
              <Row>
                <Col md="12" lg="12" style={{ marginTop: "40px" }}>
                  <Container fluid className={styles.inpatient}>
                    <Row style={{ paddingBottom: '10px' }} >
                      <Col md='3' xs='12' lg='3'>
                        <label><h6
                          style={{
                            "marginRight": "7px",
                          }}
                        >
                          Start Date
                        </h6></label>
                        <div
                          style={{
                            display: "inline-block"
                          }}
                        >
                          <DatePicker
                            minDate={moment().subtract(30, "days")}
                            maxDate={moment()}
                            selected={reportDate}
                            onChange={this.reportDateChange}
                            placeholderText="DD/MM/YYYY"
                            dateFormat="DD/MM/YYYY"
                            className={styles.databorder}
                          />
                        </div>
                      </Col>
                      <Col md='3' xs='12' lg='3'>
                        <label><h6
                          style={{
                            "marginRight": "7px",
                          }}
                        >
                          End Date
                        </h6></label>
                        <div
                          style={{
                            display: "inline-block"
                          }}
                        >
                          <DatePicker
                            minDate={moment().subtract(30, "days")}
                            maxDate={moment()}
                            selected={reportDate}
                            // onChange={this.reportDateChange}
                            placeholderText="DD/MM/YYYY"
                            dateFormat="DD/MM/YYYY"
                            className={styles.databorder}
                          />
                        </div>
                      </Col>
                      <Col md='3' xs='12' lg='3' >
                        <label>
                          <h6>
                            Institution Name :
                          </h6></label>
                        <span
                          style={{
                            paddingLeft: "5px",
                            fontSize: '20px',
                          }}>
                          {this.props.auth.user.username}
                        </span>
                      </Col>
                    </Row>
                  </Container>
                </Col>
              </Row>
              <Row>
              </Row>
              <Row>
                {/* Inpatient */}
                {/* drug status */}
                <Col md="12" lg="12">
                  <Container fluid className={styles.inpatient}>
                    <Table bordered responsive>
                      <thead>
                        <tr>
                          <th className={styles.tableHead}>S.no</th>
                          <th className={styles.tHeader}>Drugs (Strength, Type)</th>
                          <th className={styles.tableHead}> Opening Balance </th>
                          <th className={styles.tableHead}>Received</th>
                          <th className={styles.tableHead}>Issued</th>
                          <th className={styles.tableHead}>Balance</th>
                          {/* <th className={styles.tableHead}>Total</th> */}
                        </tr>
                      </thead>
                      <tbody className={styles.mainTD}>
                        {drugsList.map((drug, i) => (
                          <tr key={i}>
                            <td style={{
                              textAlign: 'center'
                            }}>
                              {i + 1}.
                            </td>
                            <td>
                              {`${drug.drug_name} ( ${drug.strength ? drug.strength + ',' : ''} ${drug.type ? drug.type : ''} )`}
                            </td>
                            <td className={styles.inputDataTable}>
                              <Input
                                type="text"
                                className={styles.inputFiled}
                                value={drug.opening ? drug.opening : ''}
                                onChange={(e) => {
                                  this.commonChange(e.target.value, i, 'opening', 'drugsList', drug, drugsList)
                                }}
                              />
                            </td>
                            <td className={styles.inputDataTable}>
                              <Input
                                type="text"
                                className={styles.inputFiled}
                                value={drug.received ? drug.received : ''}
                                onChange={(e) => {
                                  this.commonChange(e.target.value, i, 'received', 'drugsList', drug, drugsList)
                                }}
                              />
                            </td>
                            <td className={styles.inputDataTable}>
                              <Input
                                type="text"
                                className={styles.inputFiled}
                                value={drug.issued ? drug.issued : ''}
                                onChange={(e) => {
                                  this.commonChange(e.target.value, i, 'issued', 'drugsList', drug, drugsList)
                                }}
                              />
                            </td>
                            <td className={styles.inputDataTable} style={{ backgroundColor: "#cccccc" }}>
                              <Input
                                type="text"
                                className={styles.inputFiled}
                                disabled
                                value={
                                  (drug.opening ? drug.opening : 0) + (drug.received ? drug.received : 0) - (drug.issued ? drug.issued : 0) > 0 ?
                                    (drug.opening ? drug.opening : 0) + (drug.received ? drug.received : 0) - (drug.issued ? drug.issued : 0)
                                    : ''
                                }
                              />
                            </td>
                            {/* <td className={styles.inputDataTable}>
                                <Input
                                  type="text"
                                  disabled
                                  className={
                                    styles.inputFiled + " " + styles.Total
                                  }
                                 />
                              </td> */}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Container>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
        <Row style={{
          float: 'right',
          marginRight: '30px'
        }}>
          <Button color="primary"
            style={{
              right: '0px',
              marginBottom: "35px"
            }}
            onClick={this.saveReport}
          >Save</Button>{' '}
        </Row>
      </Container>
    );
  }
}
// export default Report;


Report.propTypes = {
  submitPWCReportDrug: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  language: state.language
});

export default connect(
  mapStateToProps,
  { submitPWCReportDrug }
)(withRouter(withApollo(withAlert(Report))));