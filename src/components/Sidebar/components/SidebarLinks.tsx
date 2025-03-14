import React, { useState, useCallback, useEffect, createElement } from "react";
import {
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiBarChart2,
  FiMessageSquare,
  FiLogOut,
  FiChevronRight,
  FiPlusCircle,
  FiList,
  FiHome,
  FiTool,
} from "react-icons/fi";
import { Gauge } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  isCollapsed: boolean;
  handleLogoutClick: () => void;
}

interface SidebarLink {
  href: string;
  icon: React.ElementType;
  name: string;
  children?: SidebarLink[];
}

const links: SidebarLink[] = [
  { href: "/propertyDashboard", icon: Gauge, name: "Dashboard" },

  {
    href: "#",
    icon: FiBarChart2,
    name: "Reports",
    children: [
      {
        href: "/reportRequests/list",
        icon: FiHome,
        name: "View Report Requests List",
      },
      {
        href: "/reportRequests/new",
        icon: FiPlusCircle,
        name: "Create New Report",
      },
      { href: "/reports/list", icon: FiList, name: "View Reports List" },
    ],
  },
  { href: "/chat", icon: FiMessageSquare, name: "Chat" },
  {
    href: "##",
    icon: FiTool,
    name: "Settings",
    children: [
      { href: "/preferences", icon: FiSettings, name: "Preferences" },
      { href: "/profile", icon: FiUser, name: "Profile" },
    ],
  },
  { href: "/help", icon: FiHelpCircle, name: "Help" },
];

export default function SidebarLinks({
  isCollapsed,
  handleLogoutClick,
}: Props) {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleDropdown = (href: string) => {
    if (isCollapsed) return;

    setOpenDropdowns((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  // Check if current path is inside a dropdown parent's child paths
  const isActiveParent = useCallback(
    (link: SidebarLink) => {
      if (!link.children) return false;
      return link.children.some(
        (child) => pathname === child.href || pathname.startsWith(child.href)
      );
    },
    [pathname]
  );

  // Force open the dropdown if it contains the active path
  useEffect(() => {
    links.forEach((link) => {
      if (link.children && (pathname === link.href || isActiveParent(link))) {
        setOpenDropdowns((prev) => ({
          ...prev,
          [link.href]: true,
        }));
      }
    });
  }, [pathname, isActiveParent]);

  const renderLink = (link: SidebarLink) => {
    const isActive = pathname === link.href || isActiveParent(link);
    const hasChildren = link.children && link.children.length > 0;
    const isOpen = openDropdowns[link.href];

    // Base item classes with proper spacing
    const itemClassName = isCollapsed ? "mb-6" : "mb-2";

    // Link classes for styling
    const linkClassName = `flex items-center ${
      isActive ? "text-blue-400" : "hover:text-gray-300"
    } ${hasChildren ? "justify-between" : ""}`;

    return (
      <li className={itemClassName} key={link.href}>
        <div className={linkClassName} style={{ cursor: "pointer" }}>
          <div className="flex items-center">
            {createElement(link.icon, { size: 20 })}
            {!isCollapsed && (
              <Link href={link.href}>
                <span
                  className="ml-3"
                  onClick={(e) => {
                    if (hasChildren) {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleDropdown(link.href);
                    }
                  }}
                >
                  {link.name}
                </span>
              </Link>
            )}
          </div>

          {!isCollapsed && hasChildren && (
            <div className="ml-2">
              <FiChevronRight size={16} />
            </div>
          )}
        </div>

        {/* Dropdown menu items */}
        {!isCollapsed && hasChildren && isOpen && (
          <ul className="ml-7 mt-2 space-y-2">
            {link.children?.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className={`flex items-center text-sm ${
                    pathname === child.href
                      ? "text-blue-400"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {createElement(child.icon, { size: 16 })}
                  <span className="ml-2">{child.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      {links.map(renderLink)}

      {/* Logout button */}
      <li className={isCollapsed ? "mb-6" : "mb-2"}>
        <button
          onClick={handleLogoutClick}
          className={`flex items-center hover:text-gray-300 text-red-400${
            !isCollapsed ? " w-full" : ""
          }`}
        >
          <FiLogOut size={20} />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </li>
    </>
  );
}
