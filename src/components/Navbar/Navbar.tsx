import { FiMenu, FiChevronLeft } from "react-icons/fi";
import AuthenticatedNotificationBell from "@/components/NotificationBell/AuthenticatedNotificationBell";

interface NavbarProps {
  toggleForceOpen: () => void;
  setIsCollapsed: (collapsed: boolean) => void;
  setForceOpen: (forceOpen: boolean) => void;
  isCollapsed: boolean;
}

const Navbar = ({
  toggleForceOpen,
  isCollapsed,
  setIsCollapsed,
  setForceOpen,
}: NavbarProps) => (
  <div className="h-16 border-b border-gray-700 bg-gray-800 flex items-center">
    <div className="h-full flex items-center px-4 border-l border-gray-700">
      {!isCollapsed ? (
        <button
          onClick={() => {
            setIsCollapsed(true);
            setForceOpen(false);
          }}
        >
          <FiChevronLeft size={20} />
        </button>
      ) : (
        <button
          onClick={toggleForceOpen}
          className="p-2 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors duration-200"
        >
          <FiMenu size={20} />
        </button>
      )}
    </div>

    <div className="flex-1" />

    <div className="px-4">
      <AuthenticatedNotificationBell />
    </div>
  </div>
);

export default Navbar;
