import React from "react";
import Header from "../../common/Header/Header";
import Spinner from '../../common/Spinner/Spinner';
import { withApollo } from "react-apollo";
import gql from "graphql-tag";
import DSUListContent from "./DSUListContent";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { dataList } from '../../../utils/writeToOffline';
import { getDataFromIndexedDB } from '../../../indexeDB/getData';

const storeName = [
  "districtsList", "symptomsList", "getValidMessages", "phc_masters",
  "syndromeList", "diagnosis_masters", "drugsList", "labtest_masters", "specimensList"
]


class DSUList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      data: {}
    }
  }

  changeSearchText = (searchText) => {
    this.setState({
      searchText
    })
  }

  renderList = (data) => {
    if (navigator.onLine) dataList(data);
    const { pageType } = this.props;
    return (
      <div>
        {Object.keys(data).length > 0 ? <DSUListContent
          pageType={pageType}
          phcList={data.get_all_phc}
          districtsList={data.districtsList}
          drugsList={data.drugsList}
          labList={data.labtest_masters}
          specimensList={data.specimensList}
          diagnosisList={data.diagnosis_masters}
          symptomsList={data.symptomsList}
          syndromesList={data.syndromeList}
          phc_masters={data.phc_masters ? data.phc_masters[0] : null}
          institutions={data.get_all_phc}
          validOptions={data.getValidMessages}
          searchText={this.state.searchText}
          changeSearchText={this.changeSearchText}
        /> : <div>
            <Header />
            <Spinner />
          </div>}
      </div>
    )
  }
  async componentDidMount() {
    const { user } = this.props.auth;
    let savedMasterData = await getDataFromIndexedDB(storeName);
    let masterData = {};
    storeName.map((val, i) => { masterData[val] = savedMasterData[i] });
    const pageType = this.props.pageType;
    let phc_query = `get_all_phc
    { phc_name phc_id type institution_name }`;
    if (pageType === 'labList') {

    }
    if (user.district_id) {
      phc_query = `get_all_phc(district_id : ${user.district_id})
      { phc_name phc_id type institution_name }`;
    }

    if (navigator.onLine) {
      this.props.client.query({
        query: gql`
        query${masterData.districtsList.length === 0 ? `($state_id: Int!)` : ``} {
          getValidMessages 
          { validation_id name }
         
          ${phc_query}
          ${masterData.districtsList.length === 0 ? `districtsList(state_id: $state_id) {
            state_id
            country_id
            district_id
            district_name
          }` : ``}
          ${masterData.symptomsList.length === 0 ? `symptomsList
          { symptom_id name }` : ``}
          ${masterData.phc_masters.length === 0 ? ` phc_masters(username:"${user.username}") 
          { phc_id,phc_name }` : ``}
          ${masterData.syndromeList.length === 0 ? ` syndromeList
          { syndrome_id syndrome_name syndrome_code }` : ``}
          ${masterData.diagnosis_masters.length === 0 ? `diagnosis_masters
          { diagnosis_id diagnosis_name service_id }` : ``}
          ${masterData.drugsList.length === 0 ? `drugsList
          { drug_name drug_id type strength }` : ``}
          ${masterData.labtest_masters.length === 0 ? `labtest_masters
          { test_id test_name options result_type }` : ``}
          ${masterData.specimensList.length === 0 ? `specimensList
          { specimen_id specimen_name }` : ``}
        }
        `,
        variables: {
          state_id: 33
        }
      })
        .then(async (data) => {
          let allData = Object.assign([], masterData, []);
          let responeData = Object.assign([], data.data, []);
          Object.keys(allData).map(val => {
            if (allData[val].length > 0) {
              responeData[val] = allData[val];
            }
          })
          this.setState({
            data: responeData
          })
        })
        .catch(e => {
          alert(e)
        })
    } else {
      let status = false, data = {};
      try {
        // let storeName = [
        //   "districtsList", "symptomsList", "getValidMessages", "phc_masters",
        //   "syndromeList", "diagnosis_masters", "drugsList", "labtest_masters", "specimensList"
        // ]
        data = await getDataFromIndexedDB(storeName);
        status = true;
      } catch (error) {
        console.info('ERROR', error);
        status = false
      }
      this.setState({
        data
      })
    }
  }
  render() {
    let { data } = this.state;
    return this.renderList(data);
  }
}
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {})(withRouter(withApollo(DSUList)))
