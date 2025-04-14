import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";

const User = () => {
  return (
    <div className="flex flex-col  h-screen">
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full relative max-h-[calc(100vh-55px)]">
        <SideBar>users</SideBar>
      </div>
    </div>
  );
};

export default User;
