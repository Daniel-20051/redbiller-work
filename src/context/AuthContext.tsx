import { useState, createContext, useEffect } from "react";
import { AuthApis } from "../api/index.js";

type UserDetailsContextType = {
  allUser: any;
  setAllUser: any;
  userDetails: any;
  setUserDetails: any;
  spiner: null;
  setSpiner: any;
  fetchUserDetails: () => Promise<void>;
};

const authApis = new AuthApis();

export const UserDetailsContext = createContext<UserDetailsContextType>({
  allUser: null,
  setAllUser: null,
  userDetails: null,
  setUserDetails: null,
  spiner: null,
  setSpiner: null,
  fetchUserDetails: async () => {},
});

function AuthContext({ children }: { children: React.ReactNode }) {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [allUser, setAllUser] = useState<any>(null);
  const [spiner, setSpiner] = useState<any>(true);

  // useEffect(() => {
  //   const fetchUserDetails = async () => {
  //     try {
  //       const response = await authApis.getUserDetails();
  //       setUserDetails(response?.data);
  //     } catch (error) {
  //       return console.error("Error fetching user details:", error);
  //     }
  //   };
  //   fetchUserDetails();
  // }, []);

  // useEffect(() => {
  //   const fetchAllUser = async () => {
  //     try {
  //       const response = await authApis.getAllUser();
  //       setAllUser(response);
  //       setSpiner(false);
  //     } catch (err) {
  //       return err;
  //     }
  //   };
  //   fetchAllUser();
  // }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await authApis.getUserDetails();
      setUserDetails(response?.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchAllUser = async () => {
    try {
      const response = await authApis.getAllUser();
      setAllUser(response);
      setSpiner(false);
    } catch (err) {
      console.error("Error fetching all users:", err);
      return err;
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    fetchAllUser();
  }, []);

  return (
    <UserDetailsContext
      value={{
        userDetails,
        setUserDetails,
        allUser,
        setAllUser,
        spiner,
        setSpiner,
        fetchUserDetails,
      }}
    >
      {children}
    </UserDetailsContext>
  );
}

export default AuthContext;
