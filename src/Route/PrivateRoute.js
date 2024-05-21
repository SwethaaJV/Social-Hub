import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute(){
    let auth=localStorage.getItem("authentication");
    return(
        auth==="true" ? <Outlet /> : <Navigate to="/signin"/>
    )
}
export default PrivateRoute;

