import Link from "next/link";
import BuildingLogo from "@/components/icons/BuildingLogo";
import SidebarLinks from "@/components/Sidebar/components/SidebarLinks";

interface SidebarProps {
  isCollapsed: boolean;
  toggleForceOpen: () => void;
  handleLogoutClick: () => void;
}

export default function Sidebar({
  isCollapsed,
  toggleForceOpen,
  handleLogoutClick,
}: SidebarProps) {
  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <Link
          href="/dashboard"
          onClick={toggleForceOpen}
          className="flex items-center cursor-pointer"
        >
          <BuildingLogo />
          {!isCollapsed && <span className="ml-2 font-bold">Ariba</span>}
        </Link>
      </div>

      <nav className="p-4">
        <ul>
          <SidebarLinks
            isCollapsed={isCollapsed}
            handleLogoutClick={handleLogoutClick}
          />
        </ul>
      </nav>
    </>
  );
}
