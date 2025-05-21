import crypto from 'crypto';
import axios from 'axios';
import http from 'http';
import open from 'open';
import { config } from "dotenv";
import { appendToJSONFile } from '../utils/file_helper.mjs';

import { Icons } from '../utils/icons.mjs';

// -- node scripts/kite_connect/login.mjs

class Login{
  constructor() {
    config();
    this.APIKEY = process.env.API_KEY;
    this.APISECRET = process.env.API_SECRET;
    this.REQUEST_TOKEN;
    this.ACCESS_TOKEN;
    this.REDIRECT_URI = 'http://localhost:3000/callback';
    this.LOGIN_URL = `https://kite.zerodha.com/connect/login?v=3&api_key=${this.APIKEY}`
    this.ACCESS_TOKEN_URL = 'https://api.kite.trade/session/token';
  }
}

const login = new Login();

const API_KEY = login.APIKEY;
const API_SECRET = login.APISECRET;

//Open login URL
const loginUrl = login.LOGIN_URL;
console.log(`${Icons.rocket} Opening login URL: ${loginUrl}`);
await open(loginUrl);

//Wait for request_token from redirect
const requestToken = await new Promise((resolve, reject) => {
  const server = http.createServer((req, res) => {
    if (req.url.startsWith('/callback')) {
      const urlParams = new URLSearchParams(req.url.split('?')[1]);
      const token = urlParams.get('request_token');

      if (token) {
        console.log(`${Icons.success} Received Request Token:`, token);
        res.end('Authentication successful! You can close this window.');
        resolve(token);
        server.close();
      } else {
        res.end(`${Icons.error} Request token not found!`);
        reject(new Error('No request_token found'));
        server.close();
      }
    } else {
      res.end('Invalid request');
    }
  });

  server.listen(3000, () => {
    console.log(`${Icons.loading}Listening on ${login.REDIRECT_URI} for request_token...`);
  });
});

//Compute checksum
const rawString = API_KEY + requestToken + API_SECRET;
const checksum = crypto.createHash('sha256').update(rawString).digest('hex');
console.log('✅ Computed checksum:', checksum);

//Exchange request_token for access_token
const data = new URLSearchParams({
  api_key: API_KEY,
  request_token: requestToken,
  checksum: checksum
});

try {
  const response = await axios.post(login.ACCESS_TOKEN_URL, data.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  const access_token = response.data.data.access_token;
  console.log('✅ Access Token:', access_token);
  appendToJSONFile('savedcreds.json', 'access_token', access_token);

} catch (error) {
  console.error('❌ Error exchanging token:', error.response?.data || error.message);
}
