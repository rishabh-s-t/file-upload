"use client";
import {Icons} from "@/components/icons";
import React, {useEffect} from "react";
import useDrivePicker from "react-google-drive-picker";

export default function GoogleDriveImport() {
  const [openPicker, authResponse] = useDrivePicker();
  const handleOpenPicker = () => {
    openPicker({
      clientId:
        "531390591850-2bjcst5pfeqfpfl6k7j22js4465r4lfq.apps.googleusercontent.com",
      developerKey: "AIzaSyAJIjZPPgwJm6zOiO_x1iTftFwYvffOVDU",
      viewId: "DOCS",
      // token: token, // pass oauth token in case you already have one
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      // customViews: customViewsArray, // custom view
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        }
        console.log("Selectede drive Data:", data);
      },
    });
  };
  return (
    <button
      onClick={handleOpenPicker}
      className="w-full p-4 rounded-[1rem] border-2 hover:border-primary items-center flex flex-col gap-2 mb-2"
    >
      <div className="flex flex-col items-center gap-2">
        <Icons.googleDrive className="w-10 h-10" />
        <p className="text-muted-foreground">
          Import your files from{" "}
          <span className="text-md font-bold">Google Drive</span>
        </p>
      </div>
    </button>
  );
}
