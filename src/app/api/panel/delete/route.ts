import s3Client from "@/config/aws-s3-client/s3-clients";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
export const POST = async (req: Request) => {
  try {
    const { key } = await req.json();
    if (!key) {
      return Response.json({ message: "file is req" }, { status: 400 });
    }
    const client = s3Client();
    await client.send(
      new DeleteObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
        Key: key,
      }),
    );
    return Response.json(
      { message: "image delete successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(error);
    return Response.json(
      { error: error?.message || "something went wrong" },
      { status: 500 },
    );
  }
};
