import React from "react";
import Header from "../../common/Header/Header";
import UserProfileContent from "./UserProfileContent";

import { Redirect } from 'react-router-dom';
import Spinner from '../../common/Spinner/Spinner';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
class UserProfile extends React.Component {
  render() {
    const {user} = this.props.auth;
    return (
      <Query
      query={gql`{
          userData(id:${user.id}) {
            id
            username
            mobile
            email
            latitude
            longitude
            institution_name
            User_roles {
              role_name
            }
        }
      }
      `}>
      {({error,loading,data,refetch}) => {
        if(loading) return <div>
          <Header/>
          <Spinner/>
        </div>
        if(error)  return <Redirect to='/error' />;
        console.log(data);
        return (
          <div>
        <Header />
        <UserProfileContent
         userData={data.userData}
         refetch={refetch}
         />
          </div>
        )
      }}
      </Query>

    );
  }
}
const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps, {})(withRouter(UserProfile))
