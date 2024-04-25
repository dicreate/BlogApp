import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../zustand/useAuth";
import { Table } from "flowbite-react";

interface IPost {
   _id: string;
   userId: string;
   content: string;
   title: string;
   image: string;
}
interface IUserPosts {
   totalPosts: number;
   lastMonthPosts: number;
   posts: IPost[]
   // Add other properties as needed
}
const DashPosts = () => {
   const { currentUser } = useAuth();
   const [userPosts, setUserPosts] = useState<IUserPosts | null>(null);
   useEffect(() => {
      const fetchPosts = async () => {
         try {
            const response = await axios.get(`/api/post/getposts?userId=${currentUser?._id}`);
            const data = response.data;
            if (response.statusText == "OK") {
               setUserPosts(data)
            }
         } catch (error) {
            if (error instanceof Error) {
               console.log(error.message);
            }
         }
      }
      if (currentUser?.isAdmin) {
         fetchPosts();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [currentUser?._id])

   return (
      <div>
         {currentUser?.isAdmin && userPosts?.totalPosts && userPosts?.totalPosts > 0 ? (
            <>
               <Table hoverable className="shadow-md">
                  <Table.Head>
                     <Table.HeadCell>Date updated</Table.HeadCell>
                  </Table.Head>
               </Table>
            </>
         ) : (
            <p>You have no posts yet!</p>
         )
         }
      </div >
   )
}

export default DashPosts