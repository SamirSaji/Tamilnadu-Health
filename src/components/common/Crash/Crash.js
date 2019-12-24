import React from 'react';
import Warn from '../../../assets/images/warn.png'
import styles from './crash.less';

const Crash = props => (
    <div className={styles.errrDiv} >
        <div>
            <img style={{ width: '100px', float: 'right' }} src={Warn} alt="Warning" />
            <p>Error Occured</p>
            <hr />
            <p onClick={_ => window.location = '/'}  className={styles.errBtn} > Return Home  <i className="fa fa-home" ></i> </p>
        </div>
    </div>
)

export default Crash;