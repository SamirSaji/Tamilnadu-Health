import moment from "moment";
import _ from "underscore";
import { isNumber, isArray } from "util";
export const getFullGender = gender => {
  switch (gender) {
    case "M":
      return "Male";
    case "F":
      return "Female";
    case "T":
      return "Transgender";
    default:
      return "";
  }
};

export const jwt_decode = (token) => {  
  if(token){
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } else {
    return null
  }
}

//export const districtList = [16, 31, 21, 22, 26, 27, 18, 19, 5, 3, 7, 25]
export const districtList = [16, 31, 21, 22, 26, 27, 18, 19, 5, 3, 4, 8, 30, 2, 1, 32, 24, 9, 17, 23, 11, 15, 6, 29, 28, 12, 13, 10, 20, 14, 7, 25]

export const remarksOptions = [
  { label: 'Dressing', value: 'Dressing' },
  { label: 'Hand Washing', value: 'Hand Washing' },
  { label: 'Life Style Modifications', value: 'Life Style Modifications' },
  { label: 'Exercise', value: 'Exercise' },
  { label: 'Walking', value: 'Walking' },
  { label: 'No or low sugar', value: 'No or low sugar' },
  { label: 'Salt restricted diet', value: 'Salt restricted diet' },
  { label: 'No or low fat/oily food', value: 'No or low fat/oily food' },
  { label: 'Avoid alcohol', value: 'Avoid alcohol' },
  { label: 'Avoid tobacco', value: 'Avoid tobacco' },
  { label: 'Drug adherence counselling', value: 'Drug adherence counselling' },
  { label: 'Salt water Gargling', value: 'Salt water Gargling' },
  { label: 'Cough Etiquette', value: 'Cough Etiquette' },
  { label: 'Personal Hygiene', value: 'Personal Hygiene' },
  { label: 'Social Distancing', value: 'Social Distancing' },
  { label: 'Danger Signs Counselling', value: 'Danger Signs Counselling' },
  { label: 'Family Counselling', value: 'Family Counselling' },
  { label: 'Review Advice', value: 'Review Advice' },
  { label: 'Balanced Diet Advice', value: 'Balanced Diet Advice' },
  { label: 'Plenty of fluids', value: 'Plenty of fluids' },
  { label: 'Adequate Sleep', value: 'Adequate Sleep' },
  { label: 'Antenatal Visit Advice', value: 'Antenatal Visit Advice' },
  { label: 'Postnatal Visit Advice', value: 'Postnatal Visit Advice' },
  { label: 'Breast feeding Counselling', value: 'Breast feeding Counselling' },
  { label: 'Delivery Signs Counselling', value: 'Delivery Signs Counselling' },
  { label: 'Wound washing', value: 'Wound washing' },
  { label: 'Wound care', value: 'Wound care' },
  { label: 'Referral compliance', value: 'Referral compliance' },
  { label: 'Yoga', value: 'Yoga' },
  { label: 'Other wellness advice', value: 'Other wellness advice' },
  { label: 'Others', value: 'Others' },
]

export const commonTextLimiter = (array, n) =>
  `${array.toString().slice(0, n)} ${array.toString().length > n ? "..." : ""}`;
export const optionFinder = (options, value) => {
  if (value === null) {
    return null;
  }
  let custom = value.split(",");
  let myOptions = custom.map((indi, i) => {
    return options.filter(opt => opt.value === indi)[0];
  });
  return myOptions;
};

export const TrueOrFalse = type => {
  switch (type) {
    case true:
      return "Yes";
    case false:
      return "NO";
    case "true":
      return "Yes";
    case "false":
      return "No";
    default:
      return type;
  }
};

export const getReadableDateFormat1 = currentTime => {
  return isNaN(Number(currentTime)) ? moment(currentTime).format("DD/MM/YYYY") : moment.unix(currentTime / 1000).format("DD/MM/YYYY");
};

export const commonArrayCreatorForSelect = (props, value, label) => {
  return (Array.isArray(props) && props.length > 0) ? props.map(iteratee => ({
    ...iteratee,
    value: iteratee[value],
    label: iteratee[label]
  })) : [] ;
};

export function findPos(obj) {
  var curtop = 0;
  if (obj.offsetParent) {
    do {
      curtop += obj.offsetTop;
      // eslint-disable-next-line
    } while (obj = obj.offsetParent);
    return [curtop];
  }
}

export const commonArrayCreatorForSelectForPopulation = (
  props,
  value,
  label,
  viewRelationShip = false
) => {
  return props.map(iteratee => {
    return {
      ...iteratee,
      label:
        iteratee[label] +
        (iteratee["engName"] ? ` ( ${iteratee["engName"]} )\n` : "") +
        (iteratee["age"] ? ` , ${iteratee["age"]}` : "") +
        (iteratee["gender"] ? ` / ${getFullGender(iteratee["gender"])} ` : "") +
        (viewRelationShip && iteratee["relationship"]
          ? ` , ${iteratee["relationship"]}`
          : "") +
        (iteratee["type"] === "head" ? `(குடும்ப தலைவர்)` : "") +
        (iteratee["habitationsMasterByHabitationId"] &&
          iteratee["habitationsMasterByHabitationId"].habitationName
          ? `, ${iteratee["habitationsMasterByHabitationId"].habitationName}`
          : "") +
        (iteratee["villagesMasterByVillageId"] &&
          iteratee["villagesMasterByVillageId"].villageName
          ? `, ${iteratee["villagesMasterByVillageId"].villageName}`
          : "") +
        (iteratee["addressLine"] ? ` , ${iteratee["addressLine"]}` : "") +
        (iteratee["type"] !== "head" ? iteratee[`populationHeads${iteratee.districtId}ByHeadId`] ? iteratee[`populationHeads${iteratee.districtId}ByHeadId`].addressLine ? iteratee[`populationHeads${iteratee.districtId}ByHeadId`].addressLine : '' : '' : ''),
      value: iteratee[value]
    };
  });
};

export const optionCreatorFromArray = array =>
  array.map((indi, i) => {
    return {
      value: indi,
      label: indi
    };
  });

export const validateEmail = email => {
  // eslint-disable-next-line
  const exp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return exp.test(String(email).toLowerCase());
};

export const generateHash = (num = 6) => {
  let text = "";
  const possible = "0123456789";

  for (var i = 0; i < num; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

export const capitalizeFirstLetter = string =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const twoDigitMonth = month => {
  return month < 10 ? "0" + month : "" + month;
};

export const commonSortBy = (objs, value = "label") => _.sortBy(objs, value);

export const numToString = val =>
  typeof val === "object" ? val.map(value => value.toString()) : val.toString();

export const entryListMapper = (entry, memberData, patient_diagnos_entry) => {
  memberData = memberData ? memberData : {};
  return {
  visit_id: entry.id_number,
  user_pds_line: {
    ...memberData,
    name: `${memberData.engName ? memberData.engName : memberData.headEngName ? memberData.headEngName : memberData.memberEngName ? memberData.memberEngName :  ""}/${memberData.name ? memberData.name : memberData.headName ? memberData.headName : memberData.memberName ? memberData.memberName : ''}`,
    aadhar_no: memberData.aadharCard,
    mobileno: memberData.mobileNo,
    constructed_address: memberData.addressLine,
    address2: ''
  },
  patient_diagnos_entry,
  visit_date: entry.visitDate,
  phc_id: entry.referredPhc ? entry.referredPhc.phc_id : null,
  outcome: entry.diagnosisDetails.outcome,
  outcome_date: entry.diagnosisDetails.outComeDate,
  isCompleteOffline: true
}}


export const entryMapperUpsync = (entry, memberData) => ({

})