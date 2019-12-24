import React from "react";
import { Button } from "reactstrap";
import { withRouter } from "react-router-dom";
import { APP_LAST_ONLINE } from "../../../utils/constants";
const PagesList = {
  "New Entry": "lineentry",
  "OP Line List": "linelist",
  "PHC Status": "phcstatus",
  "HSC Status": "hscstatus",
  "OP report": "report",
  "Drug Receipt": "drugreceipt",
  "Drug Utilisation": "drugreport"
};
const PagesListForHsc = {
  "New Entry": "lineentry",
  "OP Line List": "linelist",
  "HSC Status": "hscstatus",
  "OP report": "report",
  "Drug Receipt": "drugreceipt",
  "Drug Utilisation": "drugreport"
};
const PagesListForPhc = {
  "New Entry": "lineentry",
  "OP Line List": "linelist",
  "PHC Status": "phcstatus",
  "OP report": "report",
  "Drug Receipt": "drugreceipt",
  "Drug Utilisation": "drugreport"
};
const iconsList = {
  "New Entry": '<i class="fa fa-plus-square"/>&emsp;',
  "OP Line List": '<i class="fa fa-list"/>&emsp;',
  "PHC Status": '<i class="fa fa-hospital-o"/>&emsp;',
  "HSC Status": '<i class="fa fa-hospital-o"/>&emsp;',
  "OP report": '<i class="fa fa-file-text"/>&emsp;',
  "Drug Receipt": '<i class="fa fa-cart-plus"/>&emsp;',
  "Drug Utilisation": '<i class="fa fa-bar-chart"/>&emsp;'
};

export class displayPages extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentURL: this.props.location.pathname.split('/')[2],
      lastOnline: new Date(localStorage.getItem(APP_LAST_ONLINE))
    }
  }

  componentDidMount() {
    this.getLastSyncTime();
  }

  formatDate = (date: Date) => `${date.getDate()}-${date.getMonth()},${date.getFullYear()}`

  getLastSyncTime = () => {
    window.addEventListener('online', () => {
      this.setState({ lastOnline: new Date(localStorage.getItem(APP_LAST_ONLINE)) });
    })
  }

  render() {

    let { userData, history } = this.props;

    let renderPageList =
      userData.alias === "hsc"
        ? PagesListForHsc
        : userData.alias === "phc"
          ? PagesListForPhc
          : PagesList;

    // eslint-disable-next-line
    return (
      <React.Fragment>
        {
          Object.keys(renderPageList).map((page, i) => (
            <Button
              style={{
                padding: "8px 10px", marginLeft: "1px",
                ...(this.state.currentURL === Object.values(renderPageList)[i]
                  ? { color: "#fff", backgroundColor: "#00695C" }
                  : {})
              }}
              onClick={() => {
                if (page !== 'New Entry') history.push(`/UHC/${renderPageList[page]}`)
                else history.push(`/UHC/${renderPageList[page]}`)
              }
              }
              key={i}
            >
              <span dangerouslySetInnerHTML={{ __html: iconsList[page] }} />
              {page}
            </Button>
          ))
        }
        <span>
          <div style={{ display : "inline-block", paddingLeft : "25px" }}>
            {/* {`LAST ONLINE : ${this.formatDate(this.state.lastOnline)}`} */}
            <a href={'/help'} ><i class="fa fa-question-circle" style={{ fontSize: "22px", position: "absolute", top: "10px", color: "#292b2c" }} aria-hidden="true"></i></a>
          </div>
        </span>
      </React.Fragment >
    )
  }
}

export default withRouter(displayPages);
