import { useState, createContext } from "react";

type UserDetailsContextType = {
  userAuth: any;
  setUserAuth: React.Dispatch<React.SetStateAction<any>>;
  userDetails: any;
  setUserDetails: React.Dispatch<React.SetStateAction<any>>;
};

export const userDetailsContext = createContext<UserDetailsContextType>({
  userAuth: {},
  setUserAuth: () => {},
  userDetails: {},
  setUserDetails: () => {},
});

function AuthLogin({ children }: { children: React.ReactNode }) {
  const [userDetails, setUserDetails] = useState<any>({});
  const [userAuth, setUserAuth] = useState<any>({});

  return (
    <userDetailsContext.Provider
      value={{ userDetails, setUserDetails, userAuth, setUserAuth }}
    >
      {children}
    </userDetailsContext.Provider>
  );
}

export default AuthLogin;
