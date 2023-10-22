import api from 'api';
import { LoginPayloadI, LoginResponseI } from 'utils/interfaces';

const ConfigAPI = api(process.env.NEXT_PUBLIC_BACKEND_URI);

async function login(payload: LoginPayloadI): Promise<LoginResponseI> {
  const { data } = await ConfigAPI.post<LoginResponseI>(`/auth/login`, payload);
  return data;
}

async function updateCount(payload: LoginPayloadI): Promise<LoginResponseI> {
  const { data } = await ConfigAPI.post<LoginResponseI>(
    `/auth/update-count`,
    payload
  );
  return data;
}

const WebsiteAPI = {
  login,
  updateCount,
};

export default WebsiteAPI;
