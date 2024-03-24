import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../zustand/useAuth";

export default function DashSidebar() {
   const { setLoading, setErrorMessage, setCurrentUser, currentUser } = useAuth();

   const location = useLocation();
   const [tab, setTab] = useState('');


   const handleSignout = async () => {
      try {
         const res = await fetch('/api/user/signout', {
            method: 'POST'
         })

         const data = await res.json()
         if (!res.ok) {
            console.log(data.message)
         } else {
            setCurrentUser(null);
            setErrorMessage(null);
            setLoading(false)
         }
      } catch (e) {
         if (e instanceof Error) console.log(e.message)
      }
   }

   useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get('tab');
      if (tabFromUrl) {
         setTab(tabFromUrl)
      }
   }, [location.search])

   return (
      <Sidebar className="w-full md:w-56">
         <Sidebar.Items>
            <Sidebar.ItemGroup>
               <Link to="/dashboard?tab=profile">
                  <Sidebar.Item
                     active={tab === 'profile'}
                     icon={HiUser} label={currentUser?.isAdmin ? "admin" : "user"}
                     labelColor="dark"
                     className='cursor-pointer'
                     as="div"
                  >
                     Profile
                  </Sidebar.Item>
               </Link>

               <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignout}>
                  Sign Out
               </Sidebar.Item>
            </Sidebar.ItemGroup>
         </Sidebar.Items>
      </Sidebar>
   )
}
