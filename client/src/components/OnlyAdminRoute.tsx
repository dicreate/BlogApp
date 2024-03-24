import { Navigate, Outlet } from "react-router-dom"
import useAuth from "../zustand/useAuth"

const OnlyAdminRoute = () => {
   const { currentUser } = useAuth()
   return currentUser?.isAdmin ? <Outlet /> : <Navigate to={'sign-in'} />
}

export default OnlyAdminRoute
