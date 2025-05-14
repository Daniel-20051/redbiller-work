import { useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";

interface Props {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
}

export const SuccessCard = ({
  message,
  isOpen,
  onClose,
  autoClose = false,
  autoCloseTime = 3000,
}: Props) => {
  useEffect(() => {
    let timer: number;

    if (autoClose && isOpen) {
      timer = window.setTimeout(() => {
        onClose();
      }, autoCloseTime);
    }

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [autoClose, autoCloseTime, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={() => onClose()} className="relative z-50">
      <div className="fixed inset-0  flex w-screen items-center justify-center md:px-12 px-7 py-6 bg-black/40 ">
        <DialogPanel
          className="flex flex-col gap-4 bg-white w-auto h-[auto] items-center  justify-center rounded-[20px] 
    overflow-y-auto max-h-full  hide-scrollbar scroll-smooth py-7 px-5 md:px-11 md:py-12 "
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.9996 0.599609C7.04361 0.599609 0.599609 7.04361 0.599609 14.9996C0.599609 22.9556 7.04361 29.3996 14.9996 29.3996C22.9556 29.3996 29.3996 22.9556 29.3996 14.9996C29.3996 7.04361 22.9556 0.599609 14.9996 0.599609ZM13.8926 23.3876H11.4806L5.64861 15.2156L8.06241 12.9656L12.6866 17.2856L21.9404 6.60981L24.3524 8.30181L13.8926 23.3876Z"
              fill="#0ABD25"
            />
          </svg>
          <p className="font-[700] text-[12px] md:text-[14px]">Thank you !</p>
          <p className="text-[13px] md:text-[15px] text-[#898A8D] font-[700]">
            {message}
          </p>
          <button
            onClick={() => onClose()}
            className="bg-primary cursor-pointer text-white font-[500] text-[12px] md:text-[15px] px-3 md:px-4 py-1 md:py-2  rounded-[8px]"
          >
            Back
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
