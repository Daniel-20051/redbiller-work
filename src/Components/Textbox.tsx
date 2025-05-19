interface TextboxProps {
  onDelete: () => void;
  value: string;
  onChange: (value: string) => void;
}

const Textbox = ({ onDelete, value, onChange }: TextboxProps) => {
  return (
    <div className="relative w-full">
      <textarea
        className="w-full h-auto font-[400] text-[15px]
          rounded-[5px] bg-white placeholder:text-[#000000] px-[9px] py-[18px]
          focus:outline-0 resize-none"
        placeholder="Type in your report....."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        name=""
        id=""
      ></textarea>
      <button
        onClick={onDelete}
        className="absolute cursor-pointer top-1.5 right-2 text-red-500 hover:text-red-700"
      >
        <img src="/assets/dust-bin.svg" alt="Delete" className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Textbox;
