import { Outlet, Navigate } from "react-router-dom";
import jwt from "jwt-decode"
const PrivateAdmin = () => {
   const token = localStorage.getItem("token")
   const decoded = jwt(token)
   console.log(decoded)
   return (
      <>
         {decoded.roles === "Admin" ? (
            <Outlet />
         ) : (
            <Navigate to="/" />
         )}
      </>
   );
};

export default PrivateAdmin;