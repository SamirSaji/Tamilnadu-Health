import React from "react";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import styles from "./stylesheets/DSUEntry.less";
import 'react-datepicker/dist/react-datepicker.css';

class Date extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: moment()
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
  }
  render() {
    return (
      <div className={styles.withDate}>
        <DatePicker
          className={styles.databorder}
          //   selected={this.state.startDate}
            // onChange={handleChange}
          placeholderText="DD/MM/YYYY"

        >
        </DatePicker>
      </div>
    );
  }
}

export default Date;
