import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";

interface Props {
  name: string;
  PhoneNum: number;
  email: string;
  imgUrl: string;
}

const UserInfo = ({ name, PhoneNum, email, imgUrl }: Props) => {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onClick={() => setIsOpen(true)}
      className="flex ml-1 justify-between items-center bg-[#F8F8F8] border-t-1 border-[#E7E3E3] px-13 py-6 hover:bg-[#D6CBCB] cursor-pointer"
    >
      <img
        className="rounded-full w-14 h-14 border-3 border-primary"
        src={imgUrl}
        alt=""
      />
      <p>{name}</p>
      <p className="">{PhoneNum}</p>
      <p>{email}</p>
      <div className="mr-8 flex gap-6 ">
        <img className="hover:cursor-pointer" src="../src/assets/pen.svg" />

        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0  flex w-screen items-center justify-center p-4 bg-black/40 ">
            <DialogPanel className="w-[743px] h-[580px] rounded-[20px] items-center bg-white  px-12 py-6  ">
              <button
                className="place-self-end cursor-pointer "
                onClick={() => setIsOpen(false)}
              >
                <img src="../src/assets/cancel-icon.svg" alt="" />
              </button>

              <div className="flex justify-between mx-[50px]  items-center">
                <p className="text-primary text-[13px] font-[800] ">
                  PERSONAL INFORMATION
                </p>
                <img
                  className="border-3 border-primary rounded-full w-[55px] h-[55px] "
                  src={imgUrl}
                />
              </div>
              <div className="flex flex-col mt-[27px] items-center">
                <div className="flex w-[80%]  justify-between">
                  <div className="flex flex-col gap-9">
                    <p className="text-[#898A8D] font-[500] text-[12px] ">
                      Full Name
                    </p>
                    <p className="uppercase font-[500] text-[14px] ">{name}</p>
                  </div>
                  <div className="flex flex-col gap-9">
                    <p className="text-[#898A8D] font-[500] text-[12px] ">
                      Department
                    </p>
                    <p className="uppercase font-[500] text-[14px] ">Student</p>
                  </div>
                </div>
                <div className="flex w-[80%] mt-8 justify-between">
                  <div className="flex flex-col gap-9">
                    <p className="text-[#898A8D] font-[500] text-[12px] ">
                      Date of Birth
                    </p>
                    <p className=" font-[500] text-[14px] ">2002-12-12</p>
                  </div>
                  <div className="flex flex-col gap-9">
                    <p className="text-[#898A8D] font-[500] text-[12px] ">
                      Nationality
                    </p>
                    <p className="uppercase font-[500] text-[14px] ">
                      NIGERIAN
                    </p>
                  </div>
                </div>
                <div className="flex w-[77%] mt-8 justify-between">
                  <div className="flex -ml-[1.5%] flex-col gap-9">
                    <p className="text-[#898A8D] font-[500] text-[12px] ">
                      Contact Information
                    </p>
                    <p className=" font-[500] text-[14px] ">{email}</p>
                  </div>
                  <div className="flex flex-col gap-9">
                    <p className="text-[#898A8D] font-[500] text-[12px] ">
                      State
                    </p>
                    <p className="uppercase font-[500] text-[14px] ">Lagos</p>
                  </div>
                </div>
                <div className="flex w-[77%] mt-8 justify-between">
                  <div className="flex -ml-[1.5%] flex-col gap-9">
                    <p className="text-[#898A8D] font-[500] text-[12px] ">
                      Gender
                    </p>
                    <p className="flex gap-6 uppercase font-[500]  text-[14px] ">
                      <img
                        className="w-[20px] h-[20px] "
                        src="../src/assets/male.svg"
                        alt=""
                      />
                      male
                    </p>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        <img
          className="hover:cursor-pointer"
          src="../src/assets/dust-bin.svg"
          alt=""
        />
      </div>
    </div>
  );
};

export default UserInfo;
