import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  Col,
  Row,
  NavbarBrand
} from "reactstrap";
import styles from "../../../assets/styles/headerstyle/Header.less";
import { logoutUser } from "../../../actions/authActions";
// import { APP_LAST_ONLINE } from "../../../utils/constants";
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.openNav = this.openNav.bind(this);
    this.toggle = this.toggle.bind(this);
    this.logMeOut = this.logMeOut.bind(this);
    this.openNavNew = this.openNavNew.bind(this);
    this.activeMenu = this.activeMenu.bind(this);
    this.state = {
      active: true,
      sideBar: true,
      sideBarNew: true,
      dropdownOpen: false
    };
  }

  activeMenu() {
    this.setState({
      active: !this.state.active

    });
  }

  logMeOut() {
    this.props.logoutUser();
  }
  componentWillReceiveProps(newProps) {
    if (newProps.auth.isAuthenticated === false) {
      this.props.history.push("/UHC/lineentry");
    }
  }
  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }
  openNav() {
    this.setState(oldState => ({
      sideBar: !oldState.sideBar
    }));
  }
  openNavNew() {
    this.setState(oldState => ({
      sideBarNew: !oldState.sideBarNew
    }));
  }
  render() {
    const { user } = this.props.auth;
    const userimg = require("../../../assets/images/logo.png");
    const userPhoto = require("./user.png");
    const tnLogo = require('./tnlogo.png');
    const cdsp = require('./nhmlogo.jpg');
    return (
      <div>
        <Container fluid className={styles.headerbg}>
          <Row>
            <Col md="2" xs="2" href="#" className={styles.bglogo}>
              <span className={styles.opneIconNew} onClick={this.openNavNew}>
                &#9776;
              </span>
              <NavbarBrand className="mr-auto" href={"/UHC/lineentry"}>
                <img className={styles.logo} src={userimg} alt="Home" />
              </NavbarBrand>
            </Col>
            <Col md="4" className={styles.emptySpace}>
            </Col>
            <Col md="2" xs="6" className={styles.maintitle}>
              <img style={{
                paddingTop: '0px'
              }} className={styles.logotn} src={tnLogo} alt="TNlogo" />
              {/* <h2>

              </h2> */}
              {/* <h5>
                Central Disease Surveillance Portal
              </h5> */}
            </Col>
            <Col md="2" className={styles.cdspImg}>
              <img style={{
                paddingTop: '11px'
              }} className={styles.logo} src={cdsp} alt="TNlogo" />
            </Col>
            <Col md="2" xs="2">
              <Dropdown
                className={styles.signup}
                isOpen={this.state.dropdownOpen}
                toggle={this.toggle}
              >
                <DropdownToggle
                  className={styles.test}
                  tag="span"
                  onClick={this.toggle}
                  data-toggle="dropdown"
                  aria-expanded={this.state.dropdownOpen}
                >
                  <span>
                    <img className={styles.logout} src={userPhoto} alt="Home" />
                  </span>
                  <span className={styles.user}>{`Hi ${
                    user.username
                    } `}</span>
                </DropdownToggle>
                <DropdownMenu right className={styles.menu}>
                  <NavLink to={"/UHC/profile"} style={{ textDecoration: "none" }}>
                    <DropdownItem
                      className={styles.DropdownItem}
                      href={null}
                    >
                      Profile
                  </DropdownItem>
                  </NavLink>
                  <DropdownItem divider />
                  <DropdownItem
                    className={styles.DropdownItem}
                    href={null}
                    onClick={this.logMeOut}
                  >
                    Logout
                  </DropdownItem>

                </DropdownMenu>
              </Dropdown>
            </Col>
            <Col xs="2" className={styles.menuicon}>
              <span
                style={{ fontSize: "25px", cursor: "pointer" }}
                onClick={this.openNav}
              >
                &#9776;
              </span>
            </Col>
          </Row>
        </Container>
        {/* mobile side bar */}
        <Container
          className={styles.sidenav}
          style={{
            padding: "0px",
            width: this.state.sideBar === true ? "0%" : "100%"
          }}
        >
          <Col xs="12" className={"hidden-sm"} style={{ height: "100%" }}>
            <Row style={{ height: "100%" }}>
              <Col
                xs="8"
                className={styles.sideBarMenu}
                style={{
                  display: this.state.sideBar === true ? "none" : "block"
                }}
              >
                {user.alias !== 'lab' && <NavLink to={"/UHC/linelist"} activeClassName={styles.active}>
                  Linelist
                </NavLink>}
                <NavLink to={"/UHC/lineentry"} activeClassName={styles.active}>
                  New&nbsp;Line&nbsp;Entry
                </NavLink>
                <NavLink to={"/UHC/drugreceipt"} activeClassName={styles.active}>
                  Drug&nbsp;Receipt
                </NavLink>
                {(user.alias !== 'lab') && <NavLink to={"/UHC/report"} activeClassName={styles.active}>
                  Daily&nbsp;Report
                </NavLink>}
                <NavLink to={"/UHC/drugreport"} activeClassName={styles.active}>
                  Drug&nbsp;Report
                </NavLink>
                {(user.alias !== 'phc') && <NavLink to={"/UHC/hscstatus"} activeClassName={styles.active}>
                  HSC&nbsp;Status
                </NavLink>}
                {(user.alias !== 'hsc') && <NavLink to={"/UHC/phcstatus"} activeClassName={styles.active}>
                  PHC&nbsp;Status
                </NavLink>}
              </Col>
              <Col
                xs="4"
                className={styles.closeSideBar}
                style={{ opacity: this.state.sideBar === true ? "0" : "1" }}
                onClick={this.openNav}
              />
            </Row>
          </Col>
        </Container>
        {/* Newsidebar web side bar */}
        <Col className={styles.Sidebar1}>
          <Container
            className={styles.sidenavNew}
            style={{
              padding: "0px",
              width: this.state.sideBarNew === true ? "80px" : "210px"
            }}
          >
            <Col className={styles.sideBarMenuNew} style={{ height: "100vh" }}>
              {user.alias !== 'lab' && <NavLink to={"/UHC/linelist"} activeClassName={styles.active}>
                <span>
                  <i className={"fa fa-list"} />
                </span>
                <span
                  className={styles.muneListNew}
                  style={{
                    paddingLeft:
                      this.state.sideBarNew === true ? "40px" : "21px"
                  }}
                >
                  Line&nbsp;List
                </span>
              </NavLink>}
              <NavLink to={"/UHC/lineentry"} activeClassName={styles.active}>
                <span>
                  {/* <i className={"fa fa-home "} /> */}
                  <i className={"fa fa-plus-square"} />
                </span>
                <span
                  className={styles.muneListNew}
                  style={{
                    paddingLeft:
                      this.state.sideBarNew === true ? "40px" : "21px"
                  }}
                >
                  New&nbsp;Line&nbsp;Entry
                </span>
              </NavLink>
              {/* receipt page start */}
              <NavLink to={"/UHC/drugreceipt"} activeClassName={styles.active}>
                <span>
                  <i className={"fa fa-cart-plus"} />
                </span>
                <span
                  className={styles.muneListNew}
                  style={{
                    paddingLeft:
                      this.state.sideBarNew === true ? "40px" : "21px"
                  }}
                >
                  Drug&nbsp;Receipt
                </span>
              </NavLink>
              {/* receipt page end */}
              <NavLink to={"/UHC/report"} activeClassName={styles.active}>
                <span>
                  <i className={"fa fa-file-text"} />
                </span>
                <span
                  className={styles.muneListNew}
                  style={{
                    paddingLeft:
                      this.state.sideBarNew === true ? "40px" : "21px"
                  }}
                >
                  OP&nbsp;Report
                </span>
              </NavLink>
              <NavLink to={"/UHC/drugreport"} activeClassName={styles.active}>
                <span>
                  <i className={"fa fa-bar-chart"} />
                </span>
                <span
                  className={styles.muneListNew}
                  style={{
                    paddingLeft:
                      this.state.sideBarNew === true ? "40px" : "21px"
                  }}
                >
                  Drug&nbsp;Report
                </span>
              </NavLink>
              {(user.alias !== 'hsc') && <NavLink to={"/UHC/phcstatus"} activeClassName={styles.active}>
                <span>
                  <i className={"fa fa-hospital-o"} />
                </span>
                <span
                  className={styles.muneListNew}
                  style={{
                    paddingLeft:
                      this.state.sideBarNew === true ? "40px" : "21px"
                  }}
                >
                  PHC&nbsp;Statuss
                </span>
              </NavLink>}
              {(user.alias !== 'phc') && <NavLink to={"/UHC/hscstatus"} activeClassName={styles.active}>
                <span>
                  <i className={"fa fa-hospital-o"} />
                </span>
                <span
                  className={styles.muneListNew}
                  style={{
                    paddingLeft:
                      this.state.sideBarNew === true ? "40px" : "21px"
                  }}
                >
                  HSC&nbsp;Status
                </span>
              </NavLink>}
            </Col>
          </Container>
        </Col>
      </div>
    );
  }
}

Header.propTypes = {
  logoutUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(withRouter(Header));
