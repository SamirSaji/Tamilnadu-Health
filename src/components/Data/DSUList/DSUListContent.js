import React from "react";
import {
  Col,
  Row,
  Label,
  Table,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
  InputGroupAddon,
  InputGroup,
  Container,
  FormGroup
} from "reactstrap";

import styles from "./stylesheets/DSUList.less";
import { apiURL } from "../../../config";
// import { Query } from "react-apollo";
// import { Redirect } from 'react-router-dom';
import config from '../../../config';
import PropTypes from "prop-types";
import { request } from "graphql-request";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withApollo } from "react-apollo";
import gql from "graphql-tag";
// import { request } from "graphql-request";
import { withAlert } from "react-alert";

//custom components
import Spinner from '../../common/Spinner/Spinner';
import Header from "../../common/Header/Header";
import Download from "../Template/LineList/Report";
import SelectList from "../../common/fields/CustomSelectGroup/CustomSelectGroup";
import { getFullGender, getReadableDateFormat1 } from "../../../utils/Common";
import { commonArrayCreatorForSelect } from "../../../utils/Common";
//datapicker
import DatePicker from "react-datepicker";
import moment from "moment";

//datapicker styles
import "react-datepicker/dist/react-datepicker.css";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

//actions
import { downloadLineList, changePhc } from "../../../actions/reportActions.js";
import PageList from "../../common/PageList/PageList";
import { offlineEntryList } from "../../../actions/offlineAction";
import { offlineVars } from '../../../queries/offlineDataQuery';
// import { LINE_ENTRY_LIST } from "../../../actions/types";
import { LINELISTLIMIT, TIMEOUT } from "../../../utils/constants";
import { NavLink } from 'react-router-dom';
import { lineEntryList, lineEntryVitals } from '../../../utils/writeToOffline';
import { storeDetails } from '../../../indexeDB/storedetails';
import { customRequestToDownload } from '../../../utils/Request';
import { getDataFromIndexedDB, getDataIndex } from '../../../indexeDB/getData';
import { lineListRequest } from '../../../actions/lineListAction';

const outcomeList = [
  { value: "In Admission", label: "In Admission" },
  { value: "Discharged", label: "Discharged" },
  { value: "Referred Out", label: "Referred Out" },
  { value: "Referred In", label: "Referred in" },
  { value: "Follow Up", label: "Follow Up" },
  { value: "Screening", label: "Screening" },
  { value: "Against Medical Advice", label: "Against Medical Advice" },
  { value: "Treated at this level", label: "Treated at this level" },
  { value: "Dead", label: "Dead" }
];

class DSUEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dontGenReport: false,
      defaults: {
        downloadNow: false
      },
      filters: {
        limit: 10,
        offset: 0,
        startDate: moment().subtract(30, 'days').utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
        endDate: moment().utcOffset(0).set({ hour: 23, minute: 59, second: 59, millisecond: 0 }),
        districtsList: [],
        institutionsList: [],
        syndromesList: [],
        diseaseCond: [],
        outcomes: [],
        labTestList: null,
        created_by: null,
        labTestResult: null,
        phc_id: null,
        searchText: undefined,
        aadharText: undefined,
        mobileNo: undefined,
      }
    };
    this.searchMobile = this.searchMobile.bind(this);
    this.searchAadhar = this.searchAadhar.bind(this);
    this.changeDiseasecond = this.changeDiseasecond.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
    this.changeLabResult = this.changeLabResult.bind(this);
    this.onOutcomeChange = this.onOutcomeChange.bind(this);
    this.onPHCChange = this.onPHCChange.bind(this);
    this.changeLabTest = this.changeLabTest.bind(this);
    this.changeOutcomeDate = this.changeOutcomeDate.bind(this);
    this.changeValidity = this.changeValidity.bind(this);
    this.fireSearchReq = this.fireSearchReq.bind(this);
    this.changeOffset = this.changeOffset.bind(this);
    this.approveAll = this.approveAll.bind(this);
    this.onFilterOutcomeChange = this.onFilterOutcomeChange.bind(this);
    this.onLimitChange = this.onLimitChange.bind(this);
    this.onInstitutionChange = this.onInstitutionChange.bind(this);
    this.onDistrictChange = this.onDistrictChange.bind(this);
    this.onSyndromeChange = this.onSyndromeChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.initiateDownloadDailyReport = this.initiateDownloadDailyReport.bind(this);
  }

  componentDidMount = async () => {
    if (navigator.onLine) {
      this.offlineRecords();
    }
    const { user } = this.props.auth;
    this.props.lineListRequest(this.state.filters, this.props.phc_masters, this.props.auth)
    const changes = this.state;
    if (user.alias === 'hospital' || user.alias === 'opd' || user.alias === 'institution') {
      changes.filters.created_by = user.user_id;
    } else if (user.alias === 'lab') {
      changes.filters.phc_id = user.phc_id;
    } else if (user.alias === 'district') {
      changes.filters.districtsList = [user.district_id];
    }
    this.setState({
      changes,
    });
    if (typeof window.scrollTo === "function") {
      window.scrollTo(0, 0)
    }
  }

  resetFilter = () => {
    const changes = this.state;
    changes.filters = {
      limit: 10,
      offset: 0,
      startDate: moment().subtract(30, 'days').utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
      endDate: moment().utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
      districtsList: [],
      diseaseCond: [],
      institutionsList: [],
      syndromesList: [],
      outcomes: [],
      labTestList: null,
      created_by: null,
      labTestResult: null,
      searchText: undefined,
      aadharText: undefined
    };
    this.setState({
      changes,
    })
  }
  updateLineEntry = async (id, district, disableForm = false) => {
    this.props.history.push({ pathname: `/UHC/edit/lineEntry/${id}`, state: { district, disableForm } });
  }
  async changeLabResult(value, refetch) {
    const changes = this.state;
    changes.filters.labTestResult = value.value;
    this.setState({
      changes,
    });
    if (navigator.onLine) {
      refetch();
    } else {

    }
  }
  async searchAadhar(e, refetch) {
    const { filters } = this.state;
    filters.aadharText = e.target.value;
    this.setState({ filters });
    if (navigator.onLine) {
      refetch();
    } else {

    }
  }
  async searchMobile(e, refetch) {
    const { filters } = this.state;
    filters.mobileNo = e.target.value;
    this.setState({ filters });
    if (navigator.onLine) {
      refetch();
    } else {

    }
  }
  async changeLabTest(value, refetch) {
    const changes = this.state;
    changes.filters.labTestList = value.value;
    this.setState({
      changes,
    });
    if (navigator.onLine) {
      refetch();
    } else {

    }
  }
  async changeOffset(value, refetch) {

    const changes = this.state;
    if (value < 0) {
      changes.filters.offset = 0;
    } else {
      changes.filters.offset = value;
    }
    this.setState({
      changes
    }, () => {
      this.changetoListData()
    });
    // if (navigator.onLine) {
    //   refetch();
    // } else { }
  }
  searchList(e, refetch) {
    if (e.charCode === 13) {
      const changes = this.state;
      let searchText = document.getElementById('searchText').value
      changes.filters.searchText = searchText.trim();
      this.setState({
        changes,
      });
      if (navigator.onLine) {
        this.changetoListData();
      } else {
        // if(this.props.changeSearchText){
        //   this.props.changeSearchText(searchText);
        // }
      }
    }

  }
  async fireSearchReq(e, refetch) {
    const changes = this.state;
    let searchText = document.getElementById('searchText').value
    changes.filters.searchText = searchText.trim();
    this.setState({
      changes,
    });
    if (navigator.onLine) {
      this.changetoListData();
    } else {
      // if(this.props.changeSearchText){
      //   this.props.changeSearchText(searchText);
      // }
    }
  }
  async changeDiseasecond(e, refetch) {
    let { filters } = this.state;
    filters.diseaseCond = e.map(a => a.diagnosis_id);
    this.setState({ filters });
    if (navigator.onLine) {
      // refetch();
      this.changetoListData();
    } else {

    }
  }
  async onFilterOutcomeChange(e, refetch) {
    let { filters } = this.state;
    filters.outcomes = e.map(a => a.value);
    this.setState({
      filters,
    });
    if (navigator.onLine) {
      // refetch();
      this.changetoListData();
    } else {

    }
  }
  async onSyndromeChange(e, refetch) {
    const changes = this.state;
    changes.filters.syndromesList = e.map(a => a.syndrome_id);
    this.setState({
      changes,
    });
    if (navigator.onLine) {
      refetch();
    } else {

    }
  }
  async onInstitutionChange(e, refetch) {
    const { filters } = this.state;
    filters.institutionsList = e.map(a => String(a.phc_id));
    this.setState({
      filters,
    });
    if (navigator.onLine) {
      refetch();
    } else {

    }
  }
  async onDistrictChange(e, refetch) {
    const changes = this.state;
    // changes.filters.districtsList = e.map
    changes.filters.districtsList = e.map(a => a.district_id);
    this.setState({
      changes,
    });
    if (navigator.onLine) {
      refetch();
    } else {

    }
  }

  fetchCount = () => {
    request(apiURL + "/graphql")
  }

  async onDateChange(e, type, refetch) {
    console.info('DATECHANGEVENT', e);
    if (e._isAMomentObject) {
      const changes = this.state;
      let startDate = changes.filters.startDate;
      let endDate = changes.filters.endDate;
      if (type === 'startDate') {
        startDate = e.utcOffset(0).set({
          hour: 0, minute: 0, second: 0, millisecond: 0,
        })
      } else {
        endDate = e.utcOffset(0).set({
          hour: 0, minute: 0, second: 0, millisecond: 0,
        })
      }
      const diff = endDate.diff(startDate, 'days');
      if (diff > 30) {
        this.props.alert.show(`Date range can't be greater than 30 days`)
      } else {
        changes.filters[type] = e.utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      }
      this.setState({
        changes
      }, () => {
        console.info('REFETCH', refetch);
        this.changetoListData();
      });
    } else {
      e.preventDefault();
      return false;
    }
  }
  async onLimitChange(e, refetch) {
    const changes = this.state;
    changes.filters.limit = Number(e.target.value);
    this.setState({
      changes,
    }, () => {
      this.changetoListData();
    });
  }
  async approveAll(listItem, refetch) {
    if (listItem.length > 0) {
      listItem.forEach((list) => {
        this.changeValidity({ value: 'Approved' }, list, 'approval', refetch);
      });
    }
  }
  async onPHCChange(e, listItem, type, refetch) {
    this.props.changePhc(e, listItem);
    if (e.value) {
      const { data } = await this.props.client.mutate({
        mutation: gql`mutation {
          updateOutcome(id:${listItem.id},phc_id:${
          e.value
          }) {
            outcome_date }}`
      });
      if (data) {
        // refetch();
        this.changetoListData();
        this.props.alert.success("Updated");
      }

    }
  }
  async onOutcomeChange(e, listItem, type, refetch) {
    if (e.value) {
      const { data } = await this.props.client.mutate({
        mutation: gql`mutation {
          updateOutcome1(id:${listItem.id},outcome:"${
          e.value
          }") {
            outcome_date }}`
      });
      if (data) {
        refetch();
        this.props.alert.success("Updated");
      }
    }
  }
  componentWillReceiveProps(newProps) {
    const { lineEntrylist } = newProps;
    if (newProps.reports) {
      // this.generateReport(newProps.reports);
    }
    if (lineEntrylist && lineEntrylist.message) {
      if (lineEntrylist.status === 200) {
        alert(lineEntrylist.message)
      } else {
        alert(lineEntrylist.message)
      }
    }
  }
  async changeValidity(e, listItem, type, refetch) {
    if (e) {
      const { data } = await this.props.client.mutate({
        mutation: gql`mutation {
          commonUpdate(tableName:"patient_det_trans",
          id:${listItem.id},
          value:"${e.validation_id}",
          label:"${type}") {
            id }}`
      });
      if (data.commonUpdate.id === null) {
        refetch()
        // this.props.refetch();
        this.props.alert.success("Updated");
      }
    }
  }
  async changeOutcomeDate(e, listItem, type, refetch) {
    if (e._isAMomentObject) {
      const { data } = await this.props.client.mutate({
        mutation: gql`mutation {
          commonUpdate(tableName:"diagnosisinfo_trans",
          id:${listItem.PatientDetails_Diagnosisis.id},
          value:"${e._d}",
          label:"${"outcome_date"}") {
            id }}`
      });
      if (data.commonUpdate.id === null) {
        // this.props.refetch();
        refetch()
        this.props.alert.success("Updated");
      }
    } else {
      e.preventDefault();
      return false;
    }
  }
  async generateReport(report) {
    let { downloadContent } = this.state;
    const { filters } = this.state
    const { phc_masters } = this.props;
    const { user } = this.props.auth;
    if (user.alias === 'hsc' || user.alias === 'phc') {
      filters.created_by = user.user_id;
      const { data } = await customRequestToDownload(
        `
        {
          lineListNew(
            offset:0,
            limit:250,
            phc_id:${phc_masters ? phc_masters.phc_id : null},
            username:"${user.username}",
            created_by:"${user.user_id}",
            district_id:${user.district_id},
            alias :"${user.alias}",
            startDate: "${String(this.state.filters.startDate)}",
            endDate: "${String(this.state.filters.endDate)}",
            # hasDateBeenChanged: false
            ){
            id
            visit_date
            outcome
            outcome_date
            visit_id
            referred_phc
            phc_id
            vital_weight vital_height vital_pulse vital_temperature vital_bloodPressureUp vital_bloodPressureDown 
            patient_diagnos_entry
            { diagnosis_id }
            patient_drug_entry
            {     drug_id days dosage_value dosage quantity }
            patient_lab_entry
            { test_id test_date result remarks}
            ptent_mde_user
            { 
              username
              phc_User {
                phc_name
                institution_name
                gp_type
                institution_type
                type_id
              }
              User_to_district
              {
                district_id
                district_name
              }
              user_to_block {
                block_name
                block_gis_id
              }
              user_to_hud{
                hud_name
                hud_gis_id
              }
             }
            user_pds_line{
              age
              gender
              mr_ff
              aadhar_no
              mobileno
              address2
              constructed_address age gender name
              district_name_user {
                district_name
              }
              hab_name_user{
                habitation_name
              }
              village_name_user{
                village_name
              }
            }
          }
        }
        `,
        filters,
      );
      // console.info('DOWNLOAD CONTENT', data.lineListNew)
      console.log(data.lineListNew);
      downloadContent = data.lineListNew;
      this.setState({
        downloadContent
      });
      this.forceUpdate();
    }
    if (user.alias === 'admin' || user.alias === 'state' || user.alias === 'district' || (user.alias === 'block' && user.district_id) || (user.alias === 'hud' && user.district_id)) {
      if (user.email) {
        const { data } = await this.props.client.query({
          query: gql`
          {
            lineListForAdmin(
              offset:0,
              limit:250,
              email:"${user.email}"
              phc_id:${phc_masters ? phc_masters.phc_id : null},
              username:"${user.username}",
              created_by:"${user.user_id}",
              district_id:${user.district_id},
              alias :"${user.alias}",
              startDate: "${String(this.state.filters.startDate)}",
              endDate: "${String(this.state.filters.endDate)}"
              ){
                count
              }
          }
          `,
          variables: filters,
          fetchPolicy: "network-only"
        });
        if (data.lineListForAdmin.count) {
          this.props.alert.success(`Report will be sent to ${user.email}`);
        } else {
          this.props.alert.error("Due to some error, Report was not generated");
        }
      } else {
        this.props.alert.error("Your email ID is not available. Please fill your email ID");
      }
    }
  }

  vitalsDataQuery = entryId => gql`
  {
    getLineEntryEdit(entry_id:"${entryId}") {
      user_pds_line {
        name type master_registry_user_id
      }
      created_at
      updated_at
      visit_date
      outcome general_remarks outcome_date visit_id vital_weight id entry_id advices vital_hip vital_waist vital_resprate
      rfrd_phc_name {
        phc_name
      }
      phc_patient_det {
        phc_name
      }
      vital_height vital_pulse vital_temperature vital_bloodPressureUp vital_bloodPressureDown 
      patient_diagnos_entry
      { diagnosis_id }
      patient_drug_entry
      {     drug_id days dosage_value dosage quantity }
      patient_lab_entry
      { test_id test_date result remarks test_date}
    }
  }
  `
  getYesterdaysDate = () => {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }
  lineEntryQuery = (count, CurrentUser, startDate, endDate, offset = 0, reportVariable, isreport) => `
   {
   lineListNew(
        offset: ${offset},
        limit: ${count},
        phc_id:${CurrentUser.phcId},
        username:"${CurrentUser.username}",
        created_by:"${CurrentUser.user_id}",
        district_id:${CurrentUser.district_id},
        alias :"${CurrentUser.alias}",
        startDate: "${startDate}",
        endDate:"${endDate}",
        # hasDateBeenChanged: false
        ){
        id
        entry_id
        visit_date
        created_at
        updated_at
        outcome
        # rfrd_phc_name {
        #   phc_name
        # }
        validity
        outcome_date
        visit_id
        referred_phc
        patient_diagnos_entry
        { diagnosis_id 
          patient_diagno {
            diagnosis_name
        }}
        phc_id
        user_pds_line{
          constructed_address age gender name
          # address2  
          aadhar_no
          mobileno
          district_name_user{
            district_name
          }
          hab_name_user{
            habitation_name
          }
          village_name_user{
            village_name
          }
        }
      }
    }
  `

  recordCountQuery = (filters, phc_masters, CurrentUser, reportVariable, isreport) => `
  query getLineList(
    $outcomes:[String],
    $institutionsList:[String],
    $startDate:String! 
    $endDate:String!, 
    $diseaseCond:[Int], 
    $searchText:String 
    $aadharText:String,
    $mobileNo:String,
    ) {
    lineListCount(
      phc_id: ${CurrentUser.phcId},
      username:"${CurrentUser.username}",
      created_by:"${CurrentUser.user_id}",
      district_id:${CurrentUser.district_id},
      alias :"${CurrentUser.alias}"
      outcomes:$outcomes,
      startDate:$startDate,
      endDate:$endDate,
      diseasesCond:$diseaseCond,
      searchText:$searchText,
      aadharText:$aadharText,
      mobileNo:$mobileNo,
      institutionsList:$institutionsList,
      # hasDateBeenChanged: false
       ){
      count
    }
  }
    `
    // ${isreport ? `getPreviousServices(user_id: "${reportVariable.createdBy}", alias: "${reportVariable.alias}", report_date: "${Number(new Date(this.getYesterdaysDate().getTime() / 1000))}") {
    //   diagnosis_id
    //   male
    //   female
    //   patient_diagno {
    //     ser_diag {
    //       service_id
    //     }
    //   }
    // }
    // getpatientcount(user_id: "${reportVariable.createdBy}", type: "${reportVariable.type}", report_date: "${Number(new Date(this.getYesterdaysDate().getTime() / 1000))}") {
    //   male
    //   female
    //   referred_out
    //   follow_up
    //   total
    // }
    // servicesList {
    //   service_id
    //   service_name
    //   disable_for_men
    // }
    // drugsList {
    //   drug_id
    //   drug_name
    //   strength
    //   type
    // }` : ``}

  offlineRecords = async () => {
    let offlineRecordCount = 0;
    let { storeCount } = await storeDetails("lineList");
    if (storeCount) {
      offlineRecordCount = storeCount;
    }
    const endDate = new Date();
    const url = `${config.apiURL}/graphql`;
    const startDate = new Date(new Date().setMonth(endDate.getMonth() - 1));
    let reportVariable = offlineVars();
    const countQuery = this.recordCountQuery({}, {}, this.props.auth.user, reportVariable);
    const { lineListCount } = await request(url, `${countQuery}`, { startDate, endDate });
    debugger
    if (offlineRecordCount >= (typeof lineListCount === "object" ? lineListCount.count : lineListCount)) return;
    if (!(localStorage.totalCount)) {
      localStorage.setItem("totalCount", lineListCount.count);
    } else if (lineListCount.count > offlineRecordCount && (localStorage.totalCount && lineListCount.count > Number(localStorage.totalCount))) {
      //Get only new entries
      let largeoffset = offlineRecordCount > Number(localStorage.totalCount) ? offlineRecordCount : Number(localStorage.totalCount)
      this.linelistData(0, lineListCount.count - largeoffset, endDate, startDate, url)
    }
    //Get firstTime of total count of lineentry
    if (lineListCount.count > offlineRecordCount) {
      this.linelistData(offlineRecordCount, lineListCount.count, endDate, startDate, url)
    }
  }
  //fetch offlie data save from db 
  linelistData = async (offset, totalCount, endDate, startDate, url) => {
    const lineEntryQuery = await this.lineEntryQuery(LINELISTLIMIT, this.props.auth.user, new Date(startDate).toISOString(), new Date(endDate).toISOString(), offset);
    const { lineListNew } = await request(url, lineEntryQuery);
    lineEntryList(lineListNew)
    if (offset < totalCount) {
      setTimeout(() => {
        this.linelistData(offset + 10, totalCount, endDate, startDate, url);
      }, TIMEOUT);
    }
    try {
      this.offlineVitals(lineListNew);
    } catch (e) { }
  }


  offlineVitalById = async (entry_id) => {
    let query = this.vitalsDataQuery(entry_id);
    const { data } = await this.props.client.query({ query });
    return data.getLineEntryEdit;
  }

  offlineVitals = async (lineListNew) => {
    let vitals = [];
    let vitalPromises = lineListNew.map(async (k, i) => {
      let vital = await this.offlineVitalById(k.entry_id);
      vitals.push(vital);
    });
    await Promise.all(vitalPromises);
    try {
      lineEntryVitals(vitals);
    } catch (e) { }
  }


  initiateDownloadDailyReport(count) {
    this.props.downloadLineList(count);
  }

  changetoListData = () => {
    this.props.lineListRequest(this.state.filters, this.props.phc_masters, this.props.auth)
  }

  render() {
    const { filters, downloadContent } = this.state;
    const { auth, phc_masters, lineListData } = this.props;
    const CurrentUser = auth.user;
    const validOptions = commonArrayCreatorForSelect(this.props.validOptions, 'validation_id', 'name');
    const diagnosisList = commonArrayCreatorForSelect(this.props.diagnosisList, 'diagnosis_id', 'diagnosis_name');
    const phcList = commonArrayCreatorForSelect(this.props.phcList, 'phc_id', 'institution_name');
    const institutionsList = commonArrayCreatorForSelect(
      this.props.institutions, 'phc_id', 'institution_name'
    );

    const content = (lineList, lineListNew, lineListCount, refetch, totalResults) => (
      <div>
        <Header />
        <Container
          className={styles.bgcontent}
          fluid
          style={{ backgroundColor: "#fafafa" }}
        >
          <Row>
            <Col lg="12" md="12" xs="12">
              <Row className={styles.subHeader} style={{ backgroundColor: '#f8f8f8' }} >
                <Col lg="10" md="9" xs="6" className={styles.pageMenu}>
                  <PageList currentURL={window.location.pathname.split("/")[2]} userData={this.props.auth.user} />
                  {/* <DisplayPages currentURL={pageType === 'labList' ? 'lablist' : 'linelist'} userData={this.props.auth.user} /> */}
                </Col>
                <Col lg="2" md="3" xs="12" style={{ textAlign: "right" }}>
                  <div className={styles.helpIcon}>
                    <a href={'/help'} ><i class="fa fa-question-circle" style={{ fontSize: "22px", position: "absolute", top: "10px", color: "#292b2c" }} aria-hidden="true"></i></a>
                  </div>
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
                            this.generateReport();
                          }}
                        >
                          <Download
                            content={downloadContent}
                            user={CurrentUser}
                            drugsList={this.props.drugsList}
                            labList={this.props.labList}
                            specimensList={this.props.specimensList}
                            diagnosisList={this.props.diagnosisList}
                            symptomsList={this.props.symptomsList}
                          />
                        </span>
                      )}
                    </span>}
                </Col>
              </Row>
              <Container fluid>
                <Row>
                  <Col lg="12" md={"12"} xs="12" className={styles.Criteria}>
                    <Row>
                      <Col md="12" lg="12" style={{ marginBottom: "10px" }}>
                        <Row>
                          <Col md="4" lg="2" className={styles.pricetag}>
                            <span
                              className={styles.tagg}
                              style={{ top: "-15px" }}
                            >
                              Filter/Search
                              </span>
                          </Col>
                          <Col md={"4"} lg="2">
                            <label>Start Date</label>
                            <DatePicker
                              selected={filters.startDate}
                              onChange={(e) => {
                                if (refetch) this.onDateChange(e, 'startDate', refetch)
                              }}
                              onChangeRaw={(e) => {
                                if (refetch) this.onDateChange(e, 'startDate', refetch)
                              }}
                              // minDate={moment().subtract(30, 'days')}
                              maxDate={moment()}
                              placeholderText="DD/MM/YYYY"
                              dateFormat="DD/MM/YYYY"
                              className={styles.databorder}
                            />
                          </Col>
                          <Col md={"4"} lg="2">
                            <label>End Date</label>
                            <DatePicker
                              selected={filters.endDate}
                              onChange={(e) => {
                                if (refetch) this.onDateChange(e, 'endDate', refetch)
                              }}
                              onChangeRaw={(e) => {
                                if (refetch) this.onDateChange(e, 'endDate', refetch)
                              }}

                              // minDate={filters.startDate}
                              maxDate={moment()}
                              placeholderText="DD/MM/YYYY"
                              dateFormat="DD/MM/YYYY"
                              className={styles.databorder}
                            />
                          </Col>
                          <Col
                            md={"4"}
                            lg="2"
                            className={styles.ResultEllipsis}
                          >
                            <SelectList
                              Disabled={(CurrentUser.alias === ('state' || 'district')) ? false : true}
                              label="Institution"
                              options={institutionsList}
                              value={filters.institutionsList ? institutionsList.filter(value => -1 !== filters.institutionsList.indexOf(String(value.phc_id)))
                                : null}
                              placeholder="Select Institution"
                              onChange={(e) => {
                                if (refetch) this.onInstitutionChange(e, refetch)
                              }}
                              name="Institution"
                              isMulti={"true"}
                            />
                          </Col>
                          <Col
                            md={"4"}
                            lg="2"
                            className={styles.ResultEllipsis}
                          >
                            <SelectList
                              label="Disease Condition"
                              isMulti={true}
                              value={filters.diseaseCond ? diagnosisList.filter(value => -1 !== filters.diseaseCond.indexOf(value.diagnosis_id)) : null}
                              onChange={(e) => {
                                if (refetch) this.changeDiseasecond(e, refetch)
                              }}
                              options={diagnosisList}
                              placeholder="Select Disease"
                              name="Disease"
                              Multi={"true"}
                            />
                          </Col>
                          <Col md={"4"} lg="2" className={styles.ResultEllipsis}>
                            <SelectList
                              isMulti={true}
                              label={"Outcome"}
                              options={outcomeList}
                              value={filters.outcomes ? outcomeList.filter(value => -1 !== filters.outcomes.indexOf(value.value))
                                : null}
                              onChange={(e) => {
                                if (refetch) this.onFilterOutcomeChange(e, refetch);
                              }}
                              placeholder={"Outcome"}
                              Multi={"true"}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <Col
                        md='2'
                        lg='1'
                        style={{ paddingTop: "30px" }}
                        className={styles.resetBtn}
                      >
                        <button
                          onClick={(e) => {
                            this.resetFilter()
                          }}
                        >Reset Filter</button>
                      </Col>
                      <Col
                        md="3"
                        lg="2"
                        xs="6"
                        style={{ paddingTop: "30px" }}
                      >
                        <div style={{ width: "100%" }}>
                          <div style={{ width: "50%", float: "right" }}>
                            <Input
                              type="select"
                              style={{ width: "70px" }}
                              defaultValue={filters.limit}
                              onChange={(e) => {
                                if (refetch) this.onLimitChange(e, refetch);
                              }}>
                              <option>10</option>
                              <option>25</option>
                              <option>50</option>
                            </Input>
                          </div>
                          <div style={{ width: "50%" }}>
                            <h6 style={{ paddingTop: "8px" }}>Show list : </h6>
                          </div>
                        </div>
                      </Col>
                      {
                        totalResults > filters.limit &&
                        <Col
                          md={"4"}
                          lg="6"
                          className={styles.pageNation}
                        >

                          <Pagination aria-label="Page navigation example">
                            <PaginationItem>
                              <PaginationLink previous href={null} onClick={() => {
                                if (filters.offset !== 0) {
                                  this.changeOffset(0, refetch ? refetch : () => { })
                                } else {
                                  return false;
                                }
                              }}>
                              </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href={null}
                                onClick={() => {
                                  if (filters.offset !== 0) {
                                    this.changeOffset(filters.offset - filters.limit, refetch ? refetch : () => { })
                                  } else {
                                    return false;
                                  }
                                }}
                              >Prev</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href={null}
                                onClick={() => {
                                  if (totalResults > (filters.offset + filters.limit)) {
                                    this.changeOffset(filters.offset + filters.limit, refetch ? refetch : () => { })
                                  } else {
                                    return false;
                                  }
                                }}
                              >Next</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href={null} next
                                onClick={() => {
                                  if (totalResults > (filters.offset + filters.limit)) {
                                    this.changeOffset(
                                      totalResults - Number(Number(totalResults.toString()[Number(totalResults.toString().length) - 1]))
                                      , refetch ? refetch : () => { }
                                    )
                                  } else {
                                    return false;
                                  }
                                }}>
                              </PaginationLink>
                            </PaginationItem>
                          </Pagination>


                        </Col>}
                      <Col
                        md="7"
                        lg="3"
                        xs="6"
                        style={{ paddingTop: "30px" }}
                      >
                        <InputGroup className={styles.searchTag}>
                          <Input
                            placeholder="Search aadhaar/mobile/name ..."
                            id={'searchText'}
                            defaultValue={filters.searchText}
                            onKeyPress={e => {
                              this.searchList(e, refetch ? refetch : () => { })
                            }}
                          />
                          <InputGroupAddon
                            addonType="prepend"
                            className={styles.search}
                            style={{ cursor: "pointer" }}
                            onClick={(e) => this.fireSearchReq(e, refetch ? refetch : () => { })}
                          >
                            <i className="fa fa-search" aria-hidden="true" />
                          </InputGroupAddon>
                        </InputGroup>
                      </Col>
                      {/* <Col
                          md="6"
                          lg="3"
                          xs="6"
                          style={{ paddingTop: "30px" }}
                        >
                          <InputGroup className={styles.searchTag}>
                            <Input
                              placeholder="Enter aadhaar.."
                              value={filters.aadharText}
                              onChange={(e) => {
                                this.searchAadhar(e,refetch);
                              }}
                            />
                            <InputGroupAddon
                              addonType="prepend"
                              className={styles.search}
                            >
                              <i className="fa fa-search" aria-hidden="true"
                              // onClick={(e) => this.fireSearchReq(e, refetch)} 
                              />
                            </InputGroupAddon>
                          </InputGroup>
                        </Col> */}
                      {/* <Col
                          md="6"
                          lg="3"
                          xs="6"
                          style={{ paddingTop: "30px" }}
                        >
                          <InputGroup className={styles.searchTag}>
                            <Input
                              placeholder="Enter mobile.."
                              value={filters.mobileNo}
                              onChange={(e) => {
                                this.searchMobile(e,refetch)
                              }}
                            />
                            <InputGroupAddon
                              addonType="prepend"
                              className={styles.search}
                            >
                              <i className="fa fa-search" aria-hidden="true"
                              // onClick={(e) => this.fireSearchReq(e, refetch)} 
                              />
                            </InputGroupAddon>
                          </InputGroup>
                        </Col> */}
                    </Row>
                  </Col>
                </Row>
                <Row className={styles.lineResult}>
                  {/* <Col md="12" lg="12">
                      <Row>
                        <Col md={"12"} lg="12">
                          <Row>
                            <Col
                              md="12"
                              lg="12"
                              style={{ marginBottom: "10px" }}
                            >
                              <Row>
                                <Col md="2" lg="2" className={styles.pricetag}>
                                  <span className={styles.tagg}>
                                    Line List Result
                                  </span>
                                </Col>
                              </Row>
                              <div className={styles.maxCount} style={{ display: this.state.dontGenReport ? 'block' : 'none' }} >
                                The selected range has more than 25,000 records({totalResults}). Please select a different range
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col> */}
                  <Col md={"12"} lg="12" style={{ padding: "15px" }}>
                    <Table
                      responsive
                      style={{ border: "1px solid lightgray", overflowX: 'auto', overflowY: '-webkit-paged-x' }}
                    >
                      <thead className={styles.thead}>
                        <tr>
                          <th>S.No</th>
                          <th>Visit ID</th>
                          <th>
                            <div>Beneficiary</div>
                          </th>
                          <th>
                            <div>Aadhaar, Mobile No.</div>
                          </th>
                          {/* <th>
                              <div></div>
                            </th> */}
                          <th>Address</th>
                          <th>Address2</th>
                          <th>Age</th>
                          <th>Gender</th>
                          <th>Date of Visit</th>
                          <th>Disease&nbsp;Condition</th>
                          <th>Outcome</th>
                          <th>Date of outcome</th>
                          <th style={{ paddingBottom: "2px" }}>
                            Approval
                              <FormGroup check>
                              <Label check style={{ display: 'flex' }} >
                                <Input type="checkbox" style={{ zoom: "1.4" }} onClick={() => {
                                  this.approveAll(lineList, refetch ? refetch : () => { })
                                }} />
                                <p style={{ marginBottom: "0px", paddingTop: '3px' }}>Select&nbsp;All</p>
                              </Label>
                            </FormGroup>
                          </th>
                          <th>Delete</th>
                          <th>Record Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(true ? lineListNew : offlineEntryList())["map"]((listItem, i) => (
                          // {(navigator.onLine ? lineListNew : offlineEntryList())["map"]((listItem, i) => (
                          <tr key={i}>
                            <th scope="row">{(filters.offset) + (i + 1)}</th>
                            <td>
                              <i
                                className={`fa fa-${listItem.outcome === 'Referred Out' ? 'eye' : 'edit'} ` + styles.editIcon}
                                onClick={() => this.updateLineEntry(listItem.entry_id ? listItem.entry_id : listItem.visit_id, '', listItem.outcome === 'Referred Out')}
                              />
                              {listItem.visit_id}
                              <NavLink to={`/UHC/newvisit/${listItem.entry_id ? listItem.entry_id : listItem.visit_id}`} ><button className={styles.btn} style={{ padding: '2px 4px' }}
                              // onClick={() => this.props.history.push(`/UHC/newvisit/${listItem.entry_id ? listItem.entry_id : listItem.visit_id}`)}
                              >
                                <i className="fa fa-plus" aria-hidden="true"></i>
                                Visit</button></NavLink>
                              {listItem.isCompleteOffline ? <div>ONLY OFFLINE</div> : ''}
                            </td>
                            <td>
                              {listItem.user_pds_line.name ? `${listItem.user_pds_line.name.split('/').filter(_ => _ !== "undefined")[1]} (${listItem.user_pds_line.name.split('/').filter(_ => _ !== "undefined")[0]})` : ''}
                            </td>
                            <td>
                              {(listItem.user_pds_line.aadhar_no || listItem.user_pds_line.mobileno) ? `${(listItem.user_pds_line.aadhar_no ? listItem.user_pds_line.aadhar_no : '')} ,  ${(listItem.user_pds_line.mobileno ? listItem.user_pds_line.mobileno : '')}` : ''}
                            </td>
                            <td>
                              {listItem.user_pds_line.constructed_address ? listItem.user_pds_line.constructed_address : ''}
                            </td>
                            <td style={{
                              textAlign: 'center'
                            }}>
                              {listItem.user_pds_line.address2 && listItem.user_pds_line.address2 !== 'null' ? listItem.user_pds_line.address2 : '-'}
                            </td>
                            <td>{listItem.user_pds_line.age}</td>
                            <td>{getFullGender(listItem.user_pds_line.gender)}</td>
                            <td>
                              {getReadableDateFormat1(
                                listItem.visit_date
                              )}
                            </td>
                            <td>
                              {listItem.patient_diagnos_entry.length === 0 && '-'}
                              {listItem.patient_diagnos_entry.map((diagno, i) => (diagno.patient_diagno ? diagno.patient_diagno.diagnosis_name + `${i !== listItem.patient_diagnos_entry.length - 1 ? ',' : ''}` : null))}
                            </td>
                            <td className={styles.ResultEllipsis}>
                              <div style={{ width: "150px" }} >
                                <SelectList
                                  showLabel={true}
                                  placeholder="Select Outcome"
                                  options={outcomeList}
                                  value={listItem.outcome ? listItem.phc_id === (phc_masters ? phc_masters.phc_id : null) && listItem.referred_phc !== null ? { label: 'Referred Out', value: 'Referred Out' } : { label: listItem.outcome, value: listItem.outcome } : null}
                                  onChange={e => {
                                    this.onOutcomeChange(
                                      e,
                                      listItem,
                                      "outcome",
                                      refetch ? refetch : () => { },
                                    );
                                  }}
                                />
                                <br />
                                <div
                                  style={{
                                    display: listItem.outcome !== 'Referred Out' ? 'none' : 'block'
                                  }}
                                >
                                  <SelectList
                                    showLabel={true}
                                    placeholder="Select PHCs"
                                    options={phcList}
                                    Disabled={listItem.outcome === 'Referred Out' ? false : true}
                                    value={listItem.phc_id ? phcList.filter(phc => phc.phc_id === listItem.phc_id) : null}
                                    onChange={e => {
                                      this.onPHCChange(
                                        e,
                                        listItem,
                                        "phc_id",
                                        refetch ? refetch : () => { },
                                      );
                                    }}
                                  />
                                </div>
                                {listItem.outcome === 'Referred in' && <div
                                  style={{
                                    textAlign: 'center'
                                  }}
                                >
                                  Referred from - {listItem.rfrd_phc_name ? listItem.rfrd_phc_name.phc_name : 'Not available'}
                                </div>}
                              </div>
                            </td>
                            <td className={styles.tableDatePik}>
                              <DatePicker
                                selected={
                                  listItem
                                    .outcome_date ?
                                    isNaN(Number(listItem.outcome_date))
                                      ? moment(listItem.outcome_date)
                                      : moment.unix(Number(listItem.outcome_date) / 1000)
                                    : null
                                }
                                minDate={moment().subtract(15, "days")}
                                maxDate={moment()}
                                placeholderText="DD/MM/YYYY"
                                dateFormat="DD/MM/YYYY"
                                onChangeRaw={e => {
                                  this.changeOutcomeDate(
                                    e,
                                    listItem,
                                    "outcome_date",
                                    refetch ? refetch : () => { }
                                  );
                                }}
                                onChange={e => {
                                  this.changeOutcomeDate(
                                    e,
                                    listItem,
                                    "outcome_date",
                                    refetch ? refetch : () => { },
                                  );
                                }}
                                className={styles.databorder}
                              />
                            </td>
                            <td style={{ textAlign: "center", lineHeight: "3" }}>
                              <FormGroup check>
                                <Label check>
                                  <Input type="checkbox" style={{ zoom: "1.4" }} />
                                </Label>
                              </FormGroup>
                            </td>
                            <td style={{ lineHeight: "2.5", textAlign: 'center' }}>
                              <i
                                className={
                                  "fa fa-trash " + styles.deleteIcon
                                }
                              />
                            </td>
                            <td>
                              <div
                                style={{
                                  width: "150px"
                                }}
                              >
                                <SelectList
                                  showLabel={true}
                                  placeholder="Select if valid"
                                  options={validOptions}
                                  value={listItem.validity ? validOptions.filter(opt => opt.value === listItem.validity)[0] : validOptions.filter(opt => opt.value === 1)[0]}
                                  onChange={e => {
                                    this.changeValidity(
                                      e,
                                      listItem,
                                      "validity",
                                      refetch ? refetch : () => { },
                                    );
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                        {lineListNew.length < 1 && <tr>
                          <td colSpan='15' style={{
                            textAlign: 'center',
                            color: 'crimson',
                            fontSize: '14px'
                          }}><p>Data not available :(</p></td>
                        </tr>}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
    )
    const { lineList, lineListCount, lineListNew = [] } = lineListData;
    const totalResults = lineListCount ? typeof lineListCount === "object" ? lineListCount.count : lineListCount : 0;
    return lineListData.lineListNew ? content(lineList, lineListNew, lineListCount, () => { }, totalResults) : (
      <div>
        <Header />
        <Spinner />
      </div>
    );
  }
}

DSUEntry.propTypes = {
  downloadLineList: PropTypes.func.isRequired,
  changePhc: PropTypes.func.isRequired,
  lineListRequest: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  language: state.language,
  reports: state.reports,
  lineEntrylist: state.lineEntrylist,
  lineListData: state.lineListData
});

export default connect(
  mapStateToProps,
  { downloadLineList, changePhc, lineListRequest }
)(withRouter(withApollo(withAlert(DSUEntry))));
