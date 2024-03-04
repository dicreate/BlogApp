import { Navigate, Outlet } from "react-router-dom"
import useAuth from "../zustand/useAuth"

export default function PrivateRoute() {
   const { currentUser } = useAuth()
   return currentUser ? <Outlet /> : <Navigate to={'sign-in'} />
}
