import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import { Icon } from "@iconify/react";
const currentDate = new Date();
import { useRef, useState, useEffect } from "react";
import AlertCard from "../messageAlert/AlertCardProps";
import { SuccessCard } from "../messageAlert/SuccessCard";
import { AuthApis } from "../api";
const authApis = new AuthApis();

const IncidentCreate = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textAreaValue, setTextAreaValue] = useState<string | null>(null);
  const [subject, setSubject] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [alertMessage, setAlertMessage] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  //VoiceNote Recorder

  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };
  const showAlertMessage = (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };
  const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setTextAreaValue(newValue);
  };
  const handleSubject = (e: any) => {
    const newValue = e.target.value;
    setSubject(newValue);
  };

  // Add state for audio recording
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  console.log(audioFile);
  console.log(selectedFile);

  // Clean up audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Handle microphone recording
  const handleRecordClick = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorder?.stop();
      setIsRecording(false);

      return;
    }
    // Start recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setIsRecording(true);

      let chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/ogg" });
        const file = new File([blob], "incident-voice.ogg", {
          type: "audio/ogg",
        });
        setAudioFile(file); // override previous audio file
        setAudioUrl(URL.createObjectURL(blob));
        chunks = [];
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
    } catch (err) {
      showAlertMessage("Microphone access denied or unavailable", "error");
      setIsRecording(false);
    }
  };

  const sendReport = async (e: any) => {
    e.preventDefault();
    if (loading) {
      return;
    }
    if (!textAreaValue || !subject) {
      return showAlertMessage("Empty message field", "error");
    }
    try {
      setLoading(true);
      // Use audioFile if present, else selectedFile
      const response: any = await authApis.submitIncidentReport({
        message: textAreaValue || "",
        subject: subject || "",
        photo: selectedFile as File,
        voiceNote: audioFile as File,
      });
      if (
        response.data.data.status === "successful" ||
        response.status === 201
      ) {
        setLoading(false);
        showSuccessMessage("Your report has been Recorded");
        setTextAreaValue(null);
        setSubject("");
        setSelectedFile(null);
        setAudioFile(null);
        setAudioUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
      return response;
    } catch (error) {
      showAlertMessage("An error occurred while sending report", "error");
      return error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <AlertCard
        message={alertMessage}
        type={alertType}
        isOpen={showAlert}
        onClose={handleCloseAlert}
        autoClose={true}
        autoCloseTime={3000}
      />
      <SuccessCard
        message={successMessage}
        isOpen={showSuccess}
        onClose={handleCloseSuccess}
        autoClose={true}
        autoCloseTime={3000}
      />
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full max-h-[calc(100vh-55px)] ">
        <SideBar>incident-report</SideBar>
        <div className="flex flex-1 items-center justify-center relative overflow-y-auto max-h-full  hide-scrollbar scroll-smooth ">
          {/* <Link
            to="/incident-report"
            className="flex items-center gap-2 rounded-lg absolute md:top-5 top-2 left-7 md:left-10 w-[65px] md:w-[80px] border-1 border-[#b9b9b9]
            font-[600] text-[13px] md:text-[16px] p-2 "
          >
            <img
              className="w-[8px] md:w-[10px] h-[20px] md:h-[27px]  "
              src="/assets/back.svg"
              alt=""
            />
            Back
          </Link> */}
          <div className="w-[87.8%] h-[85%] md:h-[81%] border-1 border-[#D9D9D9] relative overflow-y-auto max-h-full  hide-scrollbar scroll-smooth  ">
            <p className="font-[600] text-[13px] text-[#898A8D] absolute right-2 md:right-[62px] top-2 md:top-[22px]">
              {currentDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="flex flex-col items-center justify-center h-full ">
              <p className=" text-[24px] md:text-[48px] font-[700] text-primary ">
                Incident Report
              </p>
              <form
                onSubmit={sendReport}
                className="w-[69%] text-left mt-[15px]  "
              >
                <p className="font-[400] text-[17px] md:text-[20px] mb-[11px] ">
                  Reason for Complaints
                </p>
                <div className="w-full ">
                  <input
                    onChange={handleSubject}
                    value={subject}
                    type="text"
                    className=" border-1 p-2 w-full text-sm rounded-t-[5px] border-[#CCCCCC] focus:outline-0"
                    name=""
                    placeholder="Subject"
                  />
                  <textarea
                    onChange={handleTextArea}
                    value={textAreaValue || ""}
                    className="resize-none p-[20px] w-full h-[35vh] border-[1px] border-t-0 rounded-b-[5px] border-[#CCCCCC] focus:outline-0"
                    name=""
                    id=""
                  ></textarea>
                </div>
                <div className="md:flex justify-between items-center mt-[15px]">
                  <input
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
                    type="file"
                  />

                  <div className="md:flex-col  ">
                    <div className="md:flex items-center gap-2 ">
                      <button
                        type="button"
                        className=" flex gap-5 cursor-pointer justify-between items-center border-1 border-[#E7E3E3] pr-3 rounded-[8px] w-full md:w-auto px-[14px] h-auto py-[10px] "
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <p className="text-[#817979] font-[400] text-[14px]  max-w-[200px] overflow-x-auto whitespace-nowrap hide-scrollbar scroll-smooth ">
                          {selectedFile ? selectedFile.name : "Upload"}
                        </p>
                        <img className=" " src="/assets/upload.svg" alt="" />
                      </button>
                      <button
                        type="button"
                        className={
                          `flex items-center mt-2 md:mt-0 justify-between gap-5 pr-3 border-1 border-[#E7E3E3] rounded-[8px] w-full md:w-auto px-[14px] h-auto py-[10px] cursor-pointer ` +
                          (isRecording
                            ? "animate-pulse border-primary bg-[#f8f8f8]"
                            : "")
                        }
                        onClick={handleRecordClick}
                      >
                        <p className="text-[14px] text-[#817979]">
                          {isRecording
                            ? "Tap to stop"
                            : audioFile
                            ? "Recorded Voice Note"
                            : "Tap to record"}
                        </p>
                        <Icon
                          icon="tabler:microphone-filled"
                          width="20"
                          height="20"
                          color={isRecording ? "#d32f2f" : "#817979"}
                          className={isRecording ? "animate-pulse" : ""}
                        />
                      </button>
                    </div>
                    {audioFile && audioUrl && (
                      <audio controls src={audioUrl} className="mt-2 w-full " />
                    )}
                  </div>

                  <button
                    disabled={loading}
                    type="submit"
                    className={
                      loading
                        ? "bg-[#6b6b6b] w-full md:w-auto h-auto px-[16px] py-[6.5px] mt-2 text-white rounded-[8px]"
                        : "w-full md:w-auto h-auto px-[16px] py-[6.5px] mt-2 text-white cursor-[pointer] bg-primary rounded-[8px]"
                    }
                  >
                    {loading ? (
                      <p className=" cursor-not-allowed">loading...</p>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default IncidentCreate;
