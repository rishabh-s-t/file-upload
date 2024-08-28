export type UploadType = {
  file: File;
  title: string;
  id: string;
  path: string;
  type: "pdf" | "mp4" | "jpg" | "png" | "jpeg" | "mp3" | "doc" | "docx";
};

export type FileLocal = {
  file: File;
  uploadProgress: number;
  path: string;
  title: string;
  type:
    | "pdf"
    | "mp4"
    | "jpg"
    | "png"
    | "jpeg"
    | "mp3"
    | "doc"
    | "docx"
    | undefined;
};

export const FILE_SIZE = 50;
export const MAX_FILE_SIZE_MB = FILE_SIZE * 1024 * 1024;