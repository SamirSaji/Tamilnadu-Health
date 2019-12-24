import React from 'react';
// import { Redirect } from 'react-router-dom';
import Spinner from '../../common/Spinner/Spinner';
import { withApollo } from "react-apollo";
import gql from "graphql-tag";
import Header from '../../common/Header/Header';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ProxyComponent from './ProxyComponent';
import { mapOfflineEntryToEdit } from '../../../actions/offlineAction';
// import { storeMasterDatas } from '../../../utils/writeToOffline';
import { getDataFromIndexedDB } from '../../../indexeDB/getData';
//custom components
const storeName = [
	"symptomsList", "drugsList", "specimensList", "diagnosis_masters",
	"servicesList", "countriesList", "labtest_masters", "syndromeList", "phc_list"
]
class DSUEntry extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {},
			entryType: {}
		}
	}

	async componentDidMount() {
		const userData = this.props.auth.user;
		let savedMasterData = await getDataFromIndexedDB(storeName)
		var masterData = {};
		storeName.map((val, i) => { masterData[val] = savedMasterData[i] });
		let forUserInstitution = ``;
		let editDataQuery = ``;
		let entryType = {
			type: 'create',
			id: undefined,
		}
		if (this.props.match.params.id) {
			entryType.id = this.props.match.params.id;
		}
		if (this.props.match.params.id) {
			entryType = {
				...entryType,
				type: 'edit',
				// id: this.props.match.params.id,
			}
		}
		if (this.props.type === 'newVisit') {
			entryType.type = 'newVisit';
		}
		if (navigator.onLine) {
			if (userData.phc_id !== null) {
				forUserInstitution = `getInstitutionDetails(phc_id:"${userData.phc_id}"){
					district_id
				  }`
			}
			if (entryType.type === 'edit' && entryType.id !== undefined) {
				editDataQuery = `getLineEntryEdit(entry_id:"${entryType.id}") {
					user_pds_line {
						name type master_registry_user_id
					}
					visit_date
					outcome general_remarks outcome_date visit_id vital_weight id entry_id advices vital_hip vital_waist vital_resprate
					rfrd_phc_name {
						phc_name
						phc_id
					}
					phc_patient_det {
						phc_name
						phc_id
					}
					vital_height vital_pulse vital_temperature vital_bloodPressureUp vital_bloodPressureDown 
					patient_diagnos_entry
					{ diagnosis_id }
					patient_drug_entry
					{     drug_id days dosage_value dosage quantity }
					patient_lab_entry
					{ test_id test_date result remarks test_date}
				}`
			} else if (entryType.type === 'newVisit' && entryType.id !== undefined) {
				editDataQuery = `getLineEntryVisitData(entry_id:"${entryType.id}") {
					user_pds_line {
						name type master_registry_user_id
					}
				}
				getLineEntryEdit(entry_id:"${entryType.id}") {
					visit_date
					id
					rfrd_phc_name {
						phc_id
						phc_name
					}
					outcome
					phc_patient_det {
						phc_id
						phc_name
					}
				}`
			}
			let phc_query = `phc_list: get_all_phc
			{ phc_name phc_id type institution_name }`
			if (userData.district_id) {
				phc_query = `phc_list: get_all_phc(district_id:${userData.district_id})
				{ phc_name phc_id type institution_name }`
			}

			this.setState({
				entryType
			})

			const genQuery = gql`query{
						${phc_query}
						${forUserInstitution}
						${masterData.symptomsList.length === 0 ? `symptomsList
						{ symptom_id name }` : ''}
						${masterData.drugsList.length === 0 ? `drugsList(display_for_user:true)
						{ drug_name drug_id type strength quantity update_quantity}`: ''}
						${masterData.specimensList.length === 0 ? `specimensList
						{ specimen_id specimen_name }` : ''}
						${masterData.diagnosis_masters.length === 0 ? `diagnosis_masters
						{ diagnosis_id diagnosis_name service_id
						ser_diag { service_id service_name disable_for_men } }` : ''}
						${masterData.servicesList.length === 0 ? `servicesList 
						{ service_id service_name }` : ''}
						${masterData.countriesList.length === 0 ? `countriesList
						{ country_id country_name }` : ''}
						${masterData.labtest_masters.length === 0 ? `labtest_masters(alias:"${userData.alias}")
						{ test_id test_name options result_type }` : ''}
						${masterData.syndromeList.length === 0 ? `syndromeList
						{ syndrome_id syndrome_name syndrome_code }` : ''}
						${editDataQuery}
					}
				`;
			this.props.client.query({
				query: genQuery
			}).then(res => {
				let allData = Object.assign([],masterData, []);
				let responeData = Object.assign([],res.data,[]);
				Object.keys(allData).map(val => {
					if(allData[val].length > 0){
						responeData[val] = allData[val];
					}
				})
				this.setState({
					data: responeData
				})
			}).catch(err => {

			})
		} else {
			let data = {};
			// data = await getDataFromIndexedDB(storeName);
			data = savedMasterData;
			let list = {};
			storeName.map((val, i) => {
				list[val] = data[i]
			})
			let userName = (this.props && this.props.auth && this.props.auth.user) ? this.props.auth.user.username : null;
			let lineEntry = {};
			if (entryType.type === "edit") {
				// add entryedit data
				const getLineEntryEdit = await mapOfflineEntryToEdit(entryType.id, userName);
				list = { ...list, getLineEntryEdit };
			}
			if (entryType.type === "newVisit") {
				const visitentry = await mapOfflineEntryToEdit(entryType.id, userName, 'newVisit');
				list = { ...list, getLineEntryVisitData: visitentry.memberNode, getLineEntryEdit: visitentry.entry }
			}
			this.setState({
				data: list, entryType
			})
		}
	}
	render() {
		let { data, entryType } = this.state;
		return (
			<div>
				{
					Object.keys(data).length > 0 ?
						<ProxyComponent
							data={data}
							entryType={entryType}
						/>
						: <React.Fragment>
							<Header />
							<Spinner />
						</React.Fragment>
				}
			</div>
		)
		// }
	}
}

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps, {})(withRouter(withApollo(DSUEntry)))