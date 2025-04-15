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
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <DialogPanel className="w-[743px] h-[580px] rounded-[20px]  bg-white px-12 py-16 ">
              <DialogTitle className="font-bold">
                PERSONAL iNFORMATION
              </DialogTitle>
              <Description>
                This will permanently deactivate your account
              </Description>
              <p>
                Are you sure you want to deactivate your account? All of your
                data will be permanently removed.
              </p>
              <div className="flex gap-4">
                <button onClick={() => setIsOpen(false)}>Cancel</button>
                <button onClick={() => setIsOpen(false)}>Deactivate</button>
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
