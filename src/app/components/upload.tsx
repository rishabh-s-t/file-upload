"use client";
import React, {useState, useRef, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {usePresentation} from "@/context/presentation-create-context";
import {Icons} from "@/components/icons";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.js";
import {Document, pdfjs} from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import StepContainer from "@/src/app/components/step-container";

const Uploads = () => {
  return (
    <StepContainer
      title="Upload Resources"
      subTitle="This could be a study guide, textbook, paper"
    >
      <StudyMaterial />
      <div className="grid grid-cols-[45%_1fr_45%] items-center">
        <div className="w-full h-[2px] bg-muted-foreground/40" />
        <span className="text-center text-muted-foreground/40">OR</span>
        <div className="w-full h-[2px] bg-muted-foreground/40" />
      </div>
      <ImportFromUrl />
    </StepContainer>
  );
};

export default Uploads;

const StudyMaterial = () => {
  // state to track loading
  const [isLoadingUpload, setIsLoadingUpload] = React.useState<boolean>(false);

  //   state to store the uploaded file and uploaded text
  const {uploadText, setUploadText, upload, setUpload} = usePresentation()!;

  type FileLocal = {
    file: File;
    uploadProgress: number;
    path: string;
    title: string;
  };

  //   state to store the file locally and the upload progress
  const [files, setFiles] = React.useState<FileLocal[] | undefined>(undefined);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setIsLoadingUpload(true);
      setUpload(event.target.files[0]);
      try {
        const upload = await uploadFile(event.target.files[0]);
        // if (upload) setFiles();
      } catch (error) {
        console.error("Failed to upload file:", error);
      } finally {
        setIsLoadingUpload(false);
      }
    }
  };

  async function uploadFile(file: File) {
    return null;
  }

  async function onDocumentLoadSuccess({numPages}: {numPages: number}) {
    // Function to check if the operation should proceed
    return null;
  }

  return (
    <>
      <>
        <input
          id="file-input"
          style={{display: "none"}}
          type="file"
          accept=".pdf"
          onChange={onFileChange}
        />
        <button
          onClick={() => document.getElementById("file-input")?.click()}
          className="w-full border-4 border-dashed p-8 rounded-[1rem] hover:border-primary items-center flex flex-col gap-2"
        >
          <Icons.upload className="w-10 h-10 text-primary" />
          <span className="text-xl font-bold"> Import a file</span>
          <p className="text-muted-foreground">
            Maximum file size: 50mb <br />
            Supported format: .pdf .docs .mp4 .mp3
          </p>
        </button>
      </>

      {files &&
        files.length > 0 &&
        files.map((file, index) => (
          <>
            <Document
              className={`invisible fixed pointer-events-none`}
              file={file.path}
              onLoadSuccess={onDocumentLoadSuccess}
            />
            <div className="grid grid-cols-[30px_1fr]  w-full p-2 border rounded-2xl">
              <button onClick={() => null} className="text-primary">
                <Icons.close className="w-5 h-5" />
              </button>
              <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {file?.title}
              </span>
            </div>
          </>
        ))}
    </>
  );
};

const ImportFromUrl = () => {
  const scrapeURL = async (url: string) => {
    // this will scrape the url and return the text
    return null;
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="url">Import From URL</Label>
      <div className="w-full relative">
        <input
          type="text"
          id="url"
          className="w-full p-2 border rounded-md pl-4"
          placeholder="Add file url"
        />
        <Button
          variant={"ghost"}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-primary"
        >
          Upload
        </Button>
      </div>
    </div>
  );
};
