import { useState } from "react";

interface Props {
  children: string;
  type?: string;
  onPasswordChange?: (value: string) => void;
  onEmailChange?: (value: string) => void;
}

const Inputfeild = ({
  children,
  type,
  onPasswordChange,
  onEmailChange,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState<any>("");
  const [emailValue, setEmailValue] = useState<string>("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPasswordValue(newValue);
    if (onPasswordChange) {
      onPasswordChange(newValue);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setEmailValue(newValue);
    if (onEmailChange) {
      onEmailChange(newValue);
    }
  };

  if (type === "pass") {
    return (
      <div className="flex flex-col relative ">
        <label className=" text-[16px] font-normal mb-[9px] pb-0" htmlFor="">
          {children}
        </label>
        <input
          value={passwordValue}
          onChange={handlePasswordChange}
          className="w-[340px] md:w-[370px] h-[50px] outline-1 rounded-md outline-[#00000033] px-3 focus:outline-primary "
          type={showPassword ? "text" : "password"}
          required
        />
        <button
          type="button"
          className=" absolute right-2 md:right-3 top-15 transform -translate-y-1/2 text-gray-500  "
          onClick={(e) => {
            e.preventDefault();
            setShowPassword(!showPassword);
          }}
        >
          {showPassword ? (
            <img
              className="w-[20px] h-[17px] hover:cursor-pointer"
              src="/assets/passlogooff.png"
              alt=""
            />
          ) : (
            <img
              className="w-[20px] h-[13.75px] hover:cursor-pointer"
              src="/assets/passlogo.png"
              alt=""
            />
          )}
        </button>
      </div>
    );
  } else if (type === "email") {
    return (
      <div className="flex flex-col">
        <label className=" text-[16px] font-normal mb-[9px] pb-0" htmlFor="">
          {children}
        </label>
        <input
          value={emailValue}
          onChange={handleEmailChange}
          className="w-[340px] md:w-[370px] h-[50px] outline-1 rounded-md outline-[#00000033] px-3 focus:outline-primary"
          type="text"
          required
        />
      </div>
    );
  } else {
    return (
      <div className="flex flex-col">
        <label className=" text-[16px] font-normal mb-[9px] pb-0" htmlFor="">
          {children}
        </label>
        <input
          className="w-[340px] md:w-[370px] h-[61px] outline-1 rounded-md outline-[#00000033] px-3 focus:outline-primary"
          type="text"
          required
        />
      </div>
    );
  }
};

export default Inputfeild;
