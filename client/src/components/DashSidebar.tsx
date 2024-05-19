import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiUser } from "react-icons/hi";
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
            <Sidebar.ItemGroup className="flex flex-col gap-1">
               <Link to="/dashboard?tab=profile">
                  <Sidebar.Item
                     active={tab === 'profile'}
                     icon={HiUser} label={currentUser?.isAdmin ? "Admin" : "User"}
                     labelColor="dark"
                     className='cursor-pointer'
                     as="div"
                  >
                     Profile
                  </Sidebar.Item>
               </Link>
               {currentUser?.isAdmin && (<Link to="/dashboard?tab=posts">
                  <Sidebar.Item
                     active={tab === 'posts'}
                     icon={HiDocumentText}
                     className='cursor-pointer'
                     as="div"
                  >
                     Posts
                  </Sidebar.Item>
               </Link>)}

               {currentUser?.isAdmin && (<Link to="/dashboard?tab=users">
                  <Sidebar.Item
                     active={tab === 'users'}
                     icon={HiOutlineUserGroup}
                     className='cursor-pointer'
                     as="div"
                  >
                     Users
                  </Sidebar.Item>
               </Link>)}


               <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignout}>
                  Sign Out
               </Sidebar.Item>
            </Sidebar.ItemGroup>
         </Sidebar.Items>
      </Sidebar>
   )
}
