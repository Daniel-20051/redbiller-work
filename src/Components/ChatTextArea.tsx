import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import ProfileName from "./ProfileName";

const ChatTextArea = () => {
  const [text, setText] = useState("");
  return (
    <div className="flex-1 border-1 border-[#d2d2d2] items-center rounded-lg h-full flex flex-col">
      <div className="h-[60px] w-[97%] border-b-1 border-[#d2d2d2] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ProfileName name="John Doe" />
          <p className="text-[15px] font-[500] ">John Doe</p>
        </div>
        <div className="flex items-center gap-2">
          <Icon icon="ic:round-more-vert" width="24" height="24" />
        </div>
      </div>
      <div className="flex-1 p-3 w-full">ffi</div>
      <div className=" w-full bg-[#F2F2F2] gap-5 flex items-center px-3 rounded-b-lg h-[60px]">
        <div className="flex gap-2 items-center">
          <Icon
            icon="mingcute:emoji-fill"
            className="cursor-pointer"
            width="25"
            height="25"
            style={{ color: "#808080" }}
          />{" "}
          <Icon
            icon="material-symbols:image-rounded"
            className="cursor-pointer"
            width="25"
            height="25"
            style={{ color: "#808080" }}
          />
        </div>
        <input
          className="flex-1 outline-0 resize-none px-2 h-full py-2"
          placeholder="Type a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {text.trim() ? (
          <Icon
            className="cursor-pointer "
            icon="mynaui:send-solid"
            width="24"
            height="24"
            style={{ color: "#93221D" }}
          />
        ) : (
          <Icon
            className="cursor-pointer"
            icon="ic:baseline-mic"
            width="24"
            height="24"
            style={{ color: "#93221D" }}
          />
        )}
      </div>
    </div>
  );
};

export default ChatTextArea;
