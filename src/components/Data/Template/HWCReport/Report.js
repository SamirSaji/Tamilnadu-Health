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
        console.info('PROPS-DATA',this.props);
        this.state = {
            dataToPrint: undefined
        };
    }
    componentWillMount() {
        const newProps = this.props;
        let serviceListState = [];
        if (newProps.content) {
            let serviceHeaders = [];
            const serviceListForEmpty = this.props.serviceList;
            // eslint-disable-next-line
            serviceListForEmpty.map((service, i) => {
                serviceHeaders.push(service.service_name + ' Male', service.service_name + ' Female', service.service_name + ' Total', service.service_name + ' Referred', service.service_name + ' Followup');
            });
            console.info('CONTENT',newProps.content);
            // eslint-disable-next-line
            newProps.content.map((data, i) => {

                // if (i < 122) {
                    const servicesList = isString(data.servicesList) ? JSON.parse(data.servicesList) : data.servicesList;
                    const patientCount = isString(data.patient_count) ? JSON.parse(data.patient_count) : data.patientCount;
                    const yogaSessions = isString(data.yoga_sessions) ? JSON.parse(data.yoga_sessions) : data.yogaSessions;
                    let serviceForDrug = {};
                    // eslint-disable-next-line
                    servicesList.map((service, i) => {
                        // serviceHeaders.push(service.service_name + ' Male', service.service_name + ' Female', service.service_name + ' Total', service.service_name + ' Referred', service.service_name + ' Followup');
                        serviceForDrug[service.service_name + ` Male`] = service.male;
                        serviceForDrug[service.service_name + ` Female`] = service.female;
                        serviceForDrug[service.service_name + ` Total`] = service.total;
                        serviceForDrug[service.service_name + ` Referred`] = service.referred;
                        serviceForDrug[service.service_name + ` Followup`] = service.followup;
                    });                    
                    serviceForDrug['No. of Sessions'] = yogaSessions ? yogaSessions.sessions : '';
                    serviceForDrug['No. of Participants'] = yogaSessions ? yogaSessions.participants : '';
                    serviceForDrug['Place of Session'] = yogaSessions ? yogaSessions.place : '';
                    serviceForDrug['male_ben'] = patientCount.male;
                    serviceForDrug['fem_ben'] = patientCount.female;
                    serviceForDrug['follow_up'] = patientCount.follow_up;
                    serviceForDrug['referred_out'] = patientCount.referred_out;
                    serviceForDrug['total_ben'] = patientCount.total;
                    serviceForDrug['report_date'] = getReadableDateFormat1(data.report_date);
                    serviceForDrug['hud_name'] = data.User_report_s_district && data.User_report_s_district.user_to_hud ? data.User_report_s_district.user_to_hud.hud_name : ''
                    serviceForDrug['hud_id'] = data.User_report_s_district && data.User_report_s_district.user_to_hud ? data.User_report_s_district.user_to_hud.hud_gis_id : ''
                    serviceForDrug['block_name'] = data.User_report_s_district && data.User_report_s_district.user_to_block ? data.User_report_s_district.user_to_block.block_name : '';
                    serviceForDrug['block_id'] = data.User_report_s_district && data.User_report_s_district.user_to_block ? data.User_report_s_district.user_to_block.block_gis_id : '';
                    // new fields
                    serviceForDrug['Created By District ID'] = (data.User_report_s_district && data.User_report_s_district && data.User_report_s_district.User_to_district) ? data.User_report_s_district.User_to_district.district_id : ''
                    serviceForDrug['Created By District Name'] = (data.User_report_s_district && data.User_report_s_district && data.User_report_s_district.User_to_district) ? data.User_report_s_district.User_to_district.district_name : ''
                    serviceForDrug['Username'] = data.User_report_s_district ? data.User_report_s_district.username : '';
                    serviceForDrug['Created Institution Name'] = (data.User_report_s_district && data.User_report_s_district.phc_User) ? data.User_report_s_district.phc_User.institution_name : '';
                    serviceForDrug['Institution GP Type'] = (data.User_report_s_district && data.User_report_s_district.phc_User) ? data.User_report_s_district.phc_User.gp_type : '';
                    serviceForDrug['Institution Type'] = (data.User_report_s_district && data.User_report_s_district.phc_User) ? data.User_report_s_district.phc_User.institution_type : '';
                    serviceListState.push(serviceForDrug);
                // }
            });
            this.setState({
                 serviceListState, serviceHeaders
            })
        }
    }
    render() {
        const { serviceListState, serviceHeaders } = this.state;
        console.info('HEADERS',serviceHeaders);
        let d = new Date();
        let h = d.getHours(), m = d.getMinutes();
        let _time = (h > 12) ? (h - 12 + ':' + m + ' PM') : (h + ':' + m + ' AM');
        const fileName = `${this.props.user.username}_OP_Report_${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}_${_time}`;
        if (serviceListState === undefined ) {
            return <button>Download</button>
        } else {
            return (
                <ExcelFile filename={fileName}>
                    <ExcelSheet data={serviceListState} name='Service Listing'>
                        <ExcelColumn label={`report_date`} value={`report_date`} />
                        {/*  */}
                        <ExcelColumn label={`Created By District ID`} value={`Created By District ID`} />
                        <ExcelColumn label={`Created By District Name`} value={`Created By District Name`} />
                        <ExcelColumn label={`Username`} value={`Username`} />
                        <ExcelColumn label={`Created Institution Name`} value={`Created Institution Name`} />
                        <ExcelColumn label={`Institution GP Type`} value={`Institution GP Type`} />
                        <ExcelColumn label={`Institution Type`} value={`Institution Type`} />
                        {/*  */}
                        <ExcelColumn label={`HUD Name`} value={`hud_name`} />
                        <ExcelColumn label={`HUD Name`} value={`hud_id`} />
                        <ExcelColumn label={`Block Name`} value={`block_name`} />
                        <ExcelColumn label={`Block Name`} value={`block_id`} />
                        {/* beneficiaries start*/}
                        <ExcelColumn label={`Male Beneficiaries`} value={'male_ben'} />
                        <ExcelColumn label={`Female Beneficiaries`} value={'fem_ben'} />
                        <ExcelColumn label={`Total Beneficiaries`} value={'total_ben'} />
                        <ExcelColumn label={`Follow up Beneficiaries`} value={'follow_up'} />
                        <ExcelColumn label={`Referred Out Beneficiaries`} value={'referred_out'} />
                        {/* beneficiaries end */}
                        {serviceHeaders.map((value, i) =>
                            <ExcelColumn key={i} label={`${value}`} value={`${value}`} />
                        )}
                        <ExcelColumn label={`No. of Sessions`} value={`No. of Sessions`} />
                        <ExcelColumn label={`No. of Participants`} value={`No. of Participants`} />
                        <ExcelColumn label={`Place of Session`} value={`Place of Session`} />
                    </ExcelSheet>
                </ExcelFile>
            );
        }

    }
}

export default Download;