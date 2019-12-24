import React from "react";
import ReactExport from "react-data-export";
import { getReadableDateFormat1 } from '../../../../utils/Common'
import { isString } from "util";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class Download extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataToPrint: undefined
        };
    }
    componentWillReceiveProps(newProps) {
        let drugListState = [];
        if (newProps.content) {
            let drugHeaders = [];
            const drugListForEmpty = this.props.drugsList;
            // eslint-disable-next-line
            drugListForEmpty.map((drug, i) => {
                drugHeaders.push(drug.drug_name + ' Opening', drug.drug_name + ' Received', drug.drug_name + ' Issued', drug.drug_name + ' Balance');
            });
            // eslint-disable-next-line
            newProps.content.map((data, i) => {
                if (i < 122) {
                    const drugsList = isString(data.drugsList) ? JSON.parse(data.drugsList) : data.drugsList;
                    let testForDrug = {};
                    // eslint-disable-next-line
                    drugsList.map((drug, i) => {
                        // drugHeaders.push(drug.drug_name + ' Opening', drug.drug_name + ' Received', drug.drug_name + ' Issued', drug.drug_name + ' Balance');
                        testForDrug[drug.drug_name + ` Opening`] = drug.opening;
                        testForDrug[drug.drug_name + ` Received`] = drug.received;
                        testForDrug[drug.drug_name + ` Issued`] = drug.issued;
                        testForDrug[drug.drug_name + ` Balance`] = drug.opening + drug.received - drug.issued;
                    }); 
                    testForDrug['Created By District ID'] = (data.User_report_district && data.User_report_district && data.User_report_district.User_to_district) ? data.User_report_district.User_to_district.district_id : ''
                    testForDrug['Created By District Name'] = (data.User_report_district && data.User_report_district && data.User_report_district.User_to_district) ? data.User_report_district.User_to_district.district_name : ''
                    testForDrug['Username'] = data.User_report_district ? data.User_report_district.username : '';
                    testForDrug['Created Institution Name'] = (data.User_report_district && data.User_report_district.phc_User) ? data.User_report_district.phc_User.institution_name : '';
                    testForDrug['Institution GP Type'] = (data.User_report_district && data.User_report_district.phc_User) ? data.User_report_district.phc_User.gp_type : '';
                    testForDrug['Institution Type'] = (data.User_report_district && data.User_report_district.phc_User) ? data.User_report_district.phc_User.institution_type : '';
                    testForDrug['report_date'] = getReadableDateFormat1(data.report_date);
                    testForDrug['Created by'] = data.User_report_district ? data.User_report_district.username : '';
                    testForDrug['district_name'] = data.User_report_district ? data.User_report_district.User_to_district.district_name : '';
                    testForDrug['hud_name'] = data.User_report_district && data.User_report_district.user_to_hud ? data.User_report_district.user_to_hud.hud_name : '';
                    testForDrug['hud_id'] = data.User_report_district && data.User_report_district.user_to_hud ? data.User_report_district.user_to_hud.hud_gis_id : '';
                    testForDrug['block_name'] = data.User_report_district && data.User_report_district.user_to_block ? data.User_report_district.user_to_block.block_name : '';
                    testForDrug['block_id'] = data.User_report_district && data.User_report_district.user_to_block ? data.User_report_district.user_to_block.block_gis_id : '';
                    drugListState.push(testForDrug);
                }
            });
            this.setState({
                drugListState, drugHeaders
            })
        }
    }
    render() {
        const { drugListState, drugHeaders } = this.state;
        let d = new Date();
        let h = d.getHours(), m = d.getMinutes();
        let _time = (h > 12) ? (h - 12 + ':' + m + ' PM') : (h + ':' + m + ' AM');
        const fileName = `${this.props.user.username}_OP_Report_${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}_${_time}`;
        if ( drugListState === undefined) {
            return <button>Download</button>
        } else {
            return (
                <ExcelFile filename={fileName}>
                    <ExcelSheet data={drugListState} name='Drug Listing'>
                        <ExcelColumn label={`report_date`} value={`report_date`} />
                        <ExcelColumn label={`Created By District ID`} value={`Created By District ID`} />
                        <ExcelColumn label={`Created By District Name`} value={`Created By District Name`} />
                        <ExcelColumn label={`Username`} value={`Username`} />
                        <ExcelColumn label={`Created Institution Name`} value={`Created Institution Name`} />
                        <ExcelColumn label={`Institution GP Type`} value={`Institution GP Type`} />
                        <ExcelColumn label={`Institution Type`} value={`Institution Type`} />
                        <ExcelColumn label={`HUD Name`} value={`hud_name`} />
                        <ExcelColumn label={`HUD ID`} value={`hud_id`} />
                        <ExcelColumn label={`Block Name`} value={`block_name`} />
                        <ExcelColumn label={`Block ID`} value={`block_id`} />
                        <ExcelColumn label={`District Name`} value={`district_name`} />
                        {drugHeaders.map((value, i) =>
                            <ExcelColumn key={i} label={`${value}`} value={`${value}`} />
                        )}
                    </ExcelSheet>
                </ExcelFile>
            );
        }

    }
}

export default Download;