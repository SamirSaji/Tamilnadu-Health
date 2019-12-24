import React from 'react';
import spinner from './spinner.svg';
import styles from './spinner.less';
export default () => {
  return (
    <div className={styles.overlay}>
      <img
        className={styles.imag}
        src={spinner}
        alt="Loading..."
      />
    </div>
  );
};