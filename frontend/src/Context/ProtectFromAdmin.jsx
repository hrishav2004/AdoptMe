import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext"; // Or your useAuth hook

const ProtectFromAdmin = ({ children }) => {
    // 1. Get the user directly from the context
    const { user, loading } = useContext(UserContext); // Assuming your context provides a loading state

    // 2. Use the context's loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    // 3. Check the role from the user object in the context
    if (user && user.role === 'admin') {
        return <Navigate to='/dashboard' replace />;
    }

    // 4. If the user is not an admin, show the page
    return children;
};

export default ProtectFromAdmin;