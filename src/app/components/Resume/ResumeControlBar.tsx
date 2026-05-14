"use client";
import { useEffect, useRef } from "react";
import { useSetDefaultScale } from "components/Resume/hooks";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import { usePDF } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import {
  useAppDispatch,
  useAppSelector,
  migrateLegacySkills,
} from "lib/redux/hooks";
import {
  initialResumeState,
  selectResume,
  setResume,
} from "lib/redux/resumeSlice";
import {
  initialSettings,
  selectSettings,
  setSettings,
  type Settings,
} from "lib/redux/settingsSlice";
import { deepMerge } from "lib/deep-merge";
import type { Resume } from "lib/redux/types";

const ResumeControlBar = ({
  scale,
  setScale,
  documentSize,
  document,
  fileName,
}: {
  scale: number;
  setScale: (scale: number) => void;
  documentSize: string;
  document: JSX.Element;
  fileName: string;
}) => {
  const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
    setScale,
    documentSize,
  });

  const [instance, update] = usePDF({ document });
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Hook to update pdf when document changes
  useEffect(() => {
    update();
  }, [update, document]);

  const handleExport = () => {
    const payload = JSON.stringify({ resume, settings }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${resume.profile.name || "resume"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed.resume) {
          migrateLegacySkills(parsed.resume);
          dispatch(
            setResume(
              deepMerge(initialResumeState, parsed.resume) as Resume
            )
          );
        }
        if (parsed.settings) {
          dispatch(
            setSettings(
              deepMerge(initialSettings, parsed.settings) as Settings
            )
          );
        }
      } catch {
        // eslint-disable-next-line no-alert
        alert("Could not parse that file as a resume JSON.");
      }
    };
    reader.readAsText(file);
    // Reset so importing the same file twice still fires onChange
    e.target.value = "";
  };

  const actionButtonClass =
    "ml-1 flex items-center gap-1 rounded-md border border-gray-300 px-3 py-0.5 hover:bg-gray-100";

  return (
    <div className="sticky bottom-0 left-0 right-0 flex h-[var(--resume-control-bar-height)] items-center justify-center px-[var(--resume-padding)] text-gray-600 lg:justify-between">
      <div className="flex items-center gap-2">
        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        <input
          type="range"
          min={0.5}
          max={1.5}
          step={0.01}
          value={scale}
          onChange={(e) => {
            setScaleOnResize(false);
            setScale(Number(e.target.value));
          }}
        />
        <div className="w-10">{`${Math.round(scale * 100)}%`}</div>
        <label className="hidden items-center gap-1 lg:flex">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4"
            checked={scaleOnResize}
            onChange={() => setScaleOnResize((prev) => !prev)}
          />
          <span className="select-none">Autoscale</span>
        </label>
      </div>
      <div className="flex items-center gap-1 lg:ml-8">
        <button
          type="button"
          onClick={handleExport}
          className={actionButtonClass}
          title="Download a JSON backup of your resume data"
        >
          <DocumentArrowDownIcon className="h-4 w-4" />
          <span className="whitespace-nowrap">Export JSON</span>
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={actionButtonClass}
          title="Restore resume data from a JSON backup"
        >
          <ArrowUpTrayIcon className="h-4 w-4" />
          <span className="whitespace-nowrap">Import JSON</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleImport}
        />
        <a
          className={actionButtonClass}
          href={instance.url!}
          download={fileName}
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span className="whitespace-nowrap">Download Resume</span>
        </a>
      </div>
    </div>
  );
};

/**
 * Load ResumeControlBar client side since it uses usePDF, which is a web specific API
 */
export const ResumeControlBarCSR = dynamic(
  () => Promise.resolve(ResumeControlBar),
  {
    ssr: false,
  }
);

export const ResumeControlBarBorder = () => (
  <div className="absolute bottom-[var(--resume-control-bar-height)] w-full border-t-2 bg-gray-50" />
);
