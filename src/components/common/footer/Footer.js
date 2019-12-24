import React from "react";
import styles from "./footer.less";
export default class Example extends React.Component {
  render() {
    return (
      <div className={styles.footerPosition}>
      <footer className={styles.footer}>
        Copyright &copy; {new Date().getFullYear()}
      </footer>
      </div>
    );
  }
}
