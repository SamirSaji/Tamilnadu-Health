import React from "react";
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class Download extends React.Component {
    render() {
        const downloadData = this.props.data;
        let headers = Object.keys(downloadData[0]);
        // const fileName = `${this.props.user.username}_OP_Report_${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}_${_time}`;
        const fileName = this.props.filename;
            return (
                <ExcelFile filename={fileName} hideElement={true}>
                    <ExcelSheet data={downloadData} name={fileName}>
                        {headers.map((value, i) =>
                            <ExcelColumn key={i} label={`${value}`} value={`${value}`} />
                        )}
                </ExcelSheet>
                </ExcelFile>
            );

    }
}

export default Download;