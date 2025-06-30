import { useState, useRef, useEffect } from "react";

import Modal from "./Modal";

interface Props {
  name: string;
  PhoneNum: number;
  gender: string;
  email: string;
  imgUrl: string;
  dob: string;
  department: string;
  onDelete: () => void;
}

const UserInfo = ({
  name,
  PhoneNum,
  email,
  imgUrl,
  gender,
  department,
  dob,
  onDelete,
}: Props) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteDpiner, setIsDeleteSpiner] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const [isSwiped, setIsSwiped] = useState(false);

  // Handle escape key to close modals
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsProfileOpen(false);
        setIsUpdateOpen(false);
        setIsDeleteConfirmOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX.current !== null && touchStartX.current - touchEndX > 50) {
      setIsSwiped(true);
    } else {
      setIsSwiped(false);
    }
  };

  const handleConfirmationDelete = () => {
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleteSpiner(true);
    await onDelete();
    setIsDeleteConfirmOpen(false);
    setIsDeleteSpiner(false);
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`absolute  top-0 right-0 h-full flex transition-all duration-300 z-0 ${
          isSwiped ? "w-30" : "w-0"
        }`}
      >
        <button
          onClick={() => {
            setIsUpdateOpen(true);
            setIsSwiped(false);
          }}
          className="w-1/2 flex  items-center justify-center transition-all"
        >
          <img src="/assets/pen.svg" alt="pic" />
        </button>

        <button
          onClick={() => {
            handleConfirmationDelete();
          }}
          className="w-1/2 flex  items-center justify-center transition-all"
        >
          <img src="/assets/dust-bin.svg" alt="pic" />
        </button>
      </div>
      <div
        className={`grid grid-cols-4 gap-4 md:grid-cols-5 relative z-10 transition-transform duration-300 ease-in-out ${
          isSwiped ? "-translate-x-30" : "translate-x-0"
        }
        ml-1 items-center  text-sm md:text-[16px]  bg-[#F8F8F8] border-t-1 border-[#E7E3E3] px-3 md:px-13 py-6 hover:bg-[#D6CBCB] `}
      >
        <img
          className="rounded-full  w-10 md:w-14 h-10 md:h-14 border-3 border-primary cursor-pointer justify-center"
          src={imgUrl}
          onClick={() => setIsProfileOpen(true)}
          alt=""
        />
        <p
          className="hover:underline cursor-pointer "
          onClick={() => setIsProfileOpen(true)}
        >
          {name}
        </p>
        <p className="">{PhoneNum}</p>
        <p className="overflow-hidden whitespace-wrap">{email}</p>
        <div className=" hidden  md:flex justify-center   gap-6">
          <img
            className="hover:cursor-pointer"
            src="/assets/pen.svg"
            onClick={() => setIsUpdateOpen(true)}
          />

          <img
            className="hover:cursor-pointer"
            src="/assets/dust-bin.svg"
            onClick={handleConfirmationDelete}
          />
        </div>

        {/* Profile Modal */}
        <Modal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)}>
          <div className="w-[743px] h-[580px] rounded-[20px] items-center bg-white px-12 py-6 shadow-2xl">
            <button
              className="place-self-end cursor-pointer transition-transform duration-200 hover:scale-110"
              onClick={() => setIsProfileOpen(false)}
            >
              <img src="/assets/cancel-icon.svg" alt="" />
            </button>

            <div className="flex justify-between mx-[50px] items-center">
              <p className="text-primary text-[13px] font-[800]">
                PERSONAL INFORMATION
              </p>
              <img
                className="border-3 border-primary rounded-full w-[55px] h-[55px]"
                src={imgUrl}
              />
            </div>
            <div className="flex flex-col mt-[27px] items-center">
              <div className="flex w-[80%] justify-between">
                <div className="flex flex-col gap-9">
                  <p className="text-[#898A8D] font-[500] text-[12px]">
                    Full Name
                  </p>
                  <p className="uppercase font-[500] text-[14px]">{name}</p>
                </div>
                <div className="flex flex-col gap-9">
                  <p className="text-[#898A8D] font-[500] text-[12px]">
                    Department
                  </p>
                  <p className="uppercase font-[500] text-[14px]">
                    {department}
                  </p>
                </div>
              </div>
              <div className="flex w-[80%] mt-8 justify-between">
                <div className="flex flex-col gap-9">
                  <p className="text-[#898A8D] font-[500] text-[12px]">
                    Date of Birth
                  </p>
                  <p className="font-[500] text-[14px]">{dob}</p>
                </div>
                <div className="flex flex-col gap-9">
                  <p className="text-[#898A8D] font-[500] text-[12px]">
                    Nationality
                  </p>
                  <p className="uppercase font-[500] text-[14px]">NIGERIAN</p>
                </div>
              </div>
              <div className="flex w-[77%] mt-8 justify-between">
                <div className="flex -ml-[1.5%] flex-col gap-9">
                  <p className="text-[#898A8D] font-[500] text-[12px]">
                    Contact Information
                  </p>
                  <p className="font-[500] text-[14px]">{email}</p>
                </div>
                <div className="flex flex-col gap-9">
                  <p className="text-[#898A8D] font-[500] text-[12px]">State</p>
                  <p className="uppercase font-[500] text-[14px]">Lagos</p>
                </div>
              </div>
              <div className="flex w-[77%] mt-8 justify-between">
                <div className="flex -ml-[1.5%] flex-col gap-9">
                  <p className="text-[#898A8D] font-[500] text-[12px]">
                    Gender
                  </p>
                  <p className="flex gap-6 uppercase font-[500] text-[14px]">
                    <img
                      className="w-[20px] h-[20px]"
                      src="/assets/male.svg"
                      alt=""
                    />
                    {gender}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        {/* Edit Modal */}
        <Modal isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)}>
          <div className="flex flex-col w-[375px] h-[527px] rounded-[20px] items-center bg-white shadow-2xl">
            <div className="flex justify-between p-8 border-b-1 border-[#808080] w-full">
              <p className="text-primary font-[700] text-[16px] w-full">
                Edit Profile
              </p>
              <button
                className="place-self-end cursor-pointer transition-transform duration-200 hover:scale-110"
                onClick={() => setIsUpdateOpen(false)}
              >
                <img src="/assets/cancel-icon.svg" alt="" />
              </button>
            </div>
            <div>
              <form className="flex flex-col" action="submit">
                <label className="text-[10px] font-[400] mt-2">
                  First Name
                </label>
                <input
                  className="border-1 w-[306px] h-[25px] mb-4 px-2 text-[12px] border-black/20 rounded-[5px] transition-all duration-200 focus:border-primary focus:outline-none"
                  required
                />
                <label className="text-[10px] font-[400]">Middle Name</label>
                <input className="border-1 w-[306px] h-[25px] mb-4 px-2 text-[12px] border-black/20 rounded-[5px] transition-all duration-200 focus:border-primary focus:outline-none" />
                <label className="text-[10px] font-[400]">Surname</label>
                <input className="border-1 w-[306px] h-[25px] mb-4 px-2 text-[12px] border-black/20 rounded-[5px] transition-all duration-200 focus:border-primary focus:outline-none" />
                <label className="text-[10px] font-[400]">Department</label>
                <input className="border-1 w-[306px] h-[25px] mb-4 px-2 text-[12px] border-black/20 rounded-[5px] transition-all duration-200 focus:border-primary focus:outline-none" />
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-[400]">Gender</label>
                    <input className="border-1 w-[104px] h-[50px] mb-4 px-2 text-[12px] border-black/20 rounded-[5px] transition-all duration-200 focus:border-primary focus:outline-none" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-[400]">
                      Date of Birth
                    </label>
                    <input
                      className="border-1 w-[104px] h-[50px] mb-4 px-2 text-[12px] border-black/20 rounded-[5px] transition-all duration-200 focus:border-primary focus:outline-none"
                      type="date"
                    />
                  </div>
                </div>
                <label className="text-[10px] font-[400] mb-2">
                  Nationality
                </label>
                <input className="border-1 w-[306px] h-[25px] mb-4 px-2 text-[12px] border-black/20 rounded-[5px] transition-all duration-200 focus:border-primary focus:outline-none" />
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setIsUpdateOpen(false)}
                    className="bg-[#EFEFEF] py-2 px-3 font-[500] text-[13px] rounded-[8px] hover:cursor-pointer transition-all duration-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white py-2 px-3 font-[500] text-[13px] rounded-[8px] hover:cursor-pointer transition-all duration-200 hover:bg-primary/90"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
        >
          <div className="flex flex-col w-[350px] rounded-[20px] items-center bg-white p-6 shadow-2xl">
            <div className="flex flex-col items-center mb-8">
              <h3 className="text-lg font-bold rounded px-2 text-gray-700">
                Confirm Deletion
              </h3>
              <p className="text-center text-gray-600 mt-2">
                Are you sure you want to delete {name}'s profile? This action
                cannot be undone.
              </p>
            </div>

            <div className="flex gap-4 w-full justify-center">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="bg-[#EFEFEF] py-2 px-5 font-[500] text-[13px] rounded-[8px] hover:cursor-pointer transition-all duration-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-primary text-white py-2 px-5 font-[500] text-[13px] rounded-[8px] hover:cursor-pointer transition-all duration-200 hover:bg-red-600"
              >
                {isDeleteDpiner ? "loading..." : "Delete"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default UserInfo;
