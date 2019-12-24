import React from "react";
import styles from "./styles.less";
import { Button } from "reactstrap";

class Scroll extends React.Component {
    handleScroll(event) {
        if (
          document.body.scrollTop > 30 ||
          document.documentElement.scrollTop > 30
        ) {
          document.getElementById("upBtn").style.display = "block";
        } else {
          document.getElementById("upBtn").style.display = "none";
        }
      }
      upClick() {
        window.scroll({
          top: 0,
          behavior: "smooth"
        });
      }
      componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
      }
      componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
      }
  render() {
    return (
      <Button onClick={this.upClick} id={"upBtn"} className={styles.upBtn}>
        <i className="fa fa-chevron-up" />
      </Button>
    );
  }
}
export default Scroll;
