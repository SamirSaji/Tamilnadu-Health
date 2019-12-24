import React from "react";
import styles from "../NotFound/NotFound.css";
export default class Example extends React.Component {
    componentDidMount() {
        // setTimeout(()=>{
        //     window.location.href = "/UHC/linelist";
        // },2000)
    }
    render() {
        return (
            <div>
                <div className={styles.errorPage}>
                    <div className={styles.errorInner}>
                        <h1>
                            This page is under Development. If you see this in production, Please contact the admin.
            You will redirected to home.</h1>
                        <div className={styles.pesanEror}>500</div>
                        <a href="/UHC/linelist"> <p className={styles.balikHome}>
                            Back to Home
                        </p></a>
                        <br />
                    </div>
                </div>
            </div>
        );
    }
}
