import { Upload } from "@aws-sdk/lib-storage";
import s3Client from "@/config/aws-s3-client/s3-clients";
import { validateFile } from "@/config/aws-s3-client/utils";

interface S3UploadOptions {
  file: File;
  maxUploadSize?: number;
  acceptedFileTypes?: Record<string, string[]>;
  folderPath?: string;
}
const s3Upload = async ({
  file,
  maxUploadSize,
  acceptedFileTypes,
  folderPath = "files",
}: S3UploadOptions) => {
  const { CLOUDFLARE_R2_BUCKET_NAME, CLOUDFLARE_R2_PUBLIC_ENDPOINT } =
    process.env;
  if (!CLOUDFLARE_R2_BUCKET_NAME) {
    throw new Error("Missing Cloudflare R2 bucket name environment variable");
  }
  // Validate file >>>>>>>>>>>>
  const { fileExtension, fileType, baseName, originalName } = validateFile({
    file,
    acceptedFileTypes,
    maxUploadSize,
  });
  //Create a safe key for S3
  const timestamp = Date.now();
  const key = `${folderPath}/${baseName}_${timestamp}.${fileExtension}`;
  // Body conversion for both browser File & Node Buffers >>>>>>>>>>>>
  let body;
  if (typeof file.arrayBuffer === "function") {
    body = Buffer.from(await file.arrayBuffer());
  } else if (Buffer.isBuffer(file)) {
    body = file;
  } else {
    throw new Error("Unsupported file format for upload.");
  }
  // Upload  file
  const uploadPart = new Upload({
    client: s3Client(),
    params: {
      Bucket: CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: fileType,
    },
  });
  await uploadPart.done();
  const publicUrl = CLOUDFLARE_R2_PUBLIC_ENDPOINT
    ? `${CLOUDFLARE_R2_PUBLIC_ENDPOINT}/${key}`
    : null;

  return {
    key,
    originalName,
    fileType,
    fileExtension,
    url: publicUrl,
  };
};
export default s3Upload;