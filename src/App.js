import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import PrivateRoute from "./utils/PrivateRoute";
import AlertTemplate from 'react-alert-template-basic';
import { Provider as AlertProvider } from 'react-alert';
import Login from "./components/auth/Login/Login.js";
import DSUEntry from "./components/Data/DSUEntry/DSUEntry.js";
import DSUList from "./components/Data/DSUList/DSUList.js";
import Report from "./components/Data/Report/Report.js";
import DrugReport from "./components/Data/DrugReport/Report.js";
import UserProfile from "./components/Data/UserProfile/UserProfile.js";
import PhcStatus from "./components/Data/PhcStatus/PhcStatus.js";
import HwcStatus from "./components/Data/HwcStatus/HwcStatus.js";
import DrugReceipt from './components/Data/DrugReceipt/DrugReceipt.js'
import RefreshPage from './components/Data/RefreshPage/Index';
import NotFound from './components/common/NotFound/NotFound';
import ErrorPage from './components/common/Error/Error';
import { ApolloProvider } from "react-apollo";
import config from './config';
import ApolloClient from "apollo-boost";
import { Help } from "./components/Data/Help/Help";
import { request } from "graphql-request";
import Crash from "./components/common/Crash/Crash";
import Axios from "axios";

import {
  upSyncEntries, upsyncReports, upSyncDrugReciepts,
  upSyncDrugReports, upSyncPhcEntries, upSyncHscEntries
} from './actions/onlineAction';
import { ALLUSERS, ALLHEADS } from "./utils/constants";
import offlineDataQuery, { offlineVars, dataQuery } from "./queries/offlineDataQuery";
import { jwt_decode } from './utils/Common';
import writeToOffline from "./utils/writeToOffline";
import { storeMasterDatas } from './utils/writeToOffline';
import { customRequestToMaster } from "./utils/Request";

// IndexDB Function
import { addData } from './indexeDB/addData';
import { storeDetails } from './indexeDB/storedetails';

const graphqlurl = `${config.apiURL}/graphql`;

const client = new ApolloClient({
  uri: graphqlurl
});

if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current Profile
    // store.dispatch(clearCurrentProfile());
    // Redirect to login
    window.location.href = "/login";
  }
}
class App extends Component {
  fetchOfflineData = async () => {
    if ( !navigator.onLine || !localStorage.jwtToken ) return
    let storelength = await storeDetails("lineList");
    if (storelength && storelength.storeCount < 1 && storelength.storeCount !== null) {
      const offvars = offlineVars();
      request(`${config.apiURL}/graphql`, dataQuery(offvars.districtId))
        .then(data => {
          storeMasterDatas(data)
        });
      client.query({
        query: offlineDataQuery,
        variables: offvars
      })
        .then(offlinedata => {
          writeToOffline(offlinedata);
          this.cacheLocationData(offvars.districtId)
            .then(res => {
              new Notification('Location', { body: 'location JSON.stringify(data) cached!' });
              this.cachePopulationStorage(offvars.districtId)
                .then(res => { new Notification('Population', { body: 'population data cached!' }); })
                .catch(err => { console.info('POPERR', err);  })
            })
            .catch(err => { console.info('LOCERR', err); })
        });
    }
  }

  cachePopulationStorage = async (distId) => {
    if (localStorage.getItem('allUsers') && localStorage.getItem('allHeads')) return;
    let query = `query allPopulation {
      allMembers: allPopulationMembers${distId}S(first: 100, condition: {districtId: ${distId}}, filter: {or: {headId: {isNull: false}}}) {
        totalCount
        nodes {
          nodeId
          districtId
          memberId
          age
          mobileNo
          gender
          aadharCard
          streetId
          headId
          memberName
          villageId
          memberEngName
          habitationsMasterByHabitationId {
            habitationName
          }
          villagesMasterByVillageId {
            villageName
            villageId
          }
          populationHeads${distId}ByHeadId {
            addressLine
          }
        }
      }
      allHeads:allPopulationHeads${distId}S(first: 100, condition: {districtId: ${distId}}, filter: {or: {headId: {isNull: false}}}) {
        totalCount
        nodes {
          nodeId
          districtId
          villageId
          headId
          mobileNo
          aadharCard
          streetId
          addressLine
          headName
          age
          gender
          headEngName
          habitationsMasterByHabitationId {
            habitationName
          }
          villagesMasterByVillageId {
            villageName
            villageId
          }
        }
      }
    }`

    if (navigator.onLine) {
      let populationData = await customRequestToMaster(query);
      localStorage.setItem(ALLHEADS, JSON.stringify({ totalCount: populationData.allHeads.totalCount, offset: 100 }));
      localStorage.setItem(ALLUSERS, JSON.stringify({ totalCount: populationData.allMembers.totalCount, offset: 100 }));
      addData('allHeads', populationData.allHeads.nodes, "nodeId");
      addData('allMembers', populationData.allMembers.nodes, "nodeId");
    }
  }

  cacheLocationData = async (district_id) => {
    const query = `
    query locationData {
      allCountriesMasters(condition:{ countryId:105 }) {
        nodes{
          countryId countryName
        }
      }
      
      allStatesMasters(condition: { countryId:105 }){
        nodes{
          stateId stateName
        }
      }
      
      allDistrictsMasters(condition: { districtId: ${district_id} }){
        nodes{
          districtId districtName
        }
      }
      
      allVillagesMasters(condition: { districtId: ${district_id} }){
        nodes{
          villageId villageName  blockId hudId phcId hscId
        }
      }
    }
    `
    const locationData = await customRequestToMaster(query);
    addData('allCountriesMasters', locationData.allCountriesMasters.nodes, "countryId");
    addData('allDistrictsMasters', locationData.allDistrictsMasters.nodes, "districtId");
    addData('allStatesMasters', locationData.allStatesMasters.nodes, "stateId");
    addData('allVillagesMasters', locationData.allVillagesMasters.nodes, "villageId");
  }

  upsyncData = async () => {
    document.getElementById("root").style.pointerEvents = "none";

    let snapShot = store.getState();
    const userid = snapShot.auth.isAuthenticated ? snapShot.auth.user.user_id : null;
    if (userid) {
      await upSyncEntries();
      await upsyncReports();
      await upSyncDrugReciepts();
      await upSyncDrugReports();
      await upSyncPhcEntries(userid);
      await upSyncHscEntries(userid);
    }
    document.getElementById("root").style.pointerEvents = "auto";
  }

  addListeners = () => {
    window.addEventListener('online', this.upsyncData)
    //   window.addEventListener('offline', () => {
    //   })
  }

  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    window.removeEventListener("online", this.upsyncData);
  }


  componentDidCatch(error, info) {

    console.info('ERROR', error, info)
    // console.info('STORE',store);
    let snapShot = store.getState();
    let errReport = {
      error: JSON.stringify(error), stack: error.stack, message: error.message,
      userid: snapShot.auth.isAuthenticated ? snapShot.auth.user.user_id : '',
      router: window.location.href,
      browserData: {
        appCodeName: navigator.appCodeNam,
        appName: navigator.appName,
        appVersion: navigator.appVersion,
        cookieEnabled: navigator.cookieEnabled,
        platform: navigator.platform,
        userAgent: navigator.userAgent
      }
    }
    Axios.post(`${config.apiURL}/errorHandler`, errReport)


    this.setState({ error: true, errReport });

  }

  state = { error: false, errReport: {} }

  render() {
    const options = {
      position: 'bottom center',
      timeout: 5000,
      offset: '30px',
      transition: 'scale'
    }
    return (
      <React.Fragment>
        {this.state.error ? (
          <Crash />
        ) : (
            <Provider store={store}>
              <AlertProvider template={AlertTemplate} {...options}>
                <ApolloProvider client={client}>
                  <Router>
                    <Switch>
                      <Route exact path='/' render={(props) => (
                        <Redirect to='/login' />
                      )} />
                      <Route path="/login" component={Login} pageType={'login'} />
                      <Route path="/help" exact component={RefreshPage} pageType={'refresh'} />
                      <PrivateRoute fetchOfflineData={this.fetchOfflineData} exact path='/UHC/edit/:pageType/:id' component={DSUEntry} pageType={'lineEntry'} />
                      <PrivateRoute fetchOfflineData={this.fetchOfflineData} exact path='/UHC/newvisit/:id' component={DSUEntry} type={'newVisit'} pageType={'lineEntry'} />
                      <PrivateRoute fetchOfflineData={this.fetchOfflineData} exact path="/UHC/lineentry" component={DSUEntry} pageType={'lineEntry'} />
                      <PrivateRoute fetchOfflineData={this.fetchOfflineData} exact path='/UHC/drugreport' component={DrugReport} pageType={'report'} />
                      <PrivateRoute fetchOfflineData={this.fetchOfflineData} exact path="/UHC/linelist" component={DSUList} pageType={'lineList'} />
                      <PrivateRoute fetchOfflineData={this.fetchOfflineData} exact path="/UHC/labList" component={DSUList} pageType={'labList'} />
                      <PrivateRoute fetchOfflineData={this.fetchOfflineData} exact path="/UHC/profile" component={UserProfile} pageType={'profile'} />
                      <PrivateRoute fetchOfflineData={this.fetchOfflineData} exact path="/UHC/phcstatus" component={PhcStatus} pageType={'status'} />
                      <PrivateRoute fetchOfflineData={this.fetchOfflineData} exact path="/UHC/hscstatus" component={HwcStatus} pageType={'status'} />
                      <PrivateRoute fetchOfflineData={this.fetchOfflineData} exact path="/UHC/report" component={Report} pageType={'report'} />
                      <PrivateRoute fetchOfflineData={this.fetchOfflineData} exact path="/UHC/drugreceipt" component={DrugReceipt} pageType={'DrugReceipt'} />
                      <PrivateRoute fetchOfflineData={this.fetchOfflineData} exact path="/UHC/help" component={Help} />
                      <Route component={ErrorPage} />
                      <Route component={NotFound} />
                    </Switch>
                  </Router>
                </ApolloProvider>
              </AlertProvider>
            </Provider>
          )}
      </React.Fragment>
    );
  }
}

export default (App);