import ngrok from 'ngrok';
import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PROJECT_ID = process.env.PROJECT_ID?.replace(/['"]/g, '');
const CLIENT_ID = process.env.CLIENT_ID?.replace(/['"]/g, '');
const API_PORT = process.env.API_PORT || '3000';

const SERVICE_ACCOUNT_PATH = path.resolve(__dirname, '../configs/service-account.json');

const ENV_PATHS = [
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../apps/api/.env'),
  path.resolve(__dirname, '../apps/mobile/.env.local'),
];

(async () => {
  const url = await ngrok.connect(Number(API_PORT));
  const redirectUri = `${url}/auth/google/callback`;

  console.log('🔗 Ngrok URL:', redirectUri);

  for (const envPath of ENV_PATHS) {
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
    envContent = envContent.replace(/REDIRECT_URI=.*/g, '');
    envContent += `\nREDIRECT_URI=${redirectUri}\n`;
    fs.writeFileSync(envPath, envContent);
    console.log(`✅ Actualizado: ${envPath}`);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_PATH,
    scopes: ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/console'],
  });

  const client = await auth.getClient();
  const res = await client.request({
    url: `https://oauth2.googleapis.com/v1/projects/${PROJECT_ID}/clients/${CLIENT_ID}`,
    method: 'PATCH',
    data: {
      redirectUris: [redirectUri],
    },
  });

  console.log('✅ redirectUri actualizado en Google:', res.data);
})();
