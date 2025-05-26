import Textbox from "./Textbox";
import { useState, useEffect } from "react";
interface Props {
  name: string;
  color: string;
  onValueChange?: (value: string) => void;
  reset?: boolean;
}

const ReportCard = ({ name, color, onValueChange, reset }: Props) => {
  const [textboxes, setTextboxes] = useState<{ id: number; value: string }[]>(
    []
  );
  const [number, setNumber] = useState(1);

  useEffect(() => {
    if (reset) {
      setTextboxes([]);
      setNumber(1);
      if (onValueChange) {
        onValueChange("");
      }
    }
  }, [reset, onValueChange]);

  const handleAddTextbox = () => {
    if (number <= 3) {
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
    const combined = textboxes.map((textbox) => textbox.value).join("//");
    if (onValueChange) {
      onValueChange(combined);
    }
  }, [textboxes, onValueChange]);

  return (
    <div className="w-[85%] md:w-[26.5%] justify-self-center mb-8 md:mb-0 ">
      <div className=" flex flex-col  h-[430px] rounded-[17px] bg-[#F2F2F2] items-center relative ">
        <div
          className={` rounded-t-[17px] w-full h-[59px] pt-[16px] pl-[38px] ${color} `}
        >
          <p className="font-[600] text-[20px]  text-white ">{name}</p>
        </div>
        <div className=" flex-1 flex-col gap-4 w-[90%] pt-[27px]  flex rounded-b-[15px]  items-center">
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
            className="absolute cursor-pointer bottom-[10px] right-[20px] flex gap-2 border-1 w-auto h-auto border-[#D9D9D9] rounded-[5px] px-[15px] py-[8px]"
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
