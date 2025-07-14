import { Log } from './log';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function getToken() {
  try {
    const response = await axios.post('http://20.244.56.144/evaluation-service/auth', {
      email: process.env.EMAIL,
      name: process.env.NAME,
      rollNo: process.env.ROLL_NO,
      accessCode: process.env.ACCESS_CODE,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });
    return response.data.access_token;
  } catch (err: any) {
    console.error('❌ Failed to get token:', err.response?.data || err.message);
    return null;
  }
}

async function testLogging() {
  const token = await getToken();
  if (!token) return;

  await Log({
    stack: 'backend',
    level: 'info',
    package: 'handler',
    message: 'This is a test log from test-log.ts using .env',
    token,
  });
}

testLogging();
