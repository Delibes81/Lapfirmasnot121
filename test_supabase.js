const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: 'c:/lapFirmas/Lapfirmasnot121/.env' });

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

async function run() {
  const req = await fetch(`${url}/rest/v1/assignments?limit=1`, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Prefer': 'return=representation'
    },
    method: 'POST',
    body: JSON.stringify({
      laptop_id: 'TEST1234',
      user_name: null,
      assigned_intern: 'Test Pasante',
      assigned_at: new Date().toISOString()
    })
  });
  
  const result = await req.json();
  console.log('Result of inserting user_name=null:', result);
}

run().catch(console.error);
