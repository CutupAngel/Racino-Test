import axios from "axios";
import { GITHUB_ACCESS_TOKEN, GITHUB_GRAPHQL_API } from "../config";

const graphApi = axios.create({
    responseType: "json"
});

const userInfoConfig = (loginName: string) => `{
    user (login: "${loginName}") {
        id
        avatarUrl
    }
}`

const userReposConfig = (loginName: string) => `{
  repositoryOwner(login: "${loginName}") {
    repositories(first: 100) {
      nodes {
        name
        description
      }
    }
  }
}`

const getGraphQLInfo = async (query: string) => {
    const { data } = await graphApi.post(GITHUB_GRAPHQL_API, { query: query }, {
        headers: {
            "Authorization": `bearer ${GITHUB_ACCESS_TOKEN}`
        }
    });
    return data;
}

export const getUserInfo = async (userName: string) => {
    return await getGraphQLInfo(userInfoConfig(userName));
}

export const getUserReposInfo = async (userName: string) => {
    return await getGraphQLInfo(userReposConfig(userName));
}