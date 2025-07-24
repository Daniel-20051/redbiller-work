import { Icon } from "@iconify/react";
import ProfileName from "./ProfileName";

interface Props {
  name: string;
  email?: string;
  isChat: boolean;
  onClick?: () => void;
  online?: boolean;
  unreadCount?: number;
}

const ChatCard = ({
  name,
  email,
  isChat,
  onClick,
  online,
  unreadCount,
}: Props) => {
  return (
    <div
      className="flex justify-between pb-2 border-b border-gray-200 w-full items-center cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <ProfileName name={name} online={online} />

        <div className="flex flex-col gap-[2px]">
          <p className="font-semibold text-[16px]">{name}</p>
          <p className="text-[15px] text-gray-300 font-medium">{email}</p>
        </div>
      </div>
      {typeof unreadCount === "number" && unreadCount > 0 && (
        <div className="bg-primary  text-white px-2 py-1 rounded-full text-xs">
          {unreadCount}
        </div>
      )}
      {isChat && <Icon icon="ep:arrow-right" width="24" height="24" />}
    </div>
  );
};

export default ChatCard;
