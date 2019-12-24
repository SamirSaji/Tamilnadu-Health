import React, { Component } from 'react';
import { customRequestToMaster } from '../../../utils/Request';
import { getMemberDetails } from '../../../actions/offlineAction';
import { withRouter } from 'react-router-dom';
import { getDataFromkey } from '../../../indexeDB/getData';
import { from } from 'zen-observable';
class profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileData: null
    };
  }

  getProfileDataFromMaster = () => {
    let query = `query($headId:Int!){
        populationHeadByHeadId(headId:$headId){
          headName
          headEngName
          relationship
          aadharCard
          mobileNo
          age
          gender
          addressLine
          villageId
          districtsMasterByDistrictId{
            districtName
          }
          villagesMasterByVillageId{
            villageName
          }
          habitationsMasterByHabitationId{
            habitationName
          }
          streetsMasterByStreetId{
            streetName
          }
        }
      }`;
    let memberQuery = `
    query($memberId:Int!){
      populationMemberByMemberId(memberId:$memberId){
        memberName
        memberEngName
        relationship
        age
        aadharCard
        mobileNo
        gender
        villageId
        populationHeadByHeadId{
          headName
          addressLine
          headEngName
        }
        districtsMasterByDistrictId{
          districtName
        }
        villagesMasterByVillageId{
          villageName
        }
        habitationsMasterByHabitationId{
          habitationName
        }
        streetsMasterByStreetId{
          streetName
        }
      }
    }
      `
    let variables = {
      headId: this.props.master_data.master_registry_user_id,
      memberId: this.props.master_data.master_registry_user_id,
    };
    customRequestToMaster(this.props.master_data.type !== 'member' ? query : memberQuery, variables)
      .then(data => {
        this.setState({
          profileData: data.populationHeadByHeadId ? data.populationHeadByHeadId : data.populationMemberByMemberId
        });
      })
      .catch(err => {
        this.setState({
          profileData: null
        });
      })
  }

  getProfileEditData = async (id, type) => {
    let profileData;
    if (!profileData && !navigator.onLine && (this.props.entryList || (this.props.master_data && this.props.master_data.entry_id))) {
      let entryId = this.props.entryList ? this.props.entryList.entry_id : this.props.master_data.entry_id
      // let entryData = JSON.parse(localStorage.line_entry_list).entries.filter(val => val.entry_id === entryId)
      let entryData = await getDataFromkey(["lineList"], entryId);
      if (entryData[0]) {
        entryData = entryData[0].user_pds_line
        profileData = {
          memberName: entryData.name,
          gender: entryData.gender,
          aadharCard: entryData.aadhar_no,
          age: entryData.age,
          addressLine: entryData.constructed_address,
          mobileNo: entryData.mobileno
        }

      }
    }
    if(!profileData){
      let entryId = this.props.master_data.master_registry_user_id;
      if (type === "head") {
        let headUserDetails = await getDataFromkey(["allHeads"], entryId);
        profileData = headUserDetails[0];
      } else {
        let memberDetails = await getDataFromkey(["allMembers"], entryId);
        // const members = localStorage.allMembers ? JSON.parse(localStorage.allMembers) : [];
        profileData = memberDetails[0];
      }
      // let offlineData = localStorage.lineEntries ? JSON.parse(localStorage.lineEntries) : {};
      // if (profileData === undefined && offlineData && Object.keys(offlineData).length > 0) {
      //   profileData = offlineData[id] ? offlineData[id].memberData : undefined
      //   if (profileData === undefined && this.props.match && this.props.match.params) {
      //     let enttryDta = offlineData[this.props.match.params.id];
      //     if(enttryDta){
      //       profileData = enttryDta.memberData;
      //     }else{
      //       let enttryDta = Object.values(offlineData).filter(val => val.id_number === Number(this.props.match.params.id));
      //       profileData = enttryDta ? enttryDta[0].memberData : {};
      //     }
      //   }
      // }
    }
    // if (!profileData && !navigator.onLine && (this.props.entryList || (this.props.master_data && this.props.master_data.entry_id))) {
    //   let entryId = this.props.entryList ? this.props.entryList.entry_id : this.props.master_data.entry_id
    //   let entryData = JSON.parse(localStorage.line_entry_list).entries.filter(val => val.entry_id === entryId)
    //   if (Array.isArray(entryData) && entryData.length > 0) {
    //     entryData = entryData[0].user_pds_line
    //     profileData = {
    //       memberName: entryData.name,
    //       gender: entryData.gender,
    //       aadharCard: entryData.aadhar_no,
    //       age: entryData.age,
    //       addressLine: entryData.constructed_address,
    //       mobileNo: entryData.mobileno
    //     }

    //   }
    // }
    return profileData;
  }

  async componentDidMount() {
    if (navigator.onLine) this.getProfileDataFromMaster()
    else {
      const details = await this.getProfileEditData(this.props.master_data.master_registry_user_id, this.props.master_data.type);
      this.setState({ profileData: details });
    }
  }
  render() {
    const { profileData } = this.state;
    if (profileData) {
      return (
        <div className="card" style={{ padding: '10px 6px 10px 22px' }}>
          <span><i class="fa fa-user" aria-hidden="true" style={{ cursor: "pointer" }}></i> &nbsp;&nbsp;Profile:</span>
          <h6>Name:{(profileData.headName || profileData.memberEngName || profileData.headEngName  || profileData.memberName ) ? (profileData.headName ? profileData.headName : profileData.memberName) + '/' + (profileData.headEngName ? profileData.headEngName : profileData.memberEngName) : profileData.name ? profileData.name : 'N/A' }</h6>
          {/* {`User ID : ${this.props.master_data ? this.props.master_data.master_registry_user_id : ''}`} */}
          {profileData.gender && <h6>Gender : {profileData.gender ? profileData.gender : ''}</h6>}
          {profileData.age && <h6>Age : {profileData.age ? profileData.age : ''}</h6>}
          {profileData.populationHeadByHeadId && <h6>Head Name : {profileData.populationHeadByHeadId ? (profileData.populationHeadByHeadId.headName + '/' + profileData.populationHeadByHeadId.headEngName) : ''}</h6>}
          {profileData.relationship && <h6>Relationship : {profileData.relationship ? profileData.relationship : ''}</h6>}
          {profileData.aadharCard && <h6>Aadhaar : {profileData.aadharCard ? profileData.aadharCard : ''}</h6>}
          {profileData.mobileNo && <h6>Mobile no. : {profileData.mobileNo ? profileData.mobileNo : ''}</h6>}
          {/* <h6>Address : {(profileData.districtsMasterByDistrictId && profileData.districtsMasterByDistrictId.districtName) && `${profileData.districtsMasterByDistrictId.districtName} ` }{(profileData.streetsMasterByStreetId && profileData.streetsMasterByStreetId.streetName) && `${profileData.streetsMasterByStreetId.streetName} / ` }
                    {(profileData.streetsMasterByStreetId && profileData.habitationsMasterByHabitationId.habitationName) && `/ ${profileData.habitationsMasterByHabitationId.habitationName}` }
                    {(profileData.streetsMasterByStreetId && profileData.streetsMasterByStreetId.streetName) && `/ ${profileData.streetsMasterByStreetId.streetName} ` }</h6> */}
          {profileData.addressLine && <h6>Address : {profileData.addressLine}</h6>}
          {profileData.populationHeadByHeadId && <h6>Address : {profileData.populationHeadByHeadId.addressLine}</h6>}
        </div>
      )
    } else {
      return null;
    }

  }
}


export default withRouter(profile);