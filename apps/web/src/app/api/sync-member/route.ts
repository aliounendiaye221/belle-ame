import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

const CLERK_SECRET_KEY =
  process.env.CLERK_SECRET_KEY || "sk_test_nBjOjz7I7dx4SDoTq2Lqr8LctVwDp2k1m4JvgEzzfw";

export async function POST(req: Request) {
  try {
    const session = auth();
    let userId = session?.userId;

    const body = await req.json().catch(() => ({}));
    if (!userId && body.userId) {
      userId = body.userId;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized / Missing userId" }, { status: 401 });
    }

    const {
      firstName,
      gender,
      age,
      country,
      countryCode,
      city,
      profession,
      bio,
      kycStatus,
      subscriptionTier,
    } = body;

    const publicMetadata: Record<string, any> = {};
    if (gender) publicMetadata.gender = gender;
    if (age) publicMetadata.age = age;
    if (country) publicMetadata.country = country;
    if (countryCode) publicMetadata.countryCode = countryCode;
    if (city) publicMetadata.city = city;
    if (profession) publicMetadata.profession = profession;
    if (bio) publicMetadata.bio = bio;
    if (kycStatus) publicMetadata.kycStatus = kycStatus;
    if (subscriptionTier) publicMetadata.subscriptionTier = subscriptionTier;

    // Mise à jour sur l'API Clerk
    const updateRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(firstName ? { first_name: firstName } : {}),
        public_metadata: publicMetadata,
      }),
    });

    if (!updateRes.ok) {
      const err = await updateRes.text();
      return NextResponse.json({ error: "Clerk update failed", details: err }, { status: 400 });
    }

    const updatedUser = await updateRes.json();
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error", message: err?.message || String(err) },
      { status: 500 }
    );
  }
}
