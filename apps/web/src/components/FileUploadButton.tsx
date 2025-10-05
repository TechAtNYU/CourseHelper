"use client";

import type { ChangeEvent } from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react"; // shadcn-compatible icon

type Props = {
  onFileSelected?: (file: File | null) => void;
  maxSizeMB?: number;
};

export default function FileUploadButton({
  onFileSelected,
  maxSizeMB = 20,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    //validate file type
    if (f.type !== "application/pdf") {
      setFile(null);
      setError("Please choose a PDF file.");
      e.currentTarget.value = "";
      return;
    }
    //validate file size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (f.size > maxBytes) {
      setFile(null);
      setError(`File is too large. Max ${maxSizeMB} MB.`);
      e.currentTarget.value = "";
      return;
    }

    setError(null);
    setFile(f);
    onFileSelected?.(f);
    e.currentTarget.value = "";
  }

  function handleRemoveFile() {
    setFile(null);
    setError(null);
    onFileSelected?.(null);
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

        {/* Selected file display */}
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

      {/* Error display */}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
