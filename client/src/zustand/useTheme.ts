import { create } from 'zustand'
import { devtools } from 'zustand/middleware';

interface ITheme {
   theme: string;
   toggleTheme: () => void
}

const useTheme = create<ITheme>()(devtools((set, get) => ({
   theme: "light",
   toggleTheme: () => set({theme: get().theme === 'light' ? "dark" : "light"}),
 }), {
    enabled: true
 }))
 
 export default useTheme