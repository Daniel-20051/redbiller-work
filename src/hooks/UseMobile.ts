import { useState, useEffect } from "react";

function useMobile() {
  const [deviceType, setDeviceType] = useState<{
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  }>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const tabletQuery = window.matchMedia(
      "(min-width: 768px) and (max-width: 1023px)"
    );

    const updateDeviceType = () => {
      setDeviceType({
        isMobile: mobileQuery.matches,
        isTablet: tabletQuery.matches,
        isDesktop: !mobileQuery.matches && !tabletQuery.matches,
      });
    };

    updateDeviceType();
    mobileQuery.addEventListener("change", updateDeviceType);
    tabletQuery.addEventListener("change", updateDeviceType);

    return () => {
      mobileQuery.removeEventListener("change", updateDeviceType);
      tabletQuery.removeEventListener("change", updateDeviceType);
    };
  }, []);

  return deviceType;
}

export default useMobile;