import mime from "mime-types";

export interface AcceptedFileTypes {
  [mimeType: string]: string[];
}

export interface ValidatedFile {
  fileExtension: string;
  fileType: string;
  originalName: string;
  baseName: string;
}

// Validate file properties
export const validateFile = ({
  file,
  acceptedFileTypes,
  maxUploadSize,
}: {
  file: File;
  acceptedFileTypes?: AcceptedFileTypes;
  maxUploadSize?: number; // in MB
}): ValidatedFile => {
  if (!file || !file.size) {
    throw new Error("File not found or empty.");
  }

  const originalName = file.name || "unnamed";
  const fileExtension = originalName.split(".").pop()?.toLowerCase() || "";
  const fileType = (file.type?.toLowerCase() || mime.lookup(fileExtension) || "") as string;

  if (acceptedFileTypes) {
    const ext = `.${fileExtension}`;
    let typeMatch = false;

    if (fileType && acceptedFileTypes[fileType]) {
      if (acceptedFileTypes[fileType].map((e) => e.toLowerCase()).includes(ext)) {
        typeMatch = true;
      }
    }

    if (!typeMatch) {
      for (const exts of Object.values(acceptedFileTypes) as string[][]) {
        if (exts.map((e) => e.toLowerCase()).includes(ext)) {
          typeMatch = true;
          break;
        }
      }
    }

    if (!typeMatch) {
      throw new Error(
        `File type not accepted. Allowed: ${Object.values(acceptedFileTypes)
          .flat()
          .join(", ")}`
      );
    }
  }

  if (maxUploadSize && file.size > maxUploadSize * 1024 * 1024) {
    throw new Error(`File size must be less than ${maxUploadSize} MB`);
  }

  const baseName = originalName
    .split(".")
    .slice(0, -1)
    .join(".")
    .replace(/[^a-z0-9_\-]/gi, "_");

  return { fileExtension, fileType, originalName, baseName };
};

// Retry operation helper
export const retryOperation = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 500
): Promise<T> => {
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, delay * attempt));
      }
    }
  }
  throw lastError;
};