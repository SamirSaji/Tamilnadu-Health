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
  Label
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
          <Row>
            <Col xs={{ size: 10, offset: 1 }} >
              <div>
                <Card>
                  <CardBody>
                    <h3 className={styles.errorHeadSubmit}>Raise An Issue</h3>
                    <Col
                      className={styles.inputUsername}
                      md={{ size: 4, offset: 4 } }
                    >
                      <Form className={styles.formName}>
                        <FormGroup>
                          <Label
                            style={{
                              fontWeight: "400",
                              fontSize: "15px",
                              float: "left"
                            }}
                          >
                            UserName
                          </Label>
                          <Input
                            type="text"
                            name="email"
                            id="exampleEmail"
                            placeholder="UserName"
                            required
                            
                          />
                          <Label className={styles.labelButton}
                            style={{
                              fontWeight: "400",
                              fontSize: "15px",
                              float: "left",
                              paddingBottom: "10px"
                            }}
                          >
                            Issue Type
                          </Label>
                          <Button color="primary">Another</Button>
                          <Button>another</Button>
                          <Button>another</Button>
                          <Button>another</Button>
                        </FormGroup>
                      </Form>
                    </Col>

                    {/* <Col xs={{ size: 4, offset: 4 }}></Col> */}
                  </CardBody>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(withRouter(Refresh));
