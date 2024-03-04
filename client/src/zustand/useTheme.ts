import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';

interface ITheme {
   theme: string;
   toggleTheme: () => void
}

const useTheme = create<ITheme>()(
   devtools(
      persist(
         (set, get) => ({
            theme: "light",
            toggleTheme: () => set({theme: get().theme === 'light' ? "dark" : "light"}),
         }), 
         {
            name: "BlogApp useTheme Storage"
         }
      ),
      {
         enabled: true
      })
 )
 
 export default useTheme