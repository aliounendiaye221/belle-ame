import { PrismaClient, RoleType, PlanInterval, AccountStatus } from "@prisma/client";
import * as crypto from "crypto";

const prisma = new PrismaClient();

function sha256(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

async function main() {
  console.log("🌱 Début du seed de développement pour « À Chacun Une Belle Âme »...");

  // 1. Centres d'intérêt initiaux
  const interests = [
    { name: "Entrepreneuriat", category: "Professionnel" },
    { name: "Spiritualité & Foi", category: "Valeurs" },
    { name: "Famille & Éducation", category: "Valeurs" },
    { name: "Voyages & Découvertes", category: "Loisirs" },
    { name: "Cuisine & Gastronomie", category: "Loisirs" },
    { name: "Sport & Santé", category: "Bien-être" },
    { name: "Lecture & Développement Personnel", category: "Culture" },
    { name: "Musique & Art", category: "Culture" },
  ];

  for (const item of interests) {
    await prisma.interest.upsert({
      where: { name: item.name },
      update: {},
      create: item,
    });
  }
  console.log(`✅ ${interests.length} centres d'intérêt insérés.`);

  // 2. Plans d'abonnement officiels (en centimes de FCFA)
  const plans = [
    {
      name: "Belle Âme Mensuel",
      description: "1 mois de privilèges Premium : filtres avancés, suggestions étendues et accusés de lecture.",
      interval: PlanInterval.MONTHLY,
      priceInCents: 300000, // 3 000 FCFA
      currency: "XOF",
      features: ["FILTERS_ADVANCED", "EXTENDED_SUGGESTIONS", "READ_RECEIPTS"],
      isActive: true,
    },
    {
      name: "Belle Âme Trimestriel",
      description: "3 mois pour trouver votre alter ego avec 1 boost offert.",
      interval: PlanInterval.QUARTERLY,
      priceInCents: 750000, // 7 500 FCFA (au lieu de 9 000)
      currency: "XOF",
      features: ["FILTERS_ADVANCED", "EXTENDED_SUGGESTIONS", "READ_RECEIPTS", "1_FREE_BOOST"],
      isActive: true,
    },
    {
      name: "Belle Âme Annuel",
      description: "Engagement d'un an pour un accompagnement sérieux et continu.",
      interval: PlanInterval.YEARLY,
      priceInCents: 2400000, // 24 000 FCFA
      currency: "XOF",
      features: ["FILTERS_ADVANCED", "EXTENDED_SUGGESTIONS", "READ_RECEIPTS", "VIP_BADGE", "MONTHLY_BOOST"],
      isActive: true,
    },
  ];

  for (const plan of plans) {
    const existing = await prisma.subscriptionPlan.findFirst({
      where: { name: plan.name },
    });
    if (!existing) {
      await prisma.subscriptionPlan.create({ data: plan });
    }
  }
  console.log("✅ Plans d'abonnement configurés.");

  // 3. Feature Flags
  const flags = [
    {
      key: "PREMIUM_ADVANCED_FILTERS",
      description: "Active les filtres par niveau d'études et situation de vie pour les membres Premium",
      isEnabled: true,
      targetRoles: [RoleType.USER],
    },
    {
      key: "AUDIO_VIDEO_CALLS",
      description: "Prépare l'architecture WebRTC pour la V1",
      isEnabled: false,
      targetRoles: [],
    },
  ];

  for (const flag of flags) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: {},
      create: flag,
    });
  }
  console.log("✅ Feature flags initialisés.");

  // 4. Utilisateur Super Administrateur
  const adminPhone = "+237600000001";
  const adminUser = await prisma.user.upsert({
    where: { phoneNumber: adminPhone },
    update: {},
    create: {
      phoneNumber: adminPhone,
      phoneHash: sha256(adminPhone),
      email: "superadmin@belleame.africa",
      status: AccountStatus.ACTIVE,
      isPhoneVerified: true,
      isEmailVerified: true,
      isIdentityVerified: true,
      roles: {
        create: [
          { role: RoleType.SUPER_ADMIN },
          { role: RoleType.ADMIN },
          { role: RoleType.LEAD_MODERATOR },
          { role: RoleType.MODERATOR },
        ],
      },
    },
  });
  console.log(`✅ Super Administrateur créé (ID: ${adminUser.id}).`);

  // 5. Code d'invitation initial pour la migration WhatsApp
  await prisma.referralInvite.upsert({
    where: { code: "WA-COMMUNITY-9000" },
    update: {},
    create: {
      code: "WA-COMMUNITY-9000",
      campaignName: "migration-whatsapp-pionniers",
      maxUses: 9500,
      promoDurationDays: 30, // 30 jours Premium offerts
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // Valide 90 jours
    },
  });
  console.log("✅ Code de migration WhatsApp créé : WA-COMMUNITY-9000");

  console.log("🎉 Seed terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur pendant le seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
