import { db } from "@/db";
import { organizations } from "@/db/schema";
import { auth } from "@/lib/auth";
import { ORGANIZATION_ID } from "@/utils/constants";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export const GET = auth(async (req) => {
  const user = req?.auth?.user;
  const userId = user?.id;
  if (!userId)
    return Response.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );

  const organizationsData = await db
    .select({
      id: organizations.id,
      name: organizations.name,
      imageUrl: organizations.imageUrl,
      slug: organizations.slug,
    })
    .from(organizations)
    .where(eq(organizations.userId, userId));

  return Response.json({
    data: {
      organizations: organizationsData,
    },
    message: "Success",
  });
});

export const POST = auth(async (req) => {
  const user = req?.auth?.user;
  const userId = user?.id;
  const { orgId } = await req.json();
  if (!userId)
    return Response.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  if (!orgId) return Response.json({ success: false });
  const cookieStore = await cookies();
  cookieStore.set({
    name: ORGANIZATION_ID,
    value: orgId,
    httpOnly: true,
    path: "/",
  });
  return Response.json({ success: true });
});
