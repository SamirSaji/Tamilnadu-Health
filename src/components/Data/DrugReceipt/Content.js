import React, { Component } from "react";
import { Table, Container, Row, Col, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import PropTypes from "prop-types";
import { withAlert } from "react-alert";
import { connect } from "react-redux";
import DownloadExcel from '../../common/ExcelDownload/SimpleTemplate';
import Spinner from '../../common/Spinner/Spinner';
import { withRouter } from "react-router-dom";
import Inputtext from "../../common/fields/TextFieldGroup/TextFieldGroup";
import styles from "./stylesheets/durgreceipt.less";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-dates/lib/css/_datepicker.css";
import { withApollo } from "react-apollo";
import { submitDrugInventory } from '../../../actions/reportActions';
import gql from "graphql-tag";
import moment from 'moment';
import PageList from "../../common/PageList/PageList";
import Modals from '../../common/Modal/Modal';
import Commontable from '../../common/table/table';
const DRUG_REPORTS = 'drug_reports';
const Headers = ["Drug Name (Strength, Type)", "TNMSC Code", "Batch Number ", "Date of Expiry", "Quantity", "Remarks"];
const DataList = ["Drug Name", "TNMSC Code", "Batch No", "Date Of expiry", "Quantity", "Remarks"];
class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receipt_date: moment(),
      gen_model: false,
      startDate: moment(),
      endDate: moment(),
      isView: false,
      historyDate: moment()
    }
  }

  toggleModal = () => {
    this.setState((state, props) => ({
      gen_model: !state.gen_model
    }))
  }
  emptyDrug = async (drug, i) => {
    let { drugsList } = this.state;
    drugsList = drugsList.map((drugie, j) => {
      if (i === j) {
        return {
          ...drugie,
          batch_no: null,
          date_of_expiry: null,
          quantity: null,
          remarks: null,
        }
      } else {
        return drugie
      }
    })
    this.setState({ drugsList });
  }
  clearDrug = async (drug, i) => {
    let { drugsList } = this.state;
    drugsList.splice(i, 1);
    this.setState({ drugsList });
  }
  commonDateChange = async (date) => {
    let receipt_date = date;
    this.setState({ receipt_date });
  }

  drugInventoryQuery = (receipt_date, historydate) => ({
    query: gql`{
      drugInventoryData(user_id:"${this.props.auth.user.user_id}", alias:"${this.props.auth.user.alias}", receipt_date:"${moment(receipt_date).format('MM-DD-YYYY')}" ${historydate ? `currentDate :  "${moment(historydate).format('MM-DD-YYYY')}"` : ''}){
        drug_id batch_no date_of_expiry quantity remarks receipt_date
        inven_created_by{ 
          username
          User_to_district {
            district_name
            district_id
          }
          user_to_hud {
            hud_name
            hud_gis_id
          }
          user_to_block {
            block_name
            block_gis_id
          }
          phc_User {
            phc_name
          institution_name
          gp_type
          institution_type
          type_id
          }
           }
        inven_Drug {
          drug_name tnmsc_code
        }
      }
    }`
  })

  commonOnChange = async (value, drug, i, name, type) => {
    let { drugsList } = this.state;
    switch (type) {
      case 'text':
        drugsList[i][name] = value;
        break;
      case 'number':
        drugsList[i][name] = Number(value);
        break;
      case 'date':
        drugsList[i][name] = value;
        break;
      default:
        break;
    }
    drugsList[i]['filled'] = true;
    this.setState({
      drugsList
    });
  }

  getOfflineReport = () => {
    const reports = JSON.parse(localStorage.getItem(DRUG_REPORTS));
    const mappedReports = reports.map(rp => {
      return {
        drug_id: '', batch_no: '', date_of_expiry: '', quantity: '', remarks: '', receipt_date: '',
        inven_created_by: {
          username: '',
          User_to_district: {
            district_name: '',
            district_id: ''
          },
          user_to_hud: {
            hud_name: '',
            hud_gis_id: ''
          },
          user_to_block: {
            block_name: '',
            block_gis_id: ''
          },
          phc_User: {
            phc_name: '',
            institution_name: '',
            gp_type: '',
            institution_type: '',
            type_id: ''
          }
        },
        inven_Drug: {
          drug_name: '', tnmsc_code: ''
        }
      }
    })

    return mappedReports;
  }

  generateReport = async (isview, historydate) => {
    const { receipt_date } = this.state;
    try {
      let data = [];
      if (navigator.onLine) {
        const reports = await this.props.client.query(this.drugInventoryQuery(receipt_date, historydate));
        data = reports.data.drugInventoryData;
      } else {
        // data = this.getOfflineReport();
      }
      console.info('data', data);
      let sendData = await data.map(drug => ({
        'Receipt Date': drug.receipt_date,
        'Username': drug.inven_created_by.username,
        'District ID': (drug.inven_created_by && drug.inven_created_by.User_to_district) ? drug.inven_created_by.User_to_district.district_id : '',
        'District Name': (drug.inven_created_by && drug.inven_created_by.User_to_district) ? drug.inven_created_by.User_to_district.district_name : '',
        'Institution Name': (drug.inven_created_by && drug.inven_created_by.phc_User) ? drug.inven_created_by.phc_User.institution_name : '',
        'GP Type': (drug.inven_created_by && drug.inven_created_by.phc_User) ? drug.inven_created_by.phc_User.gp_type : '',
        'Institution Type': (drug.inven_created_by && drug.inven_created_by.phc_User) ? drug.inven_created_by.phc_User.institution_type : '',
        'Type ID': (drug.inven_created_by && drug.inven_created_by.phc_User) ? drug.inven_created_by.phc_User.type_id : '',
        'Block name': (drug.inven_created_by && drug.inven_created_by.user_to_block) ? drug.inven_created_by.user_to_block.block_name : '',
        'Block id': (drug.inven_created_by && drug.inven_created_by.user_to_block) ? drug.inven_created_by.user_to_block.block_gis_id : '',
        'HUD name': (drug.inven_created_by && drug.inven_created_by.user_to_hud) ? drug.inven_created_by.user_to_hud.hud_name : '',
        'HUD ID': (drug.inven_created_by && drug.inven_created_by.user_to_hud) ? drug.inven_created_by.user_to_hud.hud_gis_id : '',
        'Drug Name': drug.inven_Drug.drug_name,
        'TNMSC Code': drug.inven_Drug.tnmsc_code,
        'Drug Id': drug.drug_id,
        'Batch No': drug.batch_no,
        'Date Of expiry': drug.date_of_expiry,
        'Quantity': drug.quantity,
        'Remarks': drug.remarks
      }));
      console.info('SEND DATA', sendData);
      if (sendData.length > 0) {
        this.setState({
          downloadContent: sendData,
          gen_model: false,
          loading : false,
          isView: isview ? isview : false
        });
        this.forceUpdate();
      } else {
        this.setState({
          downloadContent : [],
          gen_model : false,
          isView : isview ? isview : false,
          loading : false,
        });
        if(!isview){
          this.props.alert.show('No Data available');
        }
      }
    } catch (err) {
      console.info('some error', err);
      this.props.alert.show('Some error happened');
    }
  }
  addAnotherBatch = async (drug, i) => {
    let { drugsList } = this.state;
    console.log(drugsList)
    const currentBatch = Boolean(drugsList[i].batch_no && drugsList[i].quantity && drugsList[i].date_of_expiry);
    const similarBatch = drugsList.filter(k => k.drug_id === drug.drug_id);
    const sl = similarBatch.length - 1;
    const existingBatch = Boolean(similarBatch[sl].batch_no && similarBatch[sl].quantity && similarBatch[sl].date_of_expiry);
    
    if (!(currentBatch && existingBatch)) return;
    const newDrug = {
      ...drug,
      batch_no: null,
      date_of_expiry: null,
      quantity: null,
      remarks: null,
      isNewBatch: true,
    };
    drugsList.splice(i + 1, 0, newDrug);
    console.log(drugsList)
    this.setState({
      drug, drugsList
    });
  }
  upClick() {
    window.scroll({
      top: 0,
      behavior: "smooth"
    });
  }
  submitForm = async () => {
    let { drugsList, receipt_date } = this.state;
    let valid = drugsList.filter(drug => drug.filled === true);
    let errors = valid.map(drug => {
      drugsList[drugsList.findIndex(druggie => druggie.drug_id === drug.drug_id)]['isInvalid'] = false;
      if (drug.date_of_expiry && drug.quantity) {
        return {
          ...drug,
          isInvalid: false
        };
      } else {
        drugsList[drugsList.findIndex(druggie => druggie.drug_id === drug.drug_id)]['isInvalid'] = true;
        return {
          ...drug,
          isInvalid: true,
        };
      }
    });
    let isFormFilled = errors.filter(drug => drug.isInvalid === true).length;
    if (isFormFilled === 0 && valid.length > 0) {
      this.props.submitDrugInventory(valid, this.props.auth, receipt_date);
    } else {
      this.setState({
        drugsList
      });
      this.upClick()
    }
  }
  componentDidMount() {
    const { drugsList } = this.props;
    this.setState({
      drugsList
    });
  }

  generate_report_model = () => {
    return (
      <Modal isOpen={this.state.gen_model} toggle={this.toggleModal}>
        <ModalHeader toggle={this.toggleModal}>Generate Report</ModalHeader>
        <ModalBody>
          <Container>
            <Row>
              <Col lg="6">
                <Label>Start Date</Label>
                <DatePicker
                  placeholderText="DD/MM/YYYY"
                  dateFormat="DD/MM/YYYY"
                  className={styles.databorder}
                  value={this.state.startDate.format("DD/MM/YYYY")}
                  onChange={(date) => {
                    this.setState({
                      startDate: moment(date)
                    })
                  }}
                />
              </Col>
              <Col lg="6">
                <Label>End Date</Label>
                <DatePicker
                  placeholderText="DD/MM/YYYY"
                  dateFormat="DD/MM/YYYY"
                  className={styles.databorder}
                  value={this.state.endDate.format("DD/MM/YYYY")}
                  onChange={(date) => {
                    this.setState({
                      endDate: moment(date)
                    })
                  }}
                />
              </Col>
              <Col>
                <Col lg="12" style={{ color: "red", padding: 0, top: 8 }}>
                  <Label color="error">* By default it download today report.</Label>
                </Col>
              </Col>
            </Row>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={this.generateReport}>Download</Button>{' '}
          <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
  viewHistory() {
    return (
      <div style={{ height: "100%" }}>
        <div style={{ paddingBottom: "17px" }}>
          <Label>View Date</Label>
          <DatePicker
            placeholderText="DD/MM/YYYY"
            dateFormat="DD/MM/YYYY"
            className={styles.databorder}
            selected={this.state.historyDate}
            onChange={(date) => {
              this.setState({
                historyDate: moment(date),
                loading : true
              }, () => {
                this.generateReport(true, this.state.historyDate)
              })
            }}
          />
        </div>
        {Commontable(Headers, this.state.downloadContent, DataList, this.state.loading)}
      </div>
    )
  }
  render() {
    const { drugsList, receipt_date, downloadContent, isView } = this.state;
    const { globalLoading } = this.props;
    const drugMessages = this.props.reports;
    if (Object.keys(drugMessages).length > 0) {
      alert(drugMessages.drug.message);
      window.location.reload();
    }
    if (globalLoading) {
      return (
        <Spinner />
      )
    }
    return (
      <Container fluid style={{ paddingTop: 74, paddingLeft: 96 }}>
        <Row>
          <Col md="12" style={{ padding: "10px 0px", boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.1), 0 0px 20px 0 rgba(0, 0, 0, 0.19)" }} >
            <Container fluid >
              <Row>
                <Col lg="10" >
                  <PageList
                    currentURL={window.location.pathname.split("/")[2]}
                    userData={this.props.auth.user}
                  />
                </Col>
                <Col lg='2'>
                  {navigator.onLine &&
                    <p className={styles.btn}
                      style={{ cursor: 'pointer', textAlign: "center" }}
                      onClick={this.generateReport}
                    >
                      {(downloadContent && !isView) && <DownloadExcel data={downloadContent} filename='Drug Inventory' />}
                      <i className="fa fa-download" /> {'Generate Report'}
                    </p>
                  }
                </Col>

              </Row>
            </Container>
          </Col>
          <Container className={styles.inpatient} >
            {/* <div style={{ textAlign: "center" }}>
          <h6 style={{ fontSize: "18px" }}>Drug Receipt</h6>
          <hr className={styles.underline} />
        </div> */}
            <Row style={{ padding: "17px 0 19px 0px" }}>
              <Col lg={{ size: 6 }}>
                <Label>Receipt Date</Label>
                <DatePicker
                  selected={receipt_date ? receipt_date : null}
                  placeholderText="DD/MM/YYYY"
                  dateFormat="DD/MM/YYYY"
                  disabled={true}
                  maxDate={moment()}
                  minDate={moment()}
                  onChange={(e) => {
                    this.commonDateChange(e, 'receipt_date')
                  }}
                  className={styles.databorder}
                />
              </Col>
              { navigator.onLine &&  <Col lg={{ size: 6 }} style={{ textAlign: "right" }}>
                <Button onClick={async () => { if(navigator.onLine){this.generateReport(true, new Date())}else{ this.props.alert.show('Sorry you are offline'); } }} style={{ marginLeft: "22px", height: "100%" }} >View historical Receipt</Button>
              </Col> }
              {/* <Col lg={{ size: 4 }}>
              <Label>Start Date</Label>
              <DatePicker
                placeholderText="DD/MM/YYYY"
                dateFormat="DD/MM/YYYY"
                className={styles.databorder}
              />
            </Col>
            <Col lg={{ size: 4 }}>
              <Label>End Date</Label>
              <DatePicker
                placeholderText="DD/MM/YYYY"
                dateFormat="DD/MM/YYYY"
                className={styles.databorder}
              />
            </Col> */}
            </Row>
            <Table
              responsive
              style={{
                border: "1px solid lightgray",
                overflowX: "auto",
                overflowY: "-webkit-paged-x"
              }}
            >
              <thead>
                <tr>
                  {/* <th>S.no</th> */}
                  <th>Drug Name (Strength, Type)</th>
                  <th>TNMSC Code</th>
                  <th>Batch Number <span className={styles.markred}>*</span></th>
                  <th>Date of Expiry<span className={styles.markred}>*</span></th>
                  <th>Quantity<span className={styles.markred}>*</span></th>
                  <th>Remarks</th>
                  <th>Add/Del</th>
                  <th>Clear</th>
                </tr>
              </thead>
              <tbody>
                {drugsList &&
                  drugsList.map((drug, i) => (
                    <tr key={i}
                      style={{
                        // color: (drug.isInvalid && drug.isInvalid === true ? '#d84f4f' : 'black'),
                        border: (drug.isInvalid && drug.isInvalid === true ? '2.1px solid rgba(185, 39, 39, 0.63)' : ''),
                      }}
                    >
                      {/* <td>{i + 1}.</td> */}
                      <td
                      >
                        {drug.isNewBatch ? '' : `${drug.drug_name} ( ${drug.strength ? drug.strength + ',' : ''} ${drug.type ? drug.type : ''} )`}
                      </td>
                      <td style={{ textAlign: 'center' }} >{drug.isNewBatch ? '' : drug.tnmsc_code}</td>
                      <td>
                        <Inputtext
                          type={`text`}
                          onChange={(e) => {
                            this.commonOnChange(e.target.value, drug, i, 'batch_no', 'text')
                          }}
                          value={drug.batch_no ? drug.batch_no : ''}
                        />
                      </td>
                      <td style={{
                        minWidth: '168px'
                      }}>
                        <DatePicker
                          minDate={moment()}
                          // selected={moment("2019-12-19T18:30:00.000Z")}
                          selected={drug.date_of_expiry ? moment(drug.date_of_expiry) : null}
                          placeholderText="DD/MM/YYYY"
                          dateFormat="DD/MM/YYYY"
                          onChange={(e) => {
                            this.commonOnChange(e, drug, i, 'date_of_expiry', 'date')
                          }}
                          onChangeRaw={(e) => {
                            return false;
                          }}
                          className={styles.databorder}
                        />
                      </td>
                      <td>
                        <Inputtext
                          type={`number`}
                          onChange={(e) => {
                            this.commonOnChange(e.target.value, drug, i, 'quantity', 'number')
                          }}
                          value={drug.quantity ? drug.quantity : ''}
                        />
                      </td>
                      <td>
                        <Inputtext
                          type={`text`}
                          onChange={(e) => {
                            this.commonOnChange(e.target.value, drug, i, 'remarks', 'text')
                          }}
                          value={drug.remarks ? drug.remarks : ''}
                        />
                      </td>
                      <td style={{
                        width: '62px',
                        textAlign: 'center',
                        verticalAlign: 'middle'
                      }}>
                        {drug.isNewBatch === undefined && <i style={{ backgroundColor: 'green' }} className={`fa fa-plus ${styles.tblBtn}`} aria-hidden="true"
                          onClick={() => {
                            this.addAnotherBatch(drug, i);
                          }}></i>}
                        {drug.isNewBatch && <i
                          className="fa fa-trash" aria-hidden="true"
                          style={{
                            backgroundColor: '#008001',
                            color: 'white',
                            padding: '8px',
                            borderRadius: '20px',
                            textShadow: '2px 2px 7px #464a4c',
                            fontSize: 'small'
                          }}
                          onClick={() => {
                            this.clearDrug(drug, i);
                          }}
                        ></i>
                        }
                      </td>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }} >
                        <i className={`fa fa-times ${styles.tblBtn}`} aria-hidden="true"
                          style={{
                            backgroundColor: 'red',
                            width: '25px'
                          }}
                          onClick={() => {
                            this.emptyDrug(drug, i);
                          }}></i>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            <Row>
              <Col lg="12" className={styles.butt}>
                <Button
                  onClick={() => this.submitForm()}
                >Submit</Button>
              </Col>
            </Row>
            {/* <Row>
                    {drug.isNewBatch ? '' : `${drug.drug_name} ( ${drug.strength ? drug.strength+',' : ''} ${drug.type ? drug.type : ''} )`}
                  </td>
                  <td style={{ textAlign: 'center' }} >{drug.isNewBatch ? '' : drug.tnmsc_code}</td>
                  <td>
                    <Inputtext
                      type={`text`}
                      onChange={(e) => {
                        this.commonOnChange(e.target.value, drug, i, 'batch_no', 'text')
                      }}
                      value={drug.batch_no ? drug.batch_no : ''}
                    />
                  </td>
                  <td style={{
                    minWidth:'168px'
                  }}>
                    <DatePicker
                      minDate={moment()}
                      selected={drug.date_of_expiry ? drug.date_of_expiry : null}
                      placeholderText="DD/MM/YYYY"
                      dateFormat="DD/MM/YYYY"
                      onChange={(e) => {
                        this.commonOnChange(e, drug, i, 'date_of_expiry', 'date')
                      }}
                      onChangeRaw={(e) => {
                        return false;
                      }}
                      className={styles.databorder}
                    />
                  </td>
                  <td>
                    <Inputtext
                      disabled={!(drug.date_of_expiry)}
                      type="number"
                      onChange={(e) => {
                        this.commonOnChange(e.target.value, drug, i, 'quantity', 'number')
                      }}
                      value={drug.quantity ? drug.quantity : ''}
                    />
                  </td>
                  <td>
                    <Inputtext
                      type={`text`}
                      onChange={(e) => {
                        this.commonOnChange(e.target.value, drug, i, 'remarks', 'text')
                      }}
                      value={drug.remarks ? drug.remarks : ''}
                    />
                  </td>
                  <td style={{
                    width: '62px',
                    textAlign: 'center',
                    verticalAlign: 'middle'
                  }}>
                    {drug.isNewBatch === undefined && <i style={{ backgroundColor: 'green' }} className={`fa fa-plus ${styles.tblBtn}`} aria-hidden="true"
                      onClick={() => {
                        this.addAnotherBatch(drug, i);
                      }}></i>}
                    {drug.isNewBatch && <i
                      className="fa fa-trash" aria-hidden="true"
                      style={{
                        backgroundColor: '#008001',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '20px',
                        textShadow: '2px 2px 7px #464a4c',
                        fontSize: 'small'
                      }}
                      onClick={() => {
                        this.clearDrug(drug, i);
                      }}
                    ></i>
                    }
                  </td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle' }} >
                    <i className={`fa fa-times ${styles.tblBtn}`} aria-hidden="true"
                      style={{
                        backgroundColor: 'red',
                        width: '25px'
                      }}
                      onClick={() => {
                        this.emptyDrug(drug, i);
                      }}></i>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        <Row>
          <Col lg="12" className={styles.butt}>
            <Button
              onClick={this.submitForm}
            >Submit</Button>
          </Col>
        </Row>
        {/* <Row>
            <Table
              responsive
              style={{
                border: "1px solid lightgray",
                overflowX: "auto",
                overflowY: "-webkit-paged-x"
              }}
            >
              <thead>
                <th>S.no</th>
                <th>Batch no</th>
                <th>Date</th>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>9856</td>
                  <td>12/03/2019</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>7845</td>
                  <td>21/02/2019</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>5678</td>
                  <td>25/01/2019</td>
                </tr>
              </tbody>
            </Table>
          </Row> */}
          </Container>
          <Modals close={() => this.setState({ isView: false, downloadContent: null })} isopen={isView} modalTitle={"View Drugs Receipt"} modalBody={this.viewHistory()} />
        </Row>
        {this.generate_report_model()}
      </Container>
    )
  }
}

Content.propTypes = {
  downloadLineList: PropTypes.func.isRequired,
  changePhc: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  language: state.language,
  reports: state.reports,
  globalLoading: state.globalLoading
});

export default connect(
  mapStateToProps,
  { submitDrugInventory }
)(withRouter(withAlert(withApollo(Content))));