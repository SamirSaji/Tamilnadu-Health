import React from 'react';
import ApolloClient from "apollo-boost";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import config from '../../../config';
import { commonArrayCreatorForSelect } from '../../../utils/Common';
import SelectList from "../../common/fields/CustomSelectGroup/CustomSelectGroup";
const customClient = new ApolloClient({
  uri: config.masterRegisterEndpoint
});


class Testing extends React.Component {
  render() {
    const { district_id, street_id, village_id } = this.props;
    return (
      <Query query={gql`
                {
                  allPopulationHeads(first: 1000, condition: 
                    {
                      ${district_id ? 'districtId:' + district_id + ',' : ''}
                      ${street_id ? 'streetId:"' + street_id + '",' : ''}
                      ${village_id ? 'villageId:"' + village_id + '",' : ''}
                    }) {
                    nodes {
                      headId
                      villageId
                      streetId
                      headEngName
                    }
                  }
                }
                
                  `} client={customClient} >
        {({ loading, error, data }) => {

          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;
          let usersList = commonArrayCreatorForSelect(data.allPopulationHeads.nodes, 'headId', 'headEngName');
          return (
            <div>
              <SelectList
                label='Patients Name'
                options={usersList}
              />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default Testing;
