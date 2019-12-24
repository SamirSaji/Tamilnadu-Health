import React from "react";
import Header from "../../common/Header/Header";
import DailyReportContent from "./ReportContent";
import { Query, withApollo } from "react-apollo";
import gql from "graphql-tag";
// import { Redirect } from 'react-router-dom';
import Spinner from '../../common/Spinner/Spinner';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { drugReportData } from '../../../utils/writeToOffline';
import { getDataFromIndexedDB } from '../../../indexeDB/getData';
const DRUGREPORTDATA = 'drugreportdata';
class DailyReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    }
  }


  reportComponent = (data) => {
    if (navigator.onLine) drugReportData(data);
    return (
      <div>
        {
          Object.keys(data).length > 0 ?
            <React.Fragment>
              <Header />
              <DailyReportContent
                servicesList={data.servicesList}
                drugsList={data.drugsList}
                issuedDrugCount={data.getIssuesDrugCount}
                getDrugCount={data.getDrugCount}
                yesterdayIssuesCount={data.yesterdayIssuesCount}
                patientCount={data.getpatientcount}
                offlineData = {data.offlineData ? data.offlineData  : null}
              />
            </React.Fragment>
            :
            <React.Fragment>
              <Header />
              <Spinner />
            </React.Fragment>
        }
      </div>
    )
  }

  getYesterdaysDate = () => {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }

  drugReportQuery = (user_id, alias) => gql`
    query{
      servicesList {
        service_id service_name
      }
      getpatientcount(user_id:"${user_id}", type:"${alias}" report_date:"${Number(new Date(this.getYesterdaysDate().getTime() / 1000))}"){
        male female referred_out follow_up total
      }
      drugsList {
        drug_id drug_name strength type
      }
      yesterdayIssuesCount(user_id:"${user_id}" alias:"${alias}" created_date:"${Number(new Date(this.getYesterdaysDate()).getTime() / 1000)}"){
        drug_id quantity
      }
      getIssuesDrugCount(user_id:"${user_id}" alias:"${alias}" created_max_date:"${Number(new Date(new Date().setHours(23, 59, 59, 0)) / 1000)}" created_date:"${Number(new Date(new Date().setHours(0, 0, 0, 0)) / 1000)}")
      {
        quantity
        drug_id
      }
      getDrugCount(user_id: "${user_id}", date: "${Number(new Date().getTime() / 1000)}") {
        quantity
        drug_id
      }
    }
    `
  async componentDidMount() {
    const { user_id, alias } = this.props.auth.user;
    if (navigator.onLine) {
      this.props.client.query({
        query: this.drugReportQuery(user_id, alias)
      }).then(res => {
        this.setState({
          data: res.data
        })
      }).catch(err => { })
    } else {
      let data = {}, value = {}
      let storeName = [
        "servicesList", "getpatientcount", "drugsList",
        "yesterdayIssuesCount", "getIssuesDrugCount", "getDrugCount"
      ];
      data = await getDataFromIndexedDB(storeName);
      let offlineData = await getDataFromIndexedDB(["offlineDrugUtilisation"]);
      value = {
        "servicesList": data[0],
        "getpatientcount": {
          "female": data[1][1],
          "follow_up": data[1][2],
          "male": data[1][3],
          "referred_out": data[1][4],
          "total": data[1][5]
        },
        "drugsList": data[2],
        "yesterdayIssuesCount": data[3],
        "getIssuesDrugCount": data[4],
        "getDrugCount": data[5],
        "offlineData" : offlineData
      }
      this.setState({
        data: value
      })
    }

  }
  render() {
    const { user_id, alias } = this.props.auth.user;
    let { data } = this.state;
    return this.reportComponent(data);
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {})(withRouter(withApollo(DailyReport)))