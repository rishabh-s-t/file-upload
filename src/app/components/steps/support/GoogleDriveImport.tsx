"use client"
import { Icons } from '@/components/icons'
import React, {useEffect} from 'react'
import useDrivePicker from 'react-google-drive-picker'

export default function GoogleDriveImport() {
    const [openPicker, authResponse] = useDrivePicker(); 
    const handleOpenPicker = () => {
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
          callbackFunction: (data) => {
            if (data.action === 'cancel') {
              console.log('User clicked cancel/close button')
            }
            console.log(data)
          },
        })
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
