import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../zustand/useAuth";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

interface IPost {
   _id: string;
   userId: string;
   content: string;
   title: string;
   image: string;
   updatedAt: string;
   slug: string;
   category: string;
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
   const [showMore, setShowMore] = useState(true);
   const [showModal, setShowModal] = useState(false);
   const [postIdToDelete, setPostIdToDelete] = useState('');

   useEffect(() => {
      const fetchPosts = async () => {
         try {
            const response = await axios.get(`/api/post/getposts?userId=${currentUser?._id}`);
            const data = response.data;
            if (response.statusText == "OK") {
               setUserPosts(data)
               if (data.posts.length < 9) {
                  setShowMore(false);
               }
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

   const handleShowMore = async (): Promise<void> => {
      const startIndex = userPosts?.posts.length;
      try {
         const res = await axios.get(`/api/post/getposts?userid=${currentUser?._id}&startIndex=${startIndex}`);
         const data = res.data;
         if (res.statusText === "OK") {
            setUserPosts(prev => {
               if (prev) {
                  return {
                     ...prev,
                     posts: [...prev.posts, ...data.posts],
                     totalPosts: data.totalPosts,
                     lastMonthPosts: data.lastMonthPosts
                  };
               }
               return null;
            });
            if (data.posts.length < 9) {
               setShowMore(false)
            }
         }
      } catch (error) {
         error instanceof Error && console.log(error.message);
      }
   }

   const handleDeletePost = async () => {
      setShowModal(false);
      try {
         const res = await axios.delete(`/api/post/deletepost/${postIdToDelete}/${currentUser?._id}`)
         const data = res.data;
         if (res.statusText == "OK") {
            setUserPosts((prev) => {
               if (prev) {
                  return {
                     ...prev,
                     posts: prev.posts.filter((post) => post._id !== postIdToDelete)
                  };
               }
               return null;
            });
         } else {
            console.log(data.message)
         }
      } catch (e) {
         e instanceof Error && console.log(e.message)
      }
   }

   return (
      <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
         {currentUser?.isAdmin && userPosts?.totalPosts && userPosts?.totalPosts > 0 ? (
            <>
               <Table hoverable className="shadow-md">
                  <Table.Head>
                     <Table.HeadCell>Date updated</Table.HeadCell>
                     <Table.HeadCell>Post Image</Table.HeadCell>
                     <Table.HeadCell>Post title</Table.HeadCell>
                     <Table.HeadCell>Category</Table.HeadCell>
                     <Table.HeadCell>Delete</Table.HeadCell>
                     <Table.HeadCell>
                        <span>Edit</span>
                     </Table.HeadCell>
                  </Table.Head>
                  {
                     userPosts.posts.map((post: IPost, index: number) => (
                        <Table.Body className="divide-y" key={index}>
                           <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                              <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                              <Table.Cell>
                                 <Link to={`/post/${post.slug}`}>
                                    <img
                                       src={post.image}
                                       alt={post.title}
                                       className="w-20 h-10 object-cover bg-gray-500"
                                    />
                                 </Link>
                              </Table.Cell>
                              <Table.Cell>
                                 <Link className="font-medium text-gray-900 dark:text-white" to={`/post/${post.slug}`}>{post.title}</Link>
                              </Table.Cell>
                              <Table.Cell>{post.category}</Table.Cell>
                              <Table.Cell>
                                 <span
                                    className="font-medium text-red-500 hover:underline cursor-pointer"
                                    onClick={() => {
                                       setShowModal(true)
                                       setPostIdToDelete(post._id)
                                    }}
                                 >Delete</span>
                              </Table.Cell>
                              <Table.Cell>
                                 <Link className="text-teal-500 hover:underline" to={`/update-post/${post._id}`} >
                                    <span>Edit</span>
                                 </Link>
                              </Table.Cell>
                           </Table.Row>
                        </Table.Body>
                     ))
                  }
               </Table>
               {
                  showMore && (
                     <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
                        Show more
                     </button>
                  )
               }
            </>
         ) : (
            <p>You have no posts yet!</p>
         )
         }
         <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            popup
            size={'md'}
         >
            <Modal.Header />
            <Modal.Body>
               <div className="text-center">
                  <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                  <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure you want to delete this post?</h3>
               </div>
               <div className="flex justify-center gap-4">
                  <Button color='failure' onClick={handleDeletePost}>
                     Yes, I'm sure
                  </Button>
                  <Button color='gray' onClick={() => setShowModal(false)}>
                     No, cancel
                  </Button>
               </div>
            </Modal.Body>
         </Modal>
      </div >
   )
}

export default DashPosts