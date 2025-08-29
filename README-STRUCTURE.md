# Tunisia Jockey Club - Structure Organisée 🏇

## 🏗️ Architecture Nettoyée

Après organisation, voici la structure claire du projet :

```
tunisia-jockey-club-clean/
├── frontend/              # Application Remix + Vite + Shadcn/ui
│   ├── app/routes/       # Routes principales
│   │   ├── _index.tsx    # Page d'accueil (VERSION UNIQUE)
│   │   ├── login.tsx     # Page de connexion
│   │   ├── dashboard-main.tsx  # Dashboard principal (VERSION OFFICIELLE)
│   │   ├── profile.tsx   # Profil utilisateur
│   │   └── race-management.tsx # Gestion des courses
│   └── ...
├── backend/              # API NestJS + Prisma + Supabase
│   ├── src/             # Code source backend
│   ├── prisma/          # Schéma et migrations
│   └── ...
├── config/              # 🆕 Configuration centralisée
│   ├── app.config.ts    # Configuration principale
│   └── .env.example     # Variables d'environnement
├── scripts/             # Scripts essentiels uniquement
│   ├── test-auth.sh     # Test authentification
│   ├── test-system.sh   # Test système complet
│   └── debug-login-flow.sh # Debug détaillé
├── docs/                # Documentation officielle
│   └── ROADMAP.md
└── _archive/            # 🗂️ Fichiers archivés (anciens/redondants)
    ├── tests/           # Anciens scripts de test
    ├── docs/            # Anciens documents
    ├── scripts/         # Anciens scripts
    └── old-configs/     # Anciennes configurations
```

## 🎯 Versions Officielles à Utiliser

### 📱 Frontend (Pages principales)
- **Page d'accueil** : `frontend/app/routes/_index.tsx`
- **Dashboard** : `frontend/app/routes/dashboard-main.tsx` ⭐ VERSION OFFICIELLE
- **Connexion** : `frontend/app/routes/login.tsx`
- **Profil** : `frontend/app/routes/profile.tsx`
- **Gestion courses** : `frontend/app/routes/race-management.tsx`

### 🔧 Backend (Modules principaux)
- **Authentification** : `backend/src/auth/`
- **Courses** : `backend/src/races/`
- **Utilisateurs** : `backend/src/users/`
- **Dashboard** : `backend/src/dashboard/`

### 🧪 Scripts de Test (Essentiels)
- **Test auth** : `./test-auth.sh` (authentification complète)
- **Test système** : `./test-system.sh` (test global)
- **Debug login** : `./debug-login-flow.sh` (debug détaillé)

## 🚀 Démarrage Rapide

```bash
# Variables d'environnement déjà configurées ✅

# 1. Installation des dépendances
npm install

# 2. Démarrage des services
npm run dev
```

## 🌐 URLs Principales

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Application Remix |
| **API** | http://localhost:3000 | Backend NestJS |
| **Dashboard** | http://localhost:5173/dashboard-main | Dashboard officiel ⭐ |
| **Admin** | http://localhost:5173/admin | Interface admin |

## 👤 Comptes de Test

| Email | Mot de passe | Rôle | Usage |
|-------|-------------|------|-------|
| admin@tjc.tn | 1234 | ADMIN | Administration |
| monia@gmail.com | 1234 | USER | Utilisateur standard |
| jockey@tjc.tn | 1234 | JOCKEY | Jockey professionnel |

## � Aide Rapide

```bash
# Afficher toutes les commandes disponibles
./help.sh
```

## 📊 Configuration Centralisée

Toute la configuration est maintenant dans `config/app.config.ts` :

```typescript
// Routes officielles
routes: {
  dashboard: '/dashboard-main',  // VERSION UNIQUE
  home: '/',
  login: '/login',
  // ...
}

// Utilisateurs de test
testUsers: {
  admin: { email: 'admin@tjc.tn', password: '1234' },
  // ...
}
```

## 🗂️ Fichiers Archivés

Les fichiers redondants ont été déplacés dans `_archive/` :
- **13 scripts de test** redondants → `_archive/tests/`
- **11 documents d'audit** anciens → `_archive/docs/`
- **17 scripts utilitaires** obsolètes → `_archive/scripts/`
- **6 configurations** dupliquées → `_archive/old-configs/`

## 🔧 Technologies Utilisées

- **Frontend** : Remix + Vite + TypeScript + Tailwind CSS + Shadcn/ui
- **Backend** : NestJS + Prisma + Supabase + TypeScript
- **Auth** : Sessions + bcrypt + Redis
- **UI** : Lucide React + Framer Motion
- **Tests** : Vitest + Testing Library

## 📋 Prochaines Étapes

1. ✅ Projet organisé et nettoyé
2. ✅ Configuration centralisée
3. ✅ Versions uniques définies
4. ⏭️ Tests de validation
5. ⏭️ Déploiement production

---

**🎯 Point Important** : Utilisez toujours `dashboard-main.tsx` comme page de dashboard officielle. Les autres versions ont été archivées.
