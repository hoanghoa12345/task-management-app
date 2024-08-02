import { db } from "@/db";
import { auth } from "@/lib/auth";

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

  const imagesData = await db.query.images.findMany();

  const images = imagesData.map((img) => ({
    id: img.id,
    urls: {
      thumb: img.thumbnailUrl,
      full: img.fullUrl,
    },
    links: {
      html: img.linkHTML,
    },
    user: {
      name: img.username,
    },
  }));

  return Response.json({
    data: {
      images: images,
    },
    message: "Success",
  });
});
