import React from "react";
import styles from "./NotFound.css";
export default class Example extends React.Component {
  componentDidMount() {
    console.log("componentDidMount");
  }
  componentWillMount() {
    console.log("componentWillMount");
  }
  render() {
    return (
      <div>
        <div className={styles.errorPage}>
          <div className={styles.errorInner}>
          <h1>Welcome to electronic Daily Disease Surveillance System (eDDSS), a Web Based</h1>
          <h1>Communicable Disease Notification under TamilNadu Innovative Initiative (TANII)</h1>
            <div className={styles.pesanEror}>404</div>
            <p className={styles.balikHome}>
              <a href="/">Back to Home</a>
            </p>
            <br />
          </div>
        </div>
      </div>
    );
  }
}
