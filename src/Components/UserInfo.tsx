import { Dialog, DialogPanel } from "@headlessui/react";
import { useState } from "react";

interface Props {
  name: string;
  PhoneNum: number;
  gender: string;
  email: string;
  imgUrl: string;
}

const UserInfo = ({ name, PhoneNum, email, imgUrl, gender }: Props) => {
  let [isProfileOpen, setIsProfileOpen] = useState(false);
  let [isUpdateOpen, setIsUpdateOpen] = useState(false);

  return (
    <div className="flex ml-1 justify-between items-center bg-[#F8F8F8] border-t-1 border-[#E7E3E3] px-13 py-6 hover:bg-[#D6CBCB] ">
      <img
        className="rounded-full w-14 h-14 border-3 border-primary cursor-pointer"
        src={imgUrl}
        onClick={() => setIsProfileOpen(true)}
        alt=""
      />
      <p
        className="hover:underline cursor-pointer"
        onClick={() => setIsProfileOpen(true)}
      >
        {name}
      </p>
      <p className="">{PhoneNum}</p>
      <p>{email}</p>
      <div className="mr-8 flex gap-6">
        <img
          className="hover:cursor-pointer"
          src="../src/assets/pen.svg"
          onClick={() => setIsUpdateOpen(true)}
        />

        <img
          className="hover:cursor-pointer"
          src="../src/assets/dust-bin.svg"
        />
      </div>
      <Dialog
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0  flex w-screen items-center justify-center p-4 bg-black/40 ">
          <DialogPanel className="w-[743px] h-[580px] rounded-[20px] items-center bg-white  px-12 py-6  ">
            <button
              className="place-self-end cursor-pointer "
              onClick={() => setIsProfileOpen(false)}
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
                {/* <div className="flex flex-col gap-9">
                  <p className="text-[#898A8D] font-[500] text-[12px] ">
                    Department
                  </p>
                  <p className="uppercase font-[500] text-[14px] ">Student</p>
                </div> */}
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
                  <p className="uppercase font-[500] text-[14px] ">NIGERIAN</p>
                </div>
              </div>
              <div className="flex w-[77%] mt-8 justify-between">
                <div className="flex -ml-[1.5%] flex-col gap-9">
                  <p className="text-[#898A8D] font-[500] text-[12px] ">
                    Contact Information
                  </p>
                  <p className=" font-[500] text-[14px] ">{email}</p>
                </div>
                {/* <div className="flex flex-col gap-9">
                  <p className="text-[#898A8D] font-[500] text-[12px] ">
                    State
                  </p>
                  <p className="uppercase font-[500] text-[14px] ">Lagos</p>
                </div> */}
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
                    {gender}
                  </p>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      <Dialog
        open={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0  flex w-screen items-center justify-center p-4 bg-black/40 ">
          <DialogPanel className=" flex flex-col w-[375px] h-[527px] rounded-[20px] items-center bg-white  ">
            <div className="flex justify-between p-8 border-b-1 border-[#808080] w-full">
              <p className="text-primary font-[700] text-[16px] w-full">
                Edit Profile
              </p>
              <button
                className="place-self-end cursor-pointer "
                onClick={() => setIsUpdateOpen(false)}
              >
                <img src="../src/assets/cancel-icon.svg" alt="" />
              </button>
            </div>
            <div>
              <form className="flex flex-col " action="submit">
                <label className="text-[10px] font-[400] mt-2 ">
                  First Name
                </label>
                <input
                  className="border-1 w-[306px] h-[25px] mb-4 px-2 text-[12px] border-black/20 rounded-[5px]"
                  required
                />
                <label className="text-[10px] font-[400] ">Middle Name</label>
                <input className="border-1 w-[306px] h-[25px] mb-4 px-2 text-[12px] border-black/20 rounded-[5px]" />
                <label className="text-[10px] font-[400]   ">Surname</label>
                <input className="border-1 w-[306px] h-[25px] mb-4 px-2 text-[12px] border-black/20 rounded-[5px]" />
                <label className="text-[10px] font-[400]   ">Department</label>
                <input className="border-1 w-[306px] h-[25px] mb-4 px-2 text-[12px] border-black/20 rounded-[5px]" />
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-[400]  ">Gender</label>
                    <input className="border-1 w-[104px] h-[50px] mb-4 px-2 text-[12px] border-black/20 rounded-[5px]" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-[400]   ">
                      Date of Birth
                    </label>
                    <input
                      className="border-1 w-[104px] h-[50px] mb-4 px-2 text-[12px] border-black/20 rounded-[5px]"
                      type="date"
                    />
                  </div>
                </div>
                <label className="text-[10px] font-[400]   mb-2 ">
                  Nationality
                </label>
                <input className="border-1 w-[306px] h-[25px] mb-4 px-2 text-[12px] border-black/20 rounded-[5px]" />
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setIsUpdateOpen(false)}
                    className="bg-[#EFEFEF] py-2 px-3 font-[500] text-[13px] rounded-[8px] hover:cursor-pointer "
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white py-2 px-3 font-[500] text-[13px] rounded-[8px] hover:cursor-pointer "
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default UserInfo;
