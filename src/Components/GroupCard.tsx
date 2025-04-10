const GroupCard = () => {
  return (
    <div className="xl:w-[264px] h-[238px] rounded-[20px]   relative flex flex-col bg-white  shadow-xl">
      <img
        className="w-[30px] h-[30px] absolute right-[20px] top-[20px] "
        src="../src/assets/redbiller.png"
        alt=""
      />

      <p className="font-[700] pt-[38px] pl-[18px] text-[20px] ">Group Chat</p>

      <div className="ml-[29px] mt-[18px] ">
        <div className="flex  ">
          <img
            className="w-[55px] h-[55px] rounded-4xl border-2 border-primary mb-[14px] z-50 "
            src="https://s3-alpha-sig.figma.com/img/1af2/0862/20affecd5f498aeca93f64918a91bf86?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=YNHGXpSB5xmhkmix9CVJmD6cy~Xds99uLV0H6V3gR3t1Oe7l6Ag520ekrHWiFy7uOLWTQwQjNrWM-4Ez320E1IEwzjg5oeV57zE6ycx8jf5YaGEOmzdSaWsPEl7SLCDx9CnQUGDQUG-LZIYLPebnh23oipuo1DPRUK~b4vqjprzrrLeEBkfpWuEiAKz-Tk9WfuO1ilyEokjqYrncyRm86slcnSm2B19jq6v0ySLqorKexLtF13htpzhhl6rloEPtTVo27grvWx6gvr1a9A54n2PJc0KqNeNZda4VaRxrvXw1Dk-JXWlWvrc-Pv8SdtbkkZRDEYivfYUBz~sPrt1~8w__"
            alt=""
          />
          <img
            className="w-[55px] h-[55px] rounded-4xl border-2 border-primary mb-[14px] -ml-[22px] z-40 "
            src="https://s3-alpha-sig.figma.com/img/1af2/0862/20affecd5f498aeca93f64918a91bf86?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=YNHGXpSB5xmhkmix9CVJmD6cy~Xds99uLV0H6V3gR3t1Oe7l6Ag520ekrHWiFy7uOLWTQwQjNrWM-4Ez320E1IEwzjg5oeV57zE6ycx8jf5YaGEOmzdSaWsPEl7SLCDx9CnQUGDQUG-LZIYLPebnh23oipuo1DPRUK~b4vqjprzrrLeEBkfpWuEiAKz-Tk9WfuO1ilyEokjqYrncyRm86slcnSm2B19jq6v0ySLqorKexLtF13htpzhhl6rloEPtTVo27grvWx6gvr1a9A54n2PJc0KqNeNZda4VaRxrvXw1Dk-JXWlWvrc-Pv8SdtbkkZRDEYivfYUBz~sPrt1~8w__"
            alt=""
          />
          <img
            className="w-[55px] h-[55px] rounded-4xl border-2 border-primary mb-[14px] -ml-[22px] z-30 "
            src="https://s3-alpha-sig.figma.com/img/1af2/0862/20affecd5f498aeca93f64918a91bf86?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=YNHGXpSB5xmhkmix9CVJmD6cy~Xds99uLV0H6V3gR3t1Oe7l6Ag520ekrHWiFy7uOLWTQwQjNrWM-4Ez320E1IEwzjg5oeV57zE6ycx8jf5YaGEOmzdSaWsPEl7SLCDx9CnQUGDQUG-LZIYLPebnh23oipuo1DPRUK~b4vqjprzrrLeEBkfpWuEiAKz-Tk9WfuO1ilyEokjqYrncyRm86slcnSm2B19jq6v0ySLqorKexLtF13htpzhhl6rloEPtTVo27grvWx6gvr1a9A54n2PJc0KqNeNZda4VaRxrvXw1Dk-JXWlWvrc-Pv8SdtbkkZRDEYivfYUBz~sPrt1~8w__"
            alt=""
          />
          <img
            className="w-[55px] h-[55px] rounded-4xl border-2 border-primary mb-[14px] -ml-[22px] z-20 "
            src="https://s3-alpha-sig.figma.com/img/1af2/0862/20affecd5f498aeca93f64918a91bf86?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=YNHGXpSB5xmhkmix9CVJmD6cy~Xds99uLV0H6V3gR3t1Oe7l6Ag520ekrHWiFy7uOLWTQwQjNrWM-4Ez320E1IEwzjg5oeV57zE6ycx8jf5YaGEOmzdSaWsPEl7SLCDx9CnQUGDQUG-LZIYLPebnh23oipuo1DPRUK~b4vqjprzrrLeEBkfpWuEiAKz-Tk9WfuO1ilyEokjqYrncyRm86slcnSm2B19jq6v0ySLqorKexLtF13htpzhhl6rloEPtTVo27grvWx6gvr1a9A54n2PJc0KqNeNZda4VaRxrvXw1Dk-JXWlWvrc-Pv8SdtbkkZRDEYivfYUBz~sPrt1~8w__"
            alt=""
          />
        </div>

        <p className="text-[13px] font-[500] ">Redbiller Engineering Team</p>
      </div>
      <button className="absolute w-full h-[43px] rounded-b-[20px] bottom-0 text-white bg-primary text-[24px] font-[500] ">
        {" "}
        Open
      </button>
    </div>
  );
};

export default GroupCard;
