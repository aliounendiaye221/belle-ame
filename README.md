# « À Chacun Une Belle Âme » — Plateforme SaaS de Rencontres Sérieuses

Plateforme SaaS de rencontres humaines, sérieuses et vérifiées, exclusivement réservée aux personnes majeures au **Cameroun**, au **Bénin**, en **Côte d'Ivoire** et dans la **diaspora africaine francophone**.

Ce projet assure la migration sécurisée et la professionnalisation d'une communauté WhatsApp existante de plus de **9 000 membres**.

---

## 🏛️ Architecture du Système

Le projet est structuré sous la forme d'un **Monolithe Modulaire en Monorepo TypeScript** avec **Turborepo** et **pnpm** :

- **`apps/api`** : API REST & Gateway Socket.IO en NestJS 10 (Auth, KYC, Matching, Chat, Modération, Paiements).
- **`apps/web`** : Application web publique & PWA en Next.js 14 (expérience fluide, responsive mobile-first).
- **`apps/backoffice`** : Portail administratif et console de modération en Next.js 14.
- **`apps/mobile`** : Application mobile native React Native avec Expo SDK 51.
- **`packages/database`** : Schéma relationnel Prisma (34 entités), migrations et seeds.
- **`packages/shared-types`** : Schémas Zod, DTOs et enums partagés entre frontend et backend.
- **`packages/config`** : Configurations partagées TypeScript et ESLint strict.
- **`docker/`** : Environnement conteneurisé local (PostgreSQL 16, Redis 7, MinIO S3 compatible).

---

## 🚀 Démarrage Rapide en Local

### 1. Prérequis
- Node.js >= 20.x
- pnpm >= 9.x (`npm install -g pnpm`)
- Docker & Docker Compose

### 2. Cloner et Installer les Dépendances
```bash
# Copier les variables d'environnement
cp .env.example .env

# Installer les dépendances du monorepo
pnpm install
```

### 3. Lancer l'Infrastructure Conteneurisée
```bash
# Démarre PostgreSQL 16, Redis 7 et MinIO
docker compose -f docker/docker-compose.yml up -d
```

### 4. Générer et Migrer la Base de Données
```bash
# Générer le client Prisma
pnpm db:generate

# Appliquer les migrations
pnpm db:migrate

# Peupler la base avec les données de démonstration et rôles
pnpm db:seed
```

### 5. Démarrer les Serveurs de Développement
```bash
# Démarre l'API (4000), le Web (3000) et le Back-Office (3001) en parallèle
pnpm dev
```

- **Application Web** : [http://localhost:3000](http://localhost:3000)
- **Back-Office d'Administration** : [http://localhost:3001](http://localhost:3001)
- **API NestJS** : [http://localhost:4000/api/v1](http://localhost:4000/api/v1)
- **Documentation OpenAPI (Swagger)** : [http://localhost:4000/docs](http://localhost:4000/docs)
- **Console MinIO S3** : [http://localhost:9001](http://localhost:9001) (`minioadmin` / `minioadmin`)

---

## 🛡️ Sécurité & Principes Non Négociables
1. **100% Majeurs** : Calcul d'âge strict serveur (18+). Rejet bloquant immédiat de tout mineur.
2. **100% Identités Vérifiées** : Aucun échange de messages possible sans vérification d'identité préalable.
3. **Ségrégation KYC** : Les pièces d'identité sont isolées dans un bucket privé chiffré, inaccessibles publiquement, et purgées après 30 jours (seul le hash de contrôle est conservé).
4. **Consentement Mutuel** : Messagerie ouverte uniquement après accord réciproque (Mutual Match).
5. **Paiements Mobiles Locaux** : Mobile Money (Wave, MTN, Orange, Moov) avec gestion d'idempotence des webhooks.
