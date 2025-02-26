"use client";

import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/authSlice";
import Sidebar from "@/components/Sidebar/components/Sidebar";
import LogoutAlert from "@/components/Sidebar/components/LogoutAlert";
import Navbar from "@/components/Navbar/Navbar";
import { logoutUser } from "@/store/authSlice";
import { PropertyDataProvider } from "@/components/Providers/PropertyDataProvider";

interface SidebarWrapperProps {
  children: React.ReactNode;
}

export default function SidebarWrapper({ children }: SidebarWrapperProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [forceOpen, setForceOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  console.log("SideBar Wrapper Mounted");
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!forceOpen) setIsCollapsed(false);
  }, [forceOpen]);

  const handleMouseLeave = useCallback(() => {
    if (!forceOpen) setIsCollapsed(true);
  }, [forceOpen]);

  const toggleForceOpen = useCallback(() => {
    setForceOpen(!forceOpen);
    setIsCollapsed(false);
  }, [forceOpen]);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <main className="flex-1 p-4 overflow-auto"></main>;
  }

  return (
    <>
      {isAuthenticated ? (
        <>
          <LogoutAlert
            showLogoutDialog={showLogoutDialog}
            setShowLogoutDialog={setShowLogoutDialog}
            handleLogoutConfirm={handleLogoutConfirm}
          />
          <div
            className={`bg-sidebar min-h-screen transition-all duration-300 ${
              isCollapsed ? "w-16" : "w-64"
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Sidebar
              isCollapsed={isCollapsed}
              toggleForceOpen={toggleForceOpen}
              handleLogoutClick={handleLogoutClick}
            />
          </div>
          <div className="flex flex-1 flex-col">
            <Navbar
              toggleForceOpen={toggleForceOpen}
              setIsCollapsed={setIsCollapsed}
              isCollapsed={isCollapsed}
              setForceOpen={setForceOpen}
            />
            <PropertyDataProvider>
              <main className="flex-1 p-4 overflow-auto">{children}</main>
            </PropertyDataProvider>
          </div>
        </>
      ) : (
        <main className="flex-1 p-4 overflow-auto">{children}</main>
      )}
    </>
  );
}
