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

interface PresentationContextType {
  // states -----------------------------
  uploadsText: string[] | undefined;
  setUploadsText: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  uploads: File[] | UploadType[] | undefined;
  setUploads: React.Dispatch<React.SetStateAction<UploadType[] | undefined>>;
  saveFileToFirebase: (file: File) => Promise <UploadType>; 
}

type UploadType = {
  title: string;
  id: string;
  path: string;
  type: "pdf" | "mp4" | "jpg" | "png" | "jpeg" | "mp3" | "doc" | "docx"; 
};

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
    console.log(`Uploads State -> ${JSON.stringify(uploads)}`)
  }, [uploads])

  useEffect(() => {
    console.log(`Uploads Text State -> ${JSON.stringify(uploadsText)}`)
  }, [uploadsText])

  const saveFileToFirebase = async (file: File, onProgress: (progress: number) => void): Promise<UploadType> => {
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

      const upload: UploadType = {
        title: file.name,
        id: fileID,
        path: downloadURL,
        type: file.type,
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
