// import React, { useState, createContext, ReactNode } from "react";

// interface UserDetails {
//   username?: string;
//   tier?: string;
//   email?: string;
// }

// interface LoginContextType {
//   userDetails: UserDetails | null;
//   setUserDetails: React.Dispatch<React.SetStateAction<UserDetails | null>>;
// }

// export const LoginUserContext = createContext<LoginContextType>({
//   userDetails: null,
//   setUserDetails: () => null,
// });

// interface AuthLoginProps {
//   children: ReactNode;
// }

// function AuthLogin({ children }: AuthLoginProps) {
//   const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  
//   return (
//     <LoginUserContext.Provider value={{ userDetails, setUserDetails }}>
//       {children}
//     </LoginUserContext.Provider>
//   );
// }

// export default AuthLogin;