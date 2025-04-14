import UserCard from "./UserCard";

const NavBar = () => {
  return (
    <div className="bg-[#F2F2F2] h-[55px] w-full flex justify-between ">
      <img
        className="w-[114px] h-[36px] my-[9px] ml-[29px]"
        src="../src/assets/redlogodashboard.svg"
        alt=""
      />
      <UserCard username="Adeola Daniel" tier="Admin "></UserCard>
    </div>
  );
};

export default NavBar;
