"use client";

import { X } from "lucide-react";
import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  extractCourseHistory,
  isDegreeProgressReport,
} from "../utils/extract-pdf-text";
import { parseCourseHistory } from "../utils/parse-course-history";

type FileUploadButtonProps = {
  maxSizeMB?: number;
  onFileUploaded?: (file: File | null) => void;
  initialFile?: File | null;
};

export default function FileUploadButton({
  maxSizeMB = 20,
  onFileUploaded,
  initialFile,
}: FileUploadButtonProps) {
  const [file, setFile] = useState<File | null>(initialFile || null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Update state when initialFile prop changes (for controlled behavior)
  React.useEffect(() => {
    setFile(initialFile || null);
  }, [initialFile]);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    // Validate file type
    if (f.type !== "application/pdf") {
      setFile(null);
      setError("Please choose a PDF file.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // Validate file size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (f.size > maxBytes) {
      setFile(null);
      setError(`File is too large. Max ${maxSizeMB} MB.`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // Verify it's a Degree Progress Report
    try {
      const ok = await isDegreeProgressReport(f);
      if (!ok) {
        setError("This PDF doesn’t look like a Degree Progress Report.");
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
    } catch (err) {
      console.error("Error verifying PDF:", err);
      setError("Could not verify the PDF file.");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // So file is valid
    setError(null);
    setFile(f);
    onFileUploaded?.(f);

    try {
      const historyText = await extractCourseHistory(f);
      const result = parseCourseHistory(historyText);
      console.log("Parsed courses:", result);
    } catch (err) {
      console.error(err);
    }
  }

  function handleRemoveFile() {
    setFile(null);
    setError(null);
    onFileUploaded?.(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <label>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            className="w-fit"
            asChild
            disabled={!!file}
          >
            <span>{file ? "PDF Selected" : "Choose PDF File"}</span>
          </Button>
        </label>

        {file && (
          <div className="flex items-center gap-2 text-sm">
            <span>{file.name}</span>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-gray-500 hover:text-red-600"
              aria-label="Remove file"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
