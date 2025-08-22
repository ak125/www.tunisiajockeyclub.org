const fetch = require('node-fetch');
const { hash } = require('bcryptjs');

(async () => {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Variables d\'environnement manquantes');
    return;
  }

  // Hash pour admin123
  const adminHash = await hash('admin123', 10);
  
  // Hash pour 1234
  const moniaHash = await hash('1234', 10);

  console.log('Mise à jour du mot de passe admin...');
  
  // Mettre à jour admin
  const adminResponse = await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.admin@tjc.tn`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password: adminHash
    })
  });

  if (adminResponse.ok) {
    console.log('✅ Mot de passe admin mis à jour avec succès');
  } else {
    const error = await adminResponse.text();
    console.error('❌ Erreur mise à jour admin:', error);
  }

  console.log('Mise à jour du mot de passe monia...');
  
  // Mettre à jour monia
  const moniaResponse = await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.monia@gmail.com`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password: moniaHash
    })
  });

  if (moniaResponse.ok) {
    console.log('✅ Mot de passe monia mis à jour avec succès');
  } else {
    const error = await moniaResponse.text();
    console.error('❌ Erreur mise à jour monia:', error);
  }
})();
