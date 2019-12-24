import React from "react";
import {
  Col,
  Row,
  Container,
  Button,
  Table
} from "reactstrap";
import { withApollo } from "react-apollo";
import md5 from "md5";
import gql from "graphql-tag";
import { withAlert } from "react-alert";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//custom components
import Inputtext from "../../common/fields/TextFieldGroup/TextFieldGroup";
import {
  validateEmail,
  generateHash
} from "../../../utils/Common";

// styles
import styles from "./stylesheet/profile.less";

//datapicker styles
import "react-datepicker/dist/react-datepicker.css";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

class UserProfileComponent extends React.Component {
  constructor(props) {
    super(props);
    // added by sandeep
    this.changeValue = this.changeValue.bind(this);
    this.updateMobileNumber = this.updateMobileNumber.bind(this);
    this.commonMiscUpdate = this.commonMiscUpdate.bind(this);
    this.saveMobileNumber = this.saveMobileNumber.bind(this);
    this.changeLatLong = this.changeLatLong.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.saveInstitution = this.saveInstitution.bind(this);
    this.state = {
      disable: true,
      // disableradio: disabled,
      misc: {
        isMobileOpen: true,
        isEmailOpen: true,
        isPasswordOpen: true,
        // userRoleEdit: true,
        isLatlongOpen: true,
        isWardOpen: true,
        isIntitutionOpen: true
      },
      userProfile: {
        mobile: null,
        email: null,
        password: null,
        passwordConfirm: null,
        lattitude: null,
        longitude: null,
        institution_name: null
      },
      errors: {
        mobile: null,
        email: null,
        password: null,
        institution_name: null,
      }
    };
  }


  changeValue = () => {
    this.setState({ disable: false });
    this.setState({ disableradio: " " });
 };
  async saveInstitution(name, id, fieldName) {
    const changes = this.state;
    if (name.length > 15 || name.length < 5) {
      changes.errors.institution_name =
        "Please enter a institution name between 5-15 chars";
    } else {
      this.commonUpdate(id, name, fieldName);
      changes.userProfile.institution_name = null;
      setTimeout(() => this.commonMiscUpdate("isInstitutionOpen"), 500);
    }
    this.setState({
      changes
    });
  }
  async changeEmail(id, email, fieldName) {
    const changes = this.state;
    if (validateEmail(email)) {
      changes.errors.email = null;
      changes.userProfile.email = null;
      this.commonUpdate(id, email, fieldName);
      setTimeout(() => this.commonMiscUpdate("isEmailOpen"), 500);
    } else {
      changes.errors.email = "Please enter a valid email address";
    }
    this.setState({
      changes
    });
  }
  async commonUpdate(user, number, type, showMessage = true) {
    const { data } = await this.props.client.mutate({
      mutation: gql`mutation {
        commonUpdate(tableName:"users_trans",
        id:${user},
        value:"${number}",
        label:"${type}") {
          id }}`
    });
    if (data) {
      this.props.refetch();
      showMessage && setTimeout(() => this.props.alert.success("Updated"), 300);
    }
  }

  async saveMobileNumber(user, number, value) {
    const changes = this.state;
    if (number.length === 10) {
      changes.errors.mobile = null;
      changes.userProfile.mobile = null;
      this.commonUpdate(user, number, "mobile");
      setTimeout(() => this.commonMiscUpdate("isMobileOpen"), 500);
    } else {
      changes.errors.mobile = "Please enter a 10 digit number";
    }
    this.setState({
      changes
    });
  }
  commonMiscUpdate(value) {
    let currentState = this.state;
    currentState.misc = {
      ...currentState.misc,
      [value]: !currentState.misc[value]
    };
    this.setState({
      currentState
    });
  }
  updateMobileNumber(e) {
    const changes = this.state;
    changes.userProfile.mobile = e.target.value;
    this.setState({
      changes
    });
    if (
      e.target.value.length > 10 ||
      /^[1-9]\d*$/.test(e.target.value) === false
    ) {
      changes.userProfile.mobile = e.target.value.slice(0, -1);
      this.setState({
        changes
      });
      return false;
    }
  }
  changepassword(password, confirmPassword, id, fieldName, e) {
    const changes = this.state;
    if (password !== confirmPassword) {
      changes.errors.password = "Passwords dont match";
    }
    if (password.length > 8 || password.length < 8) {
      changes.errors.password = "Please enter a valid password";
    }
    if (password === confirmPassword && password.length >= 8) {
      let hash = generateHash(6);
      this.commonUpdate(id, hash, "password_hash", false);
      this.commonUpdate(id, md5(md5(`${password}`) + hash), "password");
      // this.commonUpdate(id,md5(md5(hash)+md5(password)),fieldName);
      setTimeout(() => {
        changes.userProfile.password = null;
        changes.userProfile.passwordConfirm = null;
        changes.errors.password = null;
        this.commonMiscUpdate("isPasswordOpen");
      }, 700);
    }
    this.setState({
      changes
    });
  }
  changeLatLong(value, type) {
    const changes = this.state;
    changes.userProfile[type] = value;
    this.setState({
      changes
    });
  }
  async saveLatLong(lattitude, longitude, id) {
    const changes = this.state;
    if (
      /^(0[.]+\d{2})|^[1-9]\d+[.]+\d{6}$/.test(lattitude) &&
      /^(0[.]+\d{2})|^[1-9]\d+[.]+\d{6}$/.test(longitude)
    ) {
      changes.errors.latlong = null;
      this.commonUpdate(id, lattitude, "latitude", false);
      this.commonUpdate(id, longitude, "longitude");
      setTimeout(() => this.commonMiscUpdate("isLatLongOpen"), 1000);
      changes.userProfile.lattitude = null;
      changes.userProfile.longitude = null;
    } else {
      changes.errors.latlong = "Enter in this format xx.xxxxxx";
    }
    this.setState({
      changes
    });
  }
  updateEmail(e) {
    const changes = this.state;
    changes.userProfile.email = e.target.value;
    this.setState({
      changes
    });
  }
  commonStateUpdate(value, stateValue, stateValue1) {
    const changes = this.state;
    changes[stateValue][stateValue1] = value;
    this.setState({
      changes
    });
  }
  render() {
    const { userData } = this.props;
    const { misc, userProfile, errors } = this.state;
    return (
      <Container fluid className={styles.bgcontentProf}>
        <Row>
          <Col lg="12">
            <Container fluid>
              <Row>
                <Col lg="12" className={styles.header}>
                  <h3>Profile</h3>
                  <hr className={styles.underline} />
                </Col>
              </Row>
            </Container>
          </Col>
          {/* Profile  Details*/}
          <Col
            lg="4"
            style={{ paddingRight: "0px" }}
            className={styles.profileDetls}
          >
            <Container fluid>
              <Row>
                <Col md="12" lg="12">
                  <Container
                    fluid
                    className={styles.inpatient}
                    style={{ paddingBottom: "44px" }}
                  >
                    <p style={{ textAlign: "center", fontSize: "65px" }}>
                      <i className={"fa fa-hospital-o " + styles.hospitalIcon} aria-hidden="true" />
                    </p>
                    <Row> 
                      <Col
                        style={{ marginTop: "3px" }}
                        md={{ size: 10, offset: 1 }}
                        className={styles.inputOffset}
                      >
                        <Row>
                          <hr />
                          <Col md="12">
                            <Table style={{ marginTop: "30px" }}>
                              <tbody>
                                <tr>
                                  <td>
                                    <label>Institution Name</label>
                                  </td>
                                  <td>:</td>
                                  <td>
                                    {userData.institution_name
                                      ? userData.institution_name
                                      : userData.User_institution
                                      ? userData.User_institution.name
                                      : "No Institution Name"}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <label>Institution Id</label>
                                  </td>
                                  <td>:</td>
                                  <td>
                                    {userData.User_institution &&
                                    userData.User_institution.phc_id
                                      ? userData.User_institution.phc_id
                                      : "No ID"}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <label>Mobile Number</label>
                                  </td>
                                  <td>:</td>
                                  <td>
                                    {userData.mobile
                                      ? userData.mobile
                                      : "No Mobile number"}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <label>E-Mail Id</label>
                                  </td>
                                  <td>:</td>
                                  <td>
                                    {userData.email
                                      ? userData.email
                                      : "No email found"}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <label>Role</label>
                                  </td>
                                  <td>:</td>
                                  <td>{userData.User_roles.role_name} </td>
                                </tr>
                              </tbody>
                            </Table>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Container>
                </Col>
              </Row>
            </Container>
          </Col>
          {/* end */}
          {/* Contact Details start */}
          <Col md="12" lg={{ size: 8 }}>
            <Container fluid>
              <Row>
                <Col md="12" lg="12">
                  <Container fluid className={styles.inpatient}>
                    <h6 className={styles.tital}>Contact Details</h6>
                    <hr className={styles.underline} />
                    <Row>
                      <Col
                        md={{ size: 10, offset: 1 }}
                        className={styles.inputOffset}
                      >
                        <Row>
                          <hr />
                          <Col md="12">
                            <label>Mobile Number</label>
                            <span>
                              <button
                                className={styles.editBtn}
                                onClick={() => {
                                  this.commonMiscUpdate("isMobileOpen");
                                }}
                              >
                                edit
                              </button>
                            </span>
                            <p style={{ fontSize: "17px" }}>
                              {userData.mobile
                                ? userData.mobile
                                : "Not Available"}
                            </p>
                          </Col>
                          <hr style={{ marginBottom: "-1px" }} />
                        </Row>
                      </Col>
                    </Row>
                    <Row
                      className={styles.hidecard}
                      style={{
                        height: misc.isMobileOpen === true ? "0px" : "150px"
                      }}
                    >
                      <Col md="12" className={styles.hidebg}>
                        <span>
                          <Inputtext
                            label={"Mobile Number"}
                            type="Number"
                            value={userProfile.mobile ? userProfile.mobile : ""}
                            classname={styles.inputstyle}
                            placeholder={"Mobile Number"}
                            onChange={this.updateMobileNumber}
                          />
                          <Button
                            className={styles.savebtn}
                            onClick={() => {
                              this.saveMobileNumber(
                                userData.id,
                                userProfile.mobile,
                                "mobile"
                              );
                            }}
                          >
                            Save
                          </Button>
                          <Button
                            className={styles.closebtn}
                            onClick={() => {
                              this.commonMiscUpdate("isMobileOpen");
                            }}
                          >
                            Close
                          </Button>
                          <span>{errors.mobile}</span>
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col
                        md={{ size: 10, offset: 1 }}
                        className={styles.inputOffset}
                      >
                        <Row>
                          <Col md="12">
                            <label>E-Mail Id</label>
                            <span>
                              <button
                                className={styles.editBtn}
                                onClick={() => {
                                  this.commonMiscUpdate("isEmailOpen");
                                }}
                              >
                                edit
                              </button>
                            </span>
                            <p style={{ fontSize: "17px" }}>
                              {userData.email
                                ? userData.email
                                : "Not Available"}
                            </p>
                          </Col>
                          <hr style={{ marginBottom: "-1px" }} />
                        </Row>
                      </Col>
                    </Row>
                    <Row
                      className={styles.hidecard}
                      style={{
                        height: misc.isEmailOpen === true ? "0px" : "150px"
                      }}
                    >
                      <Col className={styles.hidebg} md="12">
                        <span>
                          <Inputtext
                            label={"E-Mail Id"}
                            type="email"
                            value={userProfile.email ? userProfile.email : ""}
                            classname={styles.inputstyle}
                            placeholder={"Enter email id"}
                            onChange={this.updateEmail}
                          />
                          <span>{errors.email}</span>
                          <Button
                            className={styles.savebtn}
                            onClick={() => {
                              this.changeEmail(
                                userData.id,
                                userProfile.email,
                                "email"
                              );
                            }}
                          >
                            Save
                          </Button>
                          <Button
                            className={styles.closebtn}
                            // onClick={this.openEmailEdit}
                            onClick={e => {
                              this.commonMiscUpdate("isEmailOpen");
                            }}
                          >
                            Close
                          </Button>
                          {/* <Inputtext
                            label={"Mobile Number"}
                            type="Number"
                            value={userProfile.mobile ? userProfile.mobile : ''}
                            classname={styles.inputstyle}
                            placeholder={"Mobile Number"}
                            onChange={this.updateMobileNumber}
                          />
                          <Button className={styles.savebtn}
                          onClick={() => {
                            this.saveMobileNumber(userData.id,userProfile.mobile,'mobile')
                          }}>Save</Button> */}
                        </span>
                      </Col>
                    </Row>
                    <h6 className={styles.tital} style={{ marginTop: "30px" }}>
                      Password change
                    </h6>
                    <hr
                      className={styles.underline}
                      style={{ marginBottom: "0px" }}
                    />
                    <Row>
                      <Col
                        md={{ size: 10, offset: 1 }}
                        className={styles.inputOffset}
                        style={{
                          padding: "0px 15px"
                        }}
                      >
                        <Row>
                          <hr />
                          <Col md="12">
                            <label>Password</label>
                            <span>
                              <button
                                className={styles.editBtn}
                                onClick={e => {
                                  this.commonMiscUpdate("isPasswordOpen");
                                }}
                              >
                                change
                              </button>
                            </span>
                            <p style={{ fontSize: "17px" }}>XXXXXXXX</p>
                          </Col>
                          <hr style={{ marginBottom: "-1px" }} />
                        </Row>
                      </Col>
                    </Row>
                    <Row
                      className={styles.hidecard}
                      style={{
                        height: misc.isPasswordOpen === true ? "0px" : "230px"
                      }}
                    >
                      <Col className={styles.hidebg} md="12">
                        <span>
                          <Inputtext
                            label={"New Password"}
                            type={"password"}
                            classname={styles.inputstyle}
                            value={
                              userProfile.password ? userProfile.password : ""
                            }
                            placeholder={"Enter New Password"}
                            onChange={e => {
                              this.commonStateUpdate(
                                e.target.value,
                                "userProfile",
                                "password"
                              );
                            }}
                          />
                          <Inputtext
                            label={"Confirm Password"}
                            type={"password"}
                            classname={styles.inputstyle}
                            value={
                              userProfile.passwordConfirm
                                ? userProfile.passwordConfirm
                                : ""
                            }
                            placeholder={"Enter Confirm Password"}
                            onChange={e => {
                              this.commonStateUpdate(
                                e.target.value,
                                "userProfile",
                                "passwordConfirm"
                              );
                            }}
                          />
                          <Button
                            className={styles.savebtn}
                            onClick={e => {
                              this.changepassword(
                                userProfile.password,
                                userProfile.passwordConfirm,
                                userData.id,
                                "new_password",
                                e
                              );
                            }}
                          >
                            Save
                          </Button>
                          <Button
                            className={styles.closebtn}
                            onClick={e => {
                              this.commonMiscUpdate("isPasswordOpen");
                            }}
                          >
                            Close
                          </Button>
                          <span>{errors.password}</span>
                        </span>
                      </Col>
                    </Row>
                  </Container>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  language: state.language,
  reports: state.reports
});

export default connect(
  mapStateToProps,
  {}
)(withRouter(withApollo(withAlert(UserProfileComponent))));
