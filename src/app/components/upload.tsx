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
      <UploadManager />
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

const UploadManager = () => {
  // main functions of this component
  // 1.) allow user to upload via file input click and drag and drop
  // 2.) upload file to firebase storage
  // 3.) extract the text layer and download url of the upload
  // 4.) save the states to the context

  //   state to store the uploaded file and uploaded text
  const {uploadsText, setUploadsText, uploads, setUploads} = usePresentation()!;

  type FileLocal = {
    file: File;
    uploadProgress: number;
    path: string;
    title: string;
    type: "pdf" | "doc" | "image" | "video" | "audio";
  };

  //   state to store the file locally and the upload progress
  const [files, setFiles] = React.useState<FileLocal[] | undefined>(undefined);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // function to handle the file change event

    // how i would handle the file change event
    // 1.) get the file from the event
    // 2.) determine what type of file it is
    // 3.) save the file to firestore so text layer can be extracted with uploadFile()
    // 3.) extract the text layer of the file
    // 4.) save the file to the context states with addNewFile()

    return null;
  };

  async function addNewFile(file: File) {
    // this function will be were you save the states for the file
  }

  async function uploadFile(file: File) {
    // function to upload the file to firebase storage
    return null;
  }

  const cancelUpload = React.useRef(false);

  //   async function onDocumentLoadSuccess({numPages}: {numPages: number}) {
  //     // Process for extracting text from a PDF document
  //     const checkCancellation = () => {
  //       if (cancelUpload.current) {
  //         throw new Error("Operation cancelled");
  //       }
  //     };

  //     try {
  //       const textPromises = [];
  //       for (let i = 1; i <= numPages; i++) {
  //         checkCancellation(); // Check if we should continue before starting the next operation

  //         const loadingTask = pdfjs.getDocument({url: file.path});
  //         const promise = loadingTask.promise.then(async (pdf) => {
  //           checkCancellation(); // Check again after loading the document

  //           const page = await pdf.getPage(i);
  //           checkCancellation(); // Check before getting the text content

  //           const textContent = await page.getTextContent();
  //           checkCancellation(); // Check after getting the text content

  //           const hasTextLayer = textContent.items.length > 0;
  //           setUploadProgress(30 + (i / numPages) * 70);

  //           if (!hasTextLayer) {
  //             setRecommendScan(true);
  //             return;
  //           }

  //           return textContent.items.map((item: any) => item.str).join(" ");
  //         });
  //         textPromises.push(promise);
  //       }

  //       const pageTexts = await Promise.all(textPromises);
  //       checkCancellation(); // Check before processing the result
  //       const extractedText = pageTexts.join(" ");
  //       await setUploadsText(extractedText);

  //       console.log("extractedText==========", extractedText);
  //     } catch (error: any) {
  //       if (error.message !== "Operation cancelled") {
  //         console.error("Failed to extract PDF text:", error);
  //       }
  //     } finally {
  //       if (!cancelUpload.current) {
  //         //   setDocumentLoaded(true);
  //         //   setNumPages(numPages);
  //       }
  //     }
  //     return null;
  //   }

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
            Supported format: .pdf .docs .mp4 .mp3 .png .jpg
          </p>
        </button>
      </>

      {files &&
        files.length > 0 &&
        files.map((file, index) => (
          <>
            {file.type === "pdf" && (
              <>
                <Document
                  className={`invisible fixed pointer-events-none`}
                  file={file.path}
                  //   onLoadSuccess={onDocumentLoadSuccess}
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
            )}
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
