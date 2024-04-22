import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import { DashProfile, DashSidebar } from "../components";
import DashPosts from "../components/DashPosts";
const Dashboard = () => {
   const location = useLocation();
   const [tab, setTab] = useState('');

   useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get('tab');
      if (tabFromUrl) {
         setTab(tabFromUrl)
      }
   }, [location.search])

   return (
      <div>
         <div className="min-h-screen flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="md:w-56">
               <DashSidebar />
            </div>
            {/* profile */}
            {tab == "profile" && <DashProfile />}
            {/* posts */}
            {tab == "posts" && <DashPosts />}
         </div>
      </div>
   )
}

export default Dashboard