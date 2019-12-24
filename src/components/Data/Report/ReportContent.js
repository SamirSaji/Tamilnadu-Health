import React from "react";
import { Col, Row, Table, Container, Input, Button } from "reactstrap";
import { submitPWCReport } from '../../../actions/reportActions';
import moment from 'moment';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withApollo } from "react-apollo";
import gql from "graphql-tag";
import { withAlert } from "react-alert";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
// styles
import Download from "../Template/HWCReport/Report";
import styles from "./stylesheet/Report.less";
import "react-datepicker/dist/react-datepicker.css";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import PageList from '../../common/PageList/PageList';
import { ReportDataSave } from '../../../utils/writeToOffline';
import { getDataFromkey } from '../../../indexeDB/getData';

const REPORT_LIST = 'report_list';

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
      servicesList: [],
      yogaSessions: {
        sessions: null,
        participants: null,
        place: ''
      },
      reportDate: moment(),
    }
  }

  reportQuery = (isDistrict) => {
    if (isDistrict) {
      return {
        query: gql`{
              getHWCReportService(
              created_by:"${this.props.auth.user.user_id}",
              district_id:${this.props.auth.user.district_id},
              alias:"${this.props.auth.user.alias}"
              )
            {
              report_date servicesList patient_count yoga_sessions
              User_report_s_district 
              { username 
                phc_User {
            institution_name
            gp_type
            institution_type
            type_id
              }
                User_to_district
                { district_id district_name }
                user_to_block
                { block_id block_name }
                user_to_hud
                { hud_id hud_name }
              }
            }
            }`
      }
    } else {
      return {
        query: gql`{
              getHWCReportService(
                created_by:"${this.props.auth.user.user_id}",
              district_id:${this.props.auth.user.district_id},
              alias:"${this.props.auth.user.alias}"
              )
            {
              report_date servicesList patient_count yoga_sessions
              User_report_s_district 
              { username 
              phc_User {
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
                { hud_id hud_name hud_gis_id}
              }
            }
            }`
      }
    }
  }

  getLocalReports = () => {
    const local_reports = localStorage.getItem(REPORT_LIST) ? JSON.parse(localStorage.getItem(REPORT_LIST)) : {};
    return { getHWCReportService: Object.values(local_reports) };
  }

  async changeBenefic(value, varName) {
    const { patientCount } = this.state;
    patientCount[varName] = value;
    patientCount['total'] = Number(patientCount['male']) + Number(patientCount['female']);
    this.setState({ patientCount });
  }
  async generateReport() {
    try {
      if (navigator.onLine) {
        await this.props.client.query(this.reportQuery(this.props.auth.user.alias === 'district')).then(data => {
          console.info('data-data', data)
          this.state.downloadContent = data.data.getHWCReportService;
          this.setState(this.state);
          this.forceUpdate();
        })
      } else {
        let data = this.getLocalReports();
        this.state.downloadContent = data.getHWCReportService;
        this.setState(this.state);
        this.forceUpdate();
      }
    } catch (e) {
      this.props.alert.error('No data available to pull');
    }
  }
  async commonChange(value, i, varName, varName2, service, servicesList) {
    if (varName === 'referred' || varName === 'followup') {
      let total = service.total;
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
      changes[varName2][i]['total'] = Number(changes[varName2][i]['male']) + Number(changes[varName2][i]['female']);
      this.setState(changes);
    }
  }
  async reportDateChange(e) {
    this.state.reportDate = e;
    this.setState(this.state);
  }
  async saveReport() {
    if (navigator.onLine) this.props.submitPWCReport(this.state);
    else {
      ReportDataSave(this.state);
    }
  }

  handleYogaSection = (type) => {
    return e => {
      let { yogaSessions } = this.state;
      yogaSessions[type] = e.target.value;
      this.setState({
        yogaSessions
      });
    }
  }

  async componentDidMount() {
    let { servicesList, patientCount, previousServices, offlineData } = this.props;
    servicesList = servicesList.map(service => ({
      ...service,
      male: 0,
      total: 0,
      female: 0,
    }));
    if (previousServices.length > 0) {
      // eslint-disable-next-line
      previousServices.map(service => {
        if (service.patient_diagno && service.patient_diagno.ser_diag) {
          servicesList = servicesList.map(services => {
            if (services.service_id === service.patient_diagno.ser_diag.service_id) {
              return {
                ...services,
                male: service.male ? service.male + services.male : services.male,
                female: service.female ? service.female + services.female : services.female,
                total: (service.male ? service.male + services.male : services.male) + (service.female ? service.female + services.female : services.female),
              };
            } else {
              return services;
            }
          })
        }
      })
    }
    if (!navigator.onLine && offlineData && offlineData[0].length > 0) {
      var offlineentries = offlineData[0].map(val => JSON.parse(val));
      let maleTotal = 0;
      let femaleTotal = 0;
      let referredOutCount = 0;
      var entries = offlineentries.map(async (val) => {
        let offlineservicelist = val.diseaseConditionString.split(',');
        let type = val.memberData.gender;
        if (!type) {
          let memberData = await getDataFromkey(["allHeads"], val.memberData.nodeId);
          if (memberData && memberData[0]) {
            type = memberData[0].gender;
          } else {
            memberData = await getDataFromkey(["allMembers"], val.memberData.nodeId);
            if (memberData && memberData[0]) {
              type = memberData[0].gender;
            }
          }
        }
        if (val.diagnosisDetails.outcome === "Referred Out") {
          referredOutCount++;
        }
        if (type === 'M' || type === 'Male' || type === 'male' || type === 'm' || type === 'ஆண்') {
          maleTotal++;
        } else if (type === 'F' || type === 'Female' || type === 'female' || type === 'f' || type === 'பெண்') {
          femaleTotal++;
        }
        servicesList = servicesList.map(services => {
          let male = 0;
          let female = 0;
          if (val.diseaseConditionString && val.diseaseConditionString.includes(services.service_name)) {
            offlineservicelist.map(list => {
              if (list === services.service_name) {
                if (type === 'M' || type === 'Male' || type === 'male' || type === 'm' || type === 'ஆண்') {
                  male++;
                } else if (type === 'F' || type === 'Female' || type === 'female' || type === 'f' || type === 'பெண்') {
                  female++;
                }
              }
            })
          }
          return {
            ...services,
            male: male ? male + services.male : services.male,
            female: female ? female + services.female : services.female,
            total: (male ? male + services.male : services.male) + (female ? female + services.female : services.female),
          }
        })
      })
      var a = await Promise.all(entries)
      patientCount = {
        ...patientCount,
        female: patientCount.female + femaleTotal,
        male: patientCount.male + maleTotal,
        referred_out: patientCount.referred_out + referredOutCount,
        total: patientCount.total + (femaleTotal + maleTotal)
      }

    }
    this.setState({ patientCount, servicesList });
  }
  render() {
    const { servicesList, downloadContent, reportDate, patientCount, yogaSessions } = this.state;
    const userData = this.props.auth.user;
    return (
      <Container fluid className={styles.bgcontent}>
        <Row>
          <Col md="12" style={{ padding: "15px 10px", boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.1), 0 0px 20px 0 rgba(0, 0, 0, 0.19)" }} >
            <Container fluid >
              <Row>
                <Col lg="10" >
                  <PageList currentUrl={window.location.pathname.split('/')[2]} userData={this.props.auth.user} />
                </Col>
                <Col md='3' xs='12' lg='2' style={{ textAlign: 'right' }} className={styles.dwnldbtn}>
                  {navigator.onLine &&
                    <span>
                      {!downloadContent && (
                        <button
                          className={styles.btn}
                          onClick={() => {
                            this.generateReport();
                          }}
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
                            serviceList={servicesList}
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
                    <Row>
                      <Col md='3' xs='12' lg='3'>
                        <label style={{ "marginBottom": "0px" }}><h6
                          style={{
                            "marginRight": "7px"
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
                        <label style={{ "marginBottom": "0px" }}><h6
                          style={{
                            "marginRight": "7px"
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
                      <Col md='3' xs='12' lg='3' style={{ margin: "10px 0px" }}>
                        <label>
                          <h6>
                            Institution Name :
                          </h6></label>
                        <span
                          style={{
                            paddingLeft: "5px",
                            fontSize: '20px'
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
                <Col md="12" lg="12" >
                  <Container fluid className={styles.inpatient}>
                    <Table bordered responsive>
                      <thead>
                        <tr className={styles.headerColor}>
                          <th className={styles.tableHead}>S.no</th>
                          <th className={styles.tHeader}>Services</th>
                          <th className={styles.tableHead}>Male</th>
                          <th className={styles.tableHead}>Female</th>
                          <th className={styles.tableHead}>Total</th>
                          <th className={styles.tableHead}>Refered Out</th>
                          <th className={styles.tableHead}>Follow-up</th>
                        </tr>
                      </thead>
                      <tbody className={styles.mainTD}>
                        <tr>
                          <td></td>
                          <td>Total no of Beneficiaries</td>
                          <td className={styles.inputDataTable}>
                            <Input
                              value={(patientCount && patientCount.male > 0) ? patientCount.male : ''}
                              type="text"
                              className={styles.inputFiled}
                              onChange={(e) => {
                                this.changeBenefic(e.target.value, 'male');
                              }}
                            />
                          </td>
                          <td className={styles.inputDataTable}>
                            <Input
                              value={(patientCount && patientCount.female > 0) ? patientCount.female : ''}
                              type="text"
                              className={styles.inputFiled}
                              onChange={(e) => {
                                this.changeBenefic(e.target.value, 'female');
                              }}
                            />
                          </td>
                          <td className={styles.inputDataTable}
                            style={{
                              backgroundColor: '#cccccc'
                            }}
                          >
                            <Input
                              value={(patientCount && patientCount.total > 0) ? patientCount.total : (patientCount && (patientCount.male || patientCount.female) && (Number(patientCount.male) + Number(patientCount.female)) > 0 ? (Number(patientCount.male) + Number(patientCount.female)) : '')}
                              type="text"
                              disabled
                              className={styles.inputFiled}
                              onChange={(e) => {
                                this.changeBenefic(e.target.value, 'total');
                              }}
                            />
                          </td>
                          <td className={styles.inputDataTable}>
                            <Input
                              value={(patientCount && patientCount.referred_out > 0) ? patientCount.referred_out : ''}
                              type="text"
                              className={styles.inputFiled}
                              onChange={(e) => {
                                this.changeBenefic(e.target.value, 'referred_out');
                              }}
                            />
                          </td>
                          <td className={styles.inputDataTable}>
                            <Input
                              value={(patientCount && patientCount.follow_up > 0) ? patientCount.follow_up : ''}
                              type="text"
                              className={styles.inputFiled}
                              onChange={(e) => {
                                this.changeBenefic(e.target.value, 'follow_up');
                              }}
                            />
                          </td>
                        </tr>
                        {servicesList.map((service, i) => (
                          <tr key={i}>
                            <td>{`${i + 1}.`}</td>
                            <td>
                              {service.service_name}
                            </td>
                            <td className={styles.inputDataTable}
                              style={{
                                backgroundColor: service.disable_for_men && '#cccccc'
                              }}
                            >
                              <Input
                                value={service.male ? service.male : ''}
                                type="text"
                                disabled={service.disable_for_men}
                                onChange={(e) => {
                                  this.commonChange(e.target.value, i, 'male', 'servicesList', service, servicesList)
                                }}
                                className={styles.inputFiled}
                              />
                            </td>
                            <td className={styles.inputDataTable}>
                              <Input
                                type="text"
                                value={service.female ? service.female : ''}
                                className={styles.inputFiled}
                                onChange={(e) => {
                                  this.commonChange(e.target.value, i, 'female', 'servicesList', service, servicesList)
                                }}
                              />
                            </td>
                            <td className={styles.inputDataTable} style={{ backgroundColor: "#cccccc" }}>
                              <Input
                                type="text"
                                disabled
                                value={service.total ? service.total : ''}
                                className={
                                  styles.inputFiled + " " + styles.Total
                                }
                              />
                            </td>
                            <td className={styles.inputDataTable}>
                              <Input
                                type="text"
                                value={service.referred ? service.referred : ''}
                                className={styles.inputFiled}
                                onChange={(e) => {
                                  this.commonChange(e.target.value, i, 'referred', 'servicesList', service, servicesList)
                                }}
                              />
                            </td>
                            <td className={styles.inputDataTable}>
                              <Input
                                type="text"
                                value={service.followup ? service.followup : ''}
                                className={styles.inputFiled}
                                onChange={(e) => {
                                  this.commonChange(e.target.value, i, 'followup', 'servicesList', service, servicesList)
                                }}
                              />
                            </td>
                          </tr>
                        ))}

                      </tbody>
                    </Table>
                  </Container>
                </Col>
                <Col>
                  <Container fluid className={styles.inpatient} >
                    <h6>Yoga Sessions conducted</h6>
                    <Table bordered responsive >
                      <thead>
                        <tr className={styles.headerColor} >
                          <th className={styles.tableHead} >No. of Sessions</th>
                          <th className={styles.tableHead} >No of Participants</th>
                          <th className={styles.tableHead} >Place of Session</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className={styles.inputDataTable} >
                            <Input placeholder="No. of Sessions" type="number" value={yogaSessions.sessions} onChange={this.handleYogaSection("sessions")} />
                          </td>
                          <td className={styles.inputDataTable} >
                            <Input placeholder="No. of Participants" type="number" value={yogaSessions.participants} onChange={this.handleYogaSection("participants")} />
                          </td>
                          <td className={styles.inputDataTable} >
                            <Input placeholder="Place of Session" value={yogaSessions.place} onChange={this.handleYogaSection("place")} />
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
  submitPWCReport: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  language: state.language
});

export default connect(
  mapStateToProps,
  { submitPWCReport }
)(withRouter(withApollo(withAlert(Report))));