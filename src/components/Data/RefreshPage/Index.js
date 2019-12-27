import React from "react";
import styles from "./styles/styles.less";
import { logoutUser } from "../../../actions/authActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Col,
  Row,
  Button,
  Card,
  CardBody,
  Input,
  Label,
  Form,
} from "reactstrap";
import { request } from "graphql-request";
import config from "../../../config";

class Refresh extends React.Component {
  constructor(props) {
    super(props);
    this.logmeOut = this.logmeOut.bind(this);
    this.state = { value: "" };
    this.state = { buttonText: "" };
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };
  handleFunc = (event, type) => {
    this.setState({ button: type });
  };

  handleSubmit = event => {
    userNameValid(this.state.value, this.state.button);
    event.preventDefault();
  };

  reloadtoHome() {
    window.location.href = "/";
  }
  reloadPage() {
    window.location.reload(true);
  }
  logmeOut() {
    this.props.logoutUser();
    window.location.href = "/login";
  }

  render() {
    return (
      <div>
        <div className={styles.errorPage}>
          <div className={styles.errorInner}>
            <Row>
              <h3 className={styles.headers}>
                {" "}
                <i
                  class="far fa-question-circle"
                  style={{
                    fontWeight: "400 !important"
                  }}
                ></i>{" "}
                Help Page
              </h3>
            </Row>
            <Row className={styles.parent}>
              <Col lg="4" e md="4" xs="12">
                <div className={styles.child + " childHover "}>
                  <h5
                    style={{
                      fontWeight: "bold"
                    }}
                  >
                    Refresh
                  </h5>
                  <ul>
                    <li className={styles.innerText}>
                      {" "}
                      Please click this button if you see a 500 error page in
                      UHC Application.
                    </li>
                    <hr />{" "}
                    <li className={styles.innerText}>
                      UHC பயன்பாட்டில் 500 பிழை பக்கத்தைக் கண்டால் இந்த
                      பொத்தானைக் கிளிக் செய்யவும்.
                    </li>
                  </ul>

                  <a onClick={this.reloadPage}>
                    {" "}
                    <Button
                      className={styles.balikHome}
                      style={{
                        background: "#00695C"
                      }}
                    >
                      Click Here
                    </Button>
                  </a>
                </div>
              </Col>
              <Col lg="4" md="4" xs="12">
                <div className={styles.child + " childHover"}>
                  <h5
                    style={{
                      fontWeight: "bold"
                    }}
                  >
                    Log Out
                  </h5>
                  <ul>
                    <li className={styles.innerText}>
                      Please click this button if you are unable to log out from
                      UHC Application.
                    </li>
                    <hr />{" "}
                    <li className={styles.innerText}>
                      UHC பயன்பாட்டிலிருந்து வெளியேற முடியாவிட்டால் இந்த
                      பொத்தானைக் கிளிக் செய்யவும்.
                    </li>
                  </ul>

                  <a onClick={this.logmeOut}>
                    {" "}
                    <Button
                      className={styles.balikHome}
                      style={{
                        background: "#00695C"
                      }}
                    >
                      Click Here
                    </Button>
                  </a>
                </div>
              </Col>
              <Col lg="4" md="4" xs="12">
                <div className={styles.child + " childHover"}>
                  <h5
                    style={{
                      fontWeight: "bold"
                    }}
                  >
                    Bact To Home
                  </h5>
                  <ul>
                    <li className={styles.innerText}>
                      Please click this button if you want to go back to the
                      linelist page.
                    </li>
                    <hr />
                    <li className={styles.innerText}>
                      நீங்கள் மீண்டும் அதே பக்கத்திற்குச் செல்ல விரும்பினால்
                      இந்த பொத்தானைக் கிளிக் செய்யவும்.
                    </li>
                  </ul>

                  <a onClick={this.reloadtoHome}>
                    {" "}
                    <Button
                      className={styles.balikHome}
                      style={{
                        background: "#00695C"
                      }}
                    >
                      Click Here
                    </Button>
                  </a>
                </div>
              </Col>
            </Row>
          </div>

          <Form>
            <div>
              <Row
                style={{
                  padding: "20px 0px 50px 0px"
                }}
              >
                <Col xs={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }}>
                  <div>
                    <Card
                      style={{
                        borderRadius: "10px"
                      }}
                    >
                      <CardBody>
                        <h3 className={styles.errorHeadSubmit}>
                          Raise An Issue
                        </h3>

                        <Col
                          className={styles.inputUsername}
                          md={{ size: 6, offset: 3 }}
                          xs={{ size: 10, offset: 1 }}
                        >
                          <Row>
                            {/* <FormGroup> */}
                              <Label
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "15px",
                                  float: "left",
                                  padding: "10px 0px 0px 0px",
                                  margin: "0px 0px 5px 0px"
                                }}
                              >
                                Username
                              </Label>
                              <Input for="exampleEmail"
                                value={this.state.value}
                                onChange={this.handleChange}
                                type="text"
                                placeholder=" Enter your username"
                                invalid
                                style={{
                                  borderRadius: "25px",
                                  fontSize: "18px"
                                }}
                              />
                              {/* <FormFeedback invalid>
                                Oh noes! that name is already taken
                              </FormFeedback> */}
                            {/* </FormGroup> */}
                          </Row>
        
                          <Row>
                            {" "}
                            <Label
                              className={styles.labelButton}
                              style={{
                                fontSize: "15px",
                                float: "left",
                                margin: "0px",
                                fontWeight: "bold",
                                paddingTop: "20px"
                              }}
                            >
                              Issue Type
                            </Label>
                          </Row>
                          <Row>
                            <Col xl="3" lg="3" md="12" sm="12" xs="12">
                              <Button
                                className={styles.buttonName}
                                onClick={e => this.handleFunc(e, "500 Error")}
                              >
                                500 Error
                              </Button>
                            </Col>{" "}
                            <Col xl="3" lg="3" md="12" sm="12" xs="12">
                              <Button
                                className={styles.buttonName}
                                button=" Unable to save line entry"
                                onClick={e =>
                                  this.handleFunc(
                                    e,
                                    " Unable to save line entry"
                                  )
                                }
                              >
                                Unable to save line entry
                              </Button>
                            </Col>
                            <Col xl="3" lg="3" md="12" sm="12" xs="12">
                              <Button
                                className={styles.buttonName}
                                button=" Unable to log in"
                                onClick={e =>
                                  this.handleFunc(e, " Unable to login")
                                }
                              >
                                Unable to login
                              </Button>
                            </Col>
                            <Col xl="3" lg="3" md="12" sm="12" xs="12">
                              {" "}
                              <Button
                                className={styles.buttonName}
                                button="Other"
                                onClick={e => this.handleFunc(e, "  Other")}
                              >
                                Other
                              </Button>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <Button
                                type="submit"
                                onClick={this.handleSubmit}
                                style={{
                                  backgroundColor: "#00695C",
                                  color: "#fff",
                                  margin: "15px 0px"
                                }}
                              >
                                Submit
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                      </CardBody>
                    </Card>
                  </div>
                </Col>
              </Row>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});
const userNameValid = async (userValue, userIssue) => {
  const url = `${config.apiURL}/graphql`;
  const query = `mutation{
    createUHCTickets(username :"${userValue}" , type : "${userIssue}"){
      id
    }
  }`;
  await request(url, query)
    .then(async () => {
      alert('Your Issue Submitted')
      window.location.replace("/");
    })
    .catch(err => {
      alert("Invalid User Name, Please Enter Correct Name");
    });
};

export default connect(mapStateToProps, { logoutUser })(
  withRouter(Refresh),
  userNameValid
);
