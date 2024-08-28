"use client";

import React, {useContext, createContext, useState, useEffect} from "react";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
  listAll,
} from "firebase/storage";
import {app} from "@/config/firebase";
import {UploadType, FileLocal} from "@/config/data";

interface PresentationContextType {
  // states -----------------------------
  uploadsText: string[] | undefined;
  setUploadsText: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  uploads: File[] | UploadType[] | undefined;
  setUploads: React.Dispatch<React.SetStateAction<UploadType[] | undefined>>;
  // functions -----------------------------
  saveFileToFirebase: (
    file: File,
    onProgress: (progress: number) => void
  ) => Promise<FileLocal | undefined>;
}

const PresentationContext = createContext<PresentationContextType | null>(null);

export function usePresentation() {
  return useContext(PresentationContext);
}

interface Props {
  children?: React.ReactNode;
}

export const PresentationProvider = ({children}: Props) => {
  // states -----------------------------
  const [uploadsText, setUploadsText] = useState<string[] | undefined>([]);
  const [uploads, setUploads] = useState<UploadType[] | undefined>([]);

  useEffect(() => {
    console.log(`Uploads State -> ${JSON.stringify(uploads)}`);
  }, [uploads]);

  useEffect(() => {
    console.log(`Uploads Text State -> ${JSON.stringify(uploadsText)}`);
  }, [uploadsText]);

  const saveFileToFirebase = async (
    file: File,
    onProgress: (progress: number) => void
  ): Promise<FileLocal> => {
    try {
      const fileID = Math.random().toString(36).substring(7);
      const storage = getStorage(app);
      const fileRef = ref(storage, fileID);
      const uploadTask = uploadBytesResumable(fileRef, file);

      // Wait for the upload to complete
      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            onProgress(progress);

            // switch (snapshot.state) {
            //   case "paused":
            //     break;
            //   case "running":
            //     break;
            // }
          },
          (error) => {
            reject(error);
          },
          () => {
            resolve(uploadTask.snapshot.ref);
          }
        );
      });

      // Get download URL and return the upload object
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

      const upload: FileLocal = {
        title: file.name,
        uploadProgress: 100,
        // id: fileID,
        path: downloadURL,
        type: file.type as UploadType["type"],
        file,
      };

      // setUploadData(upload as UploadType);
      return upload;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error; // Rethrow the error after logging it
    }
  };

  const values = {
    // states -----------------------------
    uploadsText,
    setUploadsText,
    uploads,
    setUploads,
    // functions
    saveFileToFirebase,
  };

  return (
    <PresentationContext.Provider value={values}>
      {children}
    </PresentationContext.Provider>
  );
};

export default PresentationContext;
