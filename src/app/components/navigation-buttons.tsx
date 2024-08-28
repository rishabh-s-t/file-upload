import React from "react";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-create-context";

const NavigationButtons = ({
  step,
  changeStep,
  isDisabled,
}: {
  step: number;
  changeStep: (step: number) => void;
  isDisabled?: boolean;
}) => {
  return (
    <div className="w-full justify-between flex flex-col mt-6">
      {step !== 4 && (
        <Button
          disabled={isDisabled}
          onClick={() => changeStep(step + 1)}
          className="w-full rounded-full"
        >
          Next
        </Button>
      )}
      {step > 1 && (
        <Button onClick={() => changeStep(step - 1)} variant={"ghost"}>
          go back
        </Button>
      )}
    </div>
  );
};

export default NavigationButtons;
