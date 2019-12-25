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
  Form,
  FormGroup,
  Input,
  Label,
  Container
} from "reactstrap";
// import { AvForm, AvFeedback, AvField, AvGroup,AvInput} from 'availity-reactstrap-validation';

class Refresh extends React.Component {
  constructor(props) {
    super(props);
    this.logmeOut = this.logmeOut.bind(this);
  }

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
              <Col lg="4" md="4" xs="12">
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

          <div>
            <Row
              style={{
                padding: "20px 0px 50px 0px"
              }}
            >
              <Col xs={{ size: 10, offset: 1 }}>
                <div>
                  <Card
                    style={{
                      borderRadius: "10px"
                    }}
                  >
                    <CardBody>
                      <h3 className={styles.errorHeadSubmit}>Raise An Issue</h3>

                      <Col
                        className={styles.inputUsername}
                        xs={{ size: 10, offset: 1 }}
                      >
                        <Row>
                          <Label
                            style={{
                              fontWeight: "400",
                              fontSize: "15px",
                              float: "left",
                              padding: "10px 0px 0px 0px",
                              margin: "0px 0px 5px 0px"
                            }}
                          >
                            Username
                          </Label>
                        </Row>
                        <Row>
                          {" "}
                          <Input
                            type="text"
                            name="text"
                            placeholder=" Enter your username"
                          />
                        </Row>
                        <Row>
                          {" "}
                          <Label
                            className={styles.labelButton}
                            style={{
                              fontWeight: "400",
                              fontSize: "15px",
                              float: "left",
                              margin: "0px"
                            }}
                          >
                            Issue Type
                          </Label>
                        </Row>
                        <Row>
                          <Col md="3" xs="12">
                            <Button className={styles.buttonName}>
                              Return Issue
                            </Button>
                          </Col>{" "}
                          <Col md="3" xs="12">
                            <Button className={styles.buttonName}>Other</Button>
                          </Col>
                          <Col md="3" xs="12">
                            <Button className={styles.buttonName}>
                              500 Error
                            </Button>
                          </Col>
                          <Col md="3" xs="12">
                            {" "}
                            <Button className={styles.buttonName}>
                              Account Issue
                            </Button>
                          </Col>
                        </Row>

                        <Row>
                          <Col>
                            <Button
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

                      {/* <Col xs={{ size: 4, offset: 4 }}></Col> */}
                    </CardBody>
                  </Card>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(withRouter(Refresh));
