import React from "react";
import Header from "../../common/Header/Header";
import Content from "./Content";
import { withApollo } from "react-apollo";
import gql from "graphql-tag";
import Spinner from "../../common/Spinner/Spinner";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { drugReceiptList } from '../../../utils/writeToOffline';
import { getDataFromIndexedDB } from '../../../indexeDB/getData';
import moment from 'moment';
import { offlineVars } from '../../../queries/offlineDataQuery';
class DailyReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      druglist: []
    }
  }
  renderData = (druglist) => {
    if (navigator.onLine) drugReceiptList(druglist);
    return (
      <React.Fragment>
        {
          druglist.length > 0 ? <React.Fragment>
            <Header />
            <Content drugsList={druglist} />
          </React.Fragment>
            : <React.Fragment>
              <Header />
              <Spinner />
            </React.Fragment>
        }
      </React.Fragment>
    );
  }
  drugListQuery() {
    var auth = offlineVars();
    // reportVariable.createdBy
    // reportVariable.alias
    return gql`query {
      drugsList {
        drug_id
        drug_name
        strength
        type
        tnmsc_code
      }
      drugInventoryData(user_id: "${auth.createdBy}", alias: "${auth.alias}", receipt_date: "${moment().format('MM-DD-YYYY')}", currentDate :"${moment().format('MM-DD-YYYY')}") {
        drug_id
        batch_no
        date_of_expiry
        quantity
        remarks
      }
    }
    `
  }
  async componentDidMount() {
    if (navigator.onLine) {
      this.props.client.query({
        query: this.drugListQuery()
      }).then(res => {
        let receiptList = res.data.drugsList;
        let drugList = Object.assign([], receiptList, []);
        if (res.data.drugInventoryData.length > 0) {
          let newRecords = res.data.drugInventoryData
          let Listing = Object.assign([], receiptList, []);
          newRecords.map(list => {
            let checkList = []
            Listing.map((val, i) => {
              if (val.drug_id === list.drug_id) { checkList.push({ "list": val, "position": i }) }
            });
            let currentBatch = Boolean(checkList[0].list.batch_no && checkList[0].list.quantity && checkList[0].list.date_of_expiry);
            let currentListdata = res.data.drugsList.filter(val => val.drug_id === list.drug_id);
            let setList = {
              ...currentListdata[0],
              ...list,
              filled : true
            }
            if (currentBatch) {
              Listing.splice(checkList[checkList.length - 1].position + 1, 0, setList);
            } else {
              Listing[checkList[0].position] = setList;
            }

          })
          drugList = Object.assign([], Listing, []);
        }
        this.setState({
          druglist: drugList,
        })
      }).catch(err => { })
    } else {
      let druglist = [];
      let storeName = ["drugsList", "offlineDrugReport"];
      try {
        druglist = await getDataFromIndexedDB(storeName);
        let receiptList = druglist[0];
        if (druglist[1].length > 0) {
          let offlineList = JSON.parse(druglist[1])
          let Listing = Object.assign([], receiptList, []);
          offlineList.drugsList.map(list => {
            let checkList = []
            Listing.map((val, i) => {
              if (val.drug_id === list.drug_id) { checkList.push({ "list": val, "position": i }) }
            });
            let currentBatch = Boolean(checkList[0].list.batch_no && checkList[0].list.quantity && checkList[0].list.date_of_expiry);
            if (currentBatch) {
              Listing.splice(checkList[checkList.length - 1].position + 1, 0, list);
            } else {
              Listing[checkList[0].position] = list
            }

          })
          druglist[0] = Object.assign([], Listing, []);
        }
      } catch (e) { }
      this.setState({ druglist: druglist[0] });
    }
  }

  render() {
    let { druglist } = this.state
    return this.renderData(druglist);
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(withRouter(withApollo(DailyReport)));