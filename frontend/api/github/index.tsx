import api from 'api';
import { GithubUser, MinimalRepository } from 'utils/interfaces';

const ConfigAPI = api();

async function getUserProfile(name: string): Promise<GithubUser> {
  const { data } = await ConfigAPI.get<GithubUser>(`/users/${name}`);
  return data;
}

async function getUserAfterLoggedIn(name: string): Promise<{ login: string }> {
  const { data } = await ConfigAPI.get<{ login: string }>(`/user/${name}`);
  return data;
}

async function getUserRepos(
  name: string,
  query?: string
): Promise<MinimalRepository> {
  const { data } = await ConfigAPI.get<MinimalRepository>(
    `/users/${name}/repos?${query ? query : null}`
  );
  return data;
}

const GithubAPI = {
  getUserProfile,
  getUserRepos,
  getUserAfterLoggedIn,
};

export default GithubAPI;
