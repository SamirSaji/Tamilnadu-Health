import { GraphQLClient } from 'graphql-request'
import config from '../config.js';
const graphQLClientMasterRegistry = new GraphQLClient(config.masterRegisterEndpoint, {
    headers: {},
  })
 export const customRequestToMaster = async (query, variables = {}, )  =>  await graphQLClientMasterRegistry.request(query, variables)



 const graphQLClientRequset = new GraphQLClient(config.downloadEndPoint, {
  headers: {},
})
export const customRequestToDownload = async (query, variables = {}, )  =>  await graphQLClientRequset.request(query, variables)