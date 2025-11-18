import React, { useState } from "react";
import { Car, CarFront, ChevronDown, Info } from "lucide-react";// Simple replacements using plain HTML + Tailwind
const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`inline-flex items-center justify-center rounded-md bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 text-sm font-medium transition ${className}`}
  >
    {children}
  </button>
);

const Card = ({ children, className = "", ...props }) => (
  <div
    {...props}
    className={`bg-white border border-slate-200 rounded-xl shadow-sm ${className}`}
  >
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);


// Single-file, self-contained React component that mimics the shared UI
// TailwindCSS + shadcn/ui + lucide-react
// - Accessible radio group
// - Step indicator (1 of 5)
// - CTA footer links
// - Mobile-friendly layout

export default function InsuranceStep1() {
  const [selection, setSelection] = useState("comprehensive");

  const steps = 5;
  const currentStep = 1;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      {/* Header */}
      <header className="border-b-2 border-slate-200">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-28 rounded bg-slate-900/90" aria-hidden />
            <span className="hidden sm:inline text-xs text-slate-500 whitespace-nowrap">
              Part of the <span className="font-semibold">Suncorp Network</span>
            </span>
          </div>
          <div className="text-right">
            <div className="hidden sm:block text-base font-semibold">
              Car Insurance
            </div>
            <div className="sm:hidden mr-6 text-sm font-semibold">
              Car Insurance
            </div>
          </div>
        </div>
        <hr className="border-0 h-2 bg-slate-200" />
      </header>

      {/* Progress / Stepper */}
      <div className="mx-auto max-w-5xl w-full px-4 mt-2">
        <div className="flex items-center gap-3">
          <div className="relative inline-flex">
            <Button
              variant="secondary"
              className="pr-3 pl-2 py-2 h-9 rounded-md">
              <ChevronDown className="h-4 w-4 mr-2" />
              <span className="text-sm tracking-wide">
                STEP {currentStep} OF {steps}
              </span>
            </Button>
          </div>
          <span className="hidden sm:inline text-sm uppercase">
            Find Your Car
          </span>
        </div>

        <div className="mt-3 grid grid-cols-5 gap-3">
          {[...Array(steps)].map((_, i) => (
            <div
              key={i}
              className={
                "h-1.5 rounded-full " +
                (i < currentStep ? "bg-slate-900" : "bg-slate-300")
              }
            />
          ))}
        </div>
      </div>

      {/* Main */}
      <main className="flex-1">
        <div className="mx-auto max-w-3xl w-full px-4 py-10">
          <div className="uppercase text-xs tracking-wider text-slate-500 font-medium mb-1">
            Your Policy
          </div>
          <h2 className="text-xl font-semibold mb-6">
            Select your type of insurance
          </h2>

          <div
            role="radiogroup"
            aria-label="Insurance type"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Comprehensive */}
            <Card
              role="radio"
              aria-checked={selection === "comprehensive"}
              tabIndex={0}
              onClick={() => setSelection("comprehensive")}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter")
                  setSelection("comprehensive");
              }}
              className={
                "cursor-pointer transition-all border-2 rounded-2xl shadow-sm hover:shadow-md " +
                (selection === "comprehensive"
                  ? "border-slate-900"
                  : "border-slate-200")
              }>
              <CardContent className="p-5">
                <div className="flex justify-end -mt-1 -mr-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="More info: Comprehensive">
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col items-center text-center -mt-3">
                  <Car className="h-10 w-10" aria-hidden />
                  <div className="mt-4 text-base font-semibold">
                    Comprehensive
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Third Party Property Damage */}
            <Card
              role="radio"
              aria-checked={selection === "tppd"}
              tabIndex={0}
              onClick={() => setSelection("tppd")}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") setSelection("tppd");
              }}
              className={
                "cursor-pointer transition-all border-2 rounded-2xl shadow-sm hover:shadow-md " +
                (selection === "tppd" ? "border-slate-900" : "border-slate-200")
              }>
              <CardContent className="p-5">
                <div className="flex justify-end -mt-1 -mr-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="More info: Third Party Property Damage">
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col items-center text-center -mt-3">
                  <CarFront className="h-10 w-10" aria-hidden />
                  <div className="mt-4 text-base font-semibold">
                    Third Party Property Damage
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <a
            href="#"
            className="inline-flex items-center text-sm border-b border-slate-900/50 hover:border-slate-900 transition-colors"
            aria-haspopup="dialog">
            Looking for Compulsory Third Party (CTP) / Green Slip?
          </a>

          <div className="mt-8 flex justify-end">
            {/* You can replace with <Link> if using Next.js */}
            <a href="/policy-start-date" aria-label="Next">
              <Button className="text-sm px-6">Next</Button>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t-2 border-slate-200">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <ul className="flex flex-wrap gap-6 text-slate-900">
            <li>
              <a
                className="hover:underline"
                href="#"
                target="_blank"
                rel="noreferrer">
                FAQs
              </a>
            </li>
            <li>
              <a
                className="hover:underline"
                href="#"
                target="_blank"
                rel="noreferrer">
                Privacy
              </a>
            </li>
            <li>
              <a
                className="hover:underline"
                href="#"
                target="_blank"
                rel="noreferrer">
                Terms & Conditions
              </a>
            </li>
          </ul>
          <p className="mt-4 text-xs text-slate-500 leading-relaxed">
            Insurance issued by AAI Limited ABN 48 005 297 807 AFSL 230859
            trading as Bingle Insurance. Bingle's home is at Level 23, 80 Ann
            Street, Brisbane QLD 4000
          </p>
        </div>
      </footer>
    </div>
  );
}
