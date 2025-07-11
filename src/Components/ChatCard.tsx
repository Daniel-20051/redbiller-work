import { Icon } from "@iconify/react";
import ProfileName from "./ProfileName";

interface Props {
  name: string;
  email: string;
  isChat: boolean;
  onClick?: () => void;
}

const ChatCard = ({ name, email, isChat, onClick }: Props) => {
  return (
    <div
      className="flex justify-between w-full items-center cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <ProfileName name={name} />
        <div className="flex flex-col gap-[2px]">
          <p className="font-semibold text-[16px]">{name}</p>
          {/* <p className="text-[15px] text-gray-300 font-medium">{email}</p> */}
        </div>
      </div>
      {isChat && <Icon icon="ep:arrow-right" width="24" height="24" />}
    </div>
  );
};

export default ChatCard;
