import { SetupShortcut } from "@components/SetupShortcut";
import { useState, useEffect } from "react";
import { TestShortcut } from "../components/TestShortcut/index";
import { show_window } from "@actions/tauri";

export interface IStepProps {
  onNext: () => void;
}

const steps = [SetupShortcut, TestShortcut];

const SetupPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const Step = steps[currentStep];

  useEffect(() => {
    show_window();
  }, []);

  const onNext = () => {
    if (currentStep + 1 < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  return <Step onNext={onNext} />;
};

export default SetupPage;
