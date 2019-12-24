import React, { Component } from 'react'
import Header from '../../common/Header/Header';
import ApolloClient from "apollo-boost";
import config from '../../../config';
import Spinner from '../../common/Spinner/Spinner';
import { Redirect } from 'react-router-dom';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { ApolloProvider } from "react-apollo";
import DataEntryDetails from './DSUEntryContent';
const customClient = new ApolloClient({
    uri: config.masterRegisterEndpoint
});
export default class Content extends Component {
    renderPage() {
        const { entryType } = this.props;
        const { countriesList, diagnosis_masters, institutionList, institutionListSelect, getInstitutionDetails, syndromeList, servicesList, getLineEntryEdit, labtest_masters, drugsList, specimensList, phc_list, symptomsList, getLineEntryVisitData, getLastVisitDate } = this.props.data;
        return (
            <div>
                <Header />
                <DataEntryDetails
                    getLineEntryVisitData={getLineEntryVisitData}
                    countriesList={countriesList}
                    diagnosis_masters={diagnosis_masters}
                    institutionList={institutionList ? institutionList : institutionListSelect}
                    myInstitution={(getInstitutionDetails && getInstitutionDetails.district_id) ? getInstitutionDetails.district_id : null}
                    syndromeList={syndromeList}
                    symptomsList={symptomsList}
                    servicesList={servicesList}
                    entryType={entryType}
                    editData={entryType.type === 'edit' ? getLineEntryEdit : undefined}
                    visitDetails = {(entryType.type === 'edit' || entryType.type === 'newVisit') ? getLineEntryEdit : undefined}
                    visitData={getLastVisitDate}
                    labTestsList={labtest_masters}
                    drugsList={drugsList}
                    specimensList={specimensList}
                    phc_list={phc_list}
                />
            </div>
        )
    }

    render() {
        if (navigator.onLine) {
            return (
                <div>
                    <ApolloProvider client={customClient}>
                        <Query query={gql`
                    {
                      allPopulationHeads(first: 10) {
                        nodes {
                          headId
                          villageId
                          streetId
                          headEngName
                        }
                      }
                    }
                    
                      `}
                            client={customClient} >
                            {({ loading, error, data }) => {
                                if (loading) return <div>
                                    <Header />
                                    <Spinner />
                                </div>
                                if (error) return <Redirect to='/error' />;
                                return this.renderPage();
                            }}
                        </Query>
                    </ApolloProvider>
                </div>
            )
        } else {
            return this.renderPage();
        }
    }
}
