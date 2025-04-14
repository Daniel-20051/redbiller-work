import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Inputfeild from "../Components/Inputfeild";
const currentYear = new Date().getFullYear();
import { AuthApis } from "../api";
import AlertCard from "../messageAlert/AlertCardProps";

interface UserData {
  id: number;
  email: string;
  billerId: string;
  firstName: string;
  lastName: string;
}

interface LoginResponseData {
  status: boolean;
  code: number;
  message: string;
  data: {
    user: UserData;
    authToken: string;
  };
}

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<any>("");
  const [userDetails, setUserDetails] = useState<any>({});
  const [loginSpiner, setLoginSpiner] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const showAlertMessage = (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  const hnadleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginSpiner(true);
    try {
      const authApi = new AuthApis();
      const response = (await authApi.loginUser({ email, password })) as {
        data: LoginResponseData;
      };
      const responseData = response.data;

      console.log(responseData);

      if (responseData.code === 500) {
        showAlertMessage("server error", "error");
        setLoginSpiner(false);
        return;
      }
      if (responseData.status === true) {
        setUserDetails(response);
        showAlertMessage("Login successful!", "success");
        setLoginSpiner(false);
        localStorage.setItem("authToken", responseData.data.authToken);
        setTimeout(() => navigate("/home"), 1000);
        return;
      }
      showAlertMessage(responseData.message || "Login failed", "error");
    } catch (err: any) {
      showAlertMessage("An error occurred during login", "error");
      setLoginSpiner(false);
      console.log(err);
      return err;
    } finally {
      setLoginSpiner(false);
    }
  };

  return (
    <>
      <div className="flex h-screen">
        <AlertCard
          message={alertMessage}
          type={alertType}
          isOpen={showAlert}
          onClose={handleCloseAlert}
          autoClose={true}
          autoCloseTime={5000}
        />
        <div
          style={{ backgroundImage: "url('../src/assets/bg-pic.png')" }}
          className="side-bar bg- w-[30%] bg-cover relative "
        >
          <img
            className="absolute top-0 left-0"
            src="../src/assets/logo-white.png"
            alt=""
          />
          <p className="font-bold font-main text-[24px] absolute bottom-[74px] left-[36px] text-white">
            Seamlessly manage and <br /> make payments.
          </p>
          <p className="font-extrabold font-main text-[13px] absolute bottom-[44px] left-[36px] text-white">
            It doesn’t end here....
          </p>
        </div>
        <div className="main-content w-[70%] relative">
          <div className="flex flex-col items-center h-screen justify-center ">
            <p className="font-main font-semibold text-[32px] mb-0 ">
              Login to your <span className="text-primary">account</span>
            </p>
            <p className="font-main font-normal text-[14px]  ">
              Using your Biller ID
            </p>
            <form onSubmit={hnadleLogin}>
              <div className="mb-[32px] mt-[67px]">
                <Inputfeild type="email" onEmailChange={setEmail}>
                  Biller ID / Email
                </Inputfeild>
              </div>
              <div className="mb-[44px]">
                <Inputfeild type="pass" onPasswordChange={setPassword}>
                  Password
                </Inputfeild>
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-primary text-white font-[400] text-[16px] py-3 rounded-[8px] w-[394.71px] hover:bg-red-900 cursor-pointer"
                >
                  {loginSpiner ? "loading..." : "Login"}
                </button>
              </div>
            </form>
          </div>
          <div className=" absolute bottom-[20px] right-[45px] text-[10px] text-right font-main">
            &copy; {currentYear} Redbiller. All rights reserved
          </div>
        </div>
        <div className="line w-[0.5%] bg-primary"></div>
      </div>
    </>
  );
};

export default Login;
