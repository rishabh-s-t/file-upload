"use client"
import { Icons } from '@/components/icons'
import React, { useEffect, useState } from 'react'
import useDrivePicker from 'react-google-drive-picker'
import { usePresentation } from '@/context/presentation-create-context'
import { useToast } from "@/components/ui/use-toast";
import { FILE_SIZE, MAX_FILE_SIZE_MB } from '@/config/data'

export default function GoogleDriveImport() {
    const [openPicker, authResponse] = useDrivePicker(); 
    const {saveFileToFirebase} = usePresentation ();
    const {toast} = useToast(); 

    const [fileUrl, setFileUrl] = useState <string> ("");
    const [uploadProgress, setUploadProgress] = useState <number> (0);
    const [uploadResult, setUploadResult] = useState <string | null> (null);
    const [error, setError] = useState <string | null> (null);

    // const downloadFileFromDrive = async (url: string): Promise <File> => {
    //   const response = await fetch(url);

    //   if(!response.ok) {
    //     throw new Error ("Failed to fetch file from Google Drive");
    //   }

    //   const blob = await response.blob();

    //   return new File([blob], "download-file", {type: blob.type});
    // }

    // const handleUpload = async (file: File) => {
    //   try {
    //     const uploadData = await saveFileToFirebase(file, (progress: number) => {
    //       setUploadProgress(progress);
    //     });

    //     setUploadResult(uploadData?.path || "Upload failed");
    //   } catch (error: any) {
    //     setError(`Upload failed! ${error.message}`);
    //   }
    // }

    const processFiles = async (docs: any[]) => {
      const validFiles: any[] = [];
      const invalidFiles: any[] = [];

      for (const doc of docs) {
        if (
          ['application/pdf', 'image/jpeg', 'image/png', 'video/mp4', 'audio/mpeg', 'application/vnd.google-apps.document'].includes(doc.mimeType) &&
          doc.sizeBytes <= MAX_FILE_SIZE_MB
        ) {
          validFiles.push(doc);
        } else {
          invalidFiles.push(doc);
        }
      }

      // Handle invalid files
      for (const file of invalidFiles) {
        toast({
          variant: 'destructive',
          title: file.sizeBytes > MAX_FILE_SIZE_MB ? 'File too large' : 'Unsupported file type',
          description: `${file.name} is ${file.sizeBytes > MAX_FILE_SIZE_MB ? `more than ${FILE_SIZE}MB` : 'not a supported file type'}.`,
        });
      }

      // Process valid files
      for (const file of validFiles) {
        if (file.url) {
          try {
            // use G DRIVE API to download file.url 
            // upload it to firebase using saveFileToFirebase ()
          } catch (err: any) {
            console.error(`Error processing file ${file.name}: ${err.message}`);
          }
        }
      }
    }

    // GDrive File Picker
    const handleOpenPicker = async () => {
        openPicker({
          clientId: "590055248463-qrb0te4ci07sdg8nql0m3jbnakk8m0a8.apps.googleusercontent.com",
          developerKey: "AIzaSyBmDSWFb5sHri1ZTWo7cElwNB42cXnJQWk",
          viewId: "DOCS",
          // token: token, // pass oauth token in case you already have one
          showUploadView: true,
          showUploadFolders: true,
          supportDrives: true,
          multiselect: true,
          // customViews: customViewsArray, // custom view
          callbackFunction: async (data) => {
            if (data.action === 'cancel') {
              console.log('User clicked cancel/close button')
            }
            console.log(JSON.stringify(data))
            
            await processFiles(data.docs);
          },
        }
      )
    }

    return (
    <button onClick={()=> handleOpenPicker()} className="w-full p-4 rounded-[1rem] border-2 hover:border-primary items-center flex flex-col gap-2 mb-2">
        <div className="flex flex-col items-center p-4">
            <Icons.drive className="w-10 h-10 text-primary" />
            <p className="text-muted-foreground">Import your files from <span className="text-md font-bold">Google Drive</span></p>
        </div>
    </button>
    )
}
