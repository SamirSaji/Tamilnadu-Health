import React from "react";
import ReactExport from "react-data-export";
import { getReadableDateFormat1 } from '../../../../utils/Common';
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
        if (newProps.content) {
            const { drugsList, labList, diagnosisList } = this.props;
            // eslint-disable-next-line
            const newList = newProps.content.map((list, i) => {
                const localObj = {
                    outcome: list.outcome ? list.outcome : '',
                    name:list.user_pds_line ? list.user_pds_line.name : '',
                    constructed_address:list.user_pds_line ? list.user_pds_line.constructed_address : '',
                    address2:list.user_pds_line ? list.user_pds_line.address2 : '',
                    gender:list.user_pds_line ? list.user_pds_line.gender : '',
                    age:list.user_pds_line ? list.user_pds_line.age : '',
                    visit_date:list.visit_date ? getReadableDateFormat1(list.visit_date) : '',
                    vital_bloodPressureDown:list.vital_bloodPressureDown ? list.vital_bloodPressureDown : '',
                    vital_bloodPressureUp:list.vital_bloodPressureUp ? list.vital_bloodPressureUp : '',
                    vital_height:list.vital_height ? list.vital_height : '',
                    vital_pulse:list.vital_pulse ? list.vital_pulse : '',
                    vital_weight:list.vital_weight ? list.vital_weight : '',
                    vital_temperature:list.vital_temperature ? list.vital_temperature : '',
                    outcome_date: list.outcome_date ? getReadableDateFormat1(list.outcome_date) : '',
                    block_name:list.ptent_mde_user.user_to_block ? list.ptent_mde_user.user_to_block.block_name : '',
                    block_id:list.ptent_mde_user.user_to_block ? list.ptent_mde_user.user_to_block.block_gis_id : '',
                    hud_name:list.ptent_mde_user.user_to_hud ? list.ptent_mde_user.user_to_hud.hud_name : '',
                    hud_id:list.ptent_mde_user.user_to_hud ? list.ptent_mde_user.user_to_hud.hud_gis_id : '',
                    district_name: list.user_pds_line.district_name_user ? list.user_pds_line.district_name_user.district_name : '',
                    hab_name: list.user_pds_line.hab_name_user ? list.user_pds_line.hab_name_user.habitation_name : '',
                    mobile: list.user_pds_line.mobile ? list.user_pds_line.mobile : '',
                    village_name: list.user_pds_line.village_name_user ? list.user_pds_line.village_name_user.village_name : '',
                    visit_id: list.visit_id,
                    source:list.user_pds_line.mr_ff ? ('MR FF') : 'NEW FF',
                    // new ones
                    created_district_id: (list.ptent_mde_user && list.ptent_mde_user.User_to_district) ? list.ptent_mde_user.User_to_district.district_id : '',
                    created_district_name: (list.ptent_mde_user && list.ptent_mde_user.User_to_district) ? list.ptent_mde_user.User_to_district.district_name : '',
                    created_block_name: '',
                    institution_name:(list.ptent_mde_user && list.ptent_mde_user) ? list.ptent_mde_user.phc_User.institution_name : '',
                    created_username:list.ptent_mde_user ? list.ptent_mde_user.username : '', 
                    created_gp_type:(list.ptent_mde_user && list.ptent_mde_user.phc_User) ? list.ptent_mde_user.phc_User.gp_type : '',
                    created_institution_type:(list.ptent_mde_user && list.ptent_mde_user.phc_User) ? list.ptent_mde_user.phc_User.institution_type : '',
                    created_type_id:(list.ptent_mde_user && list.ptent_mde_user.phc_User) ? list.ptent_mde_user.phc_User.type_id : '',

                };
                if(list.patient_drug_entry) {
                    // eslint-disable-next-line
                    drugsList.map((drug,i) => {
                        if(list.patient_drug_entry)
                        // eslint-disable-next-line
                        list.patient_drug_entry.map((drugSmall,i) => {
                          if(drugSmall.drug_id === drug.drug_id) {
                              localObj[`${drug.drug_name} dosage`] = drugSmall.quantity;
                          }
                        })
                    });
                }
                list['vital_weight'] = list.vital_weight;
                list['vital_height'] = list.vital_height;
                list['vital_temp'] = list.weight;
                list['vital_pulse'] = list.vital_pulse;
                list['vital_bp_down'] = list.vital_bloodPressureDown;
                list['vital_bp_up'] = list.vital_bloodPressureUp;
                if(list.patient_lab_entry){
                    // eslint-disable-next-line
                    labList.map((lab1,i) => {
                        if(list.patient_lab_entry){
                            // eslint-disable-next-line
                            list.patient_lab_entry.map((lab2,i) => {
                                if(lab1.test_id === lab2.test_id) {
                                    localObj[`${lab1.test_name} result`] = lab2.result;
                                }
                            })
    
                        }
                    })
                }
                if(list.patient_diagnos_entry){
                    // eslint-disable-next-line
                    list.patient_diagnos_entry.map((diag,i) => {
                        // eslint-disable-next-line
                        diagnosisList.map(diagg => {
                            if(diagg.diagnosis_id === diag.diagnosis_id) {
                                localObj[`${diagg.diagnosis_name} diag`] = 'Yes';
                            }
                        })
                    })
                }
                return localObj;
            });
            this.setState({
                newList
            })
        }
    }
    render() {
        const { newList } = this.state;
        const { drugsList, labList, diagnosisList } = this.props;
        let d = new Date();
        let h = d.getHours(), m = d.getMinutes();
        let _time = (h > 12) ? (h - 12 + ':' + m + ' PM') : (h + ':' + m + ' AM');
        const fileName = `${this.props.user.username}_IP_Line_List_${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}_${_time}`;
        if (newList === undefined) {
            return <button>Download</button>
        } else {
            return (
                <ExcelFile filename={fileName ? fileName : 'Line List'} hideElement={true}>
                    <ExcelSheet data={newList} name='Line List'>
                        <ExcelColumn label='Visit ID' value='visit_id' />
                        <ExcelColumn label='Visit Date' value='visit_date' />
                        <ExcelColumn label='Patient Name' value='name' />
                        <ExcelColumn label='Address1' value='constructed_address' />
                        <ExcelColumn label='Address2' value='address2' />
                        <ExcelColumn label='Source' value='source' />
                        <ExcelColumn label='Age' value='age' />
                        <ExcelColumn label='Gender' value='gender' />
                        <ExcelColumn label='Mobile' value='mobile' />
                        <ExcelColumn label='Aadhaar No' value='aadhaar' />
                        <ExcelColumn label='Outcome' value='outcome' />
                        <ExcelColumn label='Outcome date' value='outcome_date' />
                        <ExcelColumn label='Vitals - Weight' value='vital_weight' />
                        <ExcelColumn label='Vitals - Height' value='vital_height' />
                        <ExcelColumn label='Vitals - Temperature' value='vital_temperature' />
                        <ExcelColumn label='Vitals - Pulse' value='vital_pulse' />
                        <ExcelColumn label='Vitals BP Sys' value='vital_bloodPressureUp' />
                        <ExcelColumn label='Vitals BP Dia' value='vital_bloodPressureDown' />
                        {diagnosisList.map((value, i) =>
                            <ExcelColumn key={i} label={`${value.diagnosis_name}`} value={`${value.diagnosis_name} diag`} />
                        )}
                        {labList.map((value, i) =>
                            <ExcelColumn key={i} label={`${value.test_name}`} value={`${value.test_name} result`} />
                        )}
                        {drugsList.map((value, i) =>
                            <ExcelColumn key={i} label={`${value.drug_name}`} value={`${value.drug_name} dosage`} />
                        )}
                        <ExcelColumn label='Institution name' value='institution_name'/>
                        <ExcelColumn label='Username' value='created_username'/>
                        <ExcelColumn label='Created User District Name' value='created_district_name'/>
                        <ExcelColumn label='Created User District ID' value='created_district_id'/>
                        <ExcelColumn label='HUD Name' value='hud_name' />
                        <ExcelColumn label='HUD ID' value='hud_id' />
                        <ExcelColumn label='Block Name' value='block_name' />
                        <ExcelColumn label='Block ID' value='block_id' />
                        <ExcelColumn label='Created by Short Code' value='created_gp_type'/>
                        <ExcelColumn label='Institution Type' value='created_institution_type'/>
                        <ExcelColumn label='Type Id' value='created_type_id'/>
                    </ExcelSheet>
                </ExcelFile>
            );
        }

    }
}

export default Download;