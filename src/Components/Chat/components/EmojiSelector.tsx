import React, { useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";

interface EmojiSelectorProps {
  visible: boolean;
  onEmojiClick: (emojiObject: any) => void;
  onClose: () => void;
  screenSize: { width: number; height: number };
}

const EmojiSelector: React.FC<EmojiSelectorProps> = ({
  visible,
  onEmojiClick,
  onClose,
  screenSize,
}) => {
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener("click", handleClick);
    }

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      ref={emojiPickerRef}
      style={{
        position: "absolute",
        bottom: "70px",
        left: screenSize.width < 768 ? "5px" : "10px",
        zIndex: 1000,
      }}
    >
      <EmojiPicker
        onEmojiClick={onEmojiClick}
        width={
          screenSize.width < 768 ? 280 : screenSize.width < 1024 ? 320 : 350
        }
        height={screenSize.width < 768 ? 400 : 350}
        searchDisabled={false}
        skinTonesDisabled={true}
      />
    </div>
  );
};

export default EmojiSelector;
