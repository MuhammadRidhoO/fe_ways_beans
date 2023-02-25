import jwtDecode from "jwt-decode";
import { Outlet, Navigate } from "react-router-dom";

const PrivateTenant = () => {
    const token = localStorage.getItem("token")
    const decoded = jwtDecode(token)
    console.log(decoded)
    
    return decoded.roles !== "Admin"     ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateTenant;
