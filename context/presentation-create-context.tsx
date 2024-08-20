"use client";

import React, {useContext, createContext, useEffect, useState} from "react";
import {collection, addDoc, setDoc, getDoc, doc} from "firebase/firestore";
import {useRouter} from "next/navigation";
interface PresentationContextType {
  // states -----------------------------
  uploadText: string;
  setUploadText: React.Dispatch<React.SetStateAction<string>>;
  upload: File | undefined;
  setUpload: React.Dispatch<React.SetStateAction<File | undefined>>;
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
  const [uploadText, setUploadText] = useState<string>("");
  const [upload, setUpload] = useState<File | undefined>();

  const values = {
    // states -----------------------------

    uploadText,
    setUploadText,
    upload,
    setUpload,
  };

  return (
    <PresentationContext.Provider value={values}>
      {children}
    </PresentationContext.Provider>
  );
};

export default PresentationContext;
