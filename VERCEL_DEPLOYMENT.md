# Guide de Déploiement en Production sur Vercel — « À Chacun Une Belle Âme »

---

## 1. Architecture Serverless sur Vercel

Le monorepo **« À Chacun Une Belle Âme »** est nativement configuré pour être déployé en production sur **Vercel** via l'intégration officielle Turborepo :

```
                                  [ Vercel Global Edge Network ]
                                                │
         ┌──────────────────────────────────────┼──────────────────────────────────────┐
         ▼                                      ▼                                      ▼
[Projet 1 : belle-ame-web]         [Projet 2 : belle-ame-backoffice]     [Projet 3 : belle-ame-api]
Root Directory : apps/web          Root Directory : apps/backoffice       Root Directory : apps/api
Domaine : belleame.africa          Domaine : admin.belleame.africa        Domaine : api.belleame.africa
(Next.js 14 App Router)            (Next.js 14 Back-Office)               (NestJS Serverless Function)
         │                                      │                                      │
         └──────────────────────────────────────┼──────────────────────────────────────┘
                                                │
                                                ▼
                                   [Base de Données Serverless]
                           (Vercel Postgres / Neon / Supabase / AWS RDS)
                                                │
                                                ▼
                                    [Stockage Compatible S3]
                            (Cloudflare R2 / AWS S3 / Supabase Storage)
```

---

## 2. Pré-requis Cloud

1. **Compte Vercel** (Hobby ou Pro) : [vercel.com](https://vercel.com) ;
2. **Base de Données PostgreSQL Managée** :
   - **Recommandé** : Vercel Postgres (intégré en 1 clic) ou Neon Serverless Postgres / Supabase ;
   - Doit supporter le pooling de connexions (ex: PgBouncer / Prisma Accelerate) pour absorber les invocations serverless concurrentes ;
3. **Compartiments de Stockage S3** :
   - AWS S3 ou Cloudflare R2 avec les compartiments `belleame-public-photos` et `belleame-private-kyc-vault` ;
4. **Dépôt Git** : GitHub ou GitLab connecté à votre organisation Vercel.

---

## 3. Déploiement des 3 Projets sur Vercel (Étape par Étape)

### Projet 1 : Le Backend API (`apps/api`)

1. Dans le Dashboard Vercel, cliquer sur **« Add New... » > « Project »** ;
2. Sélectionner votre dépôt Git `belle-ame` ;
3. Dans **Root Directory**, cliquer sur **Edit** et choisir : `apps/api` ;
4. Laisser le Framework Preset sur **Other** (détectera automatiquement `apps/api/vercel.json` et `@vercel/node`) ;
5. Dans **Build and Output Settings** :
   - Build Command : `cd ../.. && pnpm --filter @belle-ame/api build`
   - Install Command : `cd ../.. && pnpm install`
6. Renseigner les **Environment Variables** (voir section 4 ci-dessous) ;
7. Cliquer sur **Deploy**.
8. Une fois déployé, noter l'URL générée (ex : `https://api-belle-ame.vercel.app`).

---

### Projet 2 : La Web PWA (`apps/web`)

1. Dans le Dashboard Vercel, cliquer sur **« Add New... » > « Project »** ;
2. Sélectionner le même dépôt Git `belle-ame` ;
3. Dans **Root Directory**, choisir : `apps/web` ;
4. Framework Preset : **Next.js** (détecté automatiquement) ;
5. Dans **Environment Variables**, ajouter :
   - `NEXT_PUBLIC_API_URL` = `https://api-belle-ame.vercel.app` (URL de l'API déployée) ;
   - `API_URL` = `https://api-belle-ame.vercel.app` ;
6. Cliquer sur **Deploy**.

---

### Projet 3 : Le Back-Office d'Administration (`apps/backoffice`)

1. Dans le Dashboard Vercel, cliquer sur **« Add New... » > « Project »** ;
2. Sélectionner le même dépôt Git `belle-ame` ;
3. Dans **Root Directory**, choisir : `apps/backoffice` ;
4. Framework Preset : **Next.js** ;
5. Dans **Environment Variables**, ajouter :
   - `NEXT_PUBLIC_API_URL` = `https://api-belle-ame.vercel.app` ;
   - `API_URL` = `https://api-belle-ame.vercel.app` ;
6. Cliquer sur **Deploy**.

---

## 4. Variables d'Environnement Requises pour l'API (`apps/api`)

À configurer dans les paramètres du projet `apps/api` sur Vercel :

| Variable | Exemple / Format | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Environnement d'exécution |
| `VERCEL` | `1` | Marqueur d'exécution Serverless |
| `DATABASE_URL` | `postgres://user:pass@ep-pooler.neon.tech/belleame_db?sslmode=require&pgbouncer=true` | Chaîne de connexion PostgreSQL avec connection pooler |
| `REDIS_URL` | `redis://default:token@upstash.io:6379` | Instance Redis managée (Upstash Redis recommandé pour Vercel) |
| `JWT_ACCESS_SECRET` | Chaîne aléatoire 64 octets (`openssl rand -hex 64`) | Signature des jetons d'accès (15 min) |
| `JWT_REFRESH_SECRET` | Chaîne aléatoire 64 octets (`openssl rand -hex 64`) | Signature des refresh tokens (30 jours) |
| `S3_ENDPOINT` | `s3.eu-west-3.amazonaws.com` ou `r2.cloudflarestorage.com` | Endpoint de l'objet storage |
| `S3_REGION` | `eu-west-3` | Région S3 |
| `S3_ACCESS_KEY` | Clé d'accès IAM | Accès aux compartiments |
| `S3_SECRET_KEY` | Clé secrète IAM | Secret S3 |
| `S3_PUBLIC_BUCKET` | `belleame-public-photos` | Compartiment des photos de profil publiques |
| `S3_PRIVATE_KYC_BUCKET` | `belleame-private-kyc-vault` | Coffre-fort isolé des pièces d'identité |
| `NEXT_PUBLIC_APP_URL` | `https://belleame.africa` | URL de la Web PWA pour les redirections et CORS |
| `NEXT_PUBLIC_BACKOFFICE_URL` | `https://admin.belleame.africa` | URL du Back-Office pour les autorisations CORS |

---

## 5. Migration et Initialisation de la Base de Données (Seed)

Depuis votre terminal local connecté à la base PostgreSQL de production :

```powershell
# 1. Configurer la variable d'environnement avec l'URL de production
$env:DATABASE_URL="postgres://votre_user:votre_pass@votre_host_prod/belleame_db?sslmode=require"

# 2. Appliquer les migrations de schéma Prisma
pnpm --filter @belle-ame/database db:migrate

# 3. Injecter les données initiales de référence (Super Admin, plans FCFA, code WhatsApp)
pnpm --filter @belle-ame/database db:seed
```

---

## 6. Déploiement via Vercel CLI (Ligne de Commande)

Si vous préférez déployer directement depuis la ligne de commande :

```powershell
# 1. Installer Vercel CLI
pnpm add -g vercel

# 2. Se connecter à son compte
vercel login

# 3. Déployer l'API en production
cd "c:\Users\aliou\belle ame\apps\api"
vercel --prod

# 4. Déployer la Web PWA en production
cd "c:\Users\aliou\belle ame\apps\web"
vercel --prod

# 5. Déployer le Back-Office en production
cd "c:\Users\aliou\belle ame\apps\backoffice"
vercel --prod
```

---

## 7. Configuration des Domaines Personnalisés

Dans les paramètres **« Domains »** de chaque projet sur Vercel :

| Projet | Domaine Personnalisé | Configuration DNS |
| :--- | :--- | :--- |
| `apps/web` | `belleame.africa` et `www.belleame.africa` | Enregistrement A : `76.76.21.21` / CNAME : `cname.vercel-dns.com` |
| `apps/backoffice` | `admin.belleame.africa` | CNAME : `cname.vercel-dns.com` |
| `apps/api` | `api.belleame.africa` | CNAME : `cname.vercel-dns.com` |

Vercel génère et renouvelle automatiquement les **certificats SSL/TLS 1.3 Let's Encrypt** pour chacun de ces sous-domaines.

---

## 8. Vérification Post-Déploiement

Tester l'état de santé du backend en production :
```powershell
Invoke-RestMethod -Method GET -Uri "https://api.belleame.africa/api/v1/health"
# Réponse attendue : {"status":"ok","database":"connected","timestamp":"..."}
```

Tester la documentation Swagger OpenAPI interactive :
- Ouvrir dans votre navigateur : `https://api.belleame.africa/api/docs`
