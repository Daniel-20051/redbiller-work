import UserCard from "../Components/UserCard";
import SideBar from "../Components/SideBar";

const Profile = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="bg-[#F2F2F2] h-[55px] w-full flex justify-between ">
        <img
          className="w-[114px] h-[36px] my-[9px] ml-[29px]"
          src="../src/assets/redlogodashboard.svg"
          alt=""
        />
        <UserCard username="Brown Dan" tier="Admin for Association"></UserCard>
      </div>
      <div className=" flex flex-1 w-full max-h-[calc(100vh-55px)] ">
        <SideBar>home</SideBar>
        <div className="w-[76%] flex items-center justify-center ">
          <div className="w-[87.8%] h-[81%] border-1 border-[#D9D9D9] relative "></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
