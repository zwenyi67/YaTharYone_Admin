import { useAuth } from "@/hooks";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import DesktopSidebar from "@/components/sidebar/DesktopSidebar";
import ProfileBox from "./common/ProfileBox";
import { useState } from "react";
import { Menu as MenuIcon, X as XIcon } from "lucide-react";

const DefaultLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  if (!isAuthenticated) {
    return <Navigate to={"/auth/login"} state={{ from: location }} replace />;
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } transition-width duration-300 h-screen`}
      >
        {isSidebarOpen && <DesktopSidebar />}
      </div>

      {/* Main Content */}
      <main className="flex flex-col w-full overflow-y-auto">
        {/* Header */}
        <nav className="flex items-center justify-between p-3 bg-white shadow-md">
          <button
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
            className="lg:hidden"
          >
            {isSidebarOpen ? (
              <XIcon className="w-6 h-6 text-gray-600" />
            ) : (
              <MenuIcon className="w-6 h-6 text-gray-600" />
            )}
          </button>
          <div className="ml-auto flex items-center">
            <ProfileBox />
          </div>
        </nav>

        {/* Outlet for dynamic content */}
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DefaultLayout;
