import React, { Component } from 'react';
import { getReadableDateFormat1 } from '../../../utils/Common';
export default class profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileData: null
        };
    }
    render() {
        const { institutionName,visitDate } = this.props;
            return (
                <div className="card" style={{
                    padding : '10px 6px 10px 22px',
                    marginTop:'10px',
                    }}>
                    <h6><i class="fa fa-address-book" aria-hidden="true"></i>&nbsp;&nbsp;Visit Details:</h6>
                  Institution Name - {institutionName ? institutionName : 'Not Available'}
                  <br/>
                  Visit Date - {visitDate !== null ? `${getReadableDateFormat1(visitDate)}` : 'Not Available'}
                </div>
            )

    }
}
