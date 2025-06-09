import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST() {
  console.log("🔄 SYNC API HIT");

  try {
    const user = await currentUser();

    if (!user?.id) {
      console.warn("Unauthorized: No user ID");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress;

    if (!email) {
      console.warn(" Email not found for user:", user.id);
      return new NextResponse("No Email Address Found", { status: 400 });
    }

    const syncedUser = await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email,
      },
    });

    console.log("✅ User synced successfully:", syncedUser);

    return NextResponse.json({ message: "User synced", data: syncedUser }, { status: 200 });
  } catch (error) {
    console.error(" Error syncing user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
