import { request } from 'graphql-request';
import config from '../config.js';
import { ALLHEADS, ALLUSERS, POPULATIONLIMIT, POPULATIONTIMEOUT } from './constants';
import { addData } from '../indexeDB/addData';
const MR_GQL = config.masterRegisterEndpoint, TOKEN = 'jwtToken';

const allHeadQuery = (distId, offset) => {
    const body = {
        query: `
            {
                allPopulationHeads${distId}S(first: ${POPULATIONLIMIT}, offset: ${offset}, condition: {districtId: ${distId}}, filter: {or: {headId: {isNull: false}}}) {
                    totalCount
                    nodes {
                      nodeId
                      districtId
                      villageId
                      headId
                      mobileNo
                      aadharCard
                      streetId
                      addressLine
                      headName
                      age
                      gender
                      headEngName
                      habitationsMasterByHabitationId {
                        habitationName
                      }
                      villagesMasterByVillageId {
                        villageName
                        villageId
                      }
                    }
                }
            }
        `,
        variables: {}
    }
    return body.query;
    // return JSON.stringify(body);
}

const allUserQuery = (distId, offset) => {
    const body = {
        query: `
            {
                allPopulationMembers${distId}S(first: ${POPULATIONLIMIT}, offset: ${offset}, condition: {districtId: ${distId}}, filter: {or: {headId: {isNull: false}}}) {
                    totalCount
                    nodes {
                      nodeId
                      districtId
                      memberId
                      age
                      mobileNo
                      gender
                      aadharCard
                      streetId
                      headId
                      memberName
                      villageId
                      memberEngName
                      habitationsMasterByHabitationId {
                        habitationName
                      }
                      villagesMasterByVillageId {
                        villageName
                        villageId
                      }
                      populationHeads${distId}ByHeadId {
                        addressLine
                      }
                    }
                }
            }
        `,
        variables: {}
    }
    return body.query
    //return JSON.stringify(body);
}

function getDataFromToken(token, keyName) {
    token = token.split('Bearer')[1];
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const tokendata = JSON.parse(jsonPayload);

    return tokendata[keyName];
};

async function fetchPopulation(query,key) {
    const data = await request(MR_GQL, query);
    //const response = await fetch(MR_GQL, { body: query, method: 'POST' });
    //const { data } = await response.json();
    return data[key] ? data[key].nodes : [];
}

async function syncHeads() {
    if(!navigator.onLine) return
    let allHeads = localStorage[ALLHEADS] ? JSON.parse(localStorage[ALLHEADS]) : null;
    let token = localStorage[TOKEN];
    if (allHeads && token) {
        try {
            const distId = getDataFromToken(token, "district_id");
            const offset = Number(allHeads.offset) ? allHeads.offset : 0
            if(allHeads.totalCount <= offset) return null
            const updateMembers = await fetchPopulation(allHeadQuery(distId, offset), `allPopulationHeads${distId}S`);
            allHeads = {
                ...allHeads,
                offset: offset + POPULATIONLIMIT
            }
            try {
                addData('allHeads', updateMembers, "nodeId");
                localStorage.setItem(ALLHEADS, JSON.stringify(allHeads))
            } catch (error) {
                // console.error('HEAD POPULATION ERROR', error);    
            }
        } catch (error) {
            // console.error('HEAD POPULATION ERROR', error);
        }
    }
}

async function syncUsers() {
    if(!navigator.onLine) return
    let allUsers = localStorage[ALLUSERS] ? JSON.parse(localStorage[ALLUSERS]) : null;
    let token = localStorage[TOKEN];
    if ( token ) {
        try {
            const distId = getDataFromToken(token, "district_id");
            const offset = Number(allUsers.offset) ? allUsers.offset : 0
            if(allUsers.totalCount <= offset) return null
            const updatedHeads = await fetchPopulation(allUserQuery(distId, offset),`allPopulationMembers${distId}S`);
            allUsers = {
                ...allUsers,
                offset: offset + POPULATIONLIMIT
            }
            try {
                addData('allMembers', updatedHeads, "nodeId");
                localStorage.setItem(ALLUSERS, JSON.stringify(allUsers))
            } catch (error) {
            }
        } catch (error) {
            // console.error('USERS POPULATION ERROR', error);
        }
    }
}

// POPULATION SYNC
const startPopulationSync = () => {
    return setInterval(async() => {
        // if(navigator.onLine){
        //     try {
        //         await syncHeads();
        //         await syncUsers();
        //     } catch (error) {
        //         console.info('DATA RESPONSE POPULATION',error);
        //     }
        // }
    }, POPULATIONTIMEOUT)
}

export default startPopulationSync;