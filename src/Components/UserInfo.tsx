interface Props {
  name: string;
  PhoneNum: number;
  email: string;
  imgUrl: string;
}

const UserInfo = ({ name, PhoneNum, email, imgUrl }: Props) => {
  return (
    <div className="flex ml-1 justify-between items-center bg-[#F8F8F8] border-t-1 border-[#E7E3E3] px-13 py-6 hover:bg-[#D6CBCB]">
      <img
        className="rounded-full w-14 h-14 border-3 border-primary"
        src={imgUrl}
        alt=""
      />
      <p>{name}</p>
      <p className="">{PhoneNum}</p>
      <p>{email}</p>
      <div className="mr-8 flex gap-6 ">
        <img
          className="hover:cursor-pointer"
          src="../src/assets/pen.svg"
          alt=""
        />

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
