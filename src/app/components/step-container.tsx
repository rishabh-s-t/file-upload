import React from "react";
import {motion} from "framer-motion";
import {Label} from "@/components/ui/label";

const StepContainer = ({
  children,
  title,
  subTitle,
}: {
  children: React.ReactNode;
  title: string;
  subTitle: string;
}) => {
  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 1}}
      className="flex flex-col space-y-2 h-fit gap-4  "
    >
      <div className="grid gap-1 items-center">
        <Label className="text-3xl font-bold text-center">{title}</Label>
        <p className="text-center text-muted-foreground">{subTitle}</p>
      </div>
      <div className="h-fit w-full bg-background rounded-md  p-6 shadow-drop-center">
        {children}
      </div>
    </motion.div>
  );
};

export default StepContainer;
