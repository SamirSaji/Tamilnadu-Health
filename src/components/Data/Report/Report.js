import React from "react";
import Header from "../../common/Header/Header";
import DailyReportContent from "./ReportContent";
import { Query, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { Redirect } from 'react-router-dom';
import Spinner from '../../common/Spinner/Spinner';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { reportPageStoreData } from '../../../utils/writeToOffline';
import { getDataFromIndexedDB } from '../../../indexeDB/getData';

const REPORTDATA = 'report_data'

class DailyReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    }
  }
  getYesterdaysDate = () => {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }

  reportQuery = (user_id, alias) => gql`
  query{
    servicesList {
      service_id service_name disable_for_men
    }
    getPreviousServices(user_id:"${user_id}", alias: "${alias}", report_date:"${Number(new Date(this.getYesterdaysDate()).getTime() / 1000)}") {
      diagnosis_id
      male female
      patient_diagno{
        ser_diag{
          service_id
        }
      }
    }
    getpatientcount(user_id:"${user_id}", type:"${alias}" report_date:"${Number(new Date(this.getYesterdaysDate()).getTime() / 1000)}"){
      male female referred_out follow_up total
    }
    drugsList {
      drug_id drug_name strength type
    }
  }
  `

  renderReport = data => {
    if (navigator.onLine) reportPageStoreData(data);
    return (
      <div>
        {Object.keys(data).length > 0 ?
          <div>
            <Header />
            <DailyReportContent
              previousServices={data.getPreviousServices}
              servicesList={data.servicesList}
              patientCount={data.getpatientcount}
              offlineData = {data.offlineData ? data.offlineData : null }
            />
          </div>
          : <div>
            <Header />
            <Spinner />
          </div>}
      </div>
    )
  }
  async componentDidMount() {
    const { user_id, alias } = this.props.auth.user;
    if (navigator.onLine) {
      this.props.client.query({
        query: this.reportQuery(user_id, alias)
      }).then(res => {
        this.setState({
          data: res.data
        })
      }).catch(err => { })
    } else {
      let data = {};
      let value = {};
      try {
        let storeName = ["getPreviousServices", "servicesList", "getpatientcount"];
        data = await getDataFromIndexedDB(storeName);
        let offlineData = await getDataFromIndexedDB(["newOfflineEntry"]);
        value = {
          getPreviousServices: data[0],
          servicesList: data[1],
          getpatientcount: {
            "female": data[2][1],
            "follow_up": data[2][2],
            "male": data[2][3],
            "referred_out": data[2][4],
            "total": data[2][5]
          },
          "offlineData" : offlineData
        }
      } catch (error) { }
      this.setState({
        data: value
      })
    }
  }
  render() {
    let { data } = this.state;
    return this.renderReport(data);
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {})(withRouter(withApollo(DailyReport)))