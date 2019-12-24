import axios from 'axios';
import { customRequestToMaster } from '../../../utils/Request';
import CustomQueries from "../../../queries/MasterRegistry";
import { districtList } from "../../../utils/Common";
import { deleteData } from '../../../indexeDB/deleteData';
import config from "../../../config"; 

export const lineEntryAction = async (lineEntry, isMemberCreate, districtId, offlineAction) => {
    if (lineEntry.isHeNewUser) {
        let memberData = {};
        let userData = {};
        if (isMemberCreate) {
            memberData = {
                ...lineEntry.memberData,
                headId: lineEntry.memberData.headId,
                memberEngName: lineEntry.patientDetails.patientName,
                memberName: lineEntry.patientDetails.patientTamilName ? lineEntry.patientDetails.patientTamilName : lineEntry.patientDetails.patientName,
                createdAtMr: false,
                age: Number(lineEntry.patientDetails.age),
                gender: lineEntry.patientDetails.gender,
                aadharCard: lineEntry.memberData.aadharCard,
                mobileNo: lineEntry.memberData.mobileNo
            }
        } else {
            userData = {
                cardNumber: null,
                addressLine: lineEntry.patientDetails.addressLine ? lineEntry.patientDetails.addressLine : null,
                lattitude: null,
                longitude: null,
                shopCode: null,
                dateOfBirth: null,
                relationship: null,
                hudId: lineEntry.addressDetails.permanentAddress.street ? lineEntry.addressDetails.permanentAddress.street.hudId : (lineEntry.addressDetails.permanentAddress.village ? lineEntry.addressDetails.permanentAddress.village[0].hudId : null),
                blockId: lineEntry.addressDetails.permanentAddress.street ? lineEntry.addressDetails.permanentAddress.street.blockId : (lineEntry.addressDetails.permanentAddress.village ? lineEntry.addressDetails.permanentAddress.village[0].blockId : null),
                phcId: lineEntry.addressDetails.permanentAddress.street ? lineEntry.addressDetails.permanentAddress.street.phcId : (lineEntry.addressDetails.permanentAddress.village ? lineEntry.addressDetails.permanentAddress.village[0].phcId : null),
                hscId: lineEntry.addressDetails.permanentAddress.street ? lineEntry.addressDetails.permanentAddress.street.hscId : (lineEntry.addressDetails.permanentAddress.village ? lineEntry.addressDetails.permanentAddress.village[0].hscId : null),
                villageId: lineEntry.addressDetails.permanentAddress.street ? lineEntry.addressDetails.permanentAddress.street.villageId : (lineEntry.addressDetails.permanentAddress.village ? lineEntry.addressDetails.permanentAddress.village[0].villageId : null),
                habitationId: lineEntry.addressDetails.permanentAddress.street ? lineEntry.addressDetails.permanentAddress.street.habitationId : null,
                headEngName: lineEntry.patientDetails.patientName,
                headName: lineEntry.patientDetails.patientTamilName
                    ? lineEntry.patientDetails.patientTamilName
                    : lineEntry.patientDetails.patientName,
                createdAtMr: false,
                age: Number(lineEntry.patientDetails.age),
                gender: lineEntry.patientDetails.gender,
                country_id: lineEntry.addressDetails.permanentAddress.country,
                state_id: lineEntry.addressDetails.permanentAddress.state,
                district_id: lineEntry.addressDetails.permanentAddress.district,
                aadharCard: lineEntry.memberData.aadharCard,
                mobileNo: lineEntry.memberData.mobileNo
            };
        }

        // FIXME: To insert if master head
        let headId;
        let memberId;
        if (navigator.onLine) {
            let data = await customRequestToMaster((isMemberCreate ? CustomQueries.createPopulationMember() : CustomQueries.createPopulationHead()), (isMemberCreate === true ? memberData : userData))
            if (isMemberCreate) {
                memberId = data.createPopulationMember.populationMember.memberId;
                lineEntry.memberData = {
                    ...data.createPopulationMember.populationMember,
                    type: "member"
                };
            } else {
                headId = data.createPopulationHead.populationHead.headId;
                lineEntry.memberData = {
                    ...data.createPopulationHead.populationHead,
                    type: "head"
                };
            }
            // const insertData = isMemberCreate ? { ...memberData, memberId } : { ...userData, headId };
            if (districtList.includes(districtId)) {
                if (isMemberCreate === true) {
                    memberData.memberId = memberId;
                    console.info('MEMBERDATA', memberData, userData)
                    await customRequestToMaster(CustomQueries.createPopulationMemberDistrict(districtId), memberData)
                        .then(data => {
                            lineEntry.memberData = {
                                ...data[`createPopulationMembers${districtId}`][`populationMembers${districtId}`],
                                type: "member"
                            };
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else {
                    userData.headId = headId;
                    await customRequestToMaster(CustomQueries.createPopulationHeadDistrict(districtId), userData)
                        .then(data => {
                            lineEntry.memberData = {
                                ...data[`createPopulationHeads${districtId}`][`populationHeads${districtId}`],
                                type: "head"
                            };
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            }
            let entrymemberData = isMemberCreate === true ? memberData : userData
            lineEntry.memberData = {
                ...lineEntry.memberData,
                aadharCard: entrymemberData.aadharCard,
                mobileNo: entrymemberData.mobileNo,
                name: lineEntry.patientDetails.patientName,
                engName: lineEntry.patientDetails.patientTamilName ? lineEntry.patientDetails.patientTamilName : lineEntry.patientDetails.patientName
            }
        }
    } else {
        if (lineEntry.memberData) {
            if (lineEntry.memberData.mobileNo || lineEntry.memberData.aadharCard) {
                const userData = {
                    member_id: Number(lineEntry.memberData.memberId),
                    mobile_no: lineEntry.memberData.mobileNo ? lineEntry.memberData.mobileNo : null,
                    aadhar_no: lineEntry.memberData.aadharCard ? lineEntry.memberData.aadharCard : null,
                    head_id: Number(lineEntry.memberData.headId)
                };
                if (!navigator.onLine) {
                    // TODO: update data memberData in population / head
                } else {
                    await customRequestToMaster(
                        CustomQueries[lineEntry.memberData.type === "head" ? "updatePopulationHead" : "updateUserData"],
                        userData
                    ).catch(err => {
                    });

                    if (districtList.includes(districtId)) {
                        let query = lineEntry.memberData.type === "head" ? CustomQueries.updatePopulationHeadDistrictId(districtId) : CustomQueries.updateUserDataDistrictId(districtId)
                        await customRequestToMaster(query, userData).catch(err => {
                        });
                    }
                }
            }
        }
    }
    let result = false;
    if(navigator.onLine){
        await axios
            .post(`${config.apiURL}/api/${lineEntry.type === "edit" ? "lineEntry/update" : "lineEntry"}`, { lineEntry })
            .then(async (res) => {
                if (offlineAction) {
                    let deleteId = lineEntry.entry_id ? lineEntry.entry_id : lineEntry.id_number;
                    await deleteData('newOfflineEntry', deleteId)
                }
                result = true;
            })
            .catch(err => {
                result = false;
                alert(err);
            });
    }else{
        result =  true;
    }

    return result;
}