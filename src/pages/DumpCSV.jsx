import React, { useRef, useState } from "react";
import { File, FileUp } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { dumpCSV } from "../http/api";
import { toast } from "sonner";

const dumpUserCSV = async (file) => {
  const { data } = await dumpCSV(file);
  return data;
};

export default function DumpCSV() {
  const inputRef = useRef();
  const [files, setFiles] = useState([]);

  const handleFileSelect = (incomingFiles) => {
    const validFiles = [];
    const rejectedFiles = [];

    for (let file of incomingFiles) {
      if (file.name.endsWith(".csv")) validFiles.push(file);
      else rejectedFiles.push(file.name);
    }

    if (rejectedFiles.length > 0) {
      alert(`Only CSV files allowed. Rejected: ${rejectedFiles.join(", ")}`);
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileSelect(droppedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["csv"],
    mutationFn: dumpUserCSV,
    onSuccess: () => {
      toast("File Upload successfully")
    }
  });

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      alert("Only CSV files are allowed.");
      return;
    }

    setFiles([file]);
    mutate(file);
  };

  return (
    <div className=" flex justify-center items-center">
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex flex-col w-full max-w-2xl h-[60vh] justify-center items-center rounded-3xl border-2 border-dashed border-black bg-gray-100 p-6 sm:p-8 text-center cursor-pointer transition duration-300 ease-in-out gap-4"
      >
        <input
          type="file"
          ref={inputRef}
          accept=".csv"
          onChange={handleFileInputChange}
          className="mb-4"
        />
        {isPending && <p>Uploading...</p>}
        <FileUp className="text-black w-16 h-16 sm:w-24 sm:h-24" />
        <h2 className="text-xl sm:text-3xl font-bold text-black">
          Upload CSV (Click or Drag & Drop)
        </h2>

        {files.length > 0 && (
          <div className="mt-6 space-y-2 w-full px-2 sm:px-6">
            {files.slice(0, 3).map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-start gap-2 text-gray-300"
              >
                <File className="text-amber-400 w-5 h-5" />
                <span className="truncate">{file.name}</span>
              </div>
            ))}

            {files.length > 3 && (
              <p className="text-sm text-gray-400 mt-1">
                +{files.length - 3} more
              </p>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                gotoDashboard();
              }}
              className="mt-4 px-6 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-base w-full sm:w-auto"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
