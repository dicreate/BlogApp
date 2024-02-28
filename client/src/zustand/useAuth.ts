import { create } from 'zustand'

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

const useAuth = create<IAuth>((set) => ({
  currentUser: null,
  setCurrentUser: (currentUser: null | IUser) => set({currentUser}),
  errorMessage: null,
  setErrorMessage: (errorMessage: string | null) => set({errorMessage}),
  loading: false,
  setLoading: (loading: boolean) => set({loading}),
}))

export default useAuth