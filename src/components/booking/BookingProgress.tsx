import { Check } from 'lucide-react';

export interface BookingProgressStep {
  id: number;
  label: string;
  enabled?: boolean;
}

export function BookingProgress({
  steps,
  currentStep,
  onStepSelect,
  className = '',
  label = 'Booking steps',
}: {
  steps: readonly BookingProgressStep[];
  currentStep: number;
  onStepSelect?: (step: number) => void;
  className?: string;
  label?: string;
}) {
  return (
    <nav className={`relative isolate mx-auto w-full max-w-5xl rounded-2xl border-2 border-gray-200 bg-white px-1 py-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] sm:px-4 md:px-8 ${className}`} aria-label={label}>
      <ol className="flex items-center justify-between">
        {steps.map(({ id, label, enabled = true }, index) => {
          const done = currentStep > id;
          const current = currentStep === id;
          const canSelect = Boolean(onStepSelect && enabled);

          return (
            <li key={label} className="relative flex min-w-0 flex-1 items-start justify-center" aria-current={current ? 'step' : undefined}>
              {canSelect ? (
                <button
                  type="button"
                  onClick={() => onStepSelect?.(id)}
                  className="relative z-10 flex min-w-0 flex-col items-center px-1 text-center sm:px-2"
                  aria-current={current ? 'step' : undefined}
                >
                  <StepMark current={current} done={done} id={id} />
                  <StepLabel current={current} done={done} label={label} />
                </button>
              ) : (
                <div className="relative z-10 flex min-w-0 flex-col items-center px-1 text-center sm:px-2">
                  <StepMark current={current} done={done} id={id} />
                  <StepLabel current={current} done={done} label={label} />
                </div>
              )}
              {index < steps.length - 1 && (
                <div aria-hidden="true" className={`absolute left-1/2 top-3 z-0 h-[2px] w-full ${done ? 'bg-[#0f172a]' : 'bg-gray-200'}`} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function StepMark({ current, done, id }: { current: boolean; done: boolean; id: number }) {
  return (
    <span className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold ${current ? 'border-[#eab308] bg-[#eab308] text-white' : done ? 'border-[#0f172a] bg-[#0f172a] text-white' : 'border-gray-300 bg-gray-300 text-gray-600'}`}>
      {done ? <Check size={12} /> : id}
    </span>
  );
}

function StepLabel({ current, done, label }: { current: boolean; done: boolean; label: string }) {
  return <span className={`mt-1 min-h-[28px] text-center text-[9px] font-semibold leading-[14px] sm:min-h-0 sm:text-[10px] md:text-[11px] ${current || done ? 'text-[#0f172a]' : 'text-gray-500'}`}>{label}</span>;
}
