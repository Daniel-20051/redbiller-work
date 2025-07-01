import { use, useState } from "react";
import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import UserInfo from "../Components/UserInfo";
import SmallSpiner from "../Components/smallSpiner";
import { UserDetailsContext } from "../context/AuthContext";
import { AuthApis } from "../api";
import AlertCard from "../messageAlert/AlertCardProps";

const User = () => {
  const { allUser, spiner, fetchAllUser } = use(UserDetailsContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [alertType, setAlertType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const filteredUsers = allUser?.data.data.users.filter((user: any) => {
    const fullname = `${user?.firstName || ""} ${
      user?.lastName || ""
    }`.toLowerCase();
    const email = `${user?.email || ""}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullname.includes(search) || email.includes(search);
  });

  const showAlertMessage = (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 4000);
  };

  const authApis = new AuthApis();
  const handleDeleteUser = async (id: any) => {
    try {
      await authApis.deleteSignleUser(id);
      await fetchAllUser();
      showAlertMessage("User has been deleted", "success");
    } catch (err) {
      showAlertMessage("Failed to delete user", "error");
      return err;
    }
  };

  return (
    <div className="flex flex-col  h-screen">
      <NavBar />
      {showAlert && (
        <AlertCard
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
          isOpen={showAlert}
        />
      )}
      <div className=" flex flex-1 w-full relative max-h-[calc(100vh-55px)]">
        <>
          <SideBar>users</SideBar>
          <div className="flex-1 relative overflow-y-auto max-h-full hide-scrollbar   ">
            <p className="text-[#817979] text-lg absolute right-10 top-5 ">
              Total Members : <span>{allUser?.data.data.users.length}</span>
            </p>
            <p className="font-[700] text-[28px] md:text-[32px] ml-6 md:ml-11 mt-17 md:mt-11 mb-10">
              Users
            </p>
            <div className="grid grid-cols-4 gap-4 md:grid-cols-5 w-full bg-[#F8F8F8] py-6 px-4 md:px-15 justify-between items-center  text-sm md:text-[16px] text-[#817979] text-md ">
              <p className=" ml-0 ">Photo</p>
              <p>Member Name</p>
              <p>Mobile</p>
              <p className="mr-10 md:mr-0 ml-1">Email</p>
              <div className="absolute top-17 md:top-0 right-5 md:inline md:relative">
                <img
                  className=" absolute left-3 top-15 md:top-16 transform -translate-y-12  text-gray-500 "
                  src="/assets/search.svg"
                  alt=""
                />
                <input
                  className="py-3 pl-9 w-35 md:w-auto  bg-[#F2F2F2] rounded-[8px] focus:outline-0 "
                  placeholder="Search..."
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {spiner ? (
              <SmallSpiner />
            ) : (
              <div className="overflow-y-auto w-full mt-5 max-h-full hide-scrollbar scroll-smooth ">
                {filteredUsers?.map((user: any, index: number) => (
                  <UserInfo
                    key={index}
                    name={`${user?.firstName} ${user?.lastName}`}
                    id={user?.id}
                    role={user?.role}
                    firstName={user?.firstName}
                    lastName={user?.lastName}
                    middleName={user?.middleName}
                    email={user?.email}
                    dob={user?.dob}
                    PhoneNum={800000000}
                    gender={user?.gender}
                    department={user?.occupation}
                    imgUrl="/assets/blank-profile.png"
                    onDelete={() => handleDeleteUser(user?.id)}
                    refetch={fetchAllUser}
                  />
                ))}
                {filteredUsers?.length === 0 && (
                  <p className="text-center py-4 text-gray-500">
                    No users found matching your search.
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      </div>
    </div>
  );
};

export default User;
