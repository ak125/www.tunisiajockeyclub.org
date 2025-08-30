const fetch = require('node-fetch');
require('dotenv').config();

async function checkTables() {
  const baseUrl = process.env.SUPABASE_URL + '/rest/v1/';
  const headers = {
    'apikey': process.env.SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  };

  console.log('🔍 Vérification des tables existantes dans Supabase...\n');

  const tables = [
    'horses',
    'races', 
    'race_entries',
    'tournaments',
    'tournament_participants',
    'tournament_results',
    'leaderboard'
  ];

  for (const table of tables) {
    try {
      const response = await fetch(`${baseUrl}${table}?select=*&limit=1`, { 
        method: 'GET',
        headers 
      });
      
      if (response.status === 200) {
        const data = await response.json();
        console.log(`✅ Table "${table}": EXISTS (${data.length === 0 ? 'vide' : 'contient des données'})`);
      } else if (response.status === 406 || response.status === 400) {
        console.log(`❌ Table "${table}": NOT FOUND`);
      } else {
        console.log(`⚠️  Table "${table}": Status ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Table "${table}": ERROR - ${error.message}`);
    }
  }
  
  console.log('\n🎯 Vérification terminée');
}

checkTables().catch(console.error);
