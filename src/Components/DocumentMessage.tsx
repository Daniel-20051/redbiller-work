import React from "react";
import { Icon } from "@iconify/react";

interface DocumentMessageProps {
  message: any; // The full message object containing fileData
  isOwnMessage: boolean;
  uploadProgress?: number; // 0-100
  isUploading?: boolean;
}

const DocumentMessage: React.FC<DocumentMessageProps> = ({
  message,
  isOwnMessage,
  uploadProgress = 0,
  isUploading = false,
}) => {
  // Extract file data from the message
  const fileData = message?.fileData;
  const fileName = fileData?.originalName || message?.content || "Unknown File";
  const fileType = fileData?.mimeType || "";
  const fileUrl = fileData?.url || "";
  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return "mdi:image";
    if (type.includes("pdf")) return "mdi:file-pdf-box";
    if (type.includes("word") || type.includes("document"))
      return "mdi:file-word-box";
    if (type.includes("excel") || type.includes("spreadsheet"))
      return "mdi:file-excel-box";
    if (type.includes("powerpoint") || type.includes("presentation"))
      return "mdi:file-powerpoint-box";
    if (type.includes("video")) return "mdi:video";
    if (type.includes("audio")) return "mdi:music";
    if (type.includes("text")) return "mdi:file-document";
    return "mdi:file";
  };

  const getFileTypeName = (type: string) => {
    if (type.startsWith("image/")) return "Image";
    if (type.includes("pdf")) return "PDF Document";
    if (type.includes("word") || type.includes("document"))
      return "Word Document";
    if (type.includes("excel") || type.includes("spreadsheet"))
      return "Excel Spreadsheet";
    if (type.includes("powerpoint") || type.includes("presentation"))
      return "PowerPoint";
    if (type.includes("video")) return "Video";
    if (type.includes("audio")) return "Audio";
    if (type.includes("text")) return "Text Document";
    return "File";
  };

  const handleDownload = () => {
    if (fileUrl) {
      // Create a temporary anchor element to trigger download
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.log("No file URL available for download");
    }
  };

  return (
    <div
      className={`group relative cursor-pointer transition-all duration-200 hover:scale-[1.01]`}
      onClick={handleDownload}
    >
      {/* Modern minimal document card */}
      <div
        className={`relative overflow-hidden rounded-xl ${
          isOwnMessage
            ? "bg-white border border-gray-200 shadow-sm"
            : "bg-gray-50 border border-gray-100"
        } hover:shadow-md transition-all duration-200`}
      >
        {/* Compact file info layout */}
        <div className="flex items-center gap-3 p-3">
          {/* Minimal file icon */}
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
              isOwnMessage ? "bg-gray-100" : "bg-white border border-gray-200"
            }`}
          >
            <Icon
              icon={getFileIcon(fileType)}
              width="20"
              height="20"
              className={isOwnMessage ? "text-gray-600" : "text-gray-500"}
            />
          </div>

          {/* File details - more compact */}
          <div className="flex-1 min-w-0">
            <h4
              className={`font-medium text-sm truncate ${
                isOwnMessage ? "text-gray-900" : "text-gray-800"
              }`}
            >
              {fileName}
            </h4>

            <div
              className={`text-xs ${
                isOwnMessage ? "text-gray-500" : "text-gray-400"
              }`}
            >
              <span className="font-medium">{getFileTypeName(fileType)}</span>
            </div>

            {/* Upload progress bar */}
            {isUploading && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Uploading...</span>
                </div>
                <div className="w-[90%] bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isOwnMessage ? "bg-[#93221d]" : "bg-gray-500"
                    }`}
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Subtle hover indicator */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${
            isOwnMessage
              ? "from-[#93221d] to-[#93221d]"
              : "from-gray-400 to-gray-500"
          } transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200`}
        />
      </div>
    </div>
  );
};

export default DocumentMessage;
