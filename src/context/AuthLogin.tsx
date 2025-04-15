import { useState, createContext } from "react";

// export const userDetailsContext = createContext({});

type UserDetailsContextType = {
  userDetails: any;
  setUserDetails: React.Dispatch<React.SetStateAction<any>>;
};

export const userDetailsContext = createContext<UserDetailsContextType>({
  userDetails: {},
  setUserDetails: () => {},
});

function AuthLogin({ children }: { children: React.ReactNode }) {
  const [userDetails, setUserDetails] = useState<any>({});

  return (
    <userDetailsContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </userDetailsContext.Provider>
  );
}

export default AuthLogin;
