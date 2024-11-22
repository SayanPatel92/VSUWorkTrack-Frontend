import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";

const SidebarItem = ({ to, icon, label, notifications, isActive, onClick }) => (
  <li>
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center p-4 text-xl rounded-lg transition-colors duration-300 ease-in-out group ${isActive
        ? "bg-indigo-600 text-white border-l-4 border-indigo-600"
        : "bg-main-gray text-indigo-900 hover:bg-indigo-600 hover:text-white"
        }`}
    >
      <svg className="w-10 h-7 text-black-400 transition duration-100 group-hover:text-white" fill="currentColor">
        {icon}
      </svg>
      <span className="flex-1 ms-3 whitespace-nowrap">{label}</span>
      {notifications && (
        <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
          {notifications}
        </span>
      )}
    </Link>
  </li>
);
const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("my-profile"); // State to track active item

  const handleItemClick = (item) => {
    setActiveItem(item); // Set the active item when clicked
  };

  return (
    <aside
      id="default-sidebar"
      className="fixed top-0 left-0 z-40 w-80 h-screen transition-transform -translate-x-full sm:translate-x-0 bg-white border-r-2"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r-2 mt-2">
        <img
          alt="Your Company"
          height="150"
          width="150"
          src="https://upload.wikimedia.org/wikipedia/en/c/c8/VSU_seal.png"
          className="mx-auto"
        />
        <h3 className="mt-4 text-center text-xl sm:text-2xl font-bold text-indigo-700">
          VSUWorkTrack
        </h3>
        <div className="py-2 mt-6 overflow-y-auto">
          <ul className="space-y-4 font-medium mt-4">
            <SidebarItem
              to=""
              icon={<path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />}
              label="My Profile"
              isActive={activeItem === "my-profile"}
              onClick={() => handleItemClick("my-profile")}
            />
            <SidebarItem
              to="employment-modal"
              icon={<path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />}
              label="Employment"
              isActive={activeItem === "employment"}
              onClick={() => handleItemClick("employment")}
            />
            <SidebarItem
              to="input-modal"
              icon={<path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />}
              label="Update Profile"
              isActive={activeItem === "update-profile"}
              onClick={() => handleItemClick("update-profile")}
            />
            <SidebarItem
              to="/login"
              icon={<path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />}
              label="Logout"
              isActive={activeItem === "logout"}
              onClick={() => {
                localStorage.clear();
                handleItemClick("logout")
              }}
            />
          </ul>
        </div>
      </div>
    </aside>
  );
};


const MainContent = () => (
  <div className="h-screen bg-main-gray basis-full img-background">
    <Outlet />
  </div>
);

const StudentDashboard = () => (



  <div className="flex flex-row w-full">
    <div className="basis-1/5">
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
      </button>
      <Sidebar />
    </div>
    <MainContent />
  </div>
);

export default StudentDashboard;
