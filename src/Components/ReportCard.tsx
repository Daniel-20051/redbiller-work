import Textbox from "./Textbox";
import { useState, useEffect } from "react";
import { saveDraftToStorage } from "../utils/draftStorage";
export interface ReportCardProps {
  name: string;
  color: string;
  onValueChange?: (value: string) => void;
  reset?: boolean;
  draftItems?: string[] | undefined;
  storageKey?: string;
}

const ReportCard = ({
  name,
  color,
  onValueChange,
  reset,
  draftItems,
  storageKey,
}: ReportCardProps) => {
  const [textboxes, setTextboxes] = useState<{ id: number; value: string }[]>(
    []
  );
  const [number, setNumber] = useState(1);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Initialize textboxes with draft data if available
  useEffect(() => {
    // Only proceed if draftItems is defined (not undefined)
    if (draftItems !== undefined && !draftLoaded) {
      console.log(`${name} - Loading draft items:`, draftItems);
      if (draftItems.length > 0) {
        const initialTextboxes = draftItems
          .filter((item) => item.trim() !== "") // Filter out empty strings
          .map((item, index) => ({
            id: Date.now() + index,
            value: item,
          }));
        console.log(`${name} - Created textboxes:`, initialTextboxes);
        if (initialTextboxes.length > 0) {
          setTextboxes(initialTextboxes);
          setNumber(initialTextboxes.length + 1);
        }
      }
      setDraftLoaded(true); // Mark as loaded whether there was data or not
    }
  }, [draftItems, draftLoaded, name]);

  useEffect(() => {
    if (reset && draftLoaded) {
      console.log(`${name} - Resetting component`);
      setIsResetting(true);
      setTextboxes([]);
      setNumber(1);
      setDraftLoaded(false); // Reset draft loaded flag
      if (onValueChange) {
        onValueChange("");
      }
      // Reset the resetting flag after a short delay
      setTimeout(() => setIsResetting(false), 200);
    }
  }, [reset, onValueChange, draftLoaded, name]);

  const handleAddTextbox = () => {
    if (number <= 20) {
      setTextboxes([...textboxes, { id: Date.now(), value: "" }]);
      setNumber(number + 1);
    }
  };

  const handleDeleteTextbox = (id: number) => {
    setTextboxes(textboxes.filter((textbox) => textbox.id !== id));
    setNumber(number - 1);
  };

  const handleTextboxChange = (id: number, value: string) => {
    setTextboxes(
      textboxes.map((textbox) =>
        textbox.id === id ? { ...textbox, value } : textbox
      )
    );
  };

  useEffect(() => {
    const combined = textboxes.map((textbox) => textbox.value).join("\n");
    if (onValueChange) {
      onValueChange(combined);
    }

    // Save to localStorage as draft (only after draft is loaded and not during reset)
    if (storageKey && draftLoaded && !isResetting) {
      console.log(`${name} - Saving to localStorage:`, combined);
      const draftData = { [storageKey]: combined };
      saveDraftToStorage(draftData);
    }
  }, [textboxes, onValueChange, storageKey, draftLoaded, isResetting, name]);

  return (
    <div className="w-[85%] md:w-[26.5%] justify-self-center mb-8 md:mb-0 ">
      <div className=" flex flex-col  h-[400px] rounded-[17px] bg-[#F2F2F2] items-center relative ">
        <div
          className={` rounded-t-[17px] w-full h-[59px] pt-[16px] pl-[38px] ${color} `}
        >
          <p className="font-[600] text-[20px]  text-white ">{name}</p>
        </div>
        <div className=" flex-1 flex-col gap-4 w-[90%] py-6  flex rounded-b-[15px]  items-center overflow-y-auto ">
          {textboxes.map((textbox) => (
            <Textbox
              key={textbox.id}
              onDelete={() => handleDeleteTextbox(textbox.id)}
              value={textbox.value}
              onChange={(value) => handleTextboxChange(textbox.id, value)}
            />
          ))}

          <button
            onClick={handleAddTextbox}
            className="cursor-pointer place-self-end flex gap-2 border-1 w-auto h-auto border-[#D9D9D9] rounded-[5px] px-[15px] py-[8px]"
          >
            <img src="/assets/add-icon.svg" alt="" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
