"use client";
import React, {useState, useRef, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {usePresentation} from "@/context/presentation-create-context";
import {Icons} from "@/components/icons";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.js";
import {Document, pdfjs} from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import StepContainer from "../step-container";
import {FileLocal, UploadType} from "@/config/data";
import NavigationButtons from "../navigation-buttons";

const Uploads = ({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const {uploads} = usePresentation()!;

  const localFiles =
    uploads &&
    uploads.length > 0 &&
    uploads?.map((upload) => ({
      ...upload,
      uploadProgress: 100,
    }));
  //   state to store the file locally and the upload progress
  const [files, setFiles] = useState<FileLocal[] | undefined>(
    (localFiles as FileLocal[]) || undefined
  );

  const stepComplete =
    files && files.every((file) => file.uploadProgress === 100);

  return (
    <div>
      <StepContainer
        title="Upload Resources"
        subTitle="This could be a study guide, textbook, paper"
      >
        <UploadManager files={files} setFiles={setFiles} />
      </StepContainer>
      <NavigationButtons
        step={1}
        changeStep={setStep}
        isDisabled={!stepComplete}
      />
    </div>
  );
};

export default Uploads;

const UploadManager = ({
  files,
  setFiles,
}: {
  files: FileLocal[] | undefined;
  setFiles: React.Dispatch<React.SetStateAction<FileLocal[] | undefined>>;
}) => {
  //   state to store the uploaded file and uploaded text
  const {setUploadsText, saveFileToFirebase, setUploads} = usePresentation()!;

  // state for drag and drop
  const [isDragging, setIsDragging] = useState(false);

  //helper function to get file type
  const getFileType = (
    file: File
  ):
    | "pdf"
    | "jpg"
    | "jpeg"
    | "png"
    | "mp4"
    | "mp3"
    | "doc"
    | "docx"
    | undefined => {
    if (file.type === "application/pdf") return "pdf";
    if (file.type === "image/jpeg") return "jpg";
    if (file.type === "image/png") return "png";
    if (file.type === "video/mp4") return "mp4";
    if (file.type === "audio/mpeg") return "mp3";
    if (file.type === "application/msword") return "doc";
    if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
      return "docx";
    return undefined; // Default type if not matched
  };

  const handleProgressUpdate = (file: File, progress: number) => {
    setFiles((prevFiles) =>
      prevFiles?.map((f) =>
        f.file === file ? {...f, uploadProgress: progress} : f
      )
    );
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // function to handle the file change event

    // how i would handle the file change event
    // 1.) get the file from the event
    // 2.) determine what type of file it is
    // 3.) save the file to firestore so text layer can be extracted with uploadFile()
    // 3.) extract the text layer of the file
    // 4.) save the file to the context states with addNewFile()

    const target = event.target as HTMLInputElement;
    console.log(target);
    const fileList = target.files;

    console.log(fileList);

    if (fileList) {
      const filesArray = Array.from(fileList);

      const newFiles = filesArray.map((file) => ({
        file,
        uploadProgress: 0,
        path: URL.createObjectURL(file),
        title: file.name,
        type: getFileType(file),
      }));

      setFiles((prevFiles) => [...(prevFiles || []), ...newFiles]);

      for (const fileLocal of newFiles) {
        const result = await uploadFile(fileLocal);
      }
    }
  };

  async function addNewUploads(file: FileLocal) {
    // this function will be where you save the states for the file - Saving Uploads
    if (file) {
      setUploads((prev) => [
        ...(prev || []),
        {
          title: file.title,
          id: file.title,
          path: file.path,
          type: file.type as UploadType["type"],
          file: file.file,
        },
      ]);
    }
  }

  async function addNewUploadsText(text: string[]) {
    if (text && text.length > 0) {
      setUploadsText((prev) => {
        const current = prev || [];
        return [...current, ...text];
      });
    }
  }

  async function uploadFile(fileLocal: FileLocal) {
    try {
      console.log("file -> ", fileLocal);
      const upload = await saveFileToFirebase(
        fileLocal.file,
        (progress: number) => {
          handleProgressUpdate(fileLocal.file, progress);
        }
      );
      console.log("File Uploaded Successfully");

      // TEXT CONVERSION IS HAPPENING HERE _______________________
      if (fileLocal.type === "pdf") {
        const extractedText = await extractTextFromPDF(fileLocal.file);

        // Saving text to uploads text

        if (extractedText.length > 0) {
          await addNewUploadsText(extractedText);
        }
      } else if (
        fileLocal.type === "png" ||
        fileLocal.type === "jpg" ||
        fileLocal.type === "jpeg"
      ) {
        // This ISNT WORKING EITHER SINCE THE ROUTE ISNT SETUP PROPERLY BECAUSE OF MISSING KEYS :(
      }
      if (!upload) {
        return;
      }
      // Saving uploads
      await addNewUploads(upload);

      return upload;

      // More stuff here maybe
    } catch (error) {
      console.error("File Upload Failed: ", error);
      return null;
    }
  }

  const handleCancel = (file: File) => {
    // Handle cancel logic here, such as stopping the upload or removing from state
    // This one isnt working the way I want it and I cannot figure out a logic to do it
    const updatedFiles = files?.filter((f) => f.file !== file);
    if (updatedFiles?.length === 0) {
      setFiles(undefined);
    } else {
      setFiles(updatedFiles);
    }
  };

  const onDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const filesArray = Array.from(event.dataTransfer.files);

    const newFiles = filesArray.map((file) => ({
      file,
      uploadProgress: 0,
      path: URL.createObjectURL(file),
      title: file.name,
      type: getFileType(file),
    }));

    setFiles((prevFiles) => [...(prevFiles || []), ...newFiles]);

    for (const fileLocal of newFiles) {
      await uploadFile(fileLocal);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  // Extract text from a PDF file
  const extractTextFromPDF = async (file: File): Promise<string[]> => {
    try {
      const pdf = await pdfjs.getDocument({url: URL.createObjectURL(file)})
        .promise;
      const textPages: string[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item).join(" ");
        textPages.push(pageText);
      }

      return textPages;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      return [];
    }
  };

  const ProgressBar = ({
    fileLocal,
    onCancel,
  }: {
    fileLocal: FileLocal;
    onCancel: (file: File) => void;
  }) => {
    const [uploadComplete, setUploadComplete] = useState(
      fileLocal.uploadProgress === 100
    );

    useEffect(() => {
      if (fileLocal.uploadProgress === 99) {
        setTimeout(() => {
          setUploadComplete(true);
        }, 1000);
      }
    }, [fileLocal]);

    return (
      <div className="w-full p-4 flex flex-col gap-2 border border-gray-300 bg-background rounded-lg ">
        <div className="grid grid-cols-[1fr_24px] items-center gap-4">
          <div className="flex flex-col">
            <div className="flex flex-row gap-4">
              <span className="p-2 rounded-sm border aspect-square h-fit flex items-center justify-center">
                <Icons.file className="w-5 h-5 text-primary" />
              </span>
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Generic Icon for now */}
                    <span className="font-semibold">{fileLocal.title}</span>
                  </div>
                </div>
                <div className="flex justify-between ">
                  <div className="text-muted-foreground">
                    {(fileLocal.file.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                  {fileLocal.uploadProgress < 100 && (
                    <span className="text-primary font-bold  w-[50px]">{`${Math.ceil(
                      fileLocal.uploadProgress
                    ).toFixed(0)}%`}</span>
                  )}
                </div>
              </div>
            </div>
            {fileLocal.uploadProgress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{width: `${fileLocal.uploadProgress}%`}}
                />
              </div>
            )}
          </div>
          <button
            onClick={() => onCancel(fileLocal.file)}
            className="bg-gray-300 hover:bg-gray-500 transition-colors duration-500 rounded-full aspect-square h-fit p-1"
          >
            <Icons.close className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      onDrop={onDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div
        className={` w-full border-4 border-dashed rounded-[1rem] hover:border-primary items-center flex flex-col gap-2 mb-2 group
          ${
            isDragging
              ? " border-primary bg-primary/10 "
              : " border-dashed hover:border-primary "
          }
        `}
      >
        <input
          id="file-input"
          style={{display: "none"}}
          type="file"
          accept=".pdf, .jpg, .png, .mp4, .doc, .mp3, docx"
          onChange={onFileChange}
          multiple
        />

        <button
          onClick={() => document.getElementById("file-input")?.click()}
          className="w-full p-4 rounded-[1rem] hover:border-primary items-center flex flex-col gap-2 mb-2"
        >
          <Icons.upload className="w-10 h-10 text-primary" />
          <span className="text-xl font-bold"> Import a file</span>
          <p className="text-muted-foreground">
            <span className="underline group-hover:text-primary font-bold">
              Click to upload
            </span>{" "}
            or drag and drop <br />
            Supported format: .pdf .docs .mp4 .mp3 .png .jpg
          </p>
        </button>
      </div>

      {/* Conditional rendering for the progress bar */}
      {files && files.length > 0 && (
        <div className="mt-4 grid gap-2">
          <div className="flex justify-between items-center">
            <Label className="font-bold text-xl">Uploaded Files</Label>
          </div>
          <div className="space-y-2 overflow-y-auto flex flex-col h-fit ">
            {files.reverse().map((file, index) => (
              <ProgressBar
                key={index}
                fileLocal={file}
                onCancel={handleCancel}
              />
            ))}
          </div>
        </div>
      )}
      {/* {!files && (
        <>
          <div className="grid grid-cols-[45%_1fr_45%] items-center ">
            <div className="w-full h-[1px] bg-muted-foreground/40" />
            <span className="text-center text-muted-foreground/40">OR</span>
            <div className="w-full h-[1px] bg-muted-foreground/40" />
          </div>
          <ImportFromUrl />
        </>
      )} */}
    </div>
  );
};

const ImportFromUrl = () => {
  const {uploadsText, setUploadsText, uploads, setUploads} = usePresentation()!;

  const [url, setUrl] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function addNewUploadsText(text: string[]) {
    if (text && text.length > 0) {
      setUploadsText((prev) => {
        const current = prev || [];
        return [...current, ...text];
      });
    }
  }

  const scrapeURL = async (url: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!url || url === "") {
      return;
    }

    try {
      const res = await fetch("api/scrape-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({url}),
      });

      if (!res.ok) {
        setError("Failed to fetch!");
        setLoading(false);
      }

      const result = await res.json();

      if (result.message) {
        setError(result.message);
      } else {
        setSuccess(`Title: ${result.title}\nText: ${result.text}`);

        addNewUploadsText([result.text]);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button
          variant={"ghost"}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-primary"
          onClick={() => {
            scrapeURL(url);
          }}
          disabled={loading}
        >
          {loading ? "Extracting data..." : "Upload"}
        </Button>
      </div>
      {error && <p className="text-red-500 font-bold">{"Import failed!"}</p>}
      {success && (
        <p className="text-green-500 font-bold">{"Imported Successfully!"}</p>
      )}
    </div>
  );
};
