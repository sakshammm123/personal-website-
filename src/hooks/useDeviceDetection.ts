"use client";

import { useState, useEffect } from "react";

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: "mobile" | "tablet" | "desktop";
  screenWidth: number;
  screenHeight: number;
}

/**
 * Hook to detect device type (mobile, tablet, desktop) based on screen size and user agent
 */
export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    deviceType: "desktop",
    screenWidth: 0,
    screenHeight: 0,
  });

  useEffect(() => {
    // Function to detect device type
    const detectDevice = (): DeviceInfo => {
      if (typeof window === "undefined") {
        return {
          isMobile: false,
          isTablet: false,
          isDesktop: true,
          deviceType: "desktop",
          screenWidth: 0,
          screenHeight: 0,
        };
      }

      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // User agent detection for additional accuracy
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase()
      );

      // Breakpoints: mobile < 768px, tablet 768px - 1024px, desktop > 1024px
      let deviceType: "mobile" | "tablet" | "desktop";
      let isMobile = false;
      let isTablet = false;
      let isDesktop = false;

      if (width < 768) {
        deviceType = "mobile";
        isMobile = true;
      } else if (width >= 768 && width < 1024) {
        deviceType = "tablet";
        isTablet = true;
      } else {
        deviceType = "desktop";
        isDesktop = true;
      }

      // If user agent suggests mobile but screen is larger, still consider it mobile
      // This handles cases like mobile browsers in desktop mode
      if (isMobileUA && width < 1024) {
        deviceType = width < 768 ? "mobile" : "tablet";
        isMobile = width < 768;
        isTablet = width >= 768 && width < 1024;
        isDesktop = false;
      }

      return {
        isMobile,
        isTablet,
        isDesktop,
        deviceType,
        screenWidth: width,
        screenHeight: height,
      };
    };

    // Set initial device info
    setDeviceInfo(detectDevice());

    // Listen for resize events
    const handleResize = () => {
      setDeviceInfo(detectDevice());
    };

    window.addEventListener("resize", handleResize);
    
    // Also listen for orientation change on mobile devices
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return deviceInfo;
}
