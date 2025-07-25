import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "./context/UserContext";

const AdminRoute = () => {
    const { currentUser, loading } = useUser();

    if (loading) {
        return <div>Loading...</div>;
    }

    return currentUser && currentUser.isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;