import React from "react";
import "./globals.css";
import Upload from "@/src/app/components/upload";
import {PresentationProvider} from "@/context/presentation-create-context";
import RightPanel from "@/src/app/components/right-pannel";
const Page = () => {
  return (
    <PresentationProvider>
      <div className="h-screen w-screen items-start  justify-center bg-muted grid grid-rows-[50px_1fr]  ">
        <NavBar />
        <div className="grid-cols-[1fr_30%] grid h-full w-screen overflow-hidden ">
          <div className="h-full w-full flex flex-col gap-4 md:max-w-[60%] mx-auto p-4  ">
            <div className=" w-full h-full flex flex-col  pt-10 rounded-lg  gap-4">
              <Upload />
            </div>
          </div>
          <RightPanel />
        </div>
      </div>
    </PresentationProvider>
  );
};

export default Page;

const NavBar = () => {
  return (
    <div className="h-full w-full bg-background border-b flex items-center justify-between px-10"></div>
  );
};
