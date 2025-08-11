import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import socketService from "../../../services/socketService";

interface CustomAudioPlayerProps {
  src: string | null; // This will be the filePath now, can be null initially
  isOwnMessage: boolean;
  duration?: number;
}

const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = ({
  src, // This is actually the filePath
  isOwnMessage,
  duration,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const requestIdRef = useRef<string>(`${src}-${Date.now()}-${Math.random()}`);

  // Update duration when prop changes
  useEffect(() => {
    if (duration && duration > 0) {
      setAudioDuration(duration);
    }
  }, [duration]);

  // Request signed URL when component mounts
  useEffect(() => {
    if (src) {
      setError(null);
      setIsLoading(true);

      // Check if src is a direct URL (blob URL or data URL)
      const isDirectUrl =
        src.startsWith("blob:") ||
        src.startsWith("data:") ||
        src.startsWith("http");

      if (isDirectUrl) {
        // Use the direct URL immediately
        setSignedUrl(src);
        setIsLoading(false);
      } else {
        // Request signed URL from server for file paths
        const handleVoiceNoteUrl = ({
          filePath,
          signedUrl,
          requestId,
        }: {
          filePath: string;
          signedUrl: string;
          requestId?: string;
        }) => {
          // Only handle response for this specific request or if no requestId (backward compatibility)
          if (
            filePath === src &&
            (!requestId || requestId === requestIdRef.current)
          ) {
            setSignedUrl(signedUrl);
            setError(null);
            setIsLoading(false);
          }
        };

        const handleVoiceNoteError = ({
          filePath,
          error: errorMsg,
          requestId,
        }: {
          filePath: string;
          error: string;
          requestId?: string;
        }) => {
          // Only handle error for this specific request or if no requestId (backward compatibility)
          if (
            filePath === src &&
            (!requestId || requestId === requestIdRef.current)
          ) {
            setError(errorMsg);
            setIsLoading(false);
          }
        };

        // Set up listeners
        socketService.onVoiceNoteUrl(handleVoiceNoteUrl);
        socketService.onVoiceNoteError(handleVoiceNoteError);

        // Request the signed URL with unique request ID
        socketService.requestVoiceNoteUrl(src, requestIdRef.current);

        // Cleanup function
        return () => {
          socketService.offVoiceNoteUrl(handleVoiceNoteUrl);
          socketService.offVoiceNoteError(handleVoiceNoteError);
        };
      }
    }
  }, [src]);

  // Set up audio listeners when signed URL is available
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !signedUrl) return;

    audio.src = signedUrl;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      // Use duration prop if available, otherwise use audio metadata
      if (duration && duration > 0) {
        setAudioDuration(duration);
      } else if (
        audio.duration &&
        isFinite(audio.duration) &&
        audio.duration > 0
      ) {
        setAudioDuration(audio.duration);
      } else {
        console.warn("Invalid audio duration:", audio.duration);
        setAudioDuration(0);
      }
      setIsLoading(false);
    };
    const handleEnded = () => setIsPlaying(false);
    const handleError = (e: Event) => {
      console.error("Audio error:", e);
      setError("Failed to load audio");
      setIsLoading(false);
    };
    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("loadstart", handleLoadStart);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("loadstart", handleLoadStart);
    };
  }, [signedUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !signedUrl) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        console.error("Play error:", err);
        setError("Failed to play audio");
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !signedUrl) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * audio.duration;
    audio.currentTime = newTime;
  };

  const formatTime = (time: number) => {
    // Handle invalid time values
    if (!time || !isFinite(time) || time < 0) {
      return "0:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage =
    audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

  // Show error state
  if (error) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2 pr-1.5 sm:pr-2.5 min-w-[160px] sm:min-w-[200px] max-w-[240px] sm:max-w-[280px]">
        <Icon
          icon="material-symbols:error-outline"
          width="16"
          height="16"
          color={isOwnMessage ? "#ef4444" : "#fca5a5"}
        />
        <span
          className={`text-xs ${
            isOwnMessage ? "text-red-500" : "text-red-200"
          }`}
        >
          {error}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 pr-1.5 sm:pr-2.5 min-w-[160px] max-w-[240px] sm:max-w-[280px]">
      <audio ref={audioRef} preload="metadata" />

      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer ${
          isOwnMessage
            ? "bg-gray-200 hover:bg-gray-300"
            : "bg-white/20 hover:bg-white/30"
        }`}
        disabled={isLoading || !signedUrl}
      >
        {isLoading ? (
          <Icon
            icon="svg-spinners:ring-resize"
            width="12"
            height="12"
            className="sm:w-4 sm:h-4"
            color={isOwnMessage ? "#666" : "#fff"}
          />
        ) : isPlaying ? (
          <Icon
            icon="material-symbols:pause-rounded"
            width="14"
            height="14"
            className="sm:w-[18px] sm:h-[18px]"
            color={isOwnMessage ? "#666" : "#fff"}
          />
        ) : (
          <Icon
            icon="material-symbols:play-arrow-rounded"
            width="14"
            height="14"
            className="sm:w-[18px] sm:h-[18px]"
            color={isOwnMessage ? "#666" : "#fff"}
          />
        )}
      </button>

      {/* Progress Bar and Time */}
      <div className="flex-1 min-w-0">
        {/* Progress Bar */}
        <div
          className={`h-0.5 sm:h-1 rounded-full cursor-pointer ${
            isOwnMessage ? "bg-gray-300" : "bg-white/30"
          }`}
          onClick={handleProgressClick}
        >
          <div
            className={`h-full rounded-full transition-all duration-100 ${
              isOwnMessage ? "bg-gray-600" : "bg-white"
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Time Display */}
        <div className="flex justify-between items-center mt-0.5 sm:mt-1">
          <span
            className={`text-[10px] sm:text-xs ${
              isOwnMessage ? "text-gray-500" : "text-white/70"
            }`}
          >
            {formatTime(currentTime)}
          </span>
          <span
            className={`text-[10px] sm:text-xs ${
              isOwnMessage ? "text-gray-500" : "text-white/70"
            }`}
          >
            {formatTime(audioDuration)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomAudioPlayer;
