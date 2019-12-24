import { request } from "graphql-request";
import { apiURL } from '../config';
// import { getDataFromIndexedDB } from '../indexeDB/getData';
import { offlineEntryList } from './offlineAction';
import { LINE_LIST_DATA } from './types';

const lineListRequest = (filters = {}, phc_masters = null, auth = {}) => async dispatch => {
  const CurrentUser = auth.user
  let myCustomQuery = `
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
        phc_id:${phc_masters ? phc_masters.phc_id : null},
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
      lineListNew(
        offset:${filters.offset},
        limit:${filters.limit},
        phc_id:${phc_masters ? phc_masters.phc_id : null},
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
        id
        entry_id
        visit_date
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
      `;
  if (navigator.onLine) {
    request(`${apiURL}/graphql`, myCustomQuery, filters)
      .then(res => {
        dispatch({
          type: LINE_LIST_DATA,
          payload: res
        });
      }).catch(err => {
        console.log(err);
      })
  } else {
    let linelist = await offlineEntryList();
    // linelist = linelist
    let arr = [];
    for (let i = filters.offset; i < linelist.length; i++) {
      if (i < filters.offset + filters.limit || (filters.searchText && filters.searchText !== "")) {
        if (filters.searchText) {
          let userDetails = linelist[i].user_pds_line;
          let textsearch = filters.searchText.trim();
          textsearch = textsearch.toLocaleLowerCase();
          let userName = userDetails.name ? userDetails.name.toLocaleLowerCase() : "";
          let userMobileNo = userDetails.mobileno ? userDetails.mobileno.toLocaleLowerCase() : "";
          let userAadharNo = userDetails.aadhar_no ? userDetails.aadhar_no.toLocaleLowerCase() : "";
          if ((userDetails.name && userName.includes(textsearch)) || (userDetails.mobileno && userMobileNo.includes(textsearch)) || (userDetails.aadhar_no && userAadharNo.includes(textsearch))) {
            arr.push(linelist[i])
          }
        } else {
          arr.push(linelist[i])
        }
      } else {
        break;
      }
    }
    let copylist = Object.assign(arr, []);
    const lineListNew = arr.length > 0 ? (filters.searchText && filters.searchText !== "") ? copylist.slice(0, filters.limit) : arr : [], lineListCount = (filters.searchText && filters.searchText !== "") ? arr.length : linelist ? linelist.length : 0;
    // const totalResults = lineListCount ? lineListCount : 0;
    dispatch({
      type: LINE_LIST_DATA,
      payload: {
        lineListNew,
        lineListCount
      }
    });
  }
}



export {
  lineListRequest
}