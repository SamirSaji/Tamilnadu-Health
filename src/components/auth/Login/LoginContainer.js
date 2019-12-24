import React from "react";
import styles from "./stylesheets/Login.less";
import LoginDetails from "./LoginDetails";
import LoginArea from "./LoginArea";
import { Container, Row, Col } from "reactstrap";

class Logincontainer extends React.Component {
  render() {
    return (
      <Container fluid className={styles.logincontant}>
        <Row>
          <Col lg="12" className={styles.headerTitle}>
          <h2>
              <b style={{
                  fontSize: '24px'
                }}>
                Welcome to UHC - IT Portal
              </b>
            </h2> 
          </Col>
          <Col md="8">
            <LoginDetails />
          </Col>
          <Col md="4">
            <LoginArea />
          </Col>
        </Row>
      </Container>
    );
  }
}
export default Logincontainer;
