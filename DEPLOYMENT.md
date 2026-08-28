# Guide de Déploiement et d'Exploitation — « À Chacun Une Belle Âme »

---

## 1. Architecture Cible de Déploiement

Le SaaS **« À Chacun Une Belle Âme »** est articulé autour d'un monorepo Turborepo conteneurisé prêt pour le déploiement sur VPS (Docker Compose) ou Kubernetes managé :

```
                        [ Reverse Proxy / Cloudflare TLS 1.3 ]
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
[apps/web : PWA 3000]       [apps/backoffice : 3001]           [apps/api : 4000]
(Next.js 14 App Router)     (Next.js 14 Admin Portal)         (NestJS Modular Monolith)
                                                                          │
                                         ┌────────────────────────────────┤
                                         ▼                                ▼
                                 [PostgreSQL 16]                     [Redis 7]
                               (Cluster Transactionnel)       (Sessions, Cache & Sockets)
                                         │
                                         ▼
                             [Stockage Compatible S3]
                        (AWS S3 / Cloudflare R2 / MinIO)
```

---

## 2. Pré-requis Système

- **Système d'Exploitation** : Linux Ubuntu 22.04 LTS ou Debian 12 (Recommandé) ;
- **Ressources Minimales** : 4 vCPU, 8 Go de mémoire RAM, 50 Go de stockage SSD NVMe ;
- **Réseau** : Ports ouverts `80` (HTTP), `443` (HTTPS) ;
- **Outils & Runtimes** :
  - Docker Engine v24+ et Docker Compose v2.20+ ;
  - Node.js v20.14.0+ (LTS) et pnpm v9+ ;
  - Certificat SSL Let's Encrypt ou proxy Cloudflare avec terminaison TLS 1.3.

---

## 3. Checklist de Déploiement en 10 Étapes

### Étape 1 : Cloner le Répertoire et Configurer l'Environnement
```bash
git clone https://github.com/votre-orga/belle-ame.git
cd belle-ame
cp .env.example .env
```

### Étape 2 : Définir les Secrets Obligatoires de Production
Éditer le fichier `.env` et renseigner les clés obligatoires :
- `DATABASE_URL` : Chaîne de connexion PostgreSQL avec mot de passe fort (>= 32 caractères aléatoires) ;
- `REDIS_URL` : Chaîne de connexion Redis avec mot de passe `AUTH` ;
- `JWT_ACCESS_SECRET` & `JWT_REFRESH_SECRET` : Clés cryptographiques de 64 octets générées via `openssl rand -hex 64` ;
- `S3_ACCESS_KEY` & `S3_SECRET_KEY` : Clés IAM restreintes aux deux compartiments `belleame-public-photos` et `belleame-private-kyc-vault`.

### Étape 3 : Démarrer les Services d'Infrastructure
```bash
docker compose -f docker/docker-compose.yml up -d postgres redis minio minio-create-buckets
```

### Étape 4 : Installer les Dépendances du Monorepo
```bash
pnpm install --frozen-lockfile
```

### Étape 5 : Exécuter les Migrations de Base de Données
```bash
pnpm --filter @belle-ame/database db:migrate
```

### Étape 6 : Injecter les Données Initiales de Référence (Seed)
```bash
# Crée le compte Super Admin, les plans d'abonnement en FCFA, les valeurs et la campagne WhatsApp
pnpm --filter @belle-ame/database db:seed
```

### Étape 7 : Compiler les Packages Partagés et Applications
```bash
pnpm turbo build
```

### Étape 8 : Lancer les Suites de Tests de Validation
```bash
pnpm --filter @belle-ame/api test
```

### Étape 9 : Démarrer les Runtimes Applicatifs (via PM2 ou Docker)
```bash
# Exemple de démarrage avec PM2 en mode cluster
pm2 start apps/api/dist/main.js --name "belleame-api" -i max
pm2 start apps/web/server.js --name "belleame-web" -i 2
pm2 start apps/backoffice/server.js --name "belleame-backoffice" -i 2
pm2 save
```

### Étape 10 : Vérifier la Santé du Système (Health Check)
```bash
curl -I http://localhost:4000/api/v1/health
# Réponse attendue : HTTP/1.1 200 OK {"status":"ok","database":"connected"}
```

---

## 4. Stratégie de Sauvegarde et Restauration

### Sauvegarde Quotidienne Automatisée de la Base PostgreSQL
```bash
#!/bin/bash
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/belleame/postgres"
mkdir -p $BACKUP_DIR

docker exec -t belleame-postgres pg_dump -U belleame_user -d belleame_db -F c | gzip > "$BACKUP_DIR/db_backup_$BACKUP_DATE.dump.gz"

# Rétention : suppression des sauvegardes de plus de 30 jours
find $BACKUP_DIR -type f -mtime +30 -name "*.dump.gz" -exec rm {} \;
```

### Restauration en Cas d'Urgence
```bash
gunzip < /var/backups/belleame/postgres/db_backup_FICHIER.dump.gz | docker exec -i belleame-postgres pg_restore -U belleame_user -d belleame_db --clean --if-exists
```

---

## 5. Procédure de Rollback

En cas de détection d'une anomalie bloquante après déploiement :
1. Arrêter les processus applicatifs : `pm2 stop all` ;
2. Restaurer la version précédente du code : `git checkout <dernier_tag_stable>` ;
3. Si une migration de base est impliquée, révoquer la migration via Prisma ou restaurer le dump de sauvegarde pré-déploiement ;
4. Recompiler et redémarrer : `pnpm turbo build && pm2 restart all` ;
5. Confirmer le rétablissement via `/api/v1/health`.
