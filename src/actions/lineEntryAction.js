import { GET_ERRORS, LINEENTRY_SUCCESS, FETCH_FAMILY_MEMBER_LIST, PATIENT_LIST_LOADING } from "./types";
import config from "../config";
// import axios from "axios";
import { numToString, findPos } from "../utils/Common";
import underscore from "underscore";
// import CustomQueries from "../queries/MasterRegistry";
import { customRequestToMaster } from "../utils/Request";
import { getFamilyMembers, saveEntryOffline, updateEntryOffline } from "./offlineAction";
import { request } from "graphql-request";
import { drugReportQuery } from "../queries/offlineDataQuery";
import { drugReportData } from "../utils/writeToOffline";
import { lineEntryAction } from '../components/common/functions/lineentryFunctions';

export const saveLineEntry = (lineEntry, pageType, districtId, user) => async dispatch => {
	let errors = {
		commonMessage: null,
		drugsList: [],
		labResult: []
	};
	const { alias, user_id } = user;
	const isMemberCreate = lineEntry.memberData && lineEntry.memberData.isNewMember && lineEntry.memberData.isNewMember === true;
	// make sure to place them in correct order. Do the validation from ending. So the top error message is given the
	// most important priority and sent in the error object as commonMessage;

	// drug section validation
	console.info('lineEntry--', lineEntry);
	if (lineEntry.drugsList && lineEntry.drugsList.length > 0) {
		// eslint-disable-next-line
		lineEntry.drugsList.map((druggie, i) => {
			console.info('DRUGGIE--', druggie);
			if (!druggie.dosage_value && !druggie.dosageValue) {
				errors.drugsList[i] = {
					...errors.drugsList[i],
					dosageValue: "Please select a dosage"
				};
				errors.commonMessage = "Please fill drug section";
			}
			if (!druggie.days) {
				errors.drugsList[i] = {
					...errors.drugsList[i],
					days: "Please enter no. of days"
				};
				errors.commonMessage = "Please fill drug section";
			}
		});
	}
	// institution selection validtion
	if (lineEntry.diagnosisDetails.outcome === "Referred Out") {
		if (!lineEntry.referredPhc) {
			errors.referredOutInstitution = "Please select an institution";
			errors.commonMessage = "Please select the institution you are referring to";
		}
	}
	// lab results section validtion
	if (lineEntry.labResultDetails.listOfResults && lineEntry.labResultDetails.listOfResults.length > 0) {
		// eslint-disable-next-line
		lineEntry.labResultDetails.listOfResults.map((labbie, i) => {
			if (!labbie.userData.labResult) {
				// eslint-disable-next-line
				(errors.commonMessage = "Please fill lab section"),
					(errors.labResult[i] = {
						...errors.labResult[i],
						outcome: "Please enter your outcome"
					});
			}
		});
	}
	// vitals section validation
	// eslint-disable-next-line
	Object.keys(lineEntry.vitalsDef).map((value, i) => {
		// console.info('AGE',lineEntry.memberData.age);
		let vitalsList = ["weight", "pulse"];
		// lineEntry.memberData.age = 5
		if (lineEntry.memberData.age > 5) {
			vitalsList = vitalsList.concat("bloodPressureDown", "bloodPressureUp");
		}
		if (vitalsList.includes(value)) {
			if (lineEntry.vitalsDef[value] === null) {
				errors[value] = `Please enter a valid ${value}`;
				errors.commonMessage = "Please enter vitals section";
			}
		}
	});

	if (!lineEntry.diseaseCondition) {
		errors.diseaseCondition = 'Please select a disease condition';
		errors.commonMessage = 'Please select a disease condition';
	} else if (lineEntry.diseaseCondition.length === 0) {
		errors.diseaseCondition = 'Please select a disease condition';
		errors.commonMessage = 'Please select a disease condition';
	}

	if (
		lineEntry.vitalsDef["bloodPressureUp"] > 0 &&
		lineEntry.vitalsDef["bloodPressureDown"] > 0 &&
		Number(lineEntry.vitalsDef["bloodPressureUp"]) <= Number(lineEntry.vitalsDef["bloodPressureDown"])
	) {
		errors.bloodPressureValidation = "BP Sys has to be higher than BP Dia";
	}
	if (pageType === "newVisit") {
		lineEntry.memberData = {
			type: lineEntry.newVisitMemberData.type
		};
		lineEntry.memberData[`${lineEntry.memberData.type}Id`] = lineEntry.newVisitMemberData.master_registry_user_id;
	} else if (pageType !== "edit") {
		if (!lineEntry.memberData.nodeId) {
			if (lineEntry.isHeNewUser === false) {
				// all validations here
				errors.isUserFilled = "Please fill user details";
				errors.commonMessage = "Please fill user section";
			} else {
				if (lineEntry.addressDetails.permanentAddress.village && lineEntry.addressDetails.permanentAddress.village.length > 1) {
					errors.village = "Please select only one village";
					errors.commonMessage = "Please fill user section";
				}
				// for manual validation
				if (!lineEntry.patientDetails.patientName) {
					errors.patientName = "Please enter patient name";
					errors.commonMessage = "Please fill user section";
				}
				if (!lineEntry.patientDetails.patientTamilName) {
					errors.patientTamilName = "Please enter tamil name";
					errors.commonMessage = "Please fill user section";
				}
				if (!lineEntry.patientDetails.age) {
					errors.age = "Please enter a valid age";
					errors.commonMessage = "Please fill user section";
				}
				if (!lineEntry.patientDetails.gender) {
					errors.gender = "Please select a gender";
					errors.commonMessage = "Please fill user section";
				}
			}
		} else {
		}
	}
	if (errors.commonMessage === null) {
		errors = {};
		dispatch({
			type: GET_ERRORS,
			payload: errors
		});
		let result = await lineEntryAction(lineEntry, isMemberCreate, districtId, false);
		if (navigator.onLine) {
			if (result) {
				dispatch({
					type: LINEENTRY_SUCCESS,
					payload: {
						message: "Successfully Saved",
						status: 200
					}
				});
				const qry = drugReportQuery(user_id, alias);
				request(`${config.apiURL}/graphql`, qry)
					.then(data => drugReportData(data))
					.catch(() => console.info('ERROR UPDATING REPORT'));
			} else {
				dispatch({
					type: LINEENTRY_SUCCESS,
					payload: {
						status: 500,
						message: "There was a problem in saving your data."
					}
				});
			}
		} else {
			let status;
			if (lineEntry.type === "edit") {
				if (lineEntry.syncedOnline === undefined) lineEntry.type = "create";
				status = updateEntryOffline(lineEntry)
			} else {
				status = await saveEntryOffline(lineEntry)
			}
			if (status) {
				dispatch({
					type: LINEENTRY_SUCCESS,
					payload: {
						message: "Successfully Saved Offline",
						status: 200
					}
				});
			} else {
				dispatch({
					type: GET_ERRORS,
					payload: { status: 'Error Saving offline' }
				});
			}
			return;
		}

	} else {
		scrollToError(errors);

		dispatch({
			type: GET_ERRORS,
			payload: errors
		});
	}
};

const scrollToError = errors => {
	if (errors.weight || errors.pulse || errors.bloodPressureUp || errors.bloodPressureDown) {
		if (document.getElementById("weightField"))
			window.scroll({
				top: findPos(document.getElementById("weightField")) - 200,
				behavior: "smooth"
			});
	}
	if (errors.isUserFilled !== undefined) {
		if (document.getElementById("userDataFilled"))
			window.scroll({
				top: findPos(document.getElementById("userDataFilled")) - 200,
				behavior: "smooth"
			});
	}
};

export const fetchFamilyMemberList = (e, changes, district_id = '') => async dispatch => {

	dispatch({
		type: PATIENT_LIST_LOADING,
		payload: true
	});
	let query = ``;
	let memberNode = ` nodeId districtId memberId age gender headId memberName memberEngName habitationsMasterByHabitationId{ habitationName } villagesMasterByVillageId{ villageName villageId }`;
	let headNode = ` nodeId districtId headId addressLine headName age gender headEngName  habitationsMasterByHabitationId{ habitationName } villagesMasterByVillageId{ villageName villageId }`;
	// if(typeof e === 'string') {
	let districtParam = ``;
	let villageParam = ``;
	let streetParam = ``;
	let searchTextParam = ``;
	if (changes.masterRegData.district_id || changes.masterRegData.district_id.length > 0) {
		districtParam += ` districtId :${changes.masterRegData.district_id}`;
	}
	if (changes.masterRegData.village_id && changes.masterRegData.village_id.length > 0) {
		villageParam += ` villageId :{ in : [${changes.masterRegData.village_id.map(_ => (`"` + _.value + `"`))}] }`;
	}
	if (changes.masterRegData.street_id && changes.masterRegData.street_id.length > 0) {
		streetParam += ` streetId :{ in :["${numToString(changes.masterRegData.street_id)}"]}`;
	}
	if (e) {
		searchTextParam = `_search: {matches: "*${e}"}`;
	}
	if (changes.masterRegData.fetchInitialSet && !searchTextParam) {
		query = `{
      byEnglishMember: allPopulationMembers${district_id ? district_id + "S" : ''}(first : 100 ,
        condition:{
          ${districtParam}
        }
        filter: {or: { headId:{ isNull: false }    }}) {
        nodes {
          ${memberNode}
          populationHead${district_id ? 's' + district_id : ''}ByHeadId{
            addressLine
          }
        }
      }
      byEnglishHead: allPopulationHeads${district_id ? district_id + "S" : ''}(first : 100 ,
        condition:{
          ${districtParam}
        }
        filter: {or: { headId:{ isNull: false }   }}) {
        nodes {
          ${headNode}
        }
      }
    }`;
	} else {
		e = e ? e : "aa*";
		query = `{
      byEnglishMember: allPopulationMembers${district_id ? district_id + "S" : ''}(first : 100 , 
        condition:{
          ${districtParam}
        }
        filter: {or: { ${searchTextParam}  headId:{ isNull: false } ${villageParam} ${streetParam} }}) {
        nodes {
          ${memberNode}
          populationHead${district_id ? 's' + district_id : ''}ByHeadId{
            addressLine
          }
        }
      }
      byEnglishHead: allPopulationHeads${district_id ? district_id + "S" : ''}(first : 100 ,
        condition:{
          ${districtParam}
        }
        filter: {or: { ${searchTextParam} headId:{ isNull: false } ${villageParam} ${streetParam} }}) {
        nodes {
          ${headNode}
        }
      }
    }`;
	}

	const handleResponse = (res) => {
		const { byEnglishHead, byEnglishMember } = res;
		let memberList = [];
		let headList = [];
		// eslint-disable-next-line
		byEnglishMember &&
			byEnglishMember.nodes.map((englishMember, i) => {
				memberList.push(englishMember);
			});
		// eslint-disable-next-line
		byEnglishHead &&
			byEnglishHead.nodes.map((englishHead, i) => {
				headList.push(englishHead);
			});
		// eslint-disable-next-line
		let finalList = headList.map(head => {
			return {
				...head,
				type: "head",
				name: head.headName,
				engName: head.headEngName,
				id: head.headId
			};
		});
		memberList.map(member =>
			finalList.push({
				...member,
				type: "member",
				name: member.memberName,
				engName: member.memberEngName,
				id: member.headId
			})
		);
		finalList = underscore.uniq(finalList, true, person => {
			return person.nodeId;
		});

		dispatch({
			type: FETCH_FAMILY_MEMBER_LIST,
			payload: finalList
		});
		dispatch({
			type: PATIENT_LIST_LOADING,
			payload: false
		});
	}


	if (navigator.onLine) {
		// let a = getFamilyMembers(e, changes)
		customRequestToMaster(`${query}`)
			.then(handleResponse)
			.catch(err => { });
		return;
	} else {
		const response = await getFamilyMembers(e, changes);
		handleResponse(response);
		return;
	}

};

export const emptyDispatch = (dispatchType, payloadMethod) => dispatch => {
	let method = payloadMethod ? payloadMethod : []
	dispatch({
		type: dispatchType,
		payload: method
	});
};




// export default lineEntrySaveData = async () => {

// }