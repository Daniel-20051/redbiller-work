import { useState } from "react";

interface Props {
  children: string;
  type?: string;
}

const Inputfeild = ({ children, type }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  if (type === "pass") {
    return (
      <div className="flex flex-col relative  w-[394.71px]">
        <label className=" text-[16px] font-normal mb-[9px] pb-0" htmlFor="">
          {children}
        </label>
        <input
          className="w-[394.71px] h-[61px] outline-1 rounded-md outline-[#00000033] px-3 focus:outline-primary "
          type={showPassword ? "text" : "password"}
          required
        />
        <button
          className=" absolute right-5 top-16 transform -translate-y-1/2 text-gray-500  "
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <img
              className="w-[20px] h-[17px] hover:cursor-pointer"
              src="../src/assets/passlogooff.png"
              alt=""
            />
          ) : (
            <img
              className="w-[20px] h-[13.75px] hover:cursor-pointer"
              src="../src/assets/passlogo.png"
              alt=""
            />
          )}
        </button>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col">
        <label className=" text-[16px] font-normal mb-[9px] pb-0" htmlFor="">
          {children}
        </label>
        <input
          className="w-[394.71px] h-[61px] outline-1 rounded-md outline-[#00000033] px-3 focus:outline-primary"
          type="text"
          required
        />
      </div>
    );
  }
};

export default Inputfeild;
