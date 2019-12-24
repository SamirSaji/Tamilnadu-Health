//native components
import React from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import classnames from "classnames";
import md5 from "md5";
import { ApolloConsumer, withApollo } from "react-apollo";
import gql from "graphql-tag";
import {
  commonArrayCreatorForSelect,
  commonArrayCreatorForSelectForPopulation,
  commonSortBy,
  generateHash,
  optionCreatorFromArray,
  remarksOptions,
  districtList
} from "../../../utils/Common";
import Profile from "../../common/Profilecard/profile";
import VisitDetails from '../../common/Profilecard/VisitDetails';
import moment from "moment";
import {
  Col,
  Container,
  Row,
  Collapse,
  CardBody,
  Card,
  Button,
  // Form,
  FormGroup,
  Alert,
  Label,
  Input,
  // ButtonGroup,
  // ButtonToolbar,
  InputGroup
  // InputGroupAddon
} from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withAlert } from "react-alert";
//custom components
import { FETCH_FAMILY_MEMBER_LIST, PATIENT_LIST_LOADING, LINEENTRY_SUCCESS } from "../../../actions/types";
import CustomQueries from "../../../queries/MasterRegistry";
import Inputtext from "../../common/fields/TextFieldGroup/TextFieldGroup";
import SelectList from "../../common/fields/CustomSelectGroup/CustomSelectGroup";
// import TimePickers from "./TimePicker";

//styling
import "react-datepicker/dist/react-datepicker.css";
import styles from "./stylesheets/DSUEntry.less";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

//actions
import { getEntryPageLang } from "../../../actions/langAction";
import {
  saveLineEntry,
  fetchFamilyMemberList,
  emptyDispatch
} from "../../../actions/lineEntryAction";
import { emptyErrors } from "../../../actions/errorsActions";
import PageList from "../../common/PageList/PageList";
import { customRequestToMaster } from "../../../utils/Request";
import { getSelectedFamilyMembers } from "../../../actions/offlineAction";
import { isDate, isNumber } from "util";
import { getDataFromIndexedDB } from '../../../indexeDB/getData';


const Barcode = require("react-barcode");
const gendersList = [
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
  { value: "T", label: "Transgender" }
];
const Dosage = [
  { value: "3", label: "1-1-1" },
  { value: "2", label: "1-0-1" },
  { value: "1", label: "0-0-1" },
  { value: "1", label: "0-1-0" },
  { value: "1", label: "1-0-0" },
  { value: "4", label: "1-1-1-1" },
  { value: "1.5", label: "1/2-1/2-1/2" },
  { value: "2", label: "1/2-1/2-1/2-1/2" },
  { value: "0.5", label: "1/2-0-0" },
  { value: "1", label: "1/2-0-1/2" },
  { value: "0.5", label: "0-0-1/2" },
  { value: "0.5", label: "0-1/2-0" },
  { value: "0.75", label: "1/4-1/4-1/4" },
  { value: "0.5", label: "1/4-0-1/4" },
  { value: "1", label: "1/4-1/4-1/4-1/4" },
  { value: "0.25", label: "0-0-1/4" },
  { value: "0.25", label: "0-1/4-0" },
  { value: "0.25", label: "1/4-0-0" },
  { value: "2.25", label: "3/4-3/4-3/4" },
  { value: "3", label: "3/4-3/4-3/4-3/4" },
  { value: "1.5", label: "3/4-0-3/4" },
  { value: "0.75", label: "0-0-3/4" },
  { value: "0.75", label: "0-3/4-0" },
  { value: "0.75", label: "3/4-0-0" },
  { value: "6", label: "2-2-2" },
  { value: "4", label: "2-0-2" },
  { value: "2", label: "0-0-2" },
  { value: "2", label: "0-2-0" },
  { value: "2", label: "2-0-0" }
];

class DSUEntryContent extends React.Component {
  constructor(props) {
    super(props);
    this.changeRemarksGeneral = this.changeRemarksGeneral.bind(this);
    this.NEW_changeDrugFrequency = this.NEW_changeDrugFrequency.bind(this);
    this.NEW_changeDrugQuantity = this.NEW_changeDrugQuantity.bind(this);
    this.changeGeneralRemarks = this.changeGeneralRemarks.bind(this);
    this.saveMemberData = this.saveMemberData.bind(this);
    this.fetchFamily = this.fetchFamily.bind(this);
    this.updateMemberUserData = this.updateMemberUserData.bind(this);
    this.showAllPatients = this.showAllPatients.bind(this);
    this.checkPatientNameLocale = this.checkPatientNameLocale.bind(this);
    this.createNewUser = this.createNewUser.bind(this);
    // this.updateUserData = this.updateUserData.bind(this);
    this.changeSpecimenLab = this.changeSpecimenLab.bind(this);
    this.changeDrugQuantity = this.changeDrugQuantity.bind(this);
    this.changeDiseaseCondition = this.changeDiseaseCondition.bind(this);
    this.changeDrugFrequency = this.changeDrugFrequency.bind(this);
    this.toggleAllclose = this.toggleAllclose.bind(this);
    this.toggleAllopen = this.toggleAllopen.bind(this);
    this.commonVitalsChange = this.commonVitalsChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.changePhcName = this.changePhcName.bind(this);
    this.checkAge = this.checkAge.bind(this);
    this.checkMobileNo = this.checkMobileNo.bind(this);
    this.changeVisitDate = this.changeVisitDate.bind(this);
    this.checkAadharNo = this.checkAadharNo.bind(this);
    this.enableEdit = this.enableEdit.bind(this);
    this.checkPatientName = this.checkPatientName.bind(this);
    this.doCalc = this.doCalc.bind(this);
    this.doCalc1 = this.doCalc1.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.checkGuardianName = this.checkGuardianName.bind(this);
    this.checkLandmark = this.checkLandmark.bind(this);
    this.checkHouseName = this.checkHouseName.bind(this);
    this.checkDoorNo = this.checkDoorNo.bind(this);
    this.checkPincode = this.checkPincode.bind(this);
    this.removeLabtest = this.removeLabtest.bind(this);
    this.changeGender = this.changeGender.bind(this);
    this.changeOutcomeDate = this.changeOutcomeDate.bind(this);
    this.changeCountry = this.changeCountry.bind(this);
    this.changeDistrict = this.changeDistrict.bind(this);
    this.selectservice = this.selectservice.bind(this);
    this.labFinalResult = this.labFinalResult.bind(this);
    this.changeStreet = this.changeStreet.bind(this);
    this.changeVillage = this.changeVillage.bind(this);
    this.updateSpecimen = this.updateSpecimen.bind(this);
    this.changeState = this.changeState.bind(this);
    this.changeCountryTemp = this.changeCountryTemp.bind(this);
    this.changeDistrictTemp = this.changeDistrictTemp.bind(this);
    this.changeStreetTemp = this.changeStreetTemp.bind(this);
    this.changeVillageTemp = this.changeVillageTemp.bind(this);
    this.changeStateTemp = this.changeStateTemp.bind(this);
    this.updateDrug = this.updateDrug.bind(this);
    this.changeOutcome = this.changeOutcome.bind(this);
    this.changeLabResult = this.changeLabResult.bind(this);
    this.changeLabResultRemarks = this.changeLabResultRemarks.bind(this);
    this.changeLabResultAdmissionDate = this.changeLabResultAdmissionDate.bind(
      this
    );
    this.weightRef = React.createRef();
    this.isUserFilledRef = React.createRef();
    this.notNewMobile = React.createRef();
    this.notNewAadhar = React.createRef();
    this.NewAadhar = React.createRef();
    this.generalRemarksRef = React.createRef();
    //fixme - remove all the this binding
    let id_number = generateHash();
    this.state = {
      warnings: {},
      masterRegData: {
        district_id: [],
        village_id: [],
        street_id: []
      },
      isFormSubmitted: false,
      drugs: [],
      showCDSP: false,
      patientEditAllowed: false,
      defaults: {
        isWardNumberDisabled: false,
        isOutcomeDateDisabled: false,
        isAllOutcomeDisplayed: true,
        amILabUser: false
      },
      errors: { addressDetails: { permanentAddress: { doorNo: '' } } },
      collapsed: true,
      collapse1: true,
      collapse2: false,
      // collapse3: true,
      collapse4: true,
      collapse5: true,
      collapse6: true,
      collapse8: true,
      collapse9: true,
      active: true,
      countriesList: [],
      currentFamilyFolder: [],
      drugsListOpt: [],
      phcList: [],
      originalLabTestList: [],
      diagnosisList: [],
      alluserList: [],
      isTemporaryAddress: false,
      loading: true,
      lineEntryData: {
        remarks: null,
        isHeNewUser: false,
        recentHeadId: null,
        visitDate: moment(),
        id: this.props.editData ? this.props.editData.id : null,
        entry_id: this.props.editData ? this.props.editData.entry_id : null,
        type: this.props.entryType.type,
        id_number,
        isInstitutionDisabled: true,
        patientEditAllowed: true,
        drugsList: [],
        generated_ID: md5(id_number + new Date()).substring(0, 15),
        selectedServices: [],
        specimensList: [],
        // symptomsList: [],
        parentNodeId: "",
        memberData: {
          mobileNo: "",
          aadharCard: "",
          nodeId: ""
        },
        vitalsDef: {
          height: null,
          weight: null,
          temperature: null,
          pulse: null,
          bloodPressureUp: null,
          bloodPressureDown: null,
          resprate: null,
          waist: null,
          hip: null
        },
        patientDetails: {
          patientName: "",
          guardianName: "",
          registerNo: "",
          admissionDate: moment().subtract(1, "days"),
          origin: {
            value: "IPD",
            label: "IPD"
          },
          aadharCard: "",
          mobile: ""
        },
        isTemporaryAddressShown: false,
        addressDetails: {
          permanentAddress: { doorNo: "", district: "", village: [] },
          temporaryAddress: { tempdoorNo: "", templandmark: "" }
        },
        diagnosisDetails: {
          wardNo: "",
          institutionName: null,
          outComeDate: moment()
        },
        labResultDetails: {
          listOfResults: []
        }
      },
      gqlData: {
        statesList: [],
        districtsList: [],
        villagesList: [],
        hamletsList: []
      },
      gqlDataTemp: {
        statesListTemp: [],
        districtsListTemp: [],
        villagesListTemp: [],
        hamletsListTemp: []
      }
    };
  }

  async changeRemarksGeneral(e) {
    let { lineEntryData } = this.state;
    lineEntryData.generalRemarks = e.target.value;
    this.setState({
      lineEntryData
    });
  }
  async changeGeneralRemarks(e) {
    let { lineEntryData } = this.state;
    lineEntryData.remarks = e;
    this.setState({ lineEntryData });
  }

  handleVillageChange = async (opt, DSUEntryList) => {
    let vals = opt.map(_ => _.value);
    let option = {}, data = {};
    if (navigator.onLine) {
      const villages = await DSUEntryList.query({
        query: gql`
          ${CustomQueries.getAllHabitations}
        `,
        variables: {
          village_id: { in: vals }
        }
      });
      data = villages.data
      option = data.allHabitationsMasters.nodes;
    } else {
      data = await getDataFromIndexedDB(["allVillagesMasters"]);
      option = data[0];
    }

    this.changeVillage(
      opt,
      option
    );
  }

  async saveMemberData(e) {
    let { lineEntryData } = this.state;
    this.notNewAadhar.current.value = e.aadharCard ? e.aadharCard : ""
    this.notNewMobile.current.value = e.mobileNo ? e.mobileNo : ""
    lineEntryData.memberData = {
      ...e,
      mobileNo: e.mobileNo ? e.mobileNo : "",
      aadharCard: e.aadharCard ? e.aadharCard : ""
    };
    this.setState({ lineEntryData });
  }
  async changeVisitDate(e) {
    if (e._isAMomentObject) {
      let { lineEntryData } = this.state;
      lineEntryData.visitDate = e;
      this.setState({
        lineEntryData
      });
    } else {
      e.preventDefault();
      return false;
    }
  }
  async createNewUser(e, type) {
    let { collapse2, lineEntryData } = this.state;
    collapse2 = !collapse2;
    lineEntryData.isHeNewUser = !e;
    if (type === 'head') {
      if (e === false) {
        //remove the username
        lineEntryData.parentNodeId = "";
        lineEntryData.memberData = {
          mobileNo: "",
          aadharCard: "",
          nodeId: "",
          amIHead: type === 'head' ? true : false,
        };
      }
    } else {
      lineEntryData.memberData = {
        ...lineEntryData.memberData,
        isNewMember: true,
      }
    }
    this.setState({ collapse2, lineEntryData });
  }
  async changeSpecimenLab(e, spec, specimen_id) {
    let { lineEntryData } = this.state;
    spec.lab_list = [];
    lineEntryData.specimensList = lineEntryData.specimensList.filter(
      spec => spec.specimen_id !== specimen_id
    );
    // eslint-disable-next-line
    e.map(ee => {
      spec.lab_list.push(ee.value);
    });
    lineEntryData.specimensList.push(spec);
    this.setState({ lineEntryData });
  }
  async changeDiseaseCondition(e) {
    let { lineEntryData } = this.state;
    lineEntryData.diseaseCondition = e;
    let arr = [];
    // eslint-disable-next-line
    e.map(disease => {
      arr.push(disease.ser_diag.service_name);
    });
    arr = arr.filter((x, i, a) => a.indexOf(x) === i);
    lineEntryData.diseaseConditionString = arr.toString();
    this.setState({ lineEntryData });
  }

  async NEW_changeDrugFrequency(e, drug, drugsList) {
    let { lineEntryData } = this.state;
    // eslint-disable-next-line
    lineEntryData.drugsList.map(oneDrug => {
      if (oneDrug === drug) {
        oneDrug.dosage = e.value;
        oneDrug.dosageValue = e.label;
        if (oneDrug.type === "Sachet") {
          let cal = (oneDrug.days ? oneDrug.days : 0) * oneDrug.dosage;
          oneDrug.quantity = Math.ceil(cal <= 5 ? cal : 5);
        } else if (oneDrug.type === "Tablet") {
          oneDrug.quantity = Math.ceil((oneDrug.days ? oneDrug.days : 0) * oneDrug.dosage);
        } else {
          oneDrug.quantity = 1;
        }
      }
    });
    this.setState({ lineEntryData });
  }

  async changeDrugFrequency(e, drug, drugsList) {
    let { lineEntryData } = this.state;
    drug.dosage = e.value;
    drug.dosageValue = e.label;
    if (drug.update_quantity) {
      drug.quantity = drug.days ? e.value * drug.days : 0;
      if (drug.type === "Sachet" && Number(drug.quantity) > 5) {
        drug.quantity = 5;
      }
    }

    let newDrugsList = drugsList.filter(
      indiDrug => indiDrug.drug_id !== drug.drug_id
    );
    newDrugsList.push(drug);
    lineEntryData.drugsList = newDrugsList;
    this.setState({ lineEntryData });
  }

  NEW_changeDrugQuantity(e, drug, drugsList) {
    let { lineEntryData } = this.state;
    // eslint-disable-next-line
    lineEntryData.drugsList.map(oneDrug => {
      if (oneDrug.drug_name === drug.drug_name) {
        oneDrug.days = e.target.value;
        if (oneDrug.type === "Sachet") {
          let cal = (oneDrug.days ? oneDrug.days : 0) * oneDrug.dosage;
          oneDrug.quantity = Math.ceil(cal <= 5 ? cal : 5);
        } else if (oneDrug.type === "Tablet") {
          oneDrug.quantity = Math.ceil((oneDrug.days ? oneDrug.days : 0) * oneDrug.dosage);
        } else if (oneDrug.type === 'Capsule') {
          oneDrug.quantity = Math.ceil((oneDrug.days ? oneDrug.days : 0) * oneDrug.dosage);
        } else {
          oneDrug.quantity = 1;
        }
      }
    });
    this.setState({ lineEntryData });
  }

  async changeDrugQuantity(e, drug, drugsList) {
    if (e.target.value >= 0) {
      drug.days = e.target.value;
      if (drug.update_quantity) {
        drug.quantity = drug.dosage ? drug.dosage * e.target.value : 0;
        if (drug.type === "Sachet" && Number(drug.quantity) > 5) {
          drug.quantity = 5;
        }
      }
      let newDrugsList = drugsList.filter(
        indiDrug => indiDrug.drug_id !== drug.drug_id
      );
      newDrugsList.push(drug);
      this.state.lineEntryData.drugsList = newDrugsList;
      this.setState(this.state);
    }
  }
  async commonVitalsChange(type, e) {
    const regexForThreeDigits = /^(?:\d*[0-9](?:\.[0-9]{1,3})?|\.[0-9]{1,3})$/;
    const regexForTwoDigits = /^(?:\d*[0-9](?:\.[0-9]{1,2})?|\.[0-9]{1,2})$/;
    const regexForOneDigits = /^(?:\d*[0-9](?:\.[0-9]{1,1})?|\.[0-9]{1,1})$/;
    let value = e.target.value;
    let arr = value.split(".");
    let { lineEntryData, warnings } = this.state;
    if (type === "temperature") {
      if (arr.length > 1 && arr[1] === "") {
        lineEntryData.vitalsDef[type] = value;
      } else {
        lineEntryData.vitalsDef[type] = regexForOneDigits.test(value)
          ? value
          : value === "" ? "" : lineEntryData.vitalsDef[type];
      }
    } else if (type === "weight") {
      if (arr.length > 1 && arr[1] === "") {
        lineEntryData.vitalsDef[type] = value;
      } else {
        lineEntryData.vitalsDef[type] = regexForThreeDigits.test(value)
          ? value
          : value === "" ? "" : lineEntryData.vitalsDef[type];
      }
    } else if (type === "height") {
      if (arr.length > 1 && arr[1] === "") {
        lineEntryData.vitalsDef[type] = value;
      } else {
        lineEntryData.vitalsDef[type] = regexForTwoDigits.test(value)
          ? value
          : value === "" ? "" : lineEntryData.vitalsDef[type];
      }
    } else if (type === "resprate") {
      if (arr.length > 1 && arr[1] === "") {
        lineEntryData.vitalsDef[type] = value;
      } else {
        lineEntryData.vitalsDef[type] = regexForTwoDigits.test(value)
          ? value
          : value === "" ? "" : lineEntryData.vitalsDef[type];
      }
    } else if (type === "waist") {
      if (arr.length > 1 && arr[1] === "") {
        lineEntryData.vitalsDef[type] = value;
      } else {
        lineEntryData.vitalsDef[type] = regexForTwoDigits.test(value)
          ? value
          : value === "" ? "" : lineEntryData.vitalsDef[type];
      }
    } else if (type === "hip") {
      if (arr.length > 1 && arr[1] === "") {
        lineEntryData.vitalsDef[type] = value;
      } else {
        lineEntryData.vitalsDef[type] = regexForTwoDigits.test(value)
          ? value
          : value === "" ? "" : lineEntryData.vitalsDef[type];
      }
    } else {
      if (e.target.value >= 0 && e.target.value <= 1000) {
        lineEntryData.vitalsDef[type] =
          value === "" ? "" : Math.round(e.target.value);
      }
    }
    delete warnings[type];
    switch (type) {
      case "weight" || "height":
        // let bmiwarnings = this.calculateVitals(
        //   lineEntryData.vitalsDef["weight"],
        //   lineEntryData.vitalsDef["height"],
        //   "BMI"
        // );

        // warnings[type] = bmiwarnings.message ? bmiwarnings.message : '';
        break;
      case "bloodPressureUp":
        if (Number(lineEntryData.vitalsDef[type]) >= 140) {
          warnings[type] = "Suspected Hypertension";
        } else {
          warnings[type] = "";
        }
        break;
      case "bloodPressureDown":
        if (Number(lineEntryData.vitalsDef[type]) >= 90) {
          warnings[type] = "Suspected Hypertension";
        } else {
          warnings[type] = "";
        }
        break;
      case "pulse":
        if (Number(lineEntryData.vitalsDef[type]) === 0) {
          warnings[type] = "";
        } else if (Number(lineEntryData.vitalsDef[type]) < 60) {
          warnings[type] = "Low pulse rate";
        } else if (Number(lineEntryData.vitalsDef[type] > 100)) {
          warnings[type] = "High pulse rate";
        } else {
          warnings[type] = "";
        }
        break;
      case "temperature":
        // if()
        if (Number(lineEntryData.vitalsDef[type]) === 0) {
          warnings[type] = "";
        } else if (lineEntryData.vitalsDef[type] < 97.7) {
          warnings[type] = "Low Temperature";
        } else if (lineEntryData.vitalsDef[type] > 99.5) {
          warnings[type] = "Fever";
        } else {
          warnings[type] = "";
        }
        break;
      case "resprate":
        if (Number(lineEntryData.vitalsDef[type]) === 0) {
          warnings[type] = "";
        } else if (lineEntryData.vitalsDef[type] < 12) {
          warnings[type] = "Low RR";
        } else if (lineEntryData.vitalsDef[type] > 25) {
          warnings[type] = "High RR";
        } else {
          warnings[type] = "";
        }
        break;
      default:
        let referKaami = false;
        // eslint-disable-next-line
        Object.keys(warnings).filter(_ => _ !== "common").map(_ => {
          // eslint-disable-next-line
          warnings[_] !== "" ? (referKaami = true) : "";
        });
        warnings.common = referKaami ? "Refer to higher centre" : "";
        break;
    }
    let referKaami = false;
    // eslint-disable-next-line
    Object.keys(warnings).filter(_ => _ !== "common").map(_ => {
      // eslint-disable-next-line
      warnings[_] !== "" ? (referKaami = true) : "";
    });
    warnings.common = referKaami ? "Refer to higher centre" : "";
    console.log(new Date().getTime());
    this.setState({
      lineEntryData,
      warnings
    });
  }
  async doCalc(type, i) {
    let a = this.state.lineEntryData.symptomsList[i].currentValue
      ? this.state.lineEntryData.symptomsList[i].currentValue
      : 0;
    if (type === "+") {
      this.state.lineEntryData.symptomsList[i].currentValue =
        (a > 0 ? a : 0) + 1;
    } else {
      this.state.lineEntryData.symptomsList[i].currentValue = a > 0 ? a - 1 : 0;
    }
    this.setState(this.state);
  }
  async doCalc1(type, i) {
    let a = this.state.lineEntryData.symptomsList[i].currentValue1
      ? this.state.lineEntryData.symptomsList[i].currentValue1
      : 0;
    if (type === "+") {
      this.state.lineEntryData.symptomsList[i].currentValue1 =
        (a > 0 ? a : 0) + 1;
    } else {
      this.state.lineEntryData.symptomsList[i].currentValue1 =
        a > 0 ? a - 1 : 0;
    }
    this.setState(this.state);
  }
  async updateDrug(e) {
    let { lineEntryData } = this.state;
    // eslint-disable-next-line
    e.map(oruDrug => {
      oruDrug.quantity = oruDrug.days ? oruDrug.quantity : 0;
    });
    lineEntryData.drugsList = e;
    this.setState(this.state);
  }
  async enableEdit() {
    let { lineEntryData } = this.state;
    lineEntryData.patientEditAllowed = !lineEntryData.patientEditAllowed;
    this.setState({
      lineEntryData
    });
  }
  async selectservice(e) {
    this.state.lineEntryData.selectedServices = e;
    this.setState(this.state);
  }
  async updateSpecimen(e) {
    this.state.lineEntryData.specimensList = e;
    this.setState(this.state);
  }
  async currentUserUpdate(userData) {
    this.changeOutcome({
      value: "Treated at this level",
      label: "Treated at this level"
    });
    //if user is lab user set lab as default for hime
    setTimeout(() => {
      this.changeCountry({
        value: 105,
        label: "India",
        type: "manual"
      });
      setTimeout(() => {
        this.changeCountryTemp({
          value: 105,
          label: "India",
          type: "manual"
        });
      }, 500);
    }, 500);
  }
  handleScroll(event) {
    if (
      document.body.scrollTop > 30 ||
      document.documentElement.scrollTop > 30
    ) {
      document.getElementById("upBtn").style.display = "block";
    } else {
      document.getElementById("upBtn").style.display = "none";
    }
  }
  upClick() {
    window.scroll({
      top: 0,
      behavior: "smooth"
    });
  }

  //patienbt details
  checkMobileNo(e, notNew = false) {
    let { lineEntryData } = this.state;
    const mobileNo = e.target.value;
    if (notNew) {
      lineEntryData.memberData ||
        lineEntryData.memberData.mobileNo
        ? (lineEntryData.memberData.mobileNo = mobileNo)
        : (lineEntryData.memberData = { mobileNo });
    } else {
      lineEntryData.memberData ||
        lineEntryData.memberData.mobileNo
        ? (lineEntryData.mobileNo = mobileNo)
        : (lineEntryData.memberData = { mobileNo });
    }
    this.setState({ lineEntryData });
  }

  checkAadharNo(e, notNew = false) {
    let { lineEntryData } = this.state;
    notNew
      ? (lineEntryData.memberData.aadharCard = e.target.value)
      : (lineEntryData.patientDetails.aadharCard = e.target.value);
    this.setState({
      lineEntryData
    });
    if (
      e.target.value.length > 12 ||
      /^[1-9]\d*$/.test(e.target.value) === false
    ) {
      lineEntryData.patientDetails.aadharCard = e.target.value.slice(
        0,
        -1
      );
      this.setState({
        lineEntryData
      });
      return false;
    }
  }
  checkAge(e) {
    let { lineEntryData } = this.state;
    lineEntryData.patientDetails.age = e.target.value;
    this.setState({
      lineEntryData
    });
    if (
      e.target.value.length > 2 ||
      /^[1-9]\d*$/.test(e.target.value) === false
    ) {
      lineEntryData.patientDetails.age = e.target.value.slice(0, -1);
      this.setState({
        lineEntryData
      });
      return false;
    }
  }
  changeGender(data) {
    if (data.value) {
      let { lineEntryData } = this.state;
      lineEntryData.patientDetails.gender = data.value;
      this.setState({
        lineEntryData
      });
    }
  }
  changeaddressdetails(e) {
    let { lineEntryData } = this.state;
    lineEntryData.patientDetails.addressLine = e.target.value;
    this.setState({
      lineEntryData
    });
  }
  checkPatientNameLocale(e) {
    let { lineEntryData } = this.state;
    lineEntryData.patientDetails.patientTamilName = e.target.value;
    this.setState({
      lineEntryData
    });
  }
  checkPatientName(e) {
    let { lineEntryData } = this.state;
    lineEntryData.patientDetails.patientName = e.target.value;
    this.setState({
      lineEntryData
    });
    if (
      e.target.value.length > 30 ||
      /^[a-zA-Z-.-/-\s-,]+$/.test(e.target.value) === false
    ) {
      lineEntryData.patientDetails.patientName = e.target.value.slice(
        0,
        -1
      );
      this.setState({
        lineEntryData
      });
      return false;
    }
  }

  checkGuardianName(e) {
    let { lineEntryData } = this.state;
    lineEntryData.patientDetails.guardianName = e.target.value;
    this.setState({
      lineEntryData
    });
    if (
      e.target.value.length > 50 ||
      !/^[a-zA-Z-.-/-\s-,]+$/.test(e.target.value)
    ) {
      lineEntryData.patientDetails.guardianName = e.target.value.slice(
        0,
        -1
      );
      this.setState({
        lineEntryData
      });
      return false;
    }
  }
  //address validation

  async changeCountry(countryData) {
    if (countryData.value) {
      let { gqlData, lineEntryData } = this.state;
      let data;
      if (navigator.onLine) {
        const response = await this.props.client.query({
          query: gql`
            ${CustomQueries.getAllStates}
          `,
          variables: { country_id: countryData.value }
        });
        data = response.data;
      } else {
        let list = await getDataFromIndexedDB(["allStatesMasters"]);
        data = {
          allStatesMasters: {
            nodes: list[0]
          }
        }
      }
      gqlData = {
        statesList: data.allStatesMasters.nodes
          ? commonArrayCreatorForSelect(data.allStatesMasters.nodes, "stateId", "stateName")
          : [],
        districtsList: [],
        villagesList: [],
        hamletsList: []
      };
      lineEntryData.addressDetails.permanentAddress = {
        ...lineEntryData.addressDetails.permanentAddress,
        village: undefined,
        street: undefined,
        state: undefined,
        district: undefined,
        country: countryData
      };
      this.setState({
        lineEntryData, gqlData
      });
      if (countryData.type !== undefined) {
        this.changeState({
          value: 33,
          label: "Tamil Nadu",
          type: "manual"
        });
      }
    }
  }
  async changeCountryTemp(countryData) {
    if (countryData.value) {
      let { lineEntryData, gqlDataTemp } = this.state;
      const { data } = await this.props.client.query({
        query: gql`
          ${CustomQueries.getAllStates}
        `,
        variables: { country_id: countryData.value }
      });
      gqlDataTemp = {
        statesListTemp: data.allStatesMasters.nodes
          ? data.allStatesMasters.nodes
          : [],
        districtsListTemp: [],
        villagesListTemp: [],
        hamletsListTemp: []
      };
      lineEntryData.addressDetails.temporaryAddress = {
        ...lineEntryData.addressDetails.temporaryAddress,
        districtTemp: undefined,
        countryTemp: countryData.value,
        stateTemp: undefined,
        villageTemp: undefined,
        streetTemp: undefined
      };
      this.setState({
        lineEntryData, gqlDataTemp
      });
      if (countryData.type !== undefined) {
        this.changeStateTemp({
          value: 33,
          label: "Tamil Nadu",
          type: "manual"
        });
      }
    }
  }

  async changeState(stateData) {
    if (stateData.value) {
      let { gqlData, lineEntryData } = this.state;
      // on assuming there will be 15000 records per day, you will be reciving 10 records per minutes.
      // so adding a buffer of 10 for every record to avoid clash while multiple inserts at same moment
      let data;
      if (navigator.onLine) {
        const response = await this.props.client.query({
          query: gql`
            ${CustomQueries.getAllDistricts}
          `,
          variables: { state_id: stateData.value }
        });
        data = response.data;
      } else {
        let list = await getDataFromIndexedDB(["allDistrictsMasters"])
        data = {
          allDistrictsMasters: {
            nodes: list[0]
          }
        }
      }
      gqlData.districtsList = data.allDistrictsMasters.nodes
        ? commonArrayCreatorForSelect(data.allDistrictsMasters.nodes, "districtId", "districtName")
        : [];
      let district_id = lineEntryData.addressDetails.permanentAddress.district;
      district_id = districtList.includes(district_id) ? district_id + "S" : '';
      gqlData.villagesList = [];
      gqlData.hamletsList = [];
      lineEntryData.addressDetails.permanentAddress = {
        ...lineEntryData.addressDetails.permanentAddress,
        village: undefined,
        street: undefined,
        state: stateData,
        district: undefined
      };
      if (!navigator.onLine) {
        this.changeDistrict(gqlData.districtsList[0])
      }
      this.setState({
        gqlData, lineEntryData
      });
    }
  }

  async changeStateTemp(stateData) {
    if (stateData.value) {
      let { lineEntryData, gqlDataTemp } = this.state;
      const { data } = await this.props.client.query({
        query: gql`
          ${CustomQueries.getAllDistricts}
        `,
        variables: { state_id: stateData.value }
      });
      gqlDataTemp.districtsListTemp = data.allDistrictsMasters.nodes
        ? data.allDistrictsMasters.nodes
        : [];
      gqlDataTemp.villagesListTemp = [];
      gqlDataTemp.hamletsListTemp = [];
      lineEntryData.addressDetails.temporaryAddress = {
        ...lineEntryData.addressDetails.temporaryAddress,
        districtTemp: undefined,
        stateTemp: stateData.value,
        villageTemp: undefined,
        streetTemp: undefined
      };
      this.setState(
        {
          lineEntryData, gqlDataTemp
        },
        () => {
          this.changeDistrict({
            value: this.props.auth.user.district_id,
            fetchInitialSet: true
          });
        }
      );
      if (
        stateData.type !== undefined &&
        stateData.type === "manual" &&
        Number(this.props.myInstitution) > 0
      ) {
        if (data.districtsList) {
          const upcomingDistrict = data.districtsList.filter(
            district =>
              district.district_id === Number(this.props.myInstitution)
          )[0];
          this.changeDistrictTemp({
            value: upcomingDistrict.district_id,
            label: upcomingDistrict.district_name
          });
        }
      }
    }
  }
  async changeDistrict(districtData) {
    if (districtData.value) {
      let data;
      if (navigator.onLine) {
        const response = await this.props.client.query({
          query: gql`
            ${CustomQueries.getAllVillages}
          `,
          variables: { district_id: districtData.value }
        });
        data = response.data;
      } else {
        let list = await getDataFromIndexedDB(["allVillagesMasters"]);
        data = {
          allVillagesMasters: {
            nodes: list[0]
          }
        }
      }
      let { gqlData, lineEntryData } = this.state;
      gqlData.villagesList = data.allVillagesMasters.nodes
        ? commonArrayCreatorForSelect(data.allVillagesMasters.nodes, "villageId", "villageName")
        : [];
      gqlData.hamletsList = [];
      lineEntryData.memberData = {
        aadharCard: null, mobileNo: null, nodeId: null
      }
      lineEntryData.addressDetails.permanentAddress = {
        ...lineEntryData.addressDetails.permanentAddress,
        village: undefined,
        street: undefined,
        district: districtData.value,
      };
      this.showAllPatients(
        lineEntryData.addressDetails.permanentAddress.district,
        lineEntryData.addressDetails.permanentAddress.village,
        lineEntryData.addressDetails.permanentAddress.street,
        districtData.fetchInitialSet ? districtData.fetchInitialSet : false
      );
      this.setState({
        gqlData, lineEntryData
      });
    }
  }

  async changeDistrictTemp(districtData) {
    if (districtData.value) {
      const { data } = await this.props.client.query({
        query: gql`
          ${CustomQueries.getAllVillages}
        `,
        variables: { district_id: districtData.value }
      });
      let { gqlDataTemp, lineEntryData } = this.state;
      gqlDataTemp.villagesListTemp = data.allVillagesMasters.nodes
        ? data.allVillagesMasters.nodes
        : [];
      gqlDataTemp.hamletsListTemp = [];
      lineEntryData.addressDetails.temporaryAddress = {
        ...lineEntryData.addressDetails.temporaryAddress,
        districtTemp: districtData.value,
        villageTemp: undefined,
        streetTemp: undefined
      };
      this.setState({
        gqlDataTemp, lineEntryData
      });
    }
  }

  changeVillage(data, hamletsFrom) {
    if (data) {
      let { gqlData, lineEntryData } = this.state;
      gqlData.hamletsList = hamletsFrom ? commonArrayCreatorForSelect(hamletsFrom, "habitationId", "habitationName") : [];
      lineEntryData.addressDetails.permanentAddress = {
        ...lineEntryData.addressDetails.permanentAddress,
        village: data,
        street: undefined
      };
      lineEntryData.memberData = {
        aadharCard: null, mobileNo: null, nodeId: null
      }
      this.showAllPatients(
        lineEntryData.addressDetails.permanentAddress.district,
        lineEntryData.addressDetails.permanentAddress.village,
        lineEntryData.addressDetails.permanentAddress.street
      );
      this.setState({
        gqlData, lineEntryData
      });
    }
  }
  changeVillageTemp(data, hamletsFrom) {
    if (data.value) {
      let { gqlDataTemp, lineEntryData } = this.state;
      gqlDataTemp.hamletsListTemp = hamletsFrom ? hamletsFrom : [];
      lineEntryData.addressDetails.temporaryAddress = {
        ...lineEntryData.addressDetails.temporaryAddress,
        villageTemp: data.value,
        streetTemp: undefined
      };
      this.setState({
        gqlDataTemp, lineEntryData
      });
    }
  }

  async changeStreet(data) {
    if (data.value) {
      let { lineEntryData } = this.state;
      lineEntryData.addressDetails.permanentAddress.street = data;
      lineEntryData.memberData = {
        aadharCard: null, mobileNo: null, nodeId: null
      }
      this.showAllPatients(
        lineEntryData.addressDetails.permanentAddress.district,
        lineEntryData.addressDetails.permanentAddress.village,
        lineEntryData.addressDetails.permanentAddress.street
      );
      this.setState({
        lineEntryData
      });
    }
  }

  async fetchFamily(e) {
    let { currentFamilyFolder, lineEntryData } = this.state;
    currentFamilyFolder = [];
    let district_id = lineEntryData.addressDetails.permanentAddress.district;
    district_id = districtList.includes(district_id) ? district_id + "S" : '';
    let list, headData;
    if (navigator.onLine) {
      const { data } = await this.props.client.query({
        query: gql`
          query($headId: Int!) {
            memberToHead: allPopulationHeads${district_id}(condition: { headId: $headId }) {
              nodes {
                nodeId
                headId
                hudId 
                hscId
                districtId
                stateId
                countryId
                villageId
                phcId 
                streetId
                habitationId
                headName
                headEngName
                age
                gender
                aadharCard
                mobileNo
                addressLine
                populationMembers${district_id}ByHeadId {
                  nodes {
                    nodeId
                    memberId
                    headId
                    memberEngName
                    memberName
                    age
                    aadharCard
                    mobileNo
                    gender
                    relationship
                  }
                }
              }
            }
          }
        `,
        variables: {
          headId: e.id
        }
      });
      const memberToHead = data.memberToHead.nodes;
      list = memberToHead[0][`populationMembers${district_id}ByHeadId`].nodes.map(
        (member, i) => ({
          ...member,
          type: "member",
          name: member.memberName,
          engName: member.memberEngName,
          id: member.headId
        })
      );
      headData = {
        ...memberToHead[0],
        type: "head",
        name: memberToHead[0].headName,
        engName: memberToHead[0].headEngName,
        id: memberToHead[0].headId
      };
    } else {
      const { memData, hData } = await getSelectedFamilyMembers(e.id);
      list = memData.map(_ => ({
        ..._,
        type: "member",
        name: _.memberName,
        engName: _.memberEngName,
        id: _.headId
      }));
      headData = {
        ...hData,
        type: "head",
        name: hData.headName,
        engName: hData.headEngName,
        id: hData.headId
      };
    }

    list.push(headData);
    currentFamilyFolder = commonArrayCreatorForSelectForPopulation(
      list ? list : [],
      "nodeId",
      "name",
      true
    );
    lineEntryData.parentNodeId = e.nodeId;
    if (e.type === "head") {
      lineEntryData.memberData = list.find(
        user => user.type === 'head'
      );
    } else {
      lineEntryData.memberData = list.find(
        user => (user.type === 'member' && user.memberId === e.memberId)
      );
      // console.log('')
    }
    // eslint-disable-next-line
    this.notNewAadhar.current.value = lineEntryData.memberData.aadharCard
    this.notNewMobile.current.value = lineEntryData.memberData.mobileNo
    lineEntryData.memberData = {
      ...lineEntryData.memberData,
      label: lineEntryData.memberData.name,
      value: lineEntryData.memberData.nodeId
    }
    this.setState({ currentFamilyFolder, lineEntryData });
  }

  updateMemberUserData(e) {
    // let { isAuthenticated, user } = this.props.auth;
    let { lineEntryData } = this.state;
    let district_id = lineEntryData.addressDetails.permanentAddress.district;
    district_id = districtList.includes(district_id) ? district_id : '';
    this.props.fetchFamilyMemberList(e, this.state, district_id);
  }

  async showAllPatients(
    district_id,
    village_id,
    street_id,
    fetchInitialSet = false
  ) {
    let { masterRegData } = this.state;
    masterRegData.district_id = district_id;
    masterRegData.village_id = village_id;
    masterRegData.street_id = street_id;
    masterRegData.fetchInitialSet = fetchInitialSet;
    this.setState({ masterRegData }, () => {
      this.updateMemberUserData("");
    });
  }
  changeStreetTemp(data) {
    if (data.value) {
      let { lineEntryData } = this.state;
      lineEntryData.addressDetails.temporaryAddress.streetTemp =
        data.value;
      this.setState({
        lineEntryData
      });
    }
  }
  //address validation

  //diagnosis validation
  changePhcName(data) {
    if (data.value) {
      let { lineEntryData } = this.state;
      lineEntryData.referredPhc = data;
      this.setState({
        lineEntryData
      });
    }
  }
  changeOutcome(data) {
    if (data.value) {
      let { lineEntryData } = this.state;
      if (data.value === "Referred Out") {
        lineEntryData.isInstitutionDisabled = false;
      } else {
        lineEntryData.isInstitutionDisabled = true;
        lineEntryData.diagnosisDetails.institutionName = null;
      }
      lineEntryData.diagnosisDetails.outcome = data.value;
      this.setState({
        lineEntryData
      });
    }
  }
  //diagnosis validation
  //lab result validation
  removeLabtest(id) {
    let { lineEntryData, originalLabTestList } = this.state;
    const newLabTest = lineEntryData.labResultDetails.listOfResults.filter(
      eachTest => eachTest.test_id !== id
    );
    const deletedTest = this.props.labTestsList.filter(
      test => test.test_id === id
    )[0];
    originalLabTestList.push(deletedTest);
    originalLabTestList.sort((a, b) => a.test_id - b.test_id);
    lineEntryData.labResultDetails.listOfResults = newLabTest;
    this.setState({
      lineEntryData, originalLabTestList
    });
    this.forceUpdate();
  }

  changeLabResult(data) {
    if (data.value) {
      let { lineEntryData, originalLabTestList } = this.state;
      const currentLabResult = this.props.labTestsList.filter(
        labv => labv.test_id === data.value
      )[0];
      currentLabResult.userData = {
        labResult: undefined,
        dateOfAdmission: null,
        timeOfResult: undefined,
        remarks: undefined
      };
      currentLabResult.optionsForSelect = null;
      if (currentLabResult.result_type === "select") {
        currentLabResult.optionsForSelect = currentLabResult.options
          .split("$")
          .filter(Boolean);
      }
      lineEntryData.labResultDetails.listOfResults.push(
        currentLabResult
      );
      lineEntryData.labResultDetails.labResult = data.value;
      originalLabTestList = this.state.originalLabTestList.filter(
        test => test.test_id !== data.value
      );
      this.setState({
        lineEntryData, originalLabTestList
      });
      this.forceUpdate();
    }
  }
  labFinalResult(e, test_id, i, type) {
    const changes = this.state;
    console.info('TYPE', type);
    const allLabResults = changes.lineEntryData.labResultDetails.listOfResults;
    const temp = allLabResults.map(indi => {
      if (indi.test_id === test_id) {
        if (type === "select") {
          indi.userData.labResult = e.value;
        } else {
          indi.userData.labResult = e.target.value;
        }
        return indi;
      } else {
        return indi;
      }
    });
    changes.lineEntryData.labResultDetails.listOfResults = temp;
    this.setState(changes);
  }

  async submitForm(e) {
    let { isFormSubmitted, lineEntryData } = this.state;
    if ((lineEntryData.isHeNewUser && lineEntryData.addressDetails.permanentAddress.village && lineEntryData.addressDetails.permanentAddress.village.length > 1)) {
      alert("You can’t map the family to multiple locality/village/town, please select one.");
      return false;
    }
    let district_id = lineEntryData.addressDetails.permanentAddress.district;
    district_id = districtList.includes(district_id) ? district_id : '';
    if (this.notNewMobile.current.validity.valid) lineEntryData.memberData.mobileNo = this.notNewMobile.current.value;
    if (this.NewAadhar.current && this.NewAadhar.current.validity.valid) lineEntryData.memberData.aadharCard = this.NewAadhar.current.value;
    if (this.notNewAadhar.current.validity.valid && (lineEntryData.memberData.aadharCard === "" || lineEntryData.memberData.aadharCard === null)) lineEntryData.memberData.aadharCard = this.notNewAadhar.current.value;
    if ((!lineEntryData.memberData.mobileNo || lineEntryData.memberData.mobileNo === "") && lineEntryData.isHeNewUser && document.getElementsByClassName('newUserMobile').length > 0) {
      lineEntryData.memberData.mobileNo = document.getElementsByClassName('newUserMobile')[0].value;
      lineEntryData.patientDetails.mobile = document.getElementsByClassName('newUserMobile')[0].value;
    }
    this.setState({
      isFormSubmitted: !isFormSubmitted, lineEntryData
    }, () => {
      let entryData = this.state.lineEntryData;
      entryData.addressDetails.permanentAddress.country = entryData.addressDetails.permanentAddress.country.value
      entryData.addressDetails.permanentAddress.state = entryData.addressDetails.permanentAddress.state.value
      if (this.NewAadhar.current && this.NewAadhar.current.validity.valid && entryData.memberData.aadharCard === "") {
        entryData.memberData.aadharCard = this.NewAadhar.current.value;
      }
      if (entryData.addressDetails.permanentAddress.street) {
        entryData.addressDetails.permanentAddress.street = entryData.addressDetails.permanentAddress.street.value;
      }
      if (this.state.lineEntryData.type === "edit") {
        this.props.saveLineEntry(
          entryData,
          this.state.lineEntryData.type,
          district_id,
          this.props.auth.user

        );
      } else {
        if (this.state.lineEntryData.memberData) {
          this.props.saveLineEntry(
            entryData,
            this.state.lineEntryData.type,
            district_id,
            this.props.auth.user
          );
        } else {
          this.props.saveLineEntry(
            entryData,
            this.state.lineEntryData.type,
            district_id,
            this.props.auth.user
          );
        }
      }
    });

  }
  changeLabResultAdmissionDate(e, test_id, i) {
    if (e._isAMomentObject) {
      const changes = this.state;
      const allLabResults =
        changes.lineEntryData.labResultDetails.listOfResults;
      const temp = allLabResults.map(indi => {
        if (indi.test_id === test_id) {
          indi.userData.dateOfAdmission = moment(new Date());
          return indi;
        } else {
          return indi;
        }
      });
      if (
        changes.errors.labResultDetails &&
        changes.errors.labResultDetails[i] &&
        changes.errors.labResultDetails[i].labResult
      ) {
        changes.errors.labResultDetails[i].dateOfAdmission = "";
      } else {
        changes.errors.labResultDetails = [];
        changes.errors.labResultDetails[i] = {
          dateOfAdmission: ""
        };
      }
      changes.lineEntryData.labResultDetails.listOfResults = temp;
      this.setState(changes);
    } else {
      e.preventDefault();
      return false;
    }
  }
  //lab result validation
  //lab results

  changeLabResultRemarks(e, test_id) {
    const changes = this.state;
    const allLabResults = changes.lineEntryData.labResultDetails.listOfResults;
    const temp = allLabResults.map(indi => {
      if (indi.test_id === test_id) {
        indi.userData.remarks = e.target.value;
        return indi;
      } else {
        return indi;
      }
    });
    changes.lineEntryData.labResultDetails.listOfResults = temp;
    this.setState(changes);
  }

  changeOutcomeDate(e) {
    if (e._isAMomentObject) {
      const { lineEntryData } = this.state;
      lineEntryData.diagnosisDetails.outComeDate = e;
      this.setState({
        lineEntryData
      });
    } else {
      e.preventDefault();
      return false;
    }
  }
  checkHouseName(e) {
    const changes = this.state;
    changes.lineEntryData.addressDetails.permanentAddress.houseName = e.target.value;
    this.setState({
      changes
    });
    if (e.target.value.length > 40) {
      changes.lineEntryData.addressDetails.permanentAddress.houseName = e.target.value.slice(
        0,
        -1
      );
      this.setState({
        changes
      });
      return false;
    }
  }
  checkDoorNo(e) {
    const changes = this.state;
    const doorNo = e.target.value;
    changes.lineEntryData.addressDetails.permanentAddress.doorNo =
      e.target.value;
    this.setState({
      changes
    });
    if (String(doorNo).length < 1) {
      changes.errors.addressDetails ?
        changes.errors.addressDetails.permanentAddress.doorNo = "Please enter your Door no" :
        changes.errors.addressDetails = { permanentAddress: { doorNo: "Please enter your Door no" } }

      this.setState({
        changes
      });
    }
    if (e.target.value.length > 10) {
      changes.lineEntryData.addressDetails.permanentAddress.doorNo = e.target.value.slice(
        0,
        -1
      );
      this.setState({
        changes
      });
      return false;
    }
  }
  checkLandmark(e) {
    const changes = this.state;
    const landmark = e.target.value;
    changes.lineEntryData.addressDetails.permanentAddress.landmark =
      e.target.value;
    if (changes.errors.addressDetails) {
      changes.errors.addressDetails.permanentAddress.landmark = "";
    } else {
      changes.errors.addressDetails = {
        permanentAddress: {
          landmark: ""
        }
      };
    }
    this.setState({
      changes
    });
    if (String(landmark).length < 1) {
      changes.errors.addressDetails.permanentAddress.landmark =
        "Please enter your Landmark";
      this.setState({
        changes
      });
    }
    if (e.target.value.length > 30) {
      changes.lineEntryData.addressDetails.permanentAddress.landmark = e.target.value.slice(
        0,
        -1
      );
      this.setState({
        changes
      });
      return false;
    }
  }

  checkPincode(e) {
    const changes = this.state;
    const pincode = e.target.value;
    changes.lineEntryData.addressDetails.permanentAddress.pincode =
      e.target.value;
    changes.errors.pincode = "";
    this.setState({
      changes
    });
    if (String(pincode).length < 0 || String(pincode).length < 6) {
      changes.errors.pincode = "Enter 6 digit Pincode";
      this.setState({
        changes
      });
    }
    if (
      e.target.value.length > 6 ||
      /^[1-9]\d*$/.test(e.target.value) === false
    ) {
      changes.lineEntryData.addressDetails.permanentAddress.pincode = e.target.value.slice(
        0,
        -1
      );
      this.setState({
        changes
      });
      return false;
    }
  }
  toggle(value, statevalue) {
    this.setState({
      [value]: !statevalue
    });
  }
  toggleAllclose() {
    this.setState({ active: !this.state.active });
    this.setState({ collapse1: false });
    this.setState({ collapse2: false });
    this.setState({ collapse3: false });
    this.setState({ collapse4: false });
    this.setState({ collapse5: false });
    this.setState({ collapse6: false });
    this.setState({ collapse8: false });
    this.setState({ collapse9: false });
  }
  toggleAllopen() {
    this.setState({ active: !this.state.active });
    this.setState({ collapse1: true });
    this.setState({ collapse2: true });
    this.setState({ collapse3: true });
    this.setState({ collapse4: true });
    this.setState({ collapse5: true });
    this.setState({ collapse6: true });
    this.setState({ collapse8: true });
    this.setState({ collapse9: true });
  }
  componentWillMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.props.emptyDispatch(FETCH_FAMILY_MEMBER_LIST);
  }
  componentWillUnmount() {
    this.props.emptyErrors();
    window.removeEventListener("scroll", this.handleScroll);
  }

  updateVitals = (vitals) => {
    let ids = ["vital-weight", "vital-pulse", "vital-bp-up", "vital-bp-down", "vital-height",
      "vital-temp", "vital-resp", "vital-waist", "vital-hip"];

    ids.map(id => {
      // let value = null;
      if (id === "vital-bp-up") { document.querySelector('input#' + id).value = vitals.vital_bloodPressureUp ? Number(vitals.vital_bloodPressureUp) : null }
      if (id === "vital-bp-down") { document.querySelector('input#' + id).value = vitals.vital_bloodPressureDown ? Number(vitals.vital_bloodPressureDown) : null }
      if (id === "vital-height") { document.querySelector('input#' + id).value = vitals.vital_height ? Number(vitals.vital_height) : null }
      if (id === "vital-hip") { document.querySelector('input#' + id).value = vitals.vital_hip ? Number(vitals.vital_hip) : null }
      if (id === "vital-pulse") { document.querySelector('input#' + id).value = vitals.vital_pulse ? Number(vitals.vital_pulse) : null }
      if (id === "vital-resp") { document.querySelector('input#' + id).value = vitals.vital_resprate ? Number(vitals.vital_resprate) : null }
      if (id === "vital-temp") { document.querySelector('input#' + id).value = vitals.vital_temperature ? Number(vitals.vital_temperature) : null }
      if (id === "vital-waist") { document.querySelector('input#' + id).value = vitals.vital_waist ? Number(vitals.vital_waist) : null }
      if (id === "vital-weight") { document.querySelector('input#' + id).value = vitals.vital_weight ? Number(vitals.vital_weight) : null }

    })
  }
  commonArrayCreatorFromState = (
    arr,
    value,
    label,
    aliasFilter = ""
  ) => {
    if (aliasFilter !== "" && aliasFilter === this.props.auth.user.alias) {
      return arr
        .filter(val => val.test_id !== 2)
        .map(iteratee => ({
          value: iteratee[value],
          label: iteratee[label]
        }));
    } else {
      return arr.map(iteratee => ({
        value: iteratee[value],
        label: iteratee[label]
      }));
    }
  };
  componentDidMount() {
    this.setState({
      labTestList: this.props.labTestsList,
      originalLabTestList: this.props.labTestsList
    }, () => {
      this.forceUpdate()
    });
    this.currentUserUpdate(this.props.auth.user ? this.props.auth.user : {});
    if (this.props.entryType.type === "newVisit") {
      let { lineEntryData } = this.state;
      lineEntryData.newVisitMemberData = this.props.getLineEntryVisitData.user_pds_line;
      this.setState({ lineEntryData });
    }
    if (this.props.entryType.type === "edit") {
      const changes = this.state;
      const editData = this.props.editData;
      if (editData.visit_date) {
        let { lineEntryData } = this.state;
        lineEntryData.visitDate = moment(!isNaN(editData.visit_date) ? Number(editData.visit_date) : editData.visit_date);
        this.setState({
          lineEntryData
        });
      }
      changes.lineEntryData.generalRemarks = editData.general_remarks;
      this.generalRemarksRef.current.value = editData.general_remarks;
      if (editData.advices && editData.advices.length > 1) {
        let optionsTemp = editData.advices.split("**").filter(Boolean);
        changes.lineEntryData.remarks = optionsTemp.map(opt => ({
          name: opt,
          value: opt,
          label: opt
        }));
      }
      const diagnosisList = commonSortBy(
        commonArrayCreatorForSelect(
          this.props.diagnosis_masters,
          "diagnosis_id",
          "diagnosis_name"
        )
      );
      this.changeOutcomeDate(moment((!isNaN(editData.outcome_date) ? Number(editData.outcome_date) : editData.outcome_date)));
      this.changeOutcome({
        value: editData.outcome,
        label: editData.outcome
      });
      changes.lineEntryData.vitalsDef = {
        height: editData.vital_height,
        weight: editData.vital_weight,
        temperature: editData.vital_temperature,
        pulse: editData.vital_pulse,
        bloodPressureUp: editData.vital_bloodPressureUp,
        bloodPressureDown: editData.vital_bloodPressureDown,
        resprate: editData.vital_resprate,
        waist: editData.vital_waist,
        hip: editData.vital_hip
      };
      changes.lineEntryData.id_number = editData.visit_id;
      changes.lineEntryData.labResultDetails.listOfResults = [];
      const labTestsList = commonArrayCreatorForSelect(
        this.props.labTestsList,
        "test_id",
        "test_name"
      );
      let TempForLab = [];
      // eslint-disable-next-line
      editData.patient_lab_entry && editData.patient_lab_entry.map((labData, i) => {
        let temp = labTestsList.filter(
          labv => labv.test_id === labData.test_id
        );
        let labtestName = labTestsList.filter(lab => {
          if (lab.test_id === labData.test_id) {
            return lab.test_name;
          }
        })
        TempForLab.push({
          test_id: labData.test_id,
          ...temp,
          // eslint-disable-next-line
          name: labtestName.length > 0 ? labtestName[0].test_name : "",
          userData: {
            dateOfAdmission: new Date(Number(labData.test_date)),
            // dateOfAdmission: new Date(isNumber(labData.test_date) ? Number(labData.test_date) : labData.test_date),
            labResult: labData.result,
            remarks: labData.remarks,
            timeOfResult: labData.timeOfResult
          }
        });
      });
      // eslint-disable-next-line
      TempForLab.map((indiLabb, i) => {
        setTimeout(() => {
          this.changeLabResult({
            label: indiLabb.name,
            value: indiLabb.test_id
          });
          this.changeLabResultAdmissionDate(
            moment(indiLabb.userData.dateOfAdmission),
            indiLabb.test_id,
            i
          );
          this.changeLabResultRemarks(
            { target: { value: indiLabb.userData.remarks } },
            indiLabb.test_id
          );
          if (indiLabb[0].result_type === "select") {
            this.labFinalResult(
              {
                value: indiLabb.userData.labResult,
                label: indiLabb.userData.labResult
              },
              indiLabb.test_id,
              null,
              indiLabb["0"].result_type
            );
          } else {
            this.labFinalResult(
              { target: { value: indiLabb.userData.labResult } },
              indiLabb.test_id,
              null,
              indiLabb["0"].result_type
            );
          }
        });
      });
      let tempForDiag = editData.patient_diagnos_entry.map((diagno, i) => {
        let temp = diagnosisList.filter(
          data => data.diagnosis_id === diagno.diagnosis_id
        )[0];
        return temp;
      });
      this.changeDiseaseCondition(tempForDiag);
      const drugsList = commonArrayCreatorForSelect(
        this.props.drugsList,
        "drug_id",
        "drug_name"
      );
      const tempArr1 = [];
      // eslint-disable-next-line
      editData.patient_drug_entry.map(async (drug, i) => {
        let temop = drugsList.find(
          drugt => drugt.drug_id === drug.drug_id
        );
        temop = {
          ...temop,
          ...drug
        };
        temop.dosageValue = await drug["dosageValue"];
        tempArr1.push(temop);
        this.updateDrug(tempArr1);
      });
      tempArr1.forEach(data => {
        this.changeDrugFrequency(
          {
            label: data.dosage_value,
            value: data.dosage
          },
          data,
          tempArr1
        );
        this.changeDrugQuantity(
          {
            target: {
              value: data.days
            }
          },
          data,
          tempArr1
        );
      });
      this.updateVitals(editData);
      changes.diagnosisList = diagnosisList;
      changes.originalLabTestList = this.props.labTestsList;
      this.setState(changes);
    }
    if (typeof window.scrollTo === "function") {
      window.scrollTo(0, 0)
    }
  }

  async componentWillReceiveProps(nextProps) {
    const { successMessage, countriesList, drugsList, diagnosis_masters } = nextProps;
    let { lineEntryData } = this.state;
    let memberList = await this.getUsersList(lineEntryData);
    let alluserList = commonArrayCreatorForSelectForPopulation(
      memberList,
      "id",
      "name"
    );
    const diagnosisList = commonSortBy(
      commonArrayCreatorForSelect(
        diagnosis_masters,
        "diagnosis_id",
        "diagnosis_name"
      )
    );
    let countries = commonArrayCreatorForSelect(countriesList, "country_id", "country_name")
    let drugsListOpt = commonArrayCreatorForSelect(
      drugsList ? drugsList : [],
      "drug_id",
      "drug_name"
    );
    const phcList = commonArrayCreatorForSelect(
      this.props.phc_list,
      "phc_id",
      "institution_name"
    );
    if (nextProps.errors && nextProps.errors.warnings) {
      this.setState({
        warnings: nextProps.errors.warnings,
        // countriesList: countries
      });
    }
    if (nextProps.errors && nextProps.errors.payload) {
      if (Object.keys(nextProps.errors.payload).length > 0) {
        if (nextProps.errors.payload.commonMessage) {
          alert(nextProps.errors.payload.commonMessage);
        }
        this.setState({
          isFormSubmitted: false,
          errors: nextProps.errors.payload,
          countriesList: countries,
          drugsListOpt,
          phcList,
          diagnosisList,
          alluserList
        });
      } else {
        this.setState({
          isFormSubmitted: true,
          errors: {},
          countriesList: countries,
          drugsListOpt,
          phcList,
          diagnosisList,
          alluserList
        });
      }
      // this.upClick();
    } else {
      this.setState({
        errors: {},
        countriesList: countries,
        drugsListOpt,
        phcList,
        diagnosisList,
        alluserList
      });
    }
    if (successMessage && successMessage.message) {
      if (successMessage.status === 200) {
        alert(successMessage.message);
        window.location = "/";
        // emptyDispatch(LINEENTRY_SUCCESS, {})
        // this.props.history.push("/UHC/linelist")
      } else {
        alert(successMessage.message);
      }
    }
    if (Object.keys(nextProps.language > 0)) {
      this.setState({
        language: nextProps.language,
        loading: false
      });
    }
  }

  calculateVitals(a, b, type) {
    if (type === "BMI") {
      let w = a,
        h = b,
        message;
      // h = (h===0) ? 1 : h;
      let hpow = Math.pow(h / 100, 2);
      let bmi = (w / hpow).toFixed(2);
      if (w <= 1 || h <= 1) {
        bmi = 0;
        message = "";
      } else if (bmi > 1 && bmi < 18.5) {
        message = "Underweight ";
      } else if (bmi > 18.5 && bmi < 24.9) {
        message = "Normal ";
      } else if (bmi > 25 && bmi < 30) {
        message = "Overweight ";
      } else if (bmi > 30) {
        message = "Obesity ";
      }
      return { bmi, message };
    }
    if (type === "WHR") {
      let w = a,
        h = b,
        whr;
      h = h === 0 ? 1 : h;
      whr = (w / h).toFixed(2);
      return { whr };
    }
  }

  async getUsersList(lineEntryData) {
    let villageids = [], users = [];
    try {
      villageids = lineEntryData.addressDetails.permanentAddress.village
      users = this.props.lineEntrylist && this.props.lineEntrylist.usersList
        ? this.props.lineEntrylist.usersList
        : [];
    } catch (error) {
      console.error('ERROR USER', error);
    }
    return users;
  }

  render() {
    const isPatientSearchLoading = this.props.commonLoading.isPatientSearchLoading ? this.props.commonLoading.isPatientSearchLoading : false;
    const remarksCustomOptions = remarksOptions;
    const { patientEditAllowed, drugsList } = this.state.lineEntryData;
    const originalLabTestList =
      this.state.originalLabTestList !== undefined
        ? this.commonArrayCreatorFromState(
          this.state.originalLabTestList,
          "test_id",
          "test_name",
          "phc"
        )
        : [];
    let {
      errors,
      warnings,
      lineEntryData,
      collapse1,
      collapse2,
      collapse4,
      collapse5,
      collapse8,
      collapse9,
      isFormSubmitted,
      gqlData,
      countriesList,
      currentFamilyFolder,
      drugsListOpt,
      phcList,
      diagnosisList,
      alluserList
    } = this.state;
    const { vitalsDef, specimensList, diseaseConditionString } = lineEntryData;
    const Outcome = [
      { value: "Treated at this level", label: "Treated at this level" },
      { value: "Referred Out", label: "Referred Out" },
      { value: "Follow Up", label: "Follow Up" },
      { value: "Screening", label: "Screening" }
    ];
    return (
      <ApolloConsumer>
        {DSUEntryList =>
          <Container fluid className={styles.headerbg}>
            <Row>
              <Col md="12" xs="12" className={styles.bgcontent}>
                <Row>
                  <Col lg="11" sm="12" style={{ padding: "10px 10px" }}>
                    <PageList
                      currentURL={
                        this.props.pageType === "labList"
                          ? "lablist"
                          : "linelist"
                      }
                      userData={this.props.auth.user}
                    />
                  </Col>
                </Row>
                <Row
                  className={styles.dsuentrybtn}
                  style={{
                    pointerEvents: this.props.history.location.state
                      ? this.props.history.location.state.disableForm
                        ? "none"
                        : ""
                      : ""
                  }}
                >
                  <Col lg="1" xs="6">
                    <label>Visit ID</label>
                    <p>
                      {lineEntryData.id_number}
                    </p>
                  </Col>
                  <Col lg="2" sm="12" className={styles.selectFiledMargin}>
                    <SelectList
                      label={`Country`}
                      value={
                        lineEntryData.addressDetails.permanentAddress.country
                      }
                      options={countriesList}
                      onChange={this.changeCountry}
                      classNamePrefix={styles.test}
                      className={styles.changedClass + ' getCountry'}
                    />
                  </Col>
                  <Col lg="2" sm="12" className={styles.selectFiledMargin}>
                    <SelectList
                      label={`State`}
                      value={
                        lineEntryData.addressDetails.permanentAddress.state
                      }
                      options={gqlData.statesList}
                      onChange={this.changeState}
                      classNamePrefix={styles.test}
                      className={styles.changedClass + ' getState'}
                    />
                  </Col>
                  <Col
                    lg="3"
                    md="12"
                    sm="12"
                    className={styles.selectFiledMargin}
                  >
                    <SelectList
                      star="*"
                      label={`District`}
                      value={gqlData.districtsList.find(
                        val =>
                          val.value ===
                          lineEntryData.addressDetails.permanentAddress.district
                      )}
                      options={gqlData.districtsList}
                      onChange={this.changeDistrict}
                      classNamePrefix={styles.test}
                      className={styles.changedClass + ' getDistrict'}
                    />
                  </Col>
                  <Col
                    lg="2"
                    md="6"
                    xs="6"
                    className={styles.dateWidth + " " + styles.dateFiledMargin}
                  >
                    <label
                      dangerouslySetInnerHTML={{
                        __html: `Visit date`
                      }}
                    />
                    <br />
                    <DatePicker
                      minDate={moment().subtract(366, "days")}
                      maxDate={moment()}
                      // selected={}
                      onChange={this.changeVisitDate}
                      selected={lineEntryData.visitDate}
                      placeholderText="DD/MM/YYYY"
                      dateFormat="DD/MM/YYYY"
                      className={styles.databorder}
                    />
                  </Col>
                  <Col lg="2" xs="6" style={{ textAlign: "right" }}>
                    <p style={{ marginBottom: "0.5rem" }}>
                      <span style={{ color: "red", fontWeight: "900" }}>*</span>
                      Mandatory fields
                    </p>
                    <span>
                      {this.state.active === true
                        ? <Button
                          variant="primary"
                          onClick={this.toggleAllclose}
                          style={{
                            color: "#000000",
                            backgroundColor: "#cccccc"
                          }}
                        >
                          Close all Collapse
                          </Button>
                        :
                        <Button
                          variant="primary"
                          onClick={this.toggleAllopen}
                          style={{
                            color: "#000000",
                            backgroundColor: "#cccccc"
                          }}
                        >
                          Open all Collapse
                          </Button>
                      }
                    </span>
                  </Col>
                </Row>
                <Container
                  fluid
                  style={{
                    marginTop: "25px",
                    pointerEvents: this.props.history.location.state
                      ? this.props.history.location.state.disableForm
                        ? "none"
                        : ""
                      : ""
                  }}
                >
                  {(this.state.lineEntryData.type === "edit" ||
                    this.props.entryType.type === "newVisit") &&
                    <Profile
                      entryList={this.props.editData}
                      master_data={this.props.editData ? this.props.editData.user_pds_line : this.props.entryType.type === "newVisit" ? this.props.getLineEntryVisitData.user_pds_line : null}
                    />
                  }
                  {(this.state.lineEntryData.type === "edit" ||
                    this.props.entryType.type === "newVisit") &&
                    <VisitDetails
                      institutionName={this.props.visitDetails ? this.props.visitDetails.outcome === 'Referred in' ? (this.props.visitDetails.rfrd_phc_name ? this.props.visitDetails.rfrd_phc_name.phc_name : ' Not available') : (this.props.visitDetails.phc_patient_det ? this.props.visitDetails.phc_patient_det.phc_name : ' Not available') : 'Not available'}
                      visitDate={this.props.visitDetails ? (this.props.visitDetails.visit_date ? this.props.visitDetails.visit_date : null) : null}
                    />
                  }
                  <div
                    style={{
                      display:
                        this.state.lineEntryData.type === "edit" ||
                          this.props.entryType.type === "newVisit"
                          ? "none"
                          : "block"
                    }}
                  >
                    <div
                      className={styles.collapseTatile}
                      onClick={() => {
                        this.toggle("collapse1", collapse1);
                      }}
                    >
                      <Row>
                        <Col xs="10" md="11" sm="11">
                          <h6>Patient Details</h6>
                        </Col>
                        <Col xs="2" md="1" sm="1" className={styles.closeicon}>
                          <i
                            className={
                              "fa fa-plus " +
                              styles.plus +
                              (collapse1 ? " " + styles.close : "")
                            }
                          />
                        </Col>
                      </Row>
                    </div>
                    <Collapse isOpen={collapse1}>
                      <Card>
                        <CardBody
                          style={{ paddingTop: "15px", paddingBottom: "15px" }}
                        >
                          <Container fluid>
                            <Row>
                              <Col
                                md="6"
                                className={
                                  styles.selectFiledMargin +
                                  " " +
                                  styles.ResultEllipsis
                                }
                              >
                                <SelectList
                                  label={`Locality / Village / Town`}
                                  options={gqlData.villagesList}
                                  isMulti
                                  placeholder="Select Locality/Village/Town"
                                  onChange={opt => this.handleVillageChange(opt, DSUEntryList)}
                                  value={
                                    // gqlData.villagesList.filter(_ => (
                                    lineEntryData.addressDetails.permanentAddress.village
                                    // ? lineEntryData.addressDetails.permanentAddress.village.map(__ => __.value).includes(_.value)
                                    // : ''))
                                  }
                                  classNamePrefix={styles.test}
                                  className={styles.changedClass}
                                />
                                <span className={styles.commonError}>
                                  {errors.village}
                                </span>
                                {(lineEntryData.isHeNewUser && lineEntryData.addressDetails.permanentAddress.village && lineEntryData.addressDetails.permanentAddress.village.length > 1) &&
                                  <p
                                    style={{
                                      paddingTop: "4px",
                                      // paddingLeft: "17px",
                                      color: "red",
                                      marginBottom: "0px",
                                      fontSize: "13px"
                                    }}
                                  >Please select only one if you're adding a new family folder.</p>
                                }
                              </Col>
                              {
                                /(hsc|phc)/.test(this.props.auth.user.alias) ? "" : (
                                  <Col
                                    md="6"
                                    className={
                                      styles.selectFiledMargin +
                                      " " +
                                      styles.ResultEllipsis
                                    }
                                  >
                                    <SelectList
                                      label={`Hamlet(VP)/ Street(TP/MP)`}
                                      options={gqlData.hamletsList}
                                      value={
                                        lineEntryData.addressDetails
                                          .permanentAddress.street
                                      }
                                      placeholder="Select Hamlet(VP)/Street(TP/MP)"
                                      onChange={this.changeStreet}
                                      classNamePrefix={styles.test}
                                      className={styles.changedClass}
                                    />
                                  </Col>
                                )
                              }
                              <Col lg="6">
                                <SelectList
                                  isLoading={isPatientSearchLoading}
                                  label="Search Member/Head of Family"
                                  options={alluserList}
                                  value={alluserList.find(_ => _.nodeId === lineEntryData.parentNodeId) ? alluserList.find(_ => _.nodeId === lineEntryData.parentNodeId) : null}
                                  onInputChange={e => {
                                    e = e + "*";
                                    e.length > 3 &&
                                      this.updateMemberUserData(e);
                                  }}
                                  onChange={e => {
                                    this.fetchFamily(e);
                                  }}
                                />
                              </Col>
                              <Col lg="6">
                                <SelectList
                                  label="Name of beneficiary availing service"
                                  isLoading={isPatientSearchLoading}
                                  options={currentFamilyFolder}
                                  onChange={e => {
                                    this.saveMemberData(e);
                                  }}
                                  value={
                                    currentFamilyFolder.length > 0 ?
                                      this.state.lineEntryData.memberData : ""
                                  }
                                />
                              </Col>
                              <Col
                                lg="3"
                                md="4"
                                sm="12"
                                className={styles.textFiledMargin}
                              >
                                <Inputtext
                                  required
                                  star="*"
                                  disabled={!patientEditAllowed}
                                  label={`Mobile / Landline Number (10 Digit)`}
                                  type="text"
                                  placeholder="XXXXX XXXXX"
                                  name="mobileNo"
                                  maxLength="10"
                                  minLength="10"
                                  ref={this.notNewMobile}
                                  className={styles.inputstyle}
                                  onChange={e => {
                                    {/* this.checkMobileNo(e, true); */ }
                                  }}
                                  errorvalid={styles.errorValid}
                                />
                              </Col>
                              <Col
                                lg="3"
                                md="4"
                                sm="12"
                                className={styles.textFiledMargin}
                              >
                                <Inputtext
                                  disabled={!patientEditAllowed}
                                  label={`Aadhaar Number (12 Digit)`}
                                  type="text"
                                  className={styles.inputstyle}
                                  placeholder="XXXX XXXX XXXX"
                                  name="aadharNo"
                                  ref={this.notNewAadhar}
                                  maxLength="12"
                                  minLength="12"
                                  errorvalid={styles.errorValid}
                                />
                              </Col>
                            </Row>
                            {/* </Col> */}
                            {/* Do not delete */}
                            <span
                              id="userDataFilled"
                              ref={this.isUserFilledRef}
                              style={{
                                fontSize: "12px",
                                color: "red",
                                paddingLeft: "16px"
                              }}
                            >
                              {errors.isUserFilled}
                            </span>
                            {/* For creationm of user */}
                            <Col lg="12">
                              <Row>
                                <Col lg="3">
                                  <FormGroup check>
                                    <div>
                                      <Label check>
                                        <Input
                                          type="checkbox"
                                          style={{ zoom: "1.6" }}
                                          defaultValue={lineEntryData.isHeNewUser}
                                          onClick={e => {
                                            this.createNewUser(
                                              lineEntryData.isHeNewUser, 'head'
                                            );
                                          }}
                                        />
                                        <h6
                                          style={{
                                            paddingTop: "4px",
                                            paddingLeft: "15px",
                                            marginBottom: "0px"
                                          }}
                                        >
                                          Click to add a new family folder
                                      </h6>
                                        {(lineEntryData.isHeNewUser && lineEntryData.addressDetails.permanentAddress.village && lineEntryData.addressDetails.permanentAddress.village.length > 1) &&
                                          <p
                                            style={{
                                              paddingTop: "4px",
                                              paddingLeft: "17px",
                                              color: "red"
                                            }}
                                          >You can’t map the family to multiple locality/village/town, please select one.
                                        </p>}
                                      </Label>
                                    </div>
                                  </FormGroup>
                                </Col>
                                {(lineEntryData.memberData && lineEntryData.memberData.nodeId !== null && lineEntryData.memberData.nodeId !== '') && <Col lg='3'>
                                  <FormGroup check>
                                    <div>
                                      <Label check>
                                        <Input
                                          type="checkbox"
                                          style={{ zoom: "1.6" }}
                                          defaultValue={lineEntryData.isHeNewUser}
                                          onClick={e => {
                                            this.createNewUser(
                                              lineEntryData.isHeNewUser, 'member'
                                            );
                                          }}
                                        />
                                        <h6
                                          style={{
                                            paddingTop: "4px",
                                            paddingLeft: "15px"
                                          }}
                                        >
                                          Click to add a new member
                                      </h6>
                                      </Label>
                                    </div>
                                  </FormGroup>
                                </Col>}
                              </Row>
                            </Col>
                            {/* For creationm of user */}
                            {/* For adding a new member to a family user */}
                            <Col lg="5">
                              <FormGroup check>
                                <div>
                                  <Label check>
                                  </Label>
                                </div>
                              </FormGroup>
                            </Col>
                            {/* For adding a new member to a family user */}
                            {lineEntryData.isHeNewUser &&
                              <Col lg="12" md="6" sm="12">
                                <Row>
                                  <Col
                                    lg="4"
                                    md="4"
                                    sm="12"
                                    className={styles.textFiledMargin}
                                  >
                                    <Inputtext
                                      star="*"
                                      label={`Patient Name`}
                                      disabled={!patientEditAllowed}
                                      type="text"
                                      placeholder="Enter Patient Name"
                                      className={styles.inputstyle}
                                      name="patientName"
                                      onChange={this.checkPatientName}
                                      errorvalid={styles.errorValid}
                                    />
                                    <span className={styles.commonError}>
                                      {errors.patientName}
                                    </span>
                                  </Col>

                                  <Col
                                    lg="4"
                                    md="4"
                                    sm="12"
                                    className={styles.textFiledMargin}
                                  >
                                    <Inputtext
                                      star="*"
                                      disabled={!patientEditAllowed}
                                      label={`Father/Spouse/Guardian Name`}
                                      type="text"
                                      className={styles.inputstyle}
                                      placeholder="Enter Father/Spouse/Guardian Name"
                                      name="guardianName"
                                      onChange={this.checkGuardianName}
                                      errorvalid={styles.errorValid}
                                    />
                                  </Col>
                                  <Col lg="2" md="2" sm="12">
                                    <Inputtext
                                      star="*"
                                      disabled={!patientEditAllowed}
                                      label={`Age in years`}
                                      type="number"
                                      className={styles.inputstyle}
                                      onChange={this.checkAge}
                                      placeholder="Enter Age"
                                      name="age"
                                      errorvalid={styles.errorValid}
                                    />
                                    <span className={styles.commonError}>
                                      {errors.age}
                                    </span>
                                  </Col>
                                  <Col lg="2" md="2" sm="12">
                                    <div className={styles.genderbox}>
                                      <SelectList
                                        isDisabled={!patientEditAllowed}
                                        star="*"
                                        onChange={this.changeGender}
                                        classNamePrefix={styles.test}
                                        className={styles.changedClass}
                                        label={`Gender`}
                                        placeholder="Select Gender"
                                        options={gendersList}
                                      />
                                      <span className={styles.commonError}>
                                        {errors.gender}
                                      </span>
                                    </div>
                                  </Col>
                                  <Col lg="4" md="4" sm="12">
                                    <Inputtext
                                      star="*"
                                      label={`Enter Tamil Name`}
                                      disabled={!patientEditAllowed}
                                      type="text"
                                      placeholder="Enter Tamil Name"
                                      className={styles.inputstyle}
                                      onChange={this.checkPatientNameLocale}
                                      errorvalid={styles.errorValid}
                                    />
                                    <span className={styles.commonError}>
                                      {errors.patientTamilName}
                                    </span>
                                  </Col>

                                  <Col
                                    lg="4"
                                    md="4"
                                    sm="12"
                                    className={styles.textFiledMargin}
                                  >
                                    <Inputtext
                                      star="*"
                                      disabled={!patientEditAllowed}
                                      label={`Mobile / Landline Number (10 Digit)`}
                                      type="text"
                                      placeholder="XXXXX XXXXX"
                                      name="mobileNo"
                                      classname={"newUserMobile"}
                                      onChange={e => {
                                        if (e.target.value.length <= 10) {
                                          this.checkMobileNo(e, true);
                                        }
                                      }}
                                      maxLength="10"
                                      minLength="10"
                                      errorvalid={styles.errorvalid}
                                    />
                                  </Col>
                                  <Col
                                    lg="4"
                                    md="4"
                                    sm="12"
                                    className={styles.textFiledMargin}
                                  >
                                    <Inputtext
                                      disabled={!patientEditAllowed}
                                      label={`Aadhaar Number (12 Digit)`}
                                      type="text"
                                      className={styles.inputstyle}
                                      placeholder="XXXX XXXX XXXX"
                                      name="aadharNo"
                                      ref={this.NewAadhar}
                                      onChange={e => {
                                        if (e.target.value.length <= 12) {
                                          this.checkAadharNo(e, true);
                                        }
                                      }}
                                      maxLength="12"
                                      minLength="12"
                                      errorvalid={styles.errorvalid}
                                    />
                                  </Col>
                                  {(!lineEntryData.memberData.isNewMember && lineEntryData.isHeNewUser) &&
                                    <Col
                                      lg="6"
                                      md="6"
                                      sm="12"
                                      className={styles.textFiledMargin}
                                    >
                                      <Inputtext
                                        label={`Address`}
                                        type="textarea"
                                        className={styles.inputstyle}
                                        placeholder="Enter Address"
                                        name="address"
                                        // value={indiLab.userData.remarks ? indiLab.userData.remarks : ''}
                                        // id={`lab-remarks-${i}`}
                                        onChange={e => this.changeaddressdetails(e)}
                                      />
                                    </Col>}
                                </Row>
                              </Col>}
                            {/* Do not delete */}
                            {/* For creationm og user */}
                            {/* </Row> */}
                          </Container>
                        </CardBody>
                      </Card>
                    </Collapse>
                  </div>
                  {!(!lineEntryData.memberData.isNewMember && lineEntryData.isHeNewUser) && <div
                    style={{
                      display:
                        this.state.lineEntryData.type === "edit" ||
                          this.props.entryType.type === "newVisit"
                          ? "none"
                          : "block"
                    }}
                  >
                    <div
                      className={
                        styles.collapseTatile + " " + styles.mobiletitle
                      }
                      onClick={() => {
                        this.toggle("collapse2", collapse2);
                      }}
                    >
                      <Row>
                        <Col xs="10" md="11" sm="11">
                          <h6>Residential Address Information </h6>
                        </Col>
                        <Col xs="2" md="1" sm="1" className={styles.closeicon}>
                          <i
                            className={
                              "fa fa-plus " +
                              styles.plus +
                              (collapse2 ? " " + styles.close : "")
                            }
                          />
                        </Col>
                      </Row>
                    </div>
                    {/* start Residential Address */}
                    <Collapse isOpen={collapse2}>
                      <Card>
                        <CardBody>
                          <Container fluid>
                            <Row style={{ padding: "15px 0px" }}>
                              <Col
                                md="12"
                                style={{
                                  display: patientEditAllowed ? "block" : "none"
                                }}
                              >
                                <Row>
                                  <Col md="12">
                                    <Row>
                                      <Col
                                        lg="2"
                                        md="6"
                                        sm="12"
                                        className={styles.selectFiledMargin}
                                      >
                                        <SelectList
                                          isDisabled={!patientEditAllowed}
                                          label={`Country`}
                                          value={
                                            lineEntryData.addressDetails
                                              .permanentAddress.country
                                            //  &&
                                            // countriesList.length > 0
                                            // ? countriesList.filter(
                                            //   count =>
                                            //     count.value ===
                                            //     lineEntryData.addressDetails
                                            //       .permanentAddress.country
                                            // )
                                            // : null
                                          }
                                          options={countriesList}
                                          onChange={this.changeCountry}
                                          classNamePrefix={styles.test}
                                          className={styles.changedClass}
                                        />
                                      </Col>
                                      <Col
                                        lg="2"
                                        md="6"
                                        sm="12"
                                        className={styles.selectFiledMargin}
                                      >
                                        <SelectList
                                          isDisabled={!patientEditAllowed}
                                          label={`State`}
                                          value={
                                            lineEntryData.addressDetails
                                              .permanentAddress.state
                                            //  &&
                                            // gqlData.statesList.length > 0
                                            // ? gqlData.statesList.filter(
                                            //   count =>
                                            //     count.value ===
                                            //     lineEntryData.addressDetails
                                            //       .permanentAddress.state
                                            // )
                                            // : null
                                          }
                                          options={gqlData.statesList}
                                          onChange={this.changeState}
                                          classNamePrefix={styles.test}
                                          className={styles.changedClass}
                                        />
                                      </Col>
                                      <Col
                                        lg="2"
                                        md="12"
                                        sm="12"
                                        className={styles.selectFiledMargin}
                                      >
                                        <SelectList
                                          isDisabled={!patientEditAllowed}
                                          label={`District`}
                                          // value={
                                          //   lineEntryData.addressDetails
                                          //     .permanentAddress.district &&
                                          //     districts.length > 0
                                          //     ? districts.filter(
                                          //       count =>
                                          //         count.value ===
                                          //         lineEntryData.addressDetails
                                          //           .permanentAddress.district
                                          //     )
                                          //     : null
                                          // }
                                          // options={districts}
                                          onChange={this.changeDistrict}
                                          classNamePrefix={styles.test}
                                          className={styles.changedClass}
                                        />
                                      </Col>
                                      <Col
                                        md="6"
                                        className={
                                          styles.selectFiledMargin +
                                          " " +
                                          styles.ResultEllipsis
                                        }
                                      >
                                        <SelectList
                                          isDisabled={!patientEditAllowed}
                                          label={`Locality / Village / Town`}
                                          // options={villages}
                                          isMulti
                                          placeholder="Select Locality/Village/Town"
                                          onChange={async opt => {
                                            let vals = opt.map(_ => _.value);
                                            const {
                                              data
                                            } = await DSUEntryList.query({
                                              query: gql`
                                                ${CustomQueries.getAllHabitations}
                                              `,
                                              variables: {
                                                village_id: { in: vals }
                                              }
                                            });
                                            this.changeVillage(
                                              opt,
                                              data.allHabitationsMasters.nodes
                                            );
                                          }}
                                          value={
                                            // villages.filter(_ => (
                                            lineEntryData.addressDetails.permanentAddress.village
                                            //  ? lineEntryData.addressDetails.permanentAddress.village.includes(_.value) : ''))
                                          }
                                        // classNamePrefix={styles.test}
                                        // className={styles.changedClass}
                                        />
                                      </Col>
                                      <Col
                                        md="6"
                                        className={
                                          styles.selectFiledMargin +
                                          " " +
                                          styles.ResultEllipsis
                                        }
                                      >
                                        <SelectList
                                          isDisabled={!patientEditAllowed}
                                          label={`Hamlet(VP)/ Street(TP/MP)`}
                                          options={gqlData.hamletsList}
                                          placeholder="Select Hamlet(VP)/Street(TP/MP)"
                                          onChange={this.changeStreet}
                                          classNamePrefix={styles.test}
                                          className={styles.changedClass}
                                        />
                                        <button
                                          className={styles.clearBtn}
                                          onClick={() => {
                                            const changes = this.state;
                                            changes.lineEntryData.addressDetails.permanentAddress.street = null;
                                            this.setState({
                                              changes
                                            });
                                          }}
                                        >
                                          Clear
                                        </button>
                                      </Col>

                                      <Col
                                        md="6"
                                        className={styles.textFiledMargin}
                                      >
                                        <Inputtext
                                          disabled={!patientEditAllowed}
                                          label={`Landmark`}
                                          type="text"
                                          className={styles.inputstyle}
                                          placeholder="Enter Landmark"
                                          name="landmark"
                                          onChange={this.checkLandmark}
                                          errorvalid={styles.errorValid}
                                        />
                                      </Col>
                                      <Col
                                        md="6"
                                        className={styles.textFiledMargin}
                                      >
                                        <Inputtext
                                          disabled={!patientEditAllowed}
                                          label={`House / Apartment`}
                                          type="text"
                                          placeholder="Enter House / Apartment"
                                          name="handle"
                                          className={styles.inputstyle}
                                          onChange={this.checkHouseName}
                                          errorvalid={styles.errorValid}
                                        />
                                      </Col>
                                      <Col
                                        md="3"
                                        className={styles.textFiledMargin}
                                      >
                                        <Inputtext
                                          disabled={!patientEditAllowed}
                                          label={`Door No`}
                                          type="text"
                                          placeholder="Enter Door No"
                                          name="doorNo"
                                          className={styles.inputstyle}
                                          onChange={this.checkDoorNo}
                                          errorvalid={styles.errorValid}
                                        />
                                      </Col>
                                      <Col
                                        md="3"
                                        className={styles.textFiledMargin}
                                      >
                                        <Inputtext
                                          disabled={!patientEditAllowed}
                                          label={`Pincode`}
                                          maxLength="6"
                                          minLength="6"
                                          type="text"
                                          placeholder="XXX XXX"
                                          name="pincode"
                                          className={styles.inputstyle}
                                          onChange={this.checkPincode}
                                          errorvalid={styles.errorValid}
                                        />
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Container>
                        </CardBody>
                      </Card>
                    </Collapse>
                  </div>}
                  <div>
                    <div
                      className={
                        styles.collapseTatile + " " + styles.mobiletitle
                      }
                      onClick={() => {
                        this.toggle("collapse5", collapse5);
                      }}
                    >
                      <Row>
                        <Col xs="10" md="11" sm="11">
                          <h6>
                            {"Vital Signs"}
                            <div className={styles.bmiWhrHolder}>
                              <p
                                style={{
                                  display: warnings.common ? "block" : "none"
                                }}
                              >
                                {warnings.common}
                              </p>
                              {vitalsDef.weight &&
                                vitalsDef.height &&
                                this.calculateVitals(
                                  vitalsDef.weight,
                                  vitalsDef.height,
                                  "BMI"
                                ).bmi > 0
                                ? <Alert
                                  color="success"
                                  style={{ padding: "6px" }}
                                >{`BMI: ${this.calculateVitals(
                                  vitalsDef.weight,
                                  vitalsDef.height,
                                  "BMI"
                                ).bmi}`}</Alert>
                                : ""}
                              {vitalsDef.waist &&
                                vitalsDef.hip &&
                                this.calculateVitals(
                                  vitalsDef.waist,
                                  vitalsDef.hip,
                                  "WHR"
                                ).whr > 0
                                ? <Alert
                                  color="success"
                                  style={{ padding: "6px" }}
                                >{`WHR: ${this.calculateVitals(
                                  vitalsDef.waist,
                                  vitalsDef.hip,
                                  "WHR"
                                ).whr}`}</Alert>
                                : ""}
                            </div>
                          </h6>
                        </Col>
                        <Col xs="2" md="1" sm="1" className={styles.closeicon}>
                          <i
                            className={
                              "fa fa-plus " +
                              styles.plus +
                              (collapse5 ? " " + styles.close : "")
                            }
                          />
                        </Col>
                      </Row>
                    </div>
                    {/* start Residential Address */}
                    <Collapse isOpen={collapse5}>
                      <Card>
                        <CardBody>
                          <Container fluid>
                            <Row className={styles.vitalsData}>
                              <Col lg="12">
                                <Row>
                                  <Col lg="3" xs="6">
                                    <FormGroup row>
                                      <Label
                                        for="exampleEmail"
                                        sm={8}
                                        style={{ paddingTop: "10px" }}
                                      >
                                        Weight
                                        <span
                                          id="weightField"
                                          ref={this.weightRef}
                                          style={{
                                            fontWeight: 950,
                                            color: "red"
                                          }}
                                        >
                                          *
                                        </span>
                                      </Label>
                                      <Col sm={4} style={{ padding: "0px" }}>
                                        <InputGroup
                                          className={styles.inputWidth}
                                        >
                                          <Inputtext
                                            style={{
                                              width: "70px",
                                              textAlign: "center"
                                            }}
                                            id="vital-weight"
                                            // label={"Days"}
                                            onChange={e => {
                                              this.commonVitalsChange(
                                                "weight",
                                                e
                                              );
                                            }}
                                            type="number"
                                            className={styles.inputIncrement}
                                            placeholder="00.000"
                                            name="days"
                                          />
                                          <span
                                            style={{
                                              padding: "7px",
                                              fontWeight: "600",
                                              fontSize: "14px"
                                            }}
                                          >
                                            Kg
                                          </span>
                                        </InputGroup>
                                      </Col>
                                    </FormGroup>
                                    <Col lg="12" className={styles.error}>
                                      {
                                        this.calculateVitals(
                                          lineEntryData.vitalsDef["weight"],
                                          lineEntryData.vitalsDef["height"],
                                          "BMI"
                                        ).message
                                      }
                                    </Col>
                                  </Col>
                                  <Col lg="3" xs="6">
                                    <FormGroup row>
                                      <Label
                                        for="exampleEmail"
                                        sm={5}
                                        style={{ paddingTop: "10px" }}
                                      >
                                        Pulse Rate
                                        <span
                                          style={{
                                            fontWeight: 950,
                                            color: "red"
                                          }}
                                        >
                                          *
                                        </span>
                                      </Label>
                                      <Col sm={7} style={{ padding: "0px" }}>
                                        <InputGroup
                                          className={styles.inputWidth}
                                        >
                                          <Inputtext
                                            style={{
                                              width: "70px",
                                              textAlign: "center"
                                            }}
                                            // label={"Days"}
                                            onChange={e => {
                                              this.commonVitalsChange(
                                                "pulse",
                                                e
                                              );
                                            }}
                                            id="vital-pulse"
                                            type="text"
                                            className={styles.inputIncrement}
                                            placeholder="0"
                                            name="days"
                                          />
                                          <span
                                            style={{
                                              padding: "5px",
                                              fontWeight: "600",
                                              fontSize: "14px"
                                            }}
                                          >
                                            per minute
                                          </span>
                                        </InputGroup>
                                      </Col>
                                    </FormGroup>
                                    <Col lg="12" className={styles.error}>
                                      {warnings.pulse}
                                      {errors.pulse}
                                    </Col>
                                  </Col>
                                  <Col lg="3" xs="7">
                                    <FormGroup row>
                                      <Label
                                        for="exampleEmail"
                                        sm={5}
                                        style={{
                                          paddingTop: "10px",
                                          paddingRight: "0px"
                                        }}
                                      >
                                        Blood Pressure
                                        <span
                                          style={{
                                            fontWeight: 950,
                                            color: "red"
                                          }}
                                        >
                                          *
                                        </span>
                                      </Label>
                                      <Col sm={7} style={{ padding: "0px" }}>
                                        <InputGroup>
                                          <Inputtext
                                            style={{
                                              width: "70px",
                                              textAlign: "center"
                                            }}
                                            id="vital-bp-up"
                                            // label={"Days"}
                                            onChange={e => {
                                              this.commonVitalsChange(
                                                "bloodPressureUp",
                                                e
                                              );
                                            }}
                                            type="text"
                                            className={styles.inputIncrement}
                                            placeholder="0"
                                            name="days"
                                          />
                                          <span
                                            style={{
                                              fontSize: "20px",
                                              padding: "5px"
                                            }}
                                          >
                                            /
                                          </span>
                                          <Inputtext
                                            style={{
                                              width: "70px",
                                              textAlign: "center"
                                            }}
                                            id="vital-bp-down"
                                            // label={"Days"}
                                            onChange={e => {
                                              this.commonVitalsChange(
                                                "bloodPressureDown",
                                                e
                                              );
                                            }}
                                            type="text"
                                            className={styles.inputIncrement}
                                            placeholder="0"
                                            name="days"
                                          />
                                          <span
                                            style={{
                                              padding: "5px",
                                              fontWeight: "600",
                                              fontSize: "14px"
                                            }}
                                          >
                                            mmHg
                                          </span>
                                        </InputGroup>
                                      </Col>
                                    </FormGroup>
                                    <Col lg="12" className={styles.error}>
                                      {warnings.bloodPressureDown} &nbsp;
                                      {warnings.bloodPressureUp}
                                      {(errors.bloodPressureUp ||
                                        errors.bloodPressureDown) &&
                                        `Please enter a valid Blood presure`}
                                      <br />
                                      {errors.bloodPressureValidation}
                                    </Col>
                                  </Col>
                                  <Col lg="2" xs="6">
                                    <FormGroup row>
                                      <Label
                                        for="height"
                                        sm={6}
                                        style={{ paddingTop: "10px" }}
                                      >
                                        Height
                                      </Label>
                                      <Col sm={6} style={{ padding: "0px" }}>
                                        <InputGroup
                                          className={styles.inputWidth}
                                        >
                                          <Inputtext
                                            style={{
                                              width: "70px",
                                              textAlign: "center"
                                            }}
                                            id="vital-height"
                                            onChange={e => {
                                              this.commonVitalsChange(
                                                "height",
                                                e
                                              );
                                            }}
                                            type="number"
                                            className={styles.inputIncrement}
                                            placeholder="00.00"
                                            name="height"
                                          />
                                          <span
                                            style={{
                                              padding: "7px",
                                              fontWeight: "600",
                                              fontSize: "14px"
                                            }}
                                          >
                                            Cms
                                          </span>
                                        </InputGroup>
                                      </Col>
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg="3" xs="6">
                                    <FormGroup row>
                                      <Label
                                        for="temperature"
                                        sm={8}
                                        style={{ paddingTop: "10px" }}
                                      >
                                        Temperature
                                      </Label>
                                      <Col sm={4} style={{ padding: "0px" }}>
                                        <InputGroup
                                          className={styles.inputWidth}
                                        >
                                          <Inputtext
                                            style={{
                                              width: "70px",
                                              textAlign: "center"
                                            }}
                                            id="vital-temp"
                                            onChange={e => {
                                              this.commonVitalsChange(
                                                "temperature",
                                                e
                                              );
                                            }}
                                            type="number"
                                            className={styles.inputIncrement}
                                            placeholder="00.0"
                                            name="days"
                                          />
                                          <span
                                            style={{
                                              padding: "7px",
                                              fontWeight: "600",
                                              fontSize: "14px"
                                            }}
                                          >
                                            F
                                          </span>
                                        </InputGroup>
                                      </Col>
                                    </FormGroup>
                                    <Col lg="12" className={styles.error}>
                                      {warnings.temperature}
                                      {errors.temperature}
                                    </Col>
                                  </Col>
                                  <Col lg="3" xs="6">
                                    <FormGroup row>
                                      <Label
                                        for="respRate"
                                        sm={5}
                                        style={{ paddingTop: "10px" }}
                                      >
                                        Resp Rate
                                      </Label>
                                      <Col sm={6} style={{ padding: "0px" }}>
                                        <InputGroup
                                          className={styles.inputWidth}
                                        >
                                          <Inputtext
                                            style={{
                                              width: "70px",
                                              textAlign: "center"
                                            }}
                                            id="vital-resp"
                                            onChange={e => {
                                              this.commonVitalsChange(
                                                "resprate",
                                                e
                                              );
                                            }}
                                            type="number"
                                            className={styles.inputIncrement}
                                            placeholder="00.0"
                                            name="respRate"
                                          />
                                          <span
                                            style={{
                                              padding: "7px",
                                              fontWeight: "600",
                                              fontSize: "14px"
                                            }}
                                          >
                                            /min
                                          </span>
                                        </InputGroup>
                                      </Col>
                                    </FormGroup>
                                    <Col lg="12" className={styles.error}>
                                      {warnings.resprate}
                                      {errors.resprate}
                                    </Col>
                                  </Col>
                                  <Col lg="3" xs="6">
                                    <FormGroup row>
                                      <Label
                                        for="waist"
                                        sm={6}
                                        style={{ paddingTop: "10px" }}
                                      >
                                        Waist
                                      </Label>
                                      <Col sm={6} style={{ padding: "0px" }}>
                                        <InputGroup
                                          className={styles.inputWidth}
                                        >
                                          <Inputtext
                                            style={{
                                              width: "70px",
                                              textAlign: "center"
                                            }}
                                            id="vital-waist"
                                            onChange={e => {
                                              this.commonVitalsChange(
                                                "waist",
                                                e
                                              );
                                            }}
                                            type="number"
                                            className={styles.inputIncrement}
                                            placeholder="00.0"
                                            name="days"
                                          />
                                          <span
                                            style={{
                                              padding: "7px",
                                              fontWeight: "600",
                                              fontSize: "14px"
                                            }}
                                          >
                                            Cms
                                          </span>
                                        </InputGroup>
                                      </Col>
                                    </FormGroup>
                                    <Col lg="12" className={styles.error}>
                                      {errors.waist}
                                    </Col>
                                  </Col>
                                  <Col lg="2" xs="6">
                                    <FormGroup row>
                                      <Label
                                        for="hip"
                                        sm={6}
                                        style={{ paddingTop: "10px" }}
                                      >
                                        Hip
                                      </Label>
                                      <Col sm={6} style={{ padding: "0px" }}>
                                        <InputGroup
                                          className={styles.inputWidth}
                                        >
                                          <Inputtext
                                            style={{
                                              width: "70px",
                                              textAlign: "center"
                                            }}
                                            onChange={e => {
                                              this.commonVitalsChange("hip", e);
                                            }}
                                            id="vital-hip"
                                            type="number"
                                            className={styles.inputIncrement}
                                            placeholder="00.0"
                                            name="hip"
                                          />
                                          <span
                                            style={{
                                              padding: "7px",
                                              fontWeight: "600",
                                              fontSize: "14px"
                                            }}
                                          >
                                            Cms
                                          </span>
                                        </InputGroup>
                                      </Col>
                                    </FormGroup>
                                    <Col lg="12" className={styles.error}>
                                      {errors.hip}
                                    </Col>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Container>
                        </CardBody>
                      </Card>
                    </Collapse>
                  </div>
                  <div>
                    <div
                      className={styles.collapseTatile}
                      onClick={() => {
                        this.toggle("collapse4", collapse4);
                      }}
                    >
                      <Row>
                        <Col xs="10" md="11" sm="11">
                          <h6>Lab Result </h6>
                        </Col>
                        <Col xs="2" md="1" sm="1" className={styles.closeicon}>
                          <i
                            className={
                              "fa fa-plus " +
                              styles.plus +
                              (collapse4 ? " " + styles.close : "")
                            }
                          />
                        </Col>
                      </Row>
                    </div>
                    <Collapse isOpen={collapse4}>
                      <Card>
                        <CardBody>
                          <Container fluid>
                            <Row>
                              <Col md="6" className={styles.selectFiledMargin}>
                                <SelectList
                                  label={`Lab Test`}
                                  options={originalLabTestList}
                                  placeholder="Select Lab Result"
                                  onChange={this.changeLabResult}
                                  classNamePrefix={styles.test}
                                />
                              </Col>
                            </Row>
                          </Container>
                          <Container
                            fluid
                            style={{
                              borderBottom:
                                specimensList.length > 0 &&
                                  (lineEntryData.labResultDetails &&
                                    lineEntryData.labResultDetails.listOfResults
                                      .length > 0)
                                  ? "0.5px solid #dcdada"
                                  : "unset",
                              marginBottom: "23px"
                            }}
                          >
                            <Row>
                              <Col lg="12">
                                {specimensList &&
                                  specimensList.map((spec, i) =>
                                    <Row key={i}>
                                      <Col lg="3">
                                        <label>Specimen Name</label>
                                        <p>
                                          {spec.label}
                                        </p>
                                      </Col>
                                      <Col
                                        lg="3"
                                        md="6"
                                        className={
                                          styles.dateWidth +
                                          " " +
                                          styles.dateFiledMargin
                                        }
                                      >
                                        <label
                                          dangerouslySetInnerHTML={{
                                            __html: `Date of Collection`
                                          }}
                                        />
                                        <br />
                                        <DatePicker
                                          // selected={}
                                          placeholderText="DD/MM/YYYY"
                                          dateFormat="DD/MM/YYYY"
                                          selected={moment()}
                                          className={styles.databorder}
                                        />
                                      </Col>
                                      <Col lg="3" className={styles.svgBarCode}>
                                        <Barcode
                                          value={
                                            spec.label ? spec.label : spec.id
                                          }
                                        />
                                      </Col>
                                    </Row>
                                  )}
                              </Col>
                            </Row>
                          </Container>
                          {lineEntryData.labResultDetails.listOfResults.map(
                            (indiLab, i) => {
                              return (
                                <Container
                                  fluid
                                  key={indiLab.test_id}
                                  style={{ marginBottom: "5px" }}
                                >
                                  {/* <hr style={{margin: "3px"}}/> */}
                                  <Row>
                                    <Col
                                      lg="3"
                                      md="3"
                                      className={styles.textFiledMargin}
                                    >
                                      <i
                                        className={`${styles.closbtnlab} fa fa-times`}
                                        onClick={() => {
                                          this.removeLabtest(indiLab.test_id);
                                        }}
                                        aria-hidden="true"
                                      />
                                      <label>Lab Test</label>
                                      <p>
                                        {indiLab.test_name}
                                      </p>
                                    </Col>
                                    <Col
                                      lg="3"
                                      md="3"
                                      className={styles.ResultEllipsis}
                                    >
                                      {indiLab.result_type === "number" &&
                                        <Inputtext
                                          label={`Lab Result`}
                                          type="number"
                                          className={styles.inputstyle}
                                          value={indiLab.userData.labResult ? indiLab.userData.labResult : ''}
                                          placeholder="Enter Lab Result"
                                          name="handle"
                                          error={(indiLab.test_name === "Sugar (PoC) (mg/dl) " && indiLab.userData.labResult >= 140) ? 'Suspected Diabetes' : ''}
                                          onChange={e => {
                                            this.labFinalResult(
                                              e,
                                              indiLab.test_id,
                                              i,
                                              indiLab.result_type
                                            );
                                          }}
                                        />}
                                      {indiLab.result_type === "text" &&
                                        <Inputtext
                                          label={`Lab Result`}
                                          type="text"
                                          className={styles.inputstyle}
                                          value={indiLab.userData.labResult ? indiLab.userData.labResult : ''}
                                          placeholder="Enter Lab Result"
                                          name="handle"
                                          onChange={e => {
                                            this.labFinalResult(
                                              e,
                                              indiLab.test_id,
                                              i,
                                              indiLab.result_type
                                            );
                                          }}
                                        />}
                                      {indiLab.result_type === "select" &&
                                        <SelectList
                                          label={`Lab Result`}
                                          onChange={e => {
                                            this.labFinalResult(
                                              e,
                                              indiLab.test_id,
                                              i,
                                              indiLab.result_type
                                            );
                                          }}
                                          value={
                                            indiLab.userData
                                              ? indiLab.userData.labResult
                                                ? optionCreatorFromArray(
                                                  indiLab.optionsForSelect
                                                ).filter(
                                                  val =>
                                                    val.label ===
                                                    indiLab.userData.labResult
                                                )[0]
                                                : ""
                                              : ""
                                          }
                                          options={optionCreatorFromArray(
                                            indiLab.optionsForSelect
                                          )}
                                        />}
                                      <span className={styles.commonError}>
                                        {errors.labResult &&
                                          errors.labResult[i] &&
                                          errors.labResult[i].outcome}
                                      </span>
                                    </Col>
                                    <Col
                                      lg="3"
                                      md="6"
                                      className={
                                        styles.dateWidth +
                                        " " +
                                        styles.dateFiledMargin
                                      }
                                    >
                                      <label
                                        dangerouslySetInnerHTML={{
                                          __html: `Date of Confirmation`
                                        }}
                                      />
                                      <span
                                        style={{
                                          fontWeight: "950",
                                          color: "red"
                                        }}
                                      >
                                        {"*"}
                                      </span>
                                      <br />
                                      <DatePicker
                                        minDate={moment().subtract(30, "days")}
                                        maxDate={moment()}
                                        onChangeRaw={e =>
                                          this.changeLabResultAdmissionDate(
                                            e,
                                            indiLab.test_id,
                                            i
                                          )}
                                        selected={
                                          indiLab.userData.dateOfAdmission
                                            ? indiLab.userData.dateOfAdmission
                                            : moment()
                                        }
                                        onChange={e =>
                                          this.changeLabResultAdmissionDate(
                                            e,
                                            indiLab.test_id,
                                            i
                                          )}
                                        placeholderText="DD/MM/YYYY"
                                        dateFormat="DD/MM/YYYY"
                                        className={classnames(styles.databorder, {
                                          [lineEntryData.labResultDetails[i] ===
                                            undefined ||
                                            lineEntryData.labResultDetails[i]
                                              .userData === undefined ||
                                            lineEntryData.labResultDetails[i]
                                              .userData.timeOfResult
                                            ? "aa"
                                            : styles.apllyGreen]: "correct",
                                          [errors.labResultDetails &&
                                            errors.labResultDetails[i] &&
                                            errors.labResultDetails[i]
                                              .dateOfAdmission
                                            ? styles.errorforDate
                                            : "aaa"]: "asdassad"
                                        })}
                                      />
                                    </Col>
                                    <Col lg="3" md="9">
                                      <Inputtext
                                        label={`Remarks`}
                                        type="text"
                                        className={styles.inputstyle}
                                        placeholder="Enter Lab Result related Comments"
                                        name="handle"
                                        value={indiLab.userData.remarks ? indiLab.userData.remarks : ''}
                                        id={`lab-remarks-${i}`}
                                        onChange={e => {
                                          this.changeLabResultRemarks(
                                            e,
                                            indiLab.test_id
                                          );
                                        }}
                                      />
                                    </Col>
                                  </Row>
                                </Container>
                              )
                            }
                          )}
                        </CardBody>
                      </Card>
                    </Collapse>
                  </div>
                  {/* labresult component end */}

                  {/*  Disease Condition */}
                  <div>
                    <div
                      className={
                        styles.collapseTatile + " " + styles.mobiletitle
                      }
                      onClick={() => {
                        this.toggle("collapse8", collapse8);
                      }}
                    >
                      <Row>
                        <Col xs="10" md="11" sm="11">
                          <h6>
                            {"Disease Condition"}
                            <span
                              style={{
                                fontWeight: 950,
                                color: "red"
                              }}
                            >
                              *
                            </span>
                          </h6>
                        </Col>
                        <Col xs="2" md="1" sm="1" className={styles.closeicon}>
                          <i
                            className={
                              "fa fa-plus " +
                              styles.plus +
                              (collapse8 ? " " + styles.close : "")
                            }
                          />
                        </Col>
                      </Row>
                    </div>
                    <Collapse isOpen={collapse8}>
                      <Card>
                        <CardBody>
                          <Container fluid>
                            <Row style={{ padding: "6px 0px" }}>
                              <Col lg="12">
                                {diseaseConditionString
                                  ? `Services : ${diseaseConditionString}`
                                  : null}
                                <Row>
                                  <Col
                                    lg="3"
                                    className={styles.selectFiledMargin}
                                  >
                                    <SelectList
                                      label={`Disease Condition`}
                                      onChange={this.changeDiseaseCondition}
                                      options={
                                        this.state.lineEntryData.memberData &&
                                          this.state.lineEntryData.memberData
                                            .gender === "M"
                                          ? diagnosisList.filter(
                                            diagn =>
                                              diagn.ser_diag
                                                .disable_for_men === false
                                          )
                                          : diagnosisList
                                      }
                                      value={
                                        lineEntryData.diseaseCondition
                                          ? lineEntryData.diseaseCondition
                                          : null
                                      }
                                      placeholder="Select Disease"
                                      isMulti
                                    />
                                  </Col>
                                  <Col lg="3">
                                    <SelectList
                                      label={`Outcome`}
                                      options={Outcome}
                                      value={
                                        lineEntryData.diagnosisDetails.outcome
                                          ? Outcome.find(
                                            out =>
                                              out.value ===
                                              lineEntryData.diagnosisDetails
                                                .outcome
                                          )
                                          : null
                                      }
                                      onChange={e => {
                                        this.changeOutcome(e);
                                      }}
                                      placeholder="Select Outcome"
                                    />
                                  </Col>
                                  <Col
                                    lg="3"
                                    md="6"
                                    className={
                                      styles.dateWidth +
                                      " " +
                                      styles.dateFiledMargin
                                    }
                                  >
                                    <label
                                      dangerouslySetInnerHTML={{
                                        __html: `Outcome Date `
                                      }}
                                    />
                                    <br />
                                    <DatePicker
                                      minDate={moment().subtract(30, "days")}
                                      maxDate={moment()}
                                      selected={
                                        lineEntryData.diagnosisDetails
                                          .outComeDate
                                          ? lineEntryData.diagnosisDetails
                                            .outComeDate
                                          : null
                                      }
                                      onChange={this.changeOutcomeDate}
                                      placeholderText="DD/MM/YYYY"
                                      dateFormat="DD/MM/YYYY"
                                      className={styles.databorder}
                                    />
                                  </Col>
                                  <Col
                                    lg="3"
                                    hidden={lineEntryData.isInstitutionDisabled}
                                  >
                                    <SelectList
                                      label={`Name of the Institution`}
                                      value={
                                        lineEntryData.referredPhc
                                          ? phcList.filter(
                                            phc =>
                                              lineEntryData.referredPhc
                                                .phc_id === phc.value
                                          )
                                          : null
                                      }
                                      Disabled={
                                        lineEntryData.isInstitutionDisabled
                                      }
                                      placeholder="Select Name of the Institution"
                                      star={"*"}
                                      options={phcList}
                                      onChange={this.changePhcName}
                                      classNamePrefix={styles.test}
                                      className={styles.changedClass}
                                    />
                                    <span
                                      style={{
                                        fontSize: "12px",
                                        color: "red",
                                        paddingLeft: "16px"
                                      }}
                                    >
                                      {errors.referredOutInstitution}
                                    </span>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Container>
                        </CardBody>
                      </Card>
                    </Collapse>
                  </div>
                  {/* Condition end */}
                  {/*  Drug */}
                  <div>
                    <div
                      className={
                        styles.collapseTatile + " " + styles.mobiletitle
                      }
                      onClick={() => {
                        this.toggle("collapse9", collapse9);
                      }}
                    >
                      <Row>
                        <Col xs="10" md="11" sm="11">
                          <h6>
                            {"Drugs and Advice"}
                          </h6>
                        </Col>
                        <Col xs="2" md="1" sm="1" className={styles.closeicon}>
                          <i
                            className={
                              "fa fa-plus " +
                              styles.plus +
                              (collapse9 ? " " + styles.close : "")
                            }
                          />
                        </Col>
                      </Row>
                    </div>

                    <Collapse isOpen={collapse9}>
                      <Card>
                        <CardBody>
                          <Container fluid>
                            <Row style={{ padding: "8px 0px" }}>
                              <Col lg="12">
                                <Row>
                                  <Col
                                    lg="6"
                                    className={styles.selectFiledMargin}
                                  >
                                    <SelectList
                                      label={`Drug Name`}
                                      options={drugsListOpt}
                                      onChange={this.updateDrug}
                                      placeholder="Select Drug"
                                      name="district"
                                      value={
                                        lineEntryData.drugsList
                                          ? lineEntryData.drugsList
                                          : null
                                      }
                                      isMulti
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              {drugsList &&
                                drugsList.length > 0 &&
                                <Col lg="12">
                                  <Row>
                                    <Col lg="4">
                                      Drug Name&nbsp;(Strength,Type)
                                    </Col>
                                    <Col lg="3">Frequency</Col>
                                    <Col lg="2">No. Of Days</Col>
                                    <Col lg="1">Quantity</Col>
                                  </Row>
                                </Col>}
                              {drugsList &&
                                drugsList.map((drug, i) =>
                                  <Col lg="12" key={i}>
                                    <hr style={{ margin: "6px" }} />
                                    <Row>
                                      <Col lg="4">
                                        <p>
                                          {drug.label}
                                          &nbsp; ({drug.strength},
                                          {drug.type})
                                        </p>
                                      </Col>
                                      <Col lg="3">
                                        <SelectList
                                          // label={`Frequency`}
                                          showDummy={false}
                                          onChange={e => {
                                            this.NEW_changeDrugFrequency(
                                              e,
                                              drug,
                                              drugsList
                                            );
                                          }}
                                          options={Dosage}
                                          value={Dosage.filter(
                                            dose =>
                                              dose.label ===
                                              (drug.dosage_value
                                                ? drug.dosage_value
                                                : drug.dosageValue)
                                          )}
                                          placeholder="Select Dosage"
                                          name="district"
                                        />
                                        <span className={styles.commonError}>
                                          {errors.drugsList &&
                                            errors.drugsList[i] &&
                                            errors.drugsList[i].dosageValue}
                                        </span>
                                      </Col>
                                      <Col lg="2">
                                        <Inputtext
                                          type="number"
                                          className={styles.inputstyle}
                                          placeholder="Days"
                                          value={
                                            drug.drug
                                              ? drug.drug.days
                                              : drug.days
                                          }
                                          onChange={e => {
                                            this.NEW_changeDrugQuantity(
                                              e,
                                              drug,
                                              drugsList
                                            );
                                          }}
                                        />
                                        <span className={styles.commonError}>
                                          {errors.drugsList &&
                                            errors.drugsList[i] &&
                                            errors.drugsList[i].days}
                                        </span>
                                      </Col>
                                      <Col lg="1">
                                        <Inputtext
                                          // label={`Quantity`}
                                          disabled={true}
                                          value={
                                            drug.drug
                                              ? drug.drug.quantity
                                              : drug.quantity
                                          }
                                          type="number"
                                          className={styles.inputstyle}
                                        />
                                      </Col>
                                    </Row>
                                  </Col>
                                )}
                              <Col lg="6">
                                <SelectList
                                  label={`Advice`}
                                  onChange={this.changeGeneralRemarks}
                                  options={remarksCustomOptions}
                                  value={lineEntryData.remarks}
                                  placeholder="Enter advices"
                                  isMulti
                                />
                                {/* <br /> */}
                              </Col>
                              {/* eslint-disable-next-line */}
                              {lineEntryData.remarks
                                ? lineEntryData.remarks.filter(
                                  _ => _.name === "Others"
                                ).length > 0
                                  ? <Col lg="6">
                                    <Inputtext
                                      label="Other Advices"
                                      placeholder="Enter other advices"
                                      type="text"
                                      onChange={e => {
                                        // eslint-disable-next-line
                                        lineEntryData.remarks.map(_ => {
                                          if (_.name === "Others") {
                                            _.value = e.target.value;
                                          }
                                        });
                                        this.setState({ lineEntryData });
                                      }}
                                      className={styles.inputstyle}
                                    />
                                  </Col>
                                  : ""
                                : ""}
                            </Row>
                            <Row>
                              <Col lg="6">
                                <Inputtext
                                  label="Remarks"
                                  placeholder="Enter Remarks"
                                  type="textarea"
                                  ref={this.generalRemarksRef}
                                  onChange={this.changeRemarksGeneral}
                                  className={styles.inputstyle}
                                />
                                <br />
                              </Col>
                            </Row>
                          </Container>
                        </CardBody>
                      </Card>
                    </Collapse>
                  </div>
                  {/* Drug end */}
                  <Container>
                    <Row>
                      <Col lg="12" style={{ marginBottom: "50px" }}>
                        {// FROM Listcontent
                          this.props.history.location.state
                            ? !this.props.history.location.state.disableForm
                              ? <Button
                                className={styles.btnbgset}
                                onClick={() => this.submitForm()}
                                disabled={isFormSubmitted}
                              >
                                Save & Submit
                              </Button>
                              : ""
                            : <Button
                              className={styles.btnbgset}
                              onClick={() => this.submitForm()}
                              disabled={isFormSubmitted}
                            >
                              Save & Submit
                            </Button>}
                      </Col>
                    </Row>
                  </Container>
                </Container>
              </Col>
            </Row>
            <Button
              onClick={this.upClick}
              id={"upBtn"}
              className={styles.upBtn}
            >
              <i className="fa fa-chevron-up" />
            </Button>
          </Container>}
      </ApolloConsumer>
    );
  }
}

DSUEntryContent.propTypes = {
  getEntryPageLang: PropTypes.func.isRequired,
  language: PropTypes.object.isRequired,
  saveLineEntry: PropTypes.func.isRequired,
  fetchFamilyMemberList: PropTypes.func.isRequired,
  emptyDispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {

  return {
    auth: state.auth,
    errors: state.errors,
    language: state.language,
    successMessage: state.successMessage,
    lineEntrylist: state.lineEntrylist,
    commonLoading: state.commonLoading,
  }
};

export default connect(mapStateToProps, {
  getEntryPageLang,
  saveLineEntry,
  fetchFamilyMemberList,
  emptyDispatch,
  emptyErrors,
  populationNotLoading: () => dispatch => {
    dispatch({
      type: PATIENT_LIST_LOADING,
      payload: true
    });
  }
})(withRouter(withApollo(withAlert(DSUEntryContent))));