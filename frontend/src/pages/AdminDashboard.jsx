import { NavLink, Outlet } from "react-router-dom";

function AdminDashboard() {
    return (
        <div className="flex">
            <div className="w-64 h-screen bg-gray-800 text-white">
                <div className="p-4">
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                </div>
                <nav>
                    <ul>
                        <li>
                            <NavLink to="/admin/users" className={({ isActive }) => `block py-2 px-4 hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`}>
                                Users
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/posts" className={({ isActive }) => `block py-2 px-4 hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`}>
                                Posts
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="flex-1 p-10">
                <Outlet />
            </div>
        </div>
    );
}

export default AdminDashboard;