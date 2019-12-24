import React from "react";
import Loginheader from "./LoginHeader";
import Logincontainer from "./LoginContainer";
import Footer from "../../common/footer/Footer";
import styles from "./stylesheets/Common.less";
class Login extends React.Component {
  render() {
    return (
      <div className={styles.bgimg}>
        <Loginheader />
        <Logincontainer />
        <Footer />
      </div>
    );
  }
}

export default Login;
