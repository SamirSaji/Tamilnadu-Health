import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styles from "./stylesheets/Login.less";
import { loginUser } from "../../../actions/authActions";
import { emptyErrors } from '../../../actions/errorsActions';
import PropTypes from "prop-types";
import Button from "../../../components/common/fields/Button/Button";
import Inputtext from "../../../components/common/fields/TextFieldGroup/TextFieldGroup";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle
} from "reactstrap";
class LoginArea extends React.Component {
  constructor(props) {
    super(props);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.state = {
      forgot: true,
      email: "",
      password: "",
      errors: {}
    };
  }

  forgotPassword() {
    this.setState(oldState => ({
      forgot: !oldState.forgot
    }));
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/UHC/linelist");
    }
  }
  componentWillUnmount(){
    this.props.emptyErrors()
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/UHC/linelist");
    }
    if (nextProps.errors && nextProps.errors.payload) {
      this.setState({ errors: nextProps.errors.payload });
    }
  }
  onTodoChange(value) {
    this.setState({
      name: value
    });
  }
  login = e => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData);
  };
  render() {
    const { errors } = this.state;
    // const userimg = require('./usericon.png');
    return (
        <Card
          className={styles.logincontainer}
          style={{
            display: this.state.forgot === true ? "block" : "none" ,     height: '100%'
          }}
        >
          <Container className={styles.logintitle}>
            <CardTitle className={styles.title}>
              <strong>Login</strong>
            </CardTitle>
            <CardSubtitle className={styles.title}>
              HSC / PHC / Block / HUD
            </CardSubtitle>
          </Container>
          <Container className={styles.inputWidth}>
            <form
              id="login"
              action="/api/login"
              method="POST"
              onSubmit={this.login}
            >
              <CardBody>
                <div className={styles.textaea}>
                  <Inputtext
                    classname={styles.inputlogin}
                    label="User Name"
                    type="text"
                    value={this.state.email}
                    placeholder=""
                    error={errors.email}
                    name="email"
                    onChange={e => {
                      this.setState({ email: e.target.value });
                    }}
                  />
                  <Inputtext
                    classname={styles.inputlogin}
                    label="Password"
                    type="password"
                    value={this.state.password}
                    placeholder=""
                    error={errors.password}
                    name="password"
                    onChange={e => {
                      this.setState({ password: e.target.value });
                    }}
                  />
                </div>
              </CardBody>
              <Button
                type="submit"
                buttonname="Login"
                classname="btn btn-block"
                btncolor="success"
              />
            </form>
          </Container>
          <Container className={styles.loginLink}>
            <Row>
              <Col md="6">
                {/* <a href={null}>Admin Login</a> */}
              </Col>
              <Col md="6">
                {/* <a onClick={this.forgotPassword}>Forgot Password</a> */}
              </Col>
            </Row>
          </Container>
        </Card>
    );
  }
}

LoginArea.propTypes = {
  loginUser: PropTypes.func.isRequired,
  emptyErrors: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser,emptyErrors }
)(withRouter(LoginArea));
