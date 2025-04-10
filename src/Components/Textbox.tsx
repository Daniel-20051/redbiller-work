const Textbox = () => {
  return (
    <textarea
      className="w-full   h-auto font-[400] text-[15px]
        rounded-[5px] bg-white placeholder:text-[#000000] px-[9px] py-[18px]
        focus:outline-0  resize-none"
      placeholder="Type in your report....."
      name=""
      id=""
    ></textarea>
  );
};

export default Textbox;
