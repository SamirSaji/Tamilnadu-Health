import React from "react";
import styles from "./stylesheets/Login.less";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle
} from "reactstrap";

class Divcontn extends React.Component {
  render() {
    const healthimg = require("../../../assets/images/health.jpg");
    const userimg = require("../../../assets/images/userpage.png");
    return (
        <Card className={styles.logincont} style={{height: '100%'}}>
          <Container>
            <CardBody>
              <CardTitle className={styles.title}>
                <strong>Welcome to UHC - IT Portal</strong>
              </CardTitle>
              {/* <CardTitle className={styles.title}>
                <strong>
                a Web Based  Notification System under Tamil Nadu Innovative Initiative (TANII)
                </strong>
              </CardTitle> */}
              <Container fluid>
                <Row>
                  <Col md="4">
                    <Row>
                      <Col md="12">
                        <img
                          className={styles.map}
                          src={userimg}
                          alt="Smiley face"
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col className={styles.subtitle} md="8">
                    <CardSubtitle>
                      <strong>
                        Please enter the beneficiary details
                        <br />
                        <br />
                        Mandatory Fields
                      </strong>
                    </CardSubtitle>

                    <ul>
                      <li>Demographic information</li>
                      <li>Vitals , diseasecondition , date of visit</li>
                      <li>Drugs issued the visit</li>
                    </ul>
                    <div>
                      <Row>
                        <Col md="2">
                          <img
                            className={styles.helpline}
                            src={healthimg}
                            alt="Smiley face"
                          />
                        </Col>
                        <Col md="10">
                          <p>For more information, Call 104 Health Helpline</p>
                          <p>24 hours Helpline - Public Health Control Room</p>
                        </Col>
                      </Row>
                    </div>
                    {/* <hr className={styles.line} /> */}

                    {/* <div className={styles.contact}>
                    <p>Ph.no:044 - 24350496, 24334811, 9444340496, 9361482899</p>
                  </div> */}
                  </Col>
                </Row>
              </Container>
              <hr className={styles.line} />

              <div className={styles.contact}>
                <p>Ph.no:044 - 29510400, 29510500, 9444340496, 8754448477</p>
              </div>
            </CardBody>
          </Container>
        </Card>
    );
  }
}

export default Divcontn;
