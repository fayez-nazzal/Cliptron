import { SetupShortcut } from "@components/SetupShortcut";
import { useState } from "react";
import { TestShortcut } from "../components/TestShortcut/index";

export interface IStepProps {
  onNext: () => void;
}

const steps = [SetupShortcut, TestShortcut];

const SetupPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const Step = steps[currentStep];

  return <Step onNext={() => setCurrentStep(currentStep + 1)} />;
};

export default SetupPage;
