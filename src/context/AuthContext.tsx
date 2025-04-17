import { useState, createContext, useEffect } from "react";
import { AuthApis } from "../api/index.js";

type UserDetailsContextType = {
  userAuth: any;
  setUserAuth: any;
  userDetails: any;
  setUserDetails: any;
};

const authApis = new AuthApis();

export const UserDetailsContext = createContext<UserDetailsContextType>({
  userAuth: null,
  setUserAuth: null,
  userDetails: null,
  setUserDetails: null,
});

function AuthContext({ children }: { children: React.ReactNode }) {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [userAuth, setUserAuth] = useState<any>(null);

  // useEffect(() => {
  //   (async () => {
  //     const response = await authApis.getUserDetails();
  //     setUserDetails(response?.data);
  //   })();
  // }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await authApis.getUserDetails();
        setUserDetails(response?.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <UserDetailsContext
      value={{ userDetails, setUserDetails, userAuth, setUserAuth }}
    >
      {children}
    </UserDetailsContext>
  );
}

export default AuthContext;
