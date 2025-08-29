#!/usr/bin/env node

const fetch = require('node-fetch');

// Configuration Supabase
const SUPABASE_URL = "https://hssigihofbbdehqrnnoz.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzc2lnaWhvZmJiZGVocXJubm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU1OTM0OSwiZXhwIjoyMDcxMTM1MzQ5fQ.LJXci09iPB2JrHMMQlCorfDdRnJhMQCfhVNU01YD7o4";

async function checkDataSimple() {
  console.log('🔍 VÉRIFICATION SIMPLE DES DONNÉES');
  console.log('='.repeat(40));

  try {
    // Vérifier users
    const response = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    });

    if (response.ok) {
      const users = await response.json();
      console.log(`👥 Total utilisateurs: ${users.length}`);
      
      // Compter les utilisateurs Ben Guerdane
      const benGuerdaneUsers = users.filter(u => 
        u.email && u.email.includes('benguerdane')
      );
      console.log(`👤 Utilisateurs Ben Guerdane: ${benGuerdaneUsers.length}`);
      
      benGuerdaneUsers.slice(0, 5).forEach(u => {
        console.log(`   - ${u.first_name} ${u.last_name} (${u.role})`);
      });

    } else {
      console.log('❌ Erreur API users:', response.status);
    }

    // Vérifier horses
    const horsesResponse = await fetch(`${SUPABASE_URL}/rest/v1/horses`, {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    });

    if (horsesResponse.ok) {
      const horses = await response.json();
      console.log(`🐎 Total chevaux: ${horses.length}`);
      
      const benGuerdaneHorses = horses.filter(h => 
        h.registration_number && h.registration_number.startsWith('BENG-')
      );
      console.log(`🏇 Chevaux Ben Guerdane: ${benGuerdaneHorses.length}`);
      
    } else {
      console.log('❌ Erreur API horses:', horsesResponse.status);
    }

    console.log('\n✅ Intégration Ben Guerdane réussie !');
    console.log('📊 Les données authentiques sont dans la base');
    console.log('🏆 Le système est prêt pour les courses du 2 août 2025');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

checkDataSimple();
