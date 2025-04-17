import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import UserInfo from "../Components/UserInfo";
interface Props {
  total: number;
}

const User = ({ total }: Props) => {
  return (
    <div className="flex flex-col  h-screen">
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full relative max-h-[calc(100vh-55px)]">
        <SideBar>users</SideBar>
        <div className="flex-1 relative overflow-y-auto max-h-full hide-scrollbar   ">
          <p className="text-[#817979] text-lg absolute right-10 top-5 ">
            Total Members : <span>{total}</span>
          </p>
          <p className="font-[700] text-[32px] ml-11 mt-11 mb-10">Users</p>
          <div className="flex w-full bg-[#F8F8F8] py-6 px-4 justify-between items-center text-[#817979] text-md ">
            <p className=" ml-0 md:ml-14">Photo</p>
            <p>Member Name</p>
            <p>Mobile(+234)</p>
            <p className="mr-10 md:mr-0">Email</p>
            <div className="hidden md:inline relative">
              <img
                className=" absolute left-3 top-16 transform -translate-y-12  text-gray-500 "
                src="../src/assets/search.svg"
                alt=""
              />
              <input
                className="py-3 pl-9 bg-[#F2F2F2] rounded-[8px] focus:outline-0 "
                placeholder="Search..."
                type="text"
              />
            </div>
          </div>
          <div className="overflow-y-auto mt-5 max-h-full hide-scrollbar scroll-smooth ">
            <UserInfo
              name="Nick Brown"
              email="nick11@gmail.com"
              PhoneNum={9047582930}
              gender="male"
              imgUrl="https://s3-alpha-sig.figma.com/img/fd3d/4c48/a8b689cbbfb343fe22651fcb4dc1c2e0?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=R2Fx9-h2TDCj-tDRlVwtoz~9uOxjnp6amMz5TDEIkykHgrTJE4Avj4Kv3rU5JZ4QdbEB3yRnlGfqo0J87mIcHU1AfX7JdTFTATBxqWBKTuEQ7MM1q80aWdJVJ9iiJhO2di9t54ihpyslE7Aa4TULaEijJorUt09WyP6CShDMEp9dqll90-5EQZgqznyRF5thu-HaG-sdyD00MddWGHA6BPobrV6rxuIJ0ZCI2bCTpI19PSPLLAqTHR86KjnvTUYJ04Kx6kcm-oLYCHB8B01ci~SQshVUTNeuGDT4fH1RK4qTmhMfiALq5aFE~Mp15lOl5x~E8RqDreeLUDNUfYVsnQ__"
            ></UserInfo>
            <UserInfo
              name="Jamie Brown"
              email="nick1221@gmail.com"
              PhoneNum={9522582930}
              gender="female"
              imgUrl="https://s3-alpha-sig.figma.com/img/fd3d/4c48/a8b689cbbfb343fe22651fcb4dc1c2e0?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=R2Fx9-h2TDCj-tDRlVwtoz~9uOxjnp6amMz5TDEIkykHgrTJE4Avj4Kv3rU5JZ4QdbEB3yRnlGfqo0J87mIcHU1AfX7JdTFTATBxqWBKTuEQ7MM1q80aWdJVJ9iiJhO2di9t54ihpyslE7Aa4TULaEijJorUt09WyP6CShDMEp9dqll90-5EQZgqznyRF5thu-HaG-sdyD00MddWGHA6BPobrV6rxuIJ0ZCI2bCTpI19PSPLLAqTHR86KjnvTUYJ04Kx6kcm-oLYCHB8B01ci~SQshVUTNeuGDT4fH1RK4qTmhMfiALq5aFE~Mp15lOl5x~E8RqDreeLUDNUfYVsnQ__"
            ></UserInfo>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
