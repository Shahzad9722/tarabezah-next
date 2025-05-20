import type { Step } from "../AddReservation/types";
import { useEffect, useRef } from "react";

interface StepSidebarProps {
  steps: Step[];
  currentStep: number;
  setCurrentStep: any;
  confirmation: boolean;
  moveClientSearchAfterDate,
  moveClientSearchBeforeDate,
  clientIndex?: number,
  walkIn?: boolean,
}

export default function StepSidebar({
  steps,
  currentStep,
  confirmation,
  moveClientSearchAfterDate,
  moveClientSearchBeforeDate,
  walkIn
}: StepSidebarProps) {
  // Refs for each step icon
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Only scroll on mobile (horizontal stepper)
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      const activeRef = stepRefs.current[currentStep];
      if (activeRef) {
        activeRef.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [currentStep]);

  return (
    <div className="w-full md:w-[270px]">
      <div className="flex mt-4 md:mt-0 relative md:border-r-[1px] border-[#B9885859]">
        <div className="w-full relative flex md:flex-col overflow-x-auto md:h-[calc(100dvh-46px)] md:p-5 md:min-h-[600px] md:max-h-[1200px] justify-between">
          {steps.map((step, index) => (
            <div key={index} className="relative flex items-center">
              {/* Step Indicator */}
              <div
                className={`w-[150px] md:w-full flex flex-col md:flex-row gap-1 md:gap-0 items-center md:space-x-4 text-left transition-all
                ${index === 0 || index <= currentStep
                    ? "text-color-B98858"
                    : "text-gray-300"
                  }`}
                ref={el => { stepRefs.current[index] = el; }}
              >
                {/* Icon with Circle Background */}
                <div
                  className={`relative cursor-pointer w-[45px] h-[45px] flex justify-center items-center rounded-full shrink-0 transition-all 
                  ${index === 0 || index <= currentStep || confirmation
                      ? "bg-color-B98858 text-white"
                      : "bg-color-A4A4A4 text-gray-300"
                    }`}
                // onClick={() => {
                //   if (index > 0 && index < steps.length - 1)
                //     setCurrentStep(index);
                // }}
                >
                  {step.icon}
                  {/* Vertical Line Connecting Steps */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-full md:left-[calc(50%-2px)] top-[calc(50%-2px)] md:top-[45px] w-[180px] h-[4px] md:w-[4px] ${steps.length === 7 ? "md:h-[11vh]" : "md:h-[19vh]"
                        } transition-all 
                    ${index === 0 || index < currentStep || confirmation
                          ? "bg-color-B98858"
                          : "bg-color-A4A4A4"
                        }`}
                    ></div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-md md:text-xl font-medium">
                    {step.name}
                    {step.name === "Client Search" && step.step === 1 && !walkIn && (
                      <button
                        onClick={moveClientSearchAfterDate}
                        className="ml-2 text-sm text-blue-500 underline hidden md:inline"
                      >
                        Move After Date
                      </button>
                    )}
                    {step.name === "Client Search" && step.step === 2 && !walkIn && (
                      <button
                        onClick={moveClientSearchBeforeDate}
                        className="ml-2 text-sm text-blue-500 underline hidden md:inline"
                      >
                        Move Before Date
                      </button>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
