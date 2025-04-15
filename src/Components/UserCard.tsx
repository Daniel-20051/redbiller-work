import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

interface Props {
  username: string;
  role: string;
}

const UserCard = ({ username, role }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  return (
    <div
      ref={dropdownRef}
      className="flex  gap-5 items-center mr-[42.61px] relative "
    >
      <img
        className="w-[25px] h-[25px] "
        src="../src/assets/dummynot.svg"
        alt=""
      />
      <img
        className="w-[35px] h-[35px] rounded-[15px]"
        src="https://s3-alpha-sig.figma.com/img/1af2/0862/20affecd5f498aeca93f64918a91bf86?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=YNHGXpSB5xmhkmix9CVJmD6cy~Xds99uLV0H6V3gR3t1Oe7l6Ag520ekrHWiFy7uOLWTQwQjNrWM-4Ez320E1IEwzjg5oeV57zE6ycx8jf5YaGEOmzdSaWsPEl7SLCDx9CnQUGDQUG-LZIYLPebnh23oipuo1DPRUK~b4vqjprzrrLeEBkfpWuEiAKz-Tk9WfuO1ilyEokjqYrncyRm86slcnSm2B19jq6v0ySLqorKexLtF13htpzhhl6rloEPtTVo27grvWx6gvr1a9A54n2PJc0KqNeNZda4VaRxrvXw1Dk-JXWlWvrc-Pv8SdtbkkZRDEYivfYUBz~sPrt1~8w__"
        alt=""
      />
      <div className="flex flex-col text-center">
        <p className="text-[15px] font-extrabold ">{username}</p>
        <p className="text-[10px] uppercase">{role}</p>
      </div>
      <div>
        <img
          className="cursor-pointer"
          src="../src/assets/drop-icon.svg"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          alt=""
        />
      </div>
      {isOpen && (
        <div className=" flex w-[302px] h-[295px] pt-[38px] px-[29px]  flex-col bg-[#FAFAFA] rounded-[20px] z-50 absolute top-18 right-[1px] ">
          <div className="flex gap-6 items-center">
            <img
              className="w-[56px] h-[56px] ml-[15px] rounded-[50px]"
              src="https://s3-alpha-sig.figma.com/img/d1de/8b14/dcdb224d3238629ee05b2850c42f6549?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=TuQHovb-0s-6QBZycnSZFT-3k~12hGKgE0kKbTfLcnsgHhwkqOb9nkSKgnn9I9vzZICIgp85h42rfDNgMXiWKEY8zq0LMgR8EMv6OXB0krrHIutMqqfGHJMDaTdGd3LyAV9VqpVbtls~Jfii2-UuGWC~xBwfwwjVckQmoWyrHDJrkxalA6OQkSlspGfQhWn9L6laFwEHkJx7BUIoHFxhoxVxfeFLkEOFlD6iG9GzIl6vVWOlR--E24sURD4d1TPAh1h8-lJ~qfMTHFDKC8Mq9I4ZmexuaNkDYOJMkPKEcHxNPJu3AeHdCxiYSKRzmXB4gfsg3PpmmReGBIhzeaPBaQ__"
              alt=""
            />
            <div className="flex flex-col gap-4">
              <p className="font-[500] text-[12px] ">{username}</p>
              <p className="text-[#B2B2B2] font-[500] text-[12px]">
                yourname@gmail.com
              </p>
            </div>
          </div>
          <tr className="outline-[1px] outline-[#7D7D7D] my-6 w-[full]"></tr>
          <Link
            to="/profile"
            className="flex gap-3 bg-[#F2F2F2] p-[15px] rounded-[8px] hover:bg-[#d6cbcb]"
          >
            <img src="../src/assets/profile.svg" alt="" />
            <p className="font-[500] text-[14px] ">Profile</p>
          </Link>
          <button
            onClick={handleLogout}
            className="flex gap-2 justify-center items-center mt-[38px] "
          >
            <img src="../src/assets/logout-icon.svg" alt="" />
            <p className=" text-primary font-[600] text-[14px] cursor-pointer">
              Logout
            </p>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCard;
