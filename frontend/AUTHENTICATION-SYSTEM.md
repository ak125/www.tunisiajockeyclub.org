# Système d'authentification unifié - Tunisia Jockey Club

## 🎯 Fonctionnalités du système unifié

Le système d'authentification a été complètement refactorisé et unifié pour combiner le meilleur des deux approches précédentes.

### ✨ Améliorations apportées

1. **Authentification centralisée** - Intégration complète avec le backend NestJS
2. **Gestion de session avancée** - Sessions sécurisées avec expiration et validation
3. **Système de permissions** - Contrôle d'accès granulaire par rôles et permissions
4. **Middleware de sécurité** - Protection automatique des routes sensibles
5. **Validation robuste** - Validation Zod des données utilisateur
6. **Compatibilité étendue** - Support des deux patterns d'authentification existants

### 🔐 Comptes de développement disponibles

```typescript
// Comptes de test pour le développement
const devAccounts = [
  { email: 'admin@tjc.tn', password: 'admin123', role: 'admin' },
  { email: 'monia@gmail.com', password: 'password123', role: 'user' },
  { email: 'test@test.com', password: 'test123', role: 'user' }
];
```

### 📁 Structure des fichiers

```
frontend/app/utils/
├── auth.server.ts          # Système d'auth unifié (PRINCIPAL)
├── session.server.ts       # Gestion des sessions améliorée
└── security.server.ts      # Middleware de sécurité avancé
```

## 🚀 Utilisation

### Authentification basique

```typescript
// Dans une route de connexion
import { authenticate, createUserSession } from '~/utils/auth.server';

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  
  const user = await authenticate(email, password);
  
  if (!user) {
    return json({ error: 'Identifiants invalides' }, { status: 400 });
  }
  
  return createUserSession({
    request,
    user,
    redirectTo: '/dashboard',
    remember: true
  });
}
```

### Protection de routes

```typescript
// Méthode simple
import { createSecureLoader } from '~/utils/auth.server';

export const loader = createSecureLoader(async ({ request, user }) => {
  // L'utilisateur est automatiquement vérifié
  return json({ user, data: 'données sécurisées' });
});
```

```typescript
// Méthode avancée avec permissions
import { createSecureLoaderWithContext } from '~/utils/security.server';

export const loader = createSecureLoaderWithContext(async ({ request, context }) => {
  if (!context.permissions.includes('ratings.manage')) {
    throw redirect('/unauthorized');
  }
  
  return json({ user: context.user });
});
```

### Vérification de permissions

```typescript
import { SecurityMiddleware, UserRole } from '~/utils/security.server';

export const loader = async ({ request }) => {
  const context = await SecurityMiddleware.createSecurityContext(request);
  
  const canManageRatings = SecurityMiddleware.hasPermission(context, 'ratings.manage');
  const isAdmin = context.role === UserRole.ADMIN;
  
  return json({ canManageRatings, isAdmin });
};
```

### Gestion utilisateur dans root.tsx

```typescript
// root.tsx
import { getOptionalUser } from './utils/auth.server';

export const loader = async ({ request }) => {
  const user = await getOptionalUser(request);
  return json({ user });
};
```

## 🛡️ Sécurité

### Rôles utilisateur

- **GUEST** - Utilisateur non connecté
- **USER** - Utilisateur standard (lecture courses, chevaux)
- **ADMIN** - Administrateur (gestion complète)
- **SUPER_ADMIN** - Super administrateur (toutes permissions)

### Permissions disponibles

```typescript
const permissions = [
  'read',                    // Lecture générale
  'write',                   // Écriture générale
  'courses.view',           // Voir les courses
  'courses.manage',         // Gérer les courses
  'horses.view',            // Voir les chevaux
  'horses.manage',          // Gérer les chevaux
  'ratings.manage',         // Gérer les ratings
  '*'                       // Toutes les permissions (super admin)
];
```

### Configuration de session

```typescript
// Configuration automatique dans session.server.ts
{
  name: 'tjc_session',              // Nom spécifique TJC
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
  httpOnly: true,                   // Sécurité XSS
  secure: true, // en production    // HTTPS uniquement
  sameSite: 'lax'                   // Protection CSRF
}
```

## 🔧 Configuration

### Variables d'environnement

```bash
# Backend API
API_BASE_URL=http://localhost:3000

# Session
SESSION_SECRET=your-super-secret-key-here
NODE_ENV=development
```

### Middleware automatique

Le système inclut automatiquement :

- ✅ Validation des sessions
- ✅ Expiration automatique (24h d'inactivité)
- ✅ Protection CSRF
- ✅ Validation Zod des données utilisateur
- ✅ Logs de sécurité détaillés
- ✅ Gestion d'erreurs robuste

## 📊 Monitoring

```typescript
import { getSessionInfo } from '~/utils/auth.server';

export const loader = async ({ request }) => {
  const sessionInfo = await getSessionInfo(request);
  console.log('Info session:', sessionInfo);
  
  return json(sessionInfo);
};
```

## 🏁 Migration depuis l'ancien système

L'ancien code continue de fonctionner grâce à la compatibilité maintenue :

```typescript
// ✅ Fonctionne toujours
import { requireAuth, getUserFromSession } from '~/utils/auth.server';
import { createSecureLoader } from '~/utils/auth.server';

// ✨ Nouveau style recommandé
import { SecurityMiddleware, createSecureLoaderWithContext } from '~/utils/security.server';
```

---

## 🎉 Résultat

Le système d'authentification est maintenant :

- **Unifié** - Un seul système au lieu de deux
- **Sécurisé** - Validation, permissions, expiration
- **Performant** - Caching et optimisations
- **Extensible** - Facile à étendre avec de nouveaux rôles/permissions
- **Compatible** - Fonctionne avec l'existant
- **Moderne** - TypeScript strict, patterns avancés
