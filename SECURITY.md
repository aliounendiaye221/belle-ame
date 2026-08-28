# Politique de Sécurité Applicative — « À Chacun Une Belle Âme »

---

## 1. Engagement Fondamental et Modèle de Menace

La plateforme **« À Chacun Une Belle Âme »** a été conçue selon le principe de **Sécurité dès la Conception (Security by Design)** et de **Défense en Profondeur**. 
Notre public cible — célibataires africains et de la diaspora aspirant à un mariage ou une relation sérieuse — est historiquement exposé à des menaces spécifiques que notre architecture neutralise :

| Menace Identifiée | Vecteur d'Attaque | Contre-Mesure Implémentée dans l'Architecture |
| :--- | :--- | :--- |
| **Broutage / Arnaques sentimentales** | Sollicitations d'argent par Mobile Money / Western Union | Heuristique lexicale temps réel + Détection de Levenshtein + Signalement prioritaire (SLA < 4h) + Blocage bilatéral immédiat. |
| **Profils mineurs non autorisés** | Contournement du formulaire de date de naissance | Calcul strict de l'âge côté serveur (< 18 ans rejeté) + Certification d'identité biométrique (CNI/Passeport + Selfie). |
| **Vol d'identité & Faux profils** | Réutilisation de photos volées sur les réseaux sociaux | Modération humaine obligatoire des photos (`PENDING` par défaut) + Vérification KYC croisée avec liveness check. |
| **Traçage géographique & Atteinte à la vie privée** | Extraction des métadonnées EXIF (GPS) des photos de profil | Nettoyage systématique des métadonnées EXIF par `MediaService` + Masquage de l'horodatage d'activité (« En ligne », « Actif aujourd'hui »). |
| **Harcèlement ou messages non consentis** | Messages massifs non sollicités | **Consentement Mutuel Strict (Mutual Opt-In)** : impossibilité technique d'écrire sans `Match` réciproque actif. |
| **Attaques par déni de service / Brute-force OTP** | Saisie massive de codes SMS sur l'endpoint d'authentification | Verrouillage temporel : max 3 OTPs / heure par téléphone + Verrouillage de 15 minutes après 5 échecs consécutifs. |
| **Rejeu de transactions financières** | Webhooks rejoués par les passerelles Mobile Money | Idempotence absolue via la contrainte unique `externalEventId` sur la table `PaymentWebhookEvent`. |

---

## 2. Ségrégation Étanche des Données et Coffre-Fort KYC

L'un des piliers cardinaux de la plateforme est l'étanchéité absolue entre la sphère publique et la sphère d'identification légale :

```
[Réseau Public / CDN]                          [Vase Clos Privé / Vault]
        │                                                  │
        ▼                                                  ▼
┌──────────────────────────────┐              ┌──────────────────────────────┐
│  belleame-public-photos      │              │  belleame-private-kyc-vault  │
│  - Photos de profil modérées │              │  - Scans CNI / Passeports    │
│  - Format WebP sans EXIF     │   ISOLATION  │  - Selfies biométriques      │
│  - Accessible aux membres    │  ◄────────►  │  - Chiffrement au repos      │
│    connectés ayant matché    │              │  - URLs signées max 5 min    │
│  - Zéro donnée d'état civil  │              │  - Purge physique sous 30 j  │
└──────────────────────────────┘              └──────────────────────────────┘
```

### Règles de Gestion des Pièces d'Identité :
1. **Accès Temporaire Restreint** : Les modérateurs n'accèdent aux pièces justificatives que par des URLs présignées S3 dotées d'une durée de vie de 5 minutes.
2. **Purge Programmée à 30 Jours** : Une fois la décision de vérification arrêtée, les fichiers bruts sont physiquement effacés du stockage sous 30 jours. Seul le condensat cryptographique **SHA-256** est conservé en base pour interdire la recréation de compte frauduleux avec la même pièce.
3. **Masquage Support Client** : Les opérateurs de niveau 1 (`CUSTOMER_SUPPORT`) ne peuvent en aucun cas visualiser les clés ni les images des pièces justificatives.

---

## 3. Chiffrement et Gestion des Secrets

- **En Transit** : L'ensemble des communications (Web, Mobile, API, WebSocket, Webhooks) transite obligatoirement par **TLS 1.3** avec chiffrement HSTS forcé.
- **Au Repos** : Les données sensibles de base de données (adresses e-mail, tokens de session, identifiants d'appareils) et les compartiments S3 sont chiffrés via **AES-256**.
- **Gestion des Secrets** :
  - **Zéro mot de passe ou secret en dur dans le code source** ;
  - Toutes les configurations sensibles sont injectées au démarrage via les variables d'environnement validées par Zod (`ConfigModule`) ;
  - Les jetons d'accès JWT ont une durée de vie courte de **15 minutes** ; les jetons de rafraîchissement (30 jours) sont stockés sous forme de condensats **SHA-256** dans `UserSession`.

---

## 4. Matrice de Contrôle d'Accès par Rôles (RBAC)

| Rôle | Périmètre Fonctionnel | Restrictions de Sécurité |
| :--- | :--- | :--- |
| `MEMBER` | Gestion de son profil, coups de cœur, messagerie de ses matchs | Accès strict à ses propres données. |
| `CUSTOMER_SUPPORT` | Assistance connexion, consultation basique des statuts | **Pièces KYC masquées**, aucune action de bannissement. |
| `MODERATOR` | File KYC, revue des photos, sanctions graduées de modération | Traçabilité intégrale dans `AdminAuditLog`. |
| `LEAD_MODERATOR` | Arbitrage des dossiers complexes, respect du SLA (< 24h) | Supervision des actions des modérateurs. |
| `ADMIN` | Gestion financière, remboursements, campagnes de parrainage | Aucune modification de code ni attribution de rôles admin. |
| `SUPER_ADMIN` | Attribution des rôles d'administration, exports de conformité | Authentification renforcée obligatoire. |

---

## 5. Journalisation et Piste d'Audit Infalsifiable

Toute action sensible opérée par un collaborateur ou un processus automatisé est consignée de manière immuable dans la table `AdminAuditLog` :
- Horodatage certifié UTC ;
- Identifiant unique de l'opérateur (`adminId`) ;
- Type d'action normalisé (`MOD_ACTION_*`, `KYC_DECISION_*`, `VIEW_USER_DETAILS`, `PAYMENT_REFUNDED`, `ROLE_ASSIGN`) ;
- Adresse IP d'origine et User-Agent ;
- Métadonnées contextuelles (motifs internes, valeurs avant/après).

Aucun endpoint de l'API ne permet la modification ou la suppression des logs d'audit.

---

## 6. Procédure de Divulgation Responsable des Vulnérabilités

La sécurité de notre communauté est une priorité absolue. Si vous découvrez une faille de sécurité ou une vulnérabilité potentielle, nous vous invitons à nous en faire part immédiatement :
- **E-mail de sécurité** : `security@belleame.africa` ;
- **Délai de première réponse garanti** : sous 24 heures ouvrées ;
- **Périmètre du programme** : API NestJS, Web PWA Next.js, application mobile Expo et infrastructure cloud ;
- **Engagement** : Nous nous engageons à ne pas engager de poursuites judiciaires contre les chercheurs en sécurité agissant de bonne foi dans le respect de la confidentialité des données de nos membres.
