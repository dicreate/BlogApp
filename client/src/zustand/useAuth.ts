import { create } from 'zustand'
import { devtools } from 'zustand/middleware';

interface IUser {
   _id:string;
   username: string;
   email: string;
}

interface IAuth {
   currentUser: null | IUser;
   setCurrentUser: (currentUser: null | IUser) => void;
   errorMessage: string | null;
   setErrorMessage: (errorMessage: string | null) => void;
   loading: boolean;
   setLoading: (loading: boolean) => void;
 }

const useAuth = create<IAuth>()(devtools((set) => ({
  currentUser: null,
  setCurrentUser: (currentUser: null | IUser) => set({currentUser}),
  errorMessage: null,
  setErrorMessage: (errorMessage: string | null) => set({errorMessage}),
  loading: false,
  setLoading: (loading: boolean) => set({loading}),
}), {
   enabled: true
}))

export default useAuth