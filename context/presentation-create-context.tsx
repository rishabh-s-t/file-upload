"use client";

import React, {useContext, createContext, useState} from "react";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
  listAll,
} from "firebase/storage";
import {app} from "@/config/firebase";

interface PresentationContextType {
  // states -----------------------------
  uploadsText: string[] | undefined;
  setUploadsText: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  uploads: File[] | undefined;
  setUploads: React.Dispatch<React.SetStateAction<File[] | undefined>>;
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
  const [uploadsText, setUploadsText] = useState<string[] | undefined>();
  const [uploads, setUploads] = useState<File[] | undefined>();

  const saveFileToFirebase = async (file: File) => {
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

            switch (snapshot.state) {
              case "paused":
                break;
              case "running":
                break;
            }
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

      type UploadType = {
        title: string;
        id: string;
        path: string;
        type: "pdf" | "mp4" | "jpg" | "png";
      };

      const upload: UploadType = {
        title: file.name,
        id: fileID,
        path: downloadURL,
        type: "pdf",
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
  };

  return (
    <PresentationContext.Provider value={values}>
      {children}
    </PresentationContext.Provider>
  );
};

export default PresentationContext;
