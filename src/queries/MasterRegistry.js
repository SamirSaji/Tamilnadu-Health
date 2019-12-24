const masterRegistryQueries = {
    getPopulationByVillage: `
    query  queryPopulationByMembers($village_ids:[BigInt!]!){
      allPopulationMembers(filter:{
        villageId:{
          in:$village_ids
        }
      }){
        nodes{
          nodeId aadharCard mobileNo villageId memberId age gender headId memberName memberEngName habitationsMasterByHabitationId{ habitationName } villagesMasterByVillageId{ villageName villageId }
        }
      }
    }
    `,
    getAllHabitations: `
      query allHabitationsMasters($village_id: BigIntFilter) {
        allHabitationsMasters(filter: { villageId: $village_id }) {
          nodes {
            habitationId
            blockId
            hudId
            phcId
            hscId
            villageId
            habitationName
          }
        }
      }
      
      `,
    getAllVillages: `
      query allVillagesMasters($district_id: Int!) {
        allVillagesMasters(condition: {districtId: $district_id}) {
          nodes {
            villageId
            blockId
            hudId
            phcId
            hscId
            villageName
          }
        }
      }
      
      `,
    getAllDistricts: `
      query allDistrictsMasters($state_id: Int!) {
        allDistrictsMasters(condition: {stateId: $state_id}) {
          nodes {
            districtId
            districtName
          }
        }
          allPopulationHeads(last:1){
            nodes{
              headId
            }
          }
      }      
      `,
    getAllStates: `
      query allStatesMasters($country_id: Int!) {
        allStatesMasters(condition: {countryId: $country_id}) {
          nodes {
            stateId
            stateName
          }
        }
      }      
      `,
      createPopulationHeadDistrict: (district_id) => (`
      mutation createUser($headName:String!, $headEngName: String, $age: Int, $gender: String, $country_id: Int, $state_id: Int, $district_id: Int, $villageId: BigInt, 
        $hudId:Int,
        $blockId:Int,
        $phcId:Int,
        $hscId:Int,
        $habitationId:BigInt,
        ,$mobileNo: String,$aadharCard: String, $createdAtMr :Boolean, $headId: Int) {
        createPopulationHeads${district_id}(input: {populationHead${'s'+district_id}: {
          headEngName: $headEngName,
          headName:$headName
          age: $age,
          headId: $headId,
          gender: $gender, 
          countryId: $country_id, 
          stateId: $state_id, 
          districtId: $district_id, 
          villageId: $villageId,
          hudId:$hudId,
          blockId:$blockId,
          phcId:$phcId,
          hscId:$hscId,
          habitationId:$habitationId,
          mobileNo: $mobileNo,
          aadharCard: $aadharCard,
          createdAtMr: $createdAtMr,
        }}) {
          populationHeads${district_id}{
            headId
            villageId
            streetId
            headEngName
          }
        }
      }
      `),
      createPopulationMemberDistrict: (district_id) => (`
      mutation createUser($headId:Int!,
        $memberId:Int!,
          $memberName:String!,
           $memberEngName: String,
            $age: Int, $gender: String,
             $countryId: Int,
              $stateId: Int,
               $districtId: Int,
                $villageId: BigInt, 
        $hudId:Int,
        $blockId:Int,
        $phcId:Int,
        $hscId:Int,
        $habitationId:BigInt,
        $mobileNo: String,$aadharCard: String, $createdAtMr :Boolean) {
        createPopulationMembers${district_id}(input: {populationMember${'s'+district_id}: {
          memberEngName: $memberEngName,
          memberName:$memberName
          age: $age,
          headId: $headId,
          memberId: $memberId,
          gender: $gender, 
          countryId: $countryId, 
          stateId: $stateId, 
          districtId: $districtId, 
          hudId:$hudId,
          blockId:$blockId,
          phcId:$phcId,
          hscId:$hscId,
          habitationId:$habitationId,
          villageId: $villageId, 
          mobileNo: $mobileNo,
          aadharCard: $aadharCard,
          createdAtMr: $createdAtMr,
        }}) {
          populationMembers${district_id}{
            memberId
            villageId
            streetId
            memberEngName
          }
        }
      }
      `),
      createPopulationHead: (distId) =>`
      mutation createUser($headName:String!,
        $hudId:Int,
        $blockId:Int,
        $phcId:Int,
        $hscId:Int,
        $habitationId:BigInt, $addressLine :String,
         $headEngName: String, $age: Int, $gender: String, $country_id: Int, $state_id: Int, $district_id: Int, $villageId: BigInt, $mobileNo: String,$aadharCard: String, $createdAtMr :Boolean) {
        createPopulationHead${distId ? 's'+distId : ''}(input: {populationHead${distId ? 's'+distId : ''}: {
          headEngName: $headEngName,
          headName:$headName
          age: $age,
          gender: $gender, 
          countryId: $country_id, 
          stateId: $state_id, 
          addressLine : $addressLine,
          districtId: $district_id, 
          villageId: $villageId, 
          hudId:$hudId,
          blockId:$blockId,
          phcId:$phcId,
          hscId:$hscId,
          habitationId:$habitationId,
          mobileNo: $mobileNo,
          aadharCard: $aadharCard,
          createdAtMr: $createdAtMr,
        }}) {
          populationHead${distId ? 's'+distId : ''}{
            headId
            villageId
            streetId
            headEngName
          }
        }
      }
      `,
      createPopulationMember: (distId) => `
      mutation createUser($headId:Int!,
        $hudId:Int,
        $blockId:Int,
        $phcId:Int,
        $hscId:Int,
        $habitationId:BigInt,
         $memberName:String!,
          $memberEngName: String, 
          $age: Int, $gender: String, 
          $countryId: Int,
           $stateId: Int,
            $districtId: Int,
             $villageId: BigInt,
              $mobileNo: String,
              $aadharCard: String,
               $createdAtMr :Boolean
               ) {
        createPopulationMember${distId ? 's'+distId : ''}(input: {populationMember${distId ? 's'+distId : ''}: {
          memberEngName: $memberEngName,
          headId:$headId,
          memberName:$memberName,
          age: $age,
          gender: $gender, 
          countryId: $countryId, 
          hudId:$hudId,
          blockId:$blockId,
          phcId:$phcId,
          hscId:$hscId,
          habitationId:$habitationId,
          stateId: $stateId, 
          districtId: $districtId, 
          villageId: $villageId, 
          mobileNo: $mobileNo,
          aadharCard: $aadharCard,
          createdAtMr: $createdAtMr,
        }}) {
          populationMember${distId ? 's'+distId : ''}{
            memberId
            villageId
            streetId
            memberEngName
          }
        }
      }
      `,
      updateUserData: `
      mutation updatePopulationMember($member_id: Int!, $aadhar_no:String,$mobile_no: String){
        updatePopulationMemberByMemberId(input:{
          memberId:$member_id,
          populationMemberPatch:{
            aadharCard: $aadhar_no
            mobileNo: $mobile_no
          }
        }){
          populationMember{
            aadharCard
            memberId
          }
        }
      }
      `,
      updateUserDataDistrictId:(district_id) => `
      mutation updatePopulationMember($member_id: Int!, $aadhar_no:String,$mobile_no: String){
        updatePopulationMember${'s'+district_id}ByMemberId(input:{
          memberId:$member_id,
          populationMember${'s'+district_id}Patch:{
            aadharCard: $aadhar_no
            mobileNo: $mobile_no
          }
        }){
          populationMember${'s'+district_id}{
            aadharCard
            memberId
          }
        }
      }
      `,
      updatePopulationHead: `
      mutation updatePopulationHead($head_id: Int!, $aadhar_no:String,$mobile_no: String){
        updatePopulationHeadByHeadId(input:{
          headId:$head_id,
          populationHeadPatch:{
            aadharCard: $aadhar_no
            mobileNo: $mobile_no
          }
        }){
          populationHead{
            aadharCard
            mobileNo
          }
        }
      }
      `,
      updatePopulationHeadDistrictId: (district_id) => `
      mutation updatePopulationHead($head_id: Int!, $aadhar_no:String,$mobile_no: String){
        updatePopulationHead${'s'+district_id}ByHeadId(input:{
          headId:$head_id,
          populationHead${'s'+district_id}Patch:{
            aadharCard: $aadhar_no
            mobileNo: $mobile_no
          }
        }){
          populationHead${'s'+district_id}{
            aadharCard
            mobileNo
          }
        }
      }
      `,
};

export default masterRegistryQueries