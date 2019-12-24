import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import startPopulationSync from '../utils/populationSync';

class PrivateRoute extends React.Component {

  render() {
    startPopulationSync();

    const { component: Component, pageType, type, auth, fetchOfflineData, ...rest } = this.props;
    fetchOfflineData();

    return (
      <Route
        {...rest}
        render={props =>
          auth.isAuthenticated === true ? (
            <Component {...props} pageType={pageType} type={type} />
          ) : (
              <Redirect to="/" />
            )
        }
      />
    )
  }
}

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);