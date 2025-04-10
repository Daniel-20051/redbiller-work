import Inputfeild from "../Components/Inputfeild";
const currentYear = new Date().getFullYear();

const Login = () => {
  return (
    <>
      <div className="flex h-screen">
        <div
          style={{ backgroundImage: "url('../src/assets/bg-pic.png')" }}
          className="side-bar bg- w-[35%] bg-cover relative "
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
        <div className="main-content w-[64.5%] relative">
          <div className="flex flex-col items-center h-screen justify-center ">
            <p className="font-main font-semibold text-[32px] mb-0 ">
              Login to your <span className="text-primary">account</span>
            </p>
            <p className="font-main font-normal text-[14px]  ">
              Using your Biller ID
            </p>
            <div className="mb-[32px] mt-[67px]">
              <Inputfeild>Biller ID / Email</Inputfeild>
            </div>
            <div className="mb-[44px]">
              <Inputfeild type="pass">Password</Inputfeild>
            </div>
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
