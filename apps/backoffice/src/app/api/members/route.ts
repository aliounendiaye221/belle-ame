import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CLERK_SECRET_KEY =
  process.env.CLERK_SECRET_KEY || "sk_test_nBjOjz7I7dx4SDoTq2Lqr8LctVwDp2k1m4JvgEzzfw";

export async function GET() {
  try {
    const res = await fetch("https://api.clerk.com/v1/users?limit=100&order_by=-created_at", {
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: "Failed to fetch from Clerk", details: errText }, { status: res.status });
    }

    const clerkUsers = await res.json();

    const formattedUsers = clerkUsers.map((u: any) => {
      const email = u.email_addresses?.[0]?.email_address || "";
      const firstName = u.first_name || email.split("@")[0] || "Membre";
      const lastName = u.last_name || "";
      const phone = u.phone_numbers?.[0]?.phone_number || "Non renseigné (Email vérifié)";
      const avatarUrl = u.image_url || "/images/avatar-woman.jpg";
      const publicMeta = u.public_metadata || {};
      const unsafeMeta = u.unsafe_metadata || {};

      return {
        id: u.id,
        firstName,
        lastName,
        email,
        gender: publicMeta.gender || unsafeMeta.gender || "FEMALE",
        age: publicMeta.age || unsafeMeta.age || 27,
        phone,
        country: publicMeta.country || unsafeMeta.country || "Sénégal",
        countryCode: publicMeta.countryCode || unsafeMeta.countryCode || "SN",
        city: publicMeta.city || unsafeMeta.city || "Dakar",
        profession: publicMeta.profession || unsafeMeta.profession || "Cadre / Entrepreneuriat",
        subscriptionTier: publicMeta.subscriptionTier || "FREE",
        kycStatus: publicMeta.kycStatus || "VERIFIED",
        accountStatus: u.banned ? "SUSPENDED" : "ACTIVE",
        avatarUrl,
        photos: [avatarUrl],
        createdAt: new Date(u.created_at).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        lastLogin: u.last_sign_in_at
          ? new Date(u.last_sign_in_at).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Récemment",
        bio: publicMeta.bio || unsafeMeta.bio || "Membre authentifié par Clerk.",
      };
    });

    return NextResponse.json({
      success: true,
      total: formattedUsers.length,
      users: formattedUsers,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error", message: err?.message || String(err) },
      { status: 500 }
    );
  }
}
