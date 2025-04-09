import type { Step } from '../AddReservation/types';

interface StepSidebarProps {
  steps: Step[];
  currentStep: number;
  setCurrentStep: any;
  confirmation: boolean;
}

export default function StepSidebar({ steps, currentStep, setCurrentStep, confirmation }: StepSidebarProps) {
  return (
    <div className='w-full md:w-[243px]'>
      <div className='flex md:pr-3 relative mt-[46px] md:border-r-[1px] border-[#B9885859]'>
        <div className='w-full relative flex md:flex-col gap-[66px] overflow-x-auto'>
          {steps.map((step, index) => (
            <div key={index} className='relative flex items-center'>
              {/* Step Indicator */}
              <div
                className={`w-[150px] md:w-full flex flex-col md:flex-row gap-1 md:gap-0 items-center md:space-x-4 text-left transition-all
                ${index === 0 || index <= currentStep ? 'text-color-B98858' : 'text-gray-300'}`}
              >
                {/* Icon with Circle Background */}
                <div
                  className={`relative cursor-pointer w-[45px] h-[45px] flex justify-center items-center rounded-full transition-all 
                  ${
                    index === 0 || index <= currentStep || confirmation
                      ? 'bg-color-B98858 text-white'
                      : 'bg-color-A4A4A4 text-gray-300'
                  }`}
                  onClick={() => {
                    if (index > 0 && index < steps.length - 1) setCurrentStep(index);
                  }}
                >
                  {step.icon}
                  {/* Vertical Line Connecting Steps */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-full md:left-[calc(50%-2px)] top-[calc(50%-2px)] md:top-[45px] w-[180px] h-[4px] md:w-[4px] md:h-[66px] transition-all 
                  ${index === 0 || index < currentStep || confirmation ? 'bg-color-B98858' : 'bg-color-A4A4A4'}`}
                    ></div>
                  )}
                </div>
                <div className='flex items-center space-x-2'>
                  <span className='text-md md:text-xl font-medium'>{step.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
