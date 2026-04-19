import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FilePlus,
  FileText,
  LayoutDashboard,
  BarChart,
  ClipboardCheck,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ROLE_LABELS } from "../types/auth";
import type { Role } from "../types/auth";

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const navItems: {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles: Role[];
}[] = [
  {
    name: "Zgłoś zdarzenie",
    path: "/report",
    icon: <FilePlus className="h-5 w-5" />,
    roles: ["reporter", "coordinator", "admin"],
  },
  {
    name: "Moje zgłoszenia",
    path: "/my-incidents",
    icon: <FileText className="h-5 w-5" />,
    roles: ["reporter"],
  },
  {
    name: "Zgłoszenia",
    path: "/incidents",
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ["coordinator", "admin"],
  },
  {
    name: "Statystyki",
    path: "/statistics",
    icon: <BarChart className="h-5 w-5" />,
    roles: ["coordinator", "admin"],
  },
  {
    name: "Działania",
    path: "/actions",
    icon: <ClipboardCheck className="h-5 w-5" />,
    roles: ["coordinator", "admin"],
  },
];

export function Sidebar({ open, onToggle, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  function handleNavClick() {
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      onClose();
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 transform bg-white border-r border-r-gray-200
        transition duration-200 ease-in-out md:relative md:translate-x-0
        ${open ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 md:w-20"}`}
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-b-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-zdarzenia-600 rounded-md flex items-center justify-center text-white font-bold shrink-0">
            Z
          </div>
          <span
            className={`text-lg font-medium truncate ${!open && "md:hidden"}`}
          >
            Zdarzenia Niepożądane
          </span>
        </div>
        <button
          onClick={onToggle}
          className={`p-1 rounded-md hover:bg-gray-100 shrink-0 ${open ? "" : "md:rotate-180"}`}
          aria-label="Toggle sidebar"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar content */}
      <div className="py-4">
        <nav className="mt-5 px-2 space-y-1">
          {navItems.map((item) => {
            if (!item.roles.includes(user.role)) {
              return null;
            }

            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={handleNavClick}
                className={`${
                  isActive
                    ? "bg-zdarzenia-50 text-zdarzenia-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                } group flex items-center px-2 py-2 text-sm rounded-md`}
                title={!open ? item.name : ""}
              >
                {item.icon}
                <span className={`ml-3 ${!open && "md:hidden"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User info */}
      <div className="absolute bottom-0 w-full border-t border-t-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className={!open ? "md:hidden" : ""}>
            <p className="text-sm font-medium text-gray-700 truncate max-w-[180px]">
              {user.full_name}
            </p>
            <p className="text-xs text-gray-500">
              {ROLE_LABELS[user.role]}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 text-gray-500 hover:text-red-500 p-1 rounded-md hover:bg-gray-100 ${!open ? "md:mx-auto" : ""}`}
            title="Wyloguj"
          >
            <LogOut className="h-4 w-4" />
            <span className={`text-sm ${!open && "md:hidden"}`}>Wyloguj</span>
          </button>
        </div>
      </div>
    </div>
  );
}
