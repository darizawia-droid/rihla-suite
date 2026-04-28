# 🚀 Guide de Déploiement RIHLA Online

Ce document explique comment mettre la plateforme RIHLA en ligne sur **Railway.app** ou **Render.com**.

## 1. Variables d'Environnement (Crucial)

Lors du déploiement du **Backend**, vous devez configurer ces variables :

| Variable | Valeur (Exemple) |
| :--- | :--- |
| `DATABASE_URL` | `postgresql://user:pass@host:port/db` (Fournie par Railway) |
| `SECRET_KEY` | `votre_cle_secrete_tres_longue` |
| `ANTHROPIC_API_KEY` | `votre_cle_claude_ai` |
| `CORS_ORIGINS` | `https://votre-frontend.up.railway.app` |

## 2. Déploiement du Backend (FastAPI)

1. Connectez le dossier `backend`.
2. Commande de démarrage : `gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
3. Railway détectera le `requirements.txt` et installera tout.

## 3. Déploiement du Frontend (React)

1. Connectez le dossier `frontend`.
2. Build Command : `npm install && npm run build`
3. Publish Directory : `dist` (ou `build`)
4. **Important** : Configurez la variable `VITE_API_URL` pointant vers l'URL de votre Backend.

## 4. Initialisation de la Base de Données

Une fois en ligne, vous devez créer les tables. Dans le terminal de Railway (ou via une commande locale pointant vers la DB distante) :
```bash
# Dans le dossier backend
alembic upgrade head
python seed_users.py
```

## 5. Recommandations
- Utilisez un certificat SSL (inclus gratuitement sur Railway/Render).
- Configurez un domaine personnalisé (ex: `ops.stours.ma`) dans les réglages de l'hébergeur.
