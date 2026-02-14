"use client";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/utils";
import { ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import axios from "axios";
interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  accept?: Record<string, string[]>;
  maxUploadSize?: number;
  className?: string;
  message?: string;
  disabled?: boolean;
  uploadApi: string;
  uploadAction?: string;
}
const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  accept = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
    "image/svg+xml": [".svg"],
    "image/gif": [".gif"],
  },
  maxUploadSize = 5,
  className = "",
  message = "Drag and drop an image, or click to browse",
  disabled = false,
  uploadApi,
  uploadAction,
}) => {
  // Upload image mutation >>>>>>>>
  const { mutate: uploadImage, isPending: isUploadImagePending } = useMutation<
    string,
    Error,
    File
  >({
    mutationFn: async (file) => {
      if (!uploadApi) throw new Error("Upload Api is not provided");
      const formData = new FormData();
      formData.append("file", file);
      if (typeof uploadAction === "string") {
        formData.append("action", uploadAction);
      }
      // Uploading image >>>>>>>>
      const { data } = await axios.patch(uploadApi, formData);
      return data.url;
    },
    onSuccess: (imageUrl) => {
      onChange(imageUrl);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  // Drop handler >>>>>>>>
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file && file.size <= maxUploadSize * 1024 * 1024) {
        uploadImage(file);
      } else if (file) {
        toast.error(
          `File size exceeds the maximum limit of ${maxUploadSize}MB. Please upload a smaller file.`,
        );
      }
    },
    [maxUploadSize, uploadImage],
  );
  // Dropzone props >>>>>>>>
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    disabled: disabled || isUploadImagePending,
    maxFiles: 1,
  });
  // Reset handler >>>>>>>>
  const handleReset = () => {
    onChange("");
  };
  return (
    <>
      <div
        className={cn(
          "border border-input border-dashed rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4",
          className,
        )}
      >
        <div className="size-16 min-w-16 relative bg-muted flex items-center justify-center rounded-md overflow-hidden flex-shrink-0">
          {value ? (
            <Image
              src={value}
              alt="Selected profile"
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          ) : (
            <ImageIcon className="size-6 min-w-6" />
          )}
          {isUploadImagePending && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center rounded-md">
              <Loader2 className="size-10 min-w-10 animate-spin" />
            </div>
          )}
        </div>

        <div className="grow">
          <p className="text-sm text-muted-foreground">
            {message} Max size {maxUploadSize}MB
          </p>
        </div>

        <div className="flex gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
          {value ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleReset}
              disabled={isUploadImagePending || disabled}
            >
              Reset
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="ml-auto sm:ml-0"
              disabled={isUploadImagePending || disabled}
              {...getRootProps()}
            >
              Browse
            </Button>
          )}
          <input {...getInputProps()} />
        </div>
      </div>
    </>
  );
};
export default ImageUpload;
