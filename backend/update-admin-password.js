const { hash } = require('bcryptjs');

(async () => {
  const password = 'admin123';
  const newHash = await hash(password, 10);
  
  console.log('Nouveau hash pour admin123:', newHash);
  console.log('\nPour mettre à jour la base de données Supabase, exécutez cette requête SQL :');
  console.log(`UPDATE users SET password = '${newHash}' WHERE email = 'admin@tjc.tn';`);
  
  // Pour Monia aussi
  const moniaHash = await hash('1234', 10);
  console.log('\nNouveau hash pour monia@gmail.com (mot de passe: 1234):', moniaHash);
  console.log(`UPDATE users SET password = '${moniaHash}' WHERE email = 'monia@gmail.com';`);
})();
