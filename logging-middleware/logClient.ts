import axios from 'axios';

const AUTH_URL = "http://20.244.56.144/evaluation-service/auth";

let cachedToken = "";

export const getAuthToken = async (config: {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}) => {
  if (cachedToken) return cachedToken;

  const response = await axios.post(AUTH_URL, config);
  cachedToken = response.data.access_token;
  return cachedToken;
};
