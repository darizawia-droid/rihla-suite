# 🎯 Guide de Démo Live — Plateforme RIHLA / S'TOURS DMC
**À lire avant la présentation — 15 à 20 minutes de démo**

---

## ⚡ Avant de commencer (Checklist)

- [ ] Lancer le backend : `cd backend && uvicorn app.main:app --reload`
- [ ] Lancer le frontend : `cd frontend && npm run dev`
- [ ] Ouvrir le navigateur en **plein écran** (F11)
- [ ] Activer le **mode sombre** (look plus pro)
- [ ] Avoir un projet existant avec itinéraire + cotation (ou en créer un la veille)
- [ ] Désactiver les notifications Windows / Teams pendant la démo

---

## 🎬 Script de Démo — 5 actes

---

### ACTE 1 — L'accueil (2 min)
**Écran : Dashboard**

> *"Voici le tableau de bord central de RIHLA. En un coup d'œil, on voit l'état de toute l'activité S'TOURS."*

👉 **Montrer :**
- Les KPI cards en haut (projets actifs, CA pipeline, taux de conversion)
- La carte du Maroc interactive avec les destinations actives
- Le feed des projets récents

💬 **Phrase clé à dire :**
> *"Chaque matin, le directeur commercial ouvre ça et sait exactement où en est le business — sans appeler personne."*

---

### ACTE 2 — Créer une Proposition en 3 minutes (4 min)
**Écran : Nouveau Projet → Itinéraire → Cotation**

> *"Imaginons qu'une agence parisienne nous envoie une demande pour 22 PAX, Maroc Impérial 8 jours."*

👉 **Étape 1 — Créer le projet** (30 sec)
- Cliquer "Nouveau Projet"
- Remplir : Nom, Client, Destination, Dates, PAX
- Valider → le projet s'ouvre directement

👉 **Étape 2 — Générer l'itinéraire avec l'IA** (1 min)
- Aller dans l'onglet "Itinéraire"
- Cliquer "Générer avec l'IA"
- Choisir le ton (Luxe / Aventure)
- Laisser l'IA remplir les 8 jours

💬 **Phrase clé :**
> *"Ce que nos commerciaux faisaient en 2 heures, l'IA le fait en 15 secondes."*

👉 **Étape 3 — Lancer le chiffrage** (1 min 30)
- Aller dans l'onglet "Cotation"
- Cliquer "Lancer le Chiffrage"
- Remplir les coûts hôtels jour par jour (montrer 2-3 lignes)
- Le tableau multi-PAX se calcule en temps réel
- Montrer la grille : 10, 15, 20, 25, 30 PAX → prix par personne automatique

💬 **Phrase clé :**
> *"Le commercial change un coût hôtel et immédiatement tous les prix pour tous les groupes se recalculent. Fini les erreurs Excel."*

---

### ACTE 3 — La Proposition Client (3 min)
**Écran : Proposal Studio → Lien Public**

> *"Une fois la cotation validée, on génère la proposition commerciale."*

👉 **Étape 1 — Proposal Studio**
- Aller dans le menu "Proposal Studio"
- Sélectionner le projet
- Choisir le template "Luxury"
- Cliquer **"Générer le PPTX"**
- Un fichier PowerPoint professionnel se télécharge

💬 **Phrase clé :**
> *"C'est un PowerPoint aux couleurs S'TOURS, avec le programme jour par jour, le tableau des prix, les inclusions — prêt à envoyer au client."*

👉 **Étape 2 — Lien de partage client**
- Cliquer "Partager" sur le projet
- Copier le lien généré
- Ouvrir dans un onglet privé → montrer la vue client

💬 **Phrase clé :**
> *"Le client reçoit ce lien. Il voit la proposition en ligne, peut laisser des commentaires, et signer numériquement depuis son téléphone."*

---

### ACTE 4 — Les Opérations (3 min)
**Écran : Planning Opérations → Rooming List**

> *"Quand le groupe est confirmé, on bascule en mode opérationnel."*

👉 **Planning des Opérations**
- Ouvrir "Planning Opérations"
- Montrer la vue Gantt du mois avec les groupes actifs
- Affecter un guide à un groupe (dropdown)
- Montrer la détection de conflit si 2 groupes ont le même guide

💬 **Phrase clé :**
> *"Le responsable ops voit tous les groupes du mois, affecte guides et véhicules, et le système alerte automatiquement en cas de conflit de disponibilité."*

👉 **Rooming List**
- Ouvrir "Rooming List" depuis un projet
- Montrer le tableau des participants
- Cliquer "Export Excel" → le fichier se télécharge directement

💬 **Phrase clé :**
> *"La liste d'occupation est générée automatiquement et envoyée à l'hôtel en un clic."*

---

### ACTE 5 — La Vision Business (2 min)
**Écran : CRM → Finance**

> *"Et pour piloter le réseau d'agences partenaires et le chiffre d'affaires..."*

👉 **CRM Agences**
- Ouvrir "CRM & Agences"
- Montrer le tableau des agences avec taux de conversion
- Cliquer sur une agence → détail avec préférences VIP

👉 **Dashboard Finance** (si dispo)
- Montrer le CA pipeline
- Les factures en cours

💬 **Phrase clé finale :**
> *"En résumé : du premier email de l'agence partenaire jusqu'à l'encaissement de la facture, tout est dans RIHLA. Aucun Excel, aucun email perdu, une équipe qui travaille ensemble en temps réel."*

---

## 🔑 Les 3 messages clés à retenir

| Message | Ce que ça résout |
|---------|-----------------|
| **"Devis en 3 min"** | Avant : 2-3h par commercial |
| **"Zéro erreur de calcul"** | Avant : erreurs Excel fréquentes |
| **"Tout centralisé"** | Avant : WhatsApp + Excel + Email dispersés |

---

## ❓ Questions probables du patron — Réponses préparées

**"Combien ça coûte à mettre en production ?"**
> Hébergement cloud (ex: DigitalOcean) : ~50€/mois. Développement déjà avancé.

**"Est-ce que c'est sécurisé ?"**
> Authentification JWT, base de données PostgreSQL, données hébergées en Europe.

**"On peut l'utiliser sur mobile ?"**
> Le frontend est responsive. Une app mobile peut être développée en phase 2.

**"Quand est-ce que c'est prêt ?"**
> Le cœur est fonctionnel. Il reste à connecter les données réelles S'TOURS et à former l'équipe (2-3 jours).

**"Qui maintient ça ?"**
> Le code est documenté et standard (FastAPI + React). N'importe quel développeur web peut le maintenir.

---

## 💡 Conseils de présentation

- Parle **en bénéfices**, pas en technique : "le commercial gagne 2h par devis", pas "l'API REST retourne un JSON"
- Montre des **vrais chiffres** : si tu as des données de test, utilise des montants crédibles (58 000 MAD, 24 PAX, etc.)
- Laisse le patron **interagir** : donne-lui la souris pour cliquer sur un projet ou signer une proposition
- Prépare un **plan B** : si internet coupe, aie des screenshots sur ton téléphone

---

*Guide généré par RIHLA Assistant — Bonne chance pour la présentation ! 🚀*
