import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Modal from "./Modal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleDocumentClick = () => {
    if (fileUrl) {
      setIsModalOpen(true);
    } else {
      console.log("No file URL available for viewing");
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const renderDocumentContent = () => {
    if (!fileUrl)
      return (
        <div className="text-center text-gray-500">No document available</div>
      );

    if (fileType.startsWith("image/")) {
      return (
        <div className="flex items-center justify-center h-full">
          <img
            src={fileUrl}
            alt={fileName}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    }

    if (fileType.includes("pdf")) {
      return (
        <div className="w-full h-full">
          <iframe
            src={fileUrl}
            className="w-full h-full border-0"
            title={fileName}
          />
        </div>
      );
    }

    if (fileType.includes("video")) {
      return (
        <div className="flex items-center justify-center h-full">
          <video controls className="max-w-full max-h-full" src={fileUrl}>
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (fileType.includes("audio")) {
      return (
        <div className="flex items-center justify-center h-full">
          <audio controls className="w-full max-w-md" src={fileUrl}>
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }

    // For other file types, show a preview with download option
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon
            icon={getFileIcon(fileType)}
            width="40"
            height="40"
            className="text-gray-400"
          />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">{fileName}</h3>
          <p className="text-sm text-gray-500">{getFileTypeName(fileType)}</p>
        </div>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-[#93221d] text-white rounded-lg hover:bg-[#7a1d1a] transition-colors"
        >
          Download File
        </button>
      </div>
    );
  };

  return (
    <>
      <div
        className={`group relative cursor-pointer transition-all duration-200 hover:scale-[1.01]`}
        onClick={handleDocumentClick}
      >
        {/* Modern document card with better styling for different senders */}
        <div
          className={`relative overflow-hidden rounded-xl ${
            isOwnMessage
              ? "bg-white border border-gray-200 shadow-sm"
              : "bg-[#93221d] shadow-md border border-white/10"
          } hover:shadow-lg transition-all duration-200`}
        >
          {/* Compact file info layout */}
          <div className="flex items-center gap-3 p-3">
            {/* File icon with better contrast */}
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                isOwnMessage
                  ? "bg-gray-100"
                  : "bg-white/30 backdrop-blur-sm border border-white/40 shadow-sm"
              }`}
            >
              <Icon
                icon={getFileIcon(fileType)}
                width="20"
                height="20"
                className={isOwnMessage ? "text-gray-600" : "text-white"}
              />
            </div>

            {/* File details with better contrast */}
            <div className="flex-1 min-w-0">
              <h4
                className={`font-medium text-sm truncate ${
                  isOwnMessage ? "text-gray-900" : "text-white"
                }`}
              >
                {fileName}
              </h4>

              <div
                className={`text-xs ${
                  isOwnMessage ? "text-gray-500" : "text-white/80"
                }`}
              >
                <span className="font-medium">{getFileTypeName(fileType)}</span>
              </div>

              {/* Upload progress bar */}
              {isUploading && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span
                      className={
                        isOwnMessage ? "text-gray-500" : "text-white/80"
                      }
                    >
                      Uploading...
                    </span>
                  </div>
                  <div
                    className={`w-[90%] rounded-full h-1.5 ${
                      isOwnMessage ? "bg-gray-200" : "bg-white/30"
                    }`}
                  >
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isOwnMessage ? "bg-[#93221d]" : "bg-white"
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
                : "from-white/60 to-white/40"
            } transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200`}
          />
        </div>
      </div>

      {/* Document Viewer Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="bg-[#313131]/50 w-full h-full flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 ">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Icon
                  icon={getFileIcon(fileType)}
                  width="16"
                  height="16"
                  className="text-primary"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#c4c7c5]">
                  {fileName}
                </h2>
                <p className="text-sm text-[#c4c7c5]">
                  {getFileTypeName(fileType)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="p-2 text-[#c4c7c5] hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download"
              >
                <Icon icon="mdi:download" width="20" height="20" />
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[#c4c7c5] hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close"
              >
                <Icon icon="mdi:close" width="20" height="20" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-hidden">
            {renderDocumentContent()}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DocumentMessage;
