const GroupCard = () => {
  return (
    <div className=" w-[240px] h-[216px] rounded-[20px]   relative flex flex-col bg-white  shadow-xl">
      <img
        className="w-[20px] h-[20px] absolute right-[15px] top-[15px] "
        src="../src/assets/redbiller.png"
        alt=""
      />

      <p className="font-[700] pt-[30px] pl-[13px] text-[17px] ">Group Chat</p>

      <div className="ml-[20px] mt-[15px] ">
        <div className="flex  ">
          <img
            className="w-[45px] h-[45px] rounded-4xl border-2 border-primary mb-[14px] z-50 "
            src="https://s3-alpha-sig.figma.com/img/fd3d/4c48/a8b689cbbfb343fe22651fcb4dc1c2e0?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=RzuYUaaUJ2V6YfLoqXQc1e0FKNbkeE-g18gzUpYVc3YuPFwrJrewPPqXLl8Z57~PIntsw~XXbcOMXwrqXC9KymfowzFLLS65UB~vuTAWeTDpLyJhNpFy9fGebt53XBarZR3IPCLYL~We3N9q8H4ogTzzK5tbjCiATKkE7Yetp4obITXIcE1O5hhABtfeQht-jZ-SoEhOJTJ4~GCezOpc-fxAFO-zvy735yavzfczIzzTxkTaG~pS~lsuAhmnBRZataviJ8Z3N~rQCpQFYVQcEzQiUzhOhGweGsnZc0e6y~aLUYcq4ckiZ2UYDayosBM~n7h3Mwr4nlmOsCnBfxisFg__"
            alt=""
          />
          <img
            className="w-[45px] h-[45px] rounded-4xl border-2 border-primary mb-[14px] -ml-[22px] z-40 "
            src="https://s3-alpha-sig.figma.com/img/fd3d/4c48/a8b689cbbfb343fe22651fcb4dc1c2e0?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=RzuYUaaUJ2V6YfLoqXQc1e0FKNbkeE-g18gzUpYVc3YuPFwrJrewPPqXLl8Z57~PIntsw~XXbcOMXwrqXC9KymfowzFLLS65UB~vuTAWeTDpLyJhNpFy9fGebt53XBarZR3IPCLYL~We3N9q8H4ogTzzK5tbjCiATKkE7Yetp4obITXIcE1O5hhABtfeQht-jZ-SoEhOJTJ4~GCezOpc-fxAFO-zvy735yavzfczIzzTxkTaG~pS~lsuAhmnBRZataviJ8Z3N~rQCpQFYVQcEzQiUzhOhGweGsnZc0e6y~aLUYcq4ckiZ2UYDayosBM~n7h3Mwr4nlmOsCnBfxisFg__"
            alt=""
          />
          <img
            className="w-[45px] h-[45px] rounded-4xl border-2 border-primary mb-[14px] -ml-[22px] z-30 "
            src="https://s3-alpha-sig.figma.com/img/fd3d/4c48/a8b689cbbfb343fe22651fcb4dc1c2e0?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=RzuYUaaUJ2V6YfLoqXQc1e0FKNbkeE-g18gzUpYVc3YuPFwrJrewPPqXLl8Z57~PIntsw~XXbcOMXwrqXC9KymfowzFLLS65UB~vuTAWeTDpLyJhNpFy9fGebt53XBarZR3IPCLYL~We3N9q8H4ogTzzK5tbjCiATKkE7Yetp4obITXIcE1O5hhABtfeQht-jZ-SoEhOJTJ4~GCezOpc-fxAFO-zvy735yavzfczIzzTxkTaG~pS~lsuAhmnBRZataviJ8Z3N~rQCpQFYVQcEzQiUzhOhGweGsnZc0e6y~aLUYcq4ckiZ2UYDayosBM~n7h3Mwr4nlmOsCnBfxisFg__"
            alt=""
          />
          <img
            className="w-[45px] h-[45px] rounded-4xl border-2 border-primary mb-[14px] -ml-[22px] z-20 "
            src="https://s3-alpha-sig.figma.com/img/fd3d/4c48/a8b689cbbfb343fe22651fcb4dc1c2e0?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=RzuYUaaUJ2V6YfLoqXQc1e0FKNbkeE-g18gzUpYVc3YuPFwrJrewPPqXLl8Z57~PIntsw~XXbcOMXwrqXC9KymfowzFLLS65UB~vuTAWeTDpLyJhNpFy9fGebt53XBarZR3IPCLYL~We3N9q8H4ogTzzK5tbjCiATKkE7Yetp4obITXIcE1O5hhABtfeQht-jZ-SoEhOJTJ4~GCezOpc-fxAFO-zvy735yavzfczIzzTxkTaG~pS~lsuAhmnBRZataviJ8Z3N~rQCpQFYVQcEzQiUzhOhGweGsnZc0e6y~aLUYcq4ckiZ2UYDayosBM~n7h3Mwr4nlmOsCnBfxisFg__"
          />
        </div>

        <p className="text-[12px] font-[500] ">Redbiller Engineering Team</p>
      </div>
      <button className="absolute w-full h-[39px] rounded-b-[20px] bottom-0 text-white bg-primary text-[22px] font-[500] ">
        {" "}
        Open
      </button>
    </div>
  );
};

export default GroupCard;
