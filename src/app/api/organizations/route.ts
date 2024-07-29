import { db } from "@/db";
import { organizations } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

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
