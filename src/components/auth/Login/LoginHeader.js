import React from "react";
import styles from "./stylesheets/Login.less";
import { Container, Row, Col } from "reactstrap";
const userimg = require("../../../assets/images/logo.png");
export default class Example extends React.Component {
  render() {
    const cdsp = require('../../common/Header/logo.jpg');
    const tnlogo = require('../../common/Header/tnlogo.png');
    return (
      <Container fluid className={styles.headerbg}>
        <Row>
          <Col className={styles.logo} md="1" xs="3">
            <img src={userimg} alt="Home" />
          </Col>
          <Col  md="10" xs="4" style={{ textAlign: "center" }}>
            <img style={{
              paddingTop: '0px',
              paddingBottom: "5px",
            }} className={styles.logo1} src={tnlogo} alt="TNlogo" />
          </Col>
          <Col md="1" xs="5" style={{
              padding: "24px 30px",
              textAlign: "right",
              paddingBottom: "0px"
            }}>
            <img className={styles.logoCdsp} src={cdsp} alt="TNlogo" />
          </Col>
        </Row>
      </Container>
    );
  }
}
