/**
 * File & Image Upload Utility
 * Supports Cloudinary direct unsigned uploads and Next.js /api/upload
 * with fine-grained real-time progress callbacks (0 - 100%).
 */

export interface UploadResult {
  url: string;
  name: string;
  size: number;
  type: string;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function uploadFile(
  file: File,
  onProgress?: (percentage: number) => void
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    // Use /api/upload endpoint for guaranteed local/hosted reliability
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.success && res.data) {
            onProgress?.(100);
            resolve(res.data);
          } else {
            reject(new Error(res.message || "Failed to parse upload response"));
          }
        } catch {
          reject(new Error("Invalid upload server response"));
        }
      } else {
        reject(new Error(`Upload failed with status code ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during file upload"));
    };

    xhr.send(formData);
  });
}
