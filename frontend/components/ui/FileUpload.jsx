import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { UploadIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image"; // Import Next.js Image component

const FileUpload = ({
  layout = "vertical",
  uploadMode = "single",
  defaultText = "Select or drag and drop your image files here",
  otherText = "(JPG, JPEG, PNG up to 20MB)",
  maxSize = 20 * 1024 * 1024,
  acceptedFileTypes = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
  },
  onFilesUploaded,
  errors: externalErrors,
  initialFile, // New prop for initial file
}) => {
  const [files, setFiles] = useState([]);
  const [internalErrors, setInternalErrors] = useState(null);

  useEffect(() => {
    if (initialFile) {
      const initialFileWithPreview = {
        name: initialFile.split("/").pop(),
        preview: initialFile,
        size: 0, // Assuming the size isn’t available; adjust as needed
      };
      setFiles([initialFileWithPreview]);
    }
  }, [initialFile]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length === 0) {
        setInternalErrors("No valid files were dropped");
        return;
      }

      const newFile = acceptedFiles[0];
      const fileWithPreview = Object.assign(newFile, {
        preview: URL.createObjectURL(newFile),
      });

      if (uploadMode === "single") {
        setFiles([fileWithPreview]);
        onFilesUploaded(newFile);
        setInternalErrors(null);
      } else {
        setFiles((prev) => [...prev, fileWithPreview]);
        onFilesUploaded(acceptedFiles);
      }
    },
    [uploadMode, onFilesUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize,
    multiple: uploadMode === "multi",
  });

  const removeFile = () => {
    setFiles([]);
    onFilesUploaded(null);
    setInternalErrors(null);
  };

  const dropzoneClasses = cn(
    "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
    isDragActive
      ? "border-blue-500 bg-blue-50"
      : internalErrors || externalErrors
      ? "border-red-500"
      : "border-gray-300 hover:border-gray-400",
    layout === "horizontal"
      ? "flex items-center justify-center space-x-4"
      : "flex flex-col justify-center items-center space-y-2"
  );

  return (
    <div>
      <div {...getRootProps({ className: dropzoneClasses })}>
        <input {...getInputProps()} />
        <UploadIcon className="w-8 h-8 text-gray-400" />
        <p className="text-sm text-gray-600">{defaultText}</p>
        <p className="text-xs text-gray-500">{otherText}</p>
      </div>

      {(internalErrors || externalErrors) && (
        <p className="text-xs font-medium text-red-500 mt-2">
          {internalErrors || externalErrors}
        </p>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 shadow"
            >
              <div className="flex items-center space-x-2">
                <Image
                  src={file.preview}
                  alt="Preview"
                  width={40}
                  height={40}
                  className="object-cover rounded"
                />
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={removeFile}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
