# 🎯 Plan de Nettoyage des Routes - Suppression des Doublons

## Routes Identifiées avec Doublons

### 1. **Pages d'Accueil (DOUBLONS)**
- ✅ `_index.tsx` - Page d'accueil principale (GARDER - meilleure version)
- 🗑️ `home.advanced.tsx` - Version avancée (SUPPRIMER - fusionner fonctionnalités dans _index.tsx)
- 🗑️ `_fast-index.tsx` - Version rapide (SUPPRIMER - obsolète)

### 2. **Authentification (DOUBLONS)**
- ✅ `auth.signin.tsx` - Connexion principale (GARDER - plus complète)
- 🗑️ `auth.login.tsx` - Redirection simple (SUPPRIMER - redondant)
- ✅ `register.tsx` - Inscription (GARDER - unique)

### 3. **Dashboard (MULTIPLE VERSIONS)**
- ✅ `dashboard._index.tsx` - Dashboard principal (GARDER - version complète)
- 🗑️ `admin.unified._index.tsx` - Dashboard admin (ÉVALUER - peut être fusionné)
- 🗑️ `executive-dashboard.tsx` - Dashboard exécutif (SUPPRIMER - redondant)
- 🗑️ `secure-dashboard.tsx` - Dashboard sécurisé (SUPPRIMER - redondant)

### 4. **Courses (TROP DE VERSIONS)**
- ✅ `courses._index.tsx` - Page publique courses (GARDER - version complète)
- ✅ `courses.$id.tsx` - Détail course (GARDER - unique)
- ✅ `courses.search.tsx` - Recherche courses (GARDER - fonctionnalité unique)
- 🗑️ `dashboard.races._index.tsx` - Gestion admin courses (ÉVALUER - peut être intégré)

### 5. **Chevaux (VERSIONS MULTIPLES)**
- ✅ `horses.advanced.tsx` - Chevaux élite (GARDER - version premium)
- ✅ `horses.$horseId.tsx` - Profil détaillé cheval (GARDER - unique)
- 🗑️ `dashboard.horses._index.tsx` - Gestion admin chevaux (SUPPRIMER - redondant)
- 🗑️ `dashboard.horses.unified.tsx` - Version unifiée (SUPPRIMER - redondant)
- 🗑️ `member.horses._index.tsx` - Chevaux membre (ÉVALUER - peut être intégré)

### 6. **Jockeys (VERSIONS MULTIPLES)**
- ✅ `jockeys.advanced.tsx` - Jockeys élite (GARDER - version premium)
- 🗑️ `dashboard.jockeys._index.tsx` - Gestion admin jockeys (SUPPRIMER - redondant)
- 🗑️ `dashboard.jockeys.unified.tsx` - Version unifiée (SUPPRIMER - redondant)
- 🗑️ `admin.jockeys._index.tsx` - Admin jockeys (SUPPRIMER - redondant)

### 7. **Statistiques (VERSIONS MULTIPLES)**
- ✅ `statistics.advanced.tsx` - Statistiques premium (GARDER - version complète)
- 🗑️ `analytics.tsx` - Analytics simple (SUPPRIMER - redondant)
- 🗑️ `dashboard.analytics._index.tsx` - Analytics dashboard (SUPPRIMER - redondant)

### 8. **Admin/Management (TROP COMPLEXE)**
- ✅ `admin._index.tsx` - Panel admin principal (GARDER - si complet)
- 🗑️ `admin.unified._index.tsx` - Version unifiée (SUPPRIMER - redondant)
- ✅ `admin.users.tsx` - Gestion utilisateurs (GARDER - unique)
- ✅ `admin.security.tsx` - Sécurité admin (GARDER - unique)

### 9. **Design System (MULTIPLES)**
- ✅ `design-system.tsx` - Design system principal (GARDER - version complète)
- 🗑️ `design-system-clean.tsx` - Version clean (SUPPRIMER - redondant)
- 🗑️ `design-system-demo.tsx` - Demo (SUPPRIMER - pas pour prod)

## 📋 Plan d'Action

### Phase 1 : Fusion des Fonctionnalités ✅
1. **Intégrer home.advanced.tsx dans _index.tsx** (récupérer les meilleures fonctionnalités)
2. **Fusionner les analytics dans statistics.advanced.tsx**
3. **Consolider les dashboards admin**

### Phase 2 : Suppression Sécurisée 🗑️
1. **Supprimer les doublons évidents**
2. **Archiver les versions obsolètes**
3. **Nettoyer les redirections**

### Phase 3 : Validation ✅
1. **Tester toutes les routes conservées**
2. **Vérifier la navigation**
3. **Valider les fonctionnalités**

## 🎯 Résultat Attendu

**Avant** : ~202 fichiers de routes
**Après** : ~50 fichiers de routes essentielles
**Réduction** : 75% de routes en moins
