import Textbox from "./Textbox";
import { useState } from "react";
interface Props {
  name: string;
  color: string;
}

const ReportCard = ({ name, color }: Props) => {
  const [textboxes, setTextboxes] = useState<number[]>([]);
  const [number, setNumber] = useState(1);

  const handleAddTextbox = () => {
    if (number <= 3) {
      setTextboxes([...textboxes, Date.now()]);
      setNumber(number + 1);
    }
  };
  return (
    <div className="w-[85%] md:w-[26.5%] justify-self-center mb-8 md:mb-0 ">
      <div className=" flex flex-col  h-[401px] rounded-[17px] bg-[#F2F2F2] items-center relative ">
        <div
          className={` rounded-t-[17px] w-full h-[59px] pt-[16px] pl-[38px] ${color} `}
        >
          <p className="font-[600] text-[20px]  text-white ">{name}</p>
        </div>
        <div className=" flex-1 flex-col gap-4 w-[90%] pt-[27px]  flex rounded-b-[15px]  items-center">
          {textboxes.map((id) => (
            <Textbox key={id} />
          ))}

          <button
            onClick={handleAddTextbox}
            className="absolute bottom-[20px] right-[20px] flex gap-2 border-1 w-auto h-auto border-[#D9D9D9] rounded-[5px] px-[15px] py-[8px]"
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
