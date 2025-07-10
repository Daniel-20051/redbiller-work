import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import ChatCard from "../Components/ChatCard";
import { AuthApis } from "../api";
import UserSkeleton from "../Components/UserSkeleton";
import ChatTextArea from "../Components/ChatTextArea";
const authApis = new AuthApis();

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);
  const [search, setSearch] = useState("");

  const handleUsers = async () => {
    setIsUserLoading(true);
    try {
      const response: any = await authApis.getAllUser();

      if (response.status === 200) {
        setUsers(response.data.data.users);
      }
    } catch (error) {
    } finally {
      setIsUserLoading(false);
    }
  };

  useEffect(() => {
    handleUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      (user.firstName + " " + user.lastName)
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col  h-screen">
        <NavBar></NavBar>
        <div className=" flex flex-1 w-full relative max-h-[calc(100vh-55px)]">
          <SideBar>chat</SideBar>

          <div className="flex flex-1 items-center justify-center p-3 gap-3">
            <div className=" w-[40%] h-full flex flex-col gap-3  overflow-y-auto ">
              <div
                className={`flex-1  flex flex-col items-center p-3  gap-3 rounded-lg border-1 border-[#d2d2d2] transition-all duration-300 ${
                  isOpen ? "h-[43%]" : "h-[40%]"
                }`}
              >
                <div className="w-full flex place-self-start gap-2 items-center">
                  <img src="./assets/redlogodashboard.svg" alt="" />
                </div>
                <div className="relative w-[97%]">
                  <Icon
                    icon="mynaui:search"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    width="20"
                    height="20"
                  />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full h-[35px] text-[16px] rounded-md border-1 border-[#d2d2d2] outline-0 p-2 pl-10"
                  />
                </div>
                <div className="w-full flex flex-col gap-3 overflow-y-auto flex-1">
                  {isUserLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <UserSkeleton key={i} />
                    ))
                  ) : users.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      No members found.
                    </div>
                  ) : (
                    users.map((user, index) => (
                      <ChatCard
                        key={index}
                        isChat={false}
                        name={user.firstName + " " + user.lastName}
                        email={user.email}
                      />
                    ))
                  )}
                </div>
              </div>
              <div
                className={`flex flex-col  rounded-lg border-1  border-[#d2d2d2] 
                  `}
              >
                <div
                  className={`flex bg-[#F2F2F2] px-3 h-[50px] items-center justify-between transition-transform duration-300 ${
                    isOpen ? "rounded-t-lg" : "rounded-lg"
                  }`}
                >
                  <div className="flex items-center  gap-5 h-full">
                    <Icon icon="octicon:people-24" width="25" height="25" />
                    <p className="text-[15px] font-[500] ">All Members</p>
                  </div>
                  <Icon
                    className={`cursor-pointer transition-transform duration-300 ${
                      isOpen ? "" : "rotate-180"
                    }`}
                    icon="ep:arrow-down"
                    width="24"
                    height="24"
                    onClick={() => setIsOpen((prev) => !prev)}
                  />
                </div>
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden`}
                  style={{
                    maxHeight: isOpen ? 300 : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="p-3 flex flex-col items-center gap-3">
                    <div className="relative w-[97%]">
                      <Icon
                        icon="mynaui:search"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        width="20"
                        height="20"
                      />
                      <input
                        type="text"
                        placeholder="Search"
                        className="w-full h-[35px] text-[16px] rounded-md border-1 border-[#d2d2d2] outline-0 p-2 pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <div
                      className="w-full flex flex-col gap-3 overflow-y-auto"
                      style={{ maxHeight: "160px" }}
                    >
                      {isUserLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <UserSkeleton key={i} />
                        ))
                      ) : filteredUsers.length === 0 ? (
                        <div className="text-center text-gray-500 py-4">
                          No members found.
                        </div>
                      ) : (
                        filteredUsers.map((user, index) => (
                          <ChatCard
                            key={index}
                            name={user.firstName + " " + user.lastName}
                            email={user.email}
                            isChat={true}
                          />
                        ))
                      )}
                    </div>

                    <button className="flex cursor-pointer font-medium items-center justify-center gap-2 bg-primary  w-[97%] text-white px-3 py-2 rounded-md ">
                      <Icon icon="ic:round-plus" width="24" height="24" />
                      Create Group
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <ChatTextArea />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
