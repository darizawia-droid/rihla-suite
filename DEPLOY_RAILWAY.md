# 🚀 Déploiement RIHLA sur Railway — Guide Complet

**Temps estimé : 20-30 minutes**
**Coût : Gratuit (plan Hobby $5/mois pour aller au-delà des limites gratuites)**

---

## 📋 Prérequis

- Un compte GitHub → https://github.com (gratuit)
- Un compte Railway → https://railway.app (gratuit, connexion via GitHub)
- Git installé sur ton PC

---

## ÉTAPE 1 — Pousser le code sur GitHub

Ouvre un terminal dans le dossier `RIHLA03` et exécute :

```bash
git init
git add .
git commit -m "Initial commit — RIHLA DMC Platform"
```

Puis va sur https://github.com/new et crée un repo **privé** nommé `rihla03`.

```bash
git remote add origin https://github.com/TON_USERNAME/rihla03.git
git branch -M main
git push -u origin main
```

---

## ÉTAPE 2 — Créer le projet Railway

1. Va sur https://railway.app
2. Clique **"New Project"**
3. Choisis **"Deploy from GitHub repo"**
4. Sélectionne ton repo `rihla03`
5. Railway détecte le projet → clique **"Add Service"**

---

## ÉTAPE 3 — Ajouter PostgreSQL

Dans ton projet Railway :
1. Clique **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway crée automatiquement la base et génère `DATABASE_URL`
3. Note la valeur de `DATABASE_URL` (tu en auras besoin dans l'étape suivante)

---

## ÉTAPE 4 — Déployer le Backend (FastAPI)

1. Dans Railway, clique **"New"** → **"GitHub Repo"** → sélectionne `rihla03`
2. Nomme ce service **"backend"**
3. Dans **Settings** → **Build** :
   - `Root Directory` : `/backend`
   - `Dockerfile Path` : `Dockerfile`
4. Dans **Settings** → **Variables**, ajoute ces variables :

```
DATABASE_URL        = ${{Postgres.DATABASE_URL}}   ← copier depuis le plugin PG
JWT_SECRET          = [génère 64 caractères aléatoires sur https://generate-secret.vercel.app/64]
FRONTEND_URL        = https://[ton-frontend].up.railway.app  ← à remplir après étape 5
ANTHROPIC_API_KEY   = sk-ant-...   ← ta clé API Anthropic (pour les fonctions IA)
NODE_ENV            = production
WORKERS             = 2
```

5. Clique **"Deploy"** → attends 2-3 minutes
6. Dans **Settings** → **Networking** → clique **"Generate Domain"**
7. Note l'URL publique du backend (ex: `https://backend-rihla.up.railway.app`)

---

## ÉTAPE 5 — Appliquer les migrations de base de données

Dans Railway, ouvre le service **backend** → onglet **"Shell"** et tape :

```bash
alembic upgrade head
```

Cela crée toutes les tables PostgreSQL.

---

## ÉTAPE 6 — Déployer le Frontend (React)

1. Dans Railway, clique **"New"** → **"GitHub Repo"** → sélectionne `rihla03`
2. Nomme ce service **"frontend"**
3. Dans **Settings** → **Build** :
   - `Root Directory` : `/frontend`
   - `Dockerfile Path` : `Dockerfile`
4. Dans **Settings** → **Variables**, ajoute :

```
BACKEND_URL = https://backend-rihla.up.railway.app   ← URL backend de l'étape 4
PORT        = 80
```

5. Clique **"Deploy"** → attends 3-4 minutes
6. Dans **Settings** → **Networking** → clique **"Generate Domain"**
7. Note l'URL publique du frontend (ex: `https://rihla.up.railway.app`)

---

## ÉTAPE 7 — Mettre à jour FRONTEND_URL dans le backend

Retourne dans le service **backend** → **Variables** :

```
FRONTEND_URL = https://rihla.up.railway.app   ← URL frontend de l'étape 6
```

Railway redéploie automatiquement.

---

## ÉTAPE 8 — Créer le premier compte admin

Ouvre `https://rihla.up.railway.app` dans ton navigateur.

Via l'API (Swagger UI à `https://backend-rihla.up.railway.app/docs`) :
- Appelle `POST /api/auth/register` avec :
```json
{
  "email": "admin@stours.ma",
  "password": "StoursDMC2026!",
  "full_name": "Admin S'TOURS",
  "role": "super_admin"
}
```

---

## ✅ Résultat final

| Service   | URL                                        |
|-----------|--------------------------------------------|
| Frontend  | https://rihla.up.railway.app               |
| Backend   | https://backend-rihla.up.railway.app       |
| API Docs  | https://backend-rihla.up.railway.app/docs  |

---

## 🐛 Problèmes courants

### "Application Error" sur le frontend
→ Vérifie que `BACKEND_URL` pointe bien vers l'URL publique du backend (avec `https://`)

### "502 Bad Gateway" sur les appels API
→ Le backend n'est pas encore démarré. Attends 1-2 min et recharge.

### Migrations échouent
→ Vérifie que `DATABASE_URL` est bien celle du plugin PostgreSQL Railway (pas localhost)

### `weasyprint` plante au build
→ Ajoute dans le Dockerfile backend avant la copie du code :
```dockerfile
RUN apt-get update && apt-get install -y libpango-1.0-0 libpangoft2-1.0-0 libpangocairo-1.0-0
```

---

## 💡 Conseils pour la démo

- Partage l'URL frontend à ton patron **24h avant** pour qu'il puisse tester
- Crée 2-3 projets avec de vraies données avant la présentation
- Le plan gratuit Railway a un **timeout de 30 jours** — suffisant pour une démo

---

*Guide généré automatiquement — Railway Deployment v1.0*
