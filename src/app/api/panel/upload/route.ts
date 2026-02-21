import { Upload } from "@aws-sdk/lib-storage";
import s3Client from "@/config/aws-s3-client/s3-clients";
import { validateFile } from "@/config/aws-s3-client/utils";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return Response.json({ error: "Invalid file" }, { status: 400 });
    }

    const folderPath = "images";
    const maxUploadSize = 5;
    const acceptedFileTypes = {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
      "image/svg+xml": [".svg"],
    };

    // Validate file
    const { fileExtension, fileType, baseName, originalName } = validateFile({
      file,
      acceptedFileTypes,
      maxUploadSize,
    });

    const timestamp = Date.now();
    const key = `${folderPath}/${baseName}_${timestamp}.${fileExtension}`;
    // Convert file to Buffer for Node.js upload
    const arrayBuffer = await file.arrayBuffer();
    const body = Buffer.from(arrayBuffer);

    // Upload to Cloudflare R2
    const upload = new Upload({
      client: s3Client(),
      params: {
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
        Key: key,
        Body: body,
        ContentType: fileType,
      },
    });

    await upload.done();

    const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_ENDPOINT
      ? `${process.env.CLOUDFLARE_R2_PUBLIC_ENDPOINT}/${key}`
      : null;
    return Response.json(
      {
        key,
        originalName,
        fileType,
        fileExtension,
        url: publicUrl,
      },
      { status: 200 },
    );
  } catch (err: any) {
    console.log(err);
    return Response.json(
      { error: err.message || "Upload failed" },
      { status: 500 },
    );
  }
}
