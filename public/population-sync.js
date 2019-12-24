const ALL_HEADS = 'allHeads', ALL_USERS = 'allUsers', LIMIT = 200;
const MR_GQL = 'http://165.22.212.150:8000/graphql', TOKEN = 'jwtToken';
// const MR_GQL = 'http://139.59.89.197:8000/graphql', TOKEN = 'jwtToken';


const allHeadQuery = (distId, offset) => {
    console.log(distId)
    const body = {
        query: `
            query fetchPopulation ($offset: Int!, $first:Int!){
                allPopulationHeads${distId}S(first: $first, offset: $offset, condition: {districtId: ${distId}}, filter: {or: {headId: {isNull: false}}}) {
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
        variables: { offset, first: LIMIT },
        operationName: "fetchPopulation"
    }
    return JSON.stringify(body);
}

const allUserQuery = (distId, offset) => {
    const body = {
        query: `
            query fetchPopulation ($offset: Int!, $first:Int!){
                allPopulationMembers${distId}S(first: $first, offset: $offset, condition: {districtId: ${distId}}, filter: {or: {headId: {isNull: false}}}) {
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
        variables: { offset, first: LIMIT },
        operationName: "fetchPopulation"
    }
    return JSON.stringify(body);
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
    const response = await fetch(MR_GQL, { body: query });
    const data = await response.json();
    return data[key].nodes;
}

async function syncHeads() {
    let allHeads = localStorage[ALL_HEADS] ? JSON.parse(localStorage[ALL_HEADS]) : null;
    let token = localStorage[TOKEN];
    if (allHeads && token) {
        try {
            const distId = getDataFromToken(token, "district_id");
            const offset = Number(allHeads.offset) ? allHeads.offset : 0;
            if(allHeads.totalCount <= offset) return null
            const updatedHeads = await fetchPopulation(allHeadQuery(distId, offset),`allPopulationHeads${distId}S`);
            allHeads = {
                ...allHeads,
                nodes: [...allHeads['nodes'], ...updatedHeads],
                offset: offset + LIMIT
            }
            localStorage.setItem(ALL_HEADS, JSON.stringify(allHeads))
        } catch (error) {
            console.error('HEAD POPULATION ERROR', error);
        }
    }
}

async function syncUsers() {
    let allUsers = localStorage[ALL_USERS] ? JSON.parse(localStorage[ALL_USERS]) : null;
    let token = localStorage[TOKEN];
    if (allUsers && token) {
        try {
            const distId = getDataFromToken(token, "district_id");
            const offset = Number(allUsers.offset) ? allUsers.offset : 0
            if(allUsers.totalCount <= offset) return null
            const updatedHeads = await fetchPopulation(allUserQuery(distId, offset),`allPopulationMembers${distId}S`);
            allUsers = {
                ...allUsers,
                nodes: [...allUsers['nodes'], ...updatedHeads],
                offset: offset + LIMIT
            }
            localStorage.setItem(ALL_USERS, JSON.stringify(allUsers))
        } catch (error) {
            console.error('USERS POPULATION ERROR', error);
        }
    }
}

// POPULATION SYNC
self.addEventListener('sync', (e) => {
    if (e.tag === 'population-sync') {
        e.waitUntil(async () => {
            await syncHeads();
            await syncUsers();
        })
    }
})
