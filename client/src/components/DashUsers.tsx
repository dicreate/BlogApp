import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../zustand/useAuth";
import { Button, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

interface IUser {
   _id: string;
   username: string;
   email: string;
   profilePicture: string;
   isAdmin: boolean;
   updatedAt: string;
   createdAt: string;
}
interface IUsersInfo {
   totalUsers: number;
   lastMonthUsers: number;
   users: IUser[]
}
const DashUsers = () => {
   const { currentUser } = useAuth();
   const [usersInfo, setUsersInfo] = useState<IUsersInfo | null>(null);
   const [showMore, setShowMore] = useState(true);
   const [showModal, setShowModal] = useState(false);
   const [userIdToDelete, setUserIdToDelete] = useState('');

   useEffect(() => {
      const fetchUsers = async () => {
         try {
            const response = await axios.get(`/api/user/getusers`);
            const data = response.data;
            if (response.statusText == "OK") {
               setUsersInfo(data)
               if (data.users.length < 9) {
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
         fetchUsers();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [currentUser?._id])

   const handleShowMore = async (): Promise<void> => {
      const startIndex = usersInfo?.users.length;
      try {
         const res = await axios.get(`/api/user/getusers?startIndex=${startIndex}`);
         const data = res.data;
         if (res.statusText === "OK") {
            setUsersInfo(prev => {
               if (prev) {
                  return {
                     ...prev,
                     users: [...prev.users, ...data.users],
                     totalUsers: data.totalUsers,
                     lastMonthUsers: data.lastMonthUsers
                  };
               }
               return null;
            });
            if (data.users.length < 9) {
               setShowMore(false)
            }
         }
      } catch (error) {
         error instanceof Error && console.log(error.message);
      }
   }

   const handleDeleteUser = async () => {
      setShowModal(false);
      try {
         const res = await axios.delete(`/api/user/deleteuser/${userIdToDelete}/${currentUser?._id}`)
         const data = res.data;
         if (res.statusText == "OK") {
            setUsersInfo((prev) => {
               if (prev) {
                  return {
                     ...prev,
                     users: prev.users.filter((user) => user._id !== userIdToDelete)
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
         {currentUser?.isAdmin && usersInfo?.totalUsers && usersInfo?.totalUsers > 0 ? (
            <>
               <Table hoverable className="shadow-md">
                  <Table.Head>
                     <Table.HeadCell>Date created</Table.HeadCell>
                     <Table.HeadCell>User Image</Table.HeadCell>
                     <Table.HeadCell>Username</Table.HeadCell>
                     <Table.HeadCell>Email</Table.HeadCell>
                     <Table.HeadCell>Admin</Table.HeadCell>
                     <Table.HeadCell>Delete</Table.HeadCell>
                  </Table.Head>
                  {
                     usersInfo.users.map((user: IUser, index: number) => (
                        <Table.Body className="divide-y" key={index}>
                           <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                              <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                              <Table.Cell>
                                 <img
                                    src={user.profilePicture}
                                    alt={user.username}
                                    className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                                 />
                              </Table.Cell>
                              <Table.Cell>
                                 {user.username}
                              </Table.Cell>
                              <Table.Cell>{user.email}</Table.Cell>
                              <Table.Cell>{user.isAdmin ? (<FaCheck className="text-green-500" />) : (<FaTimes className="text-red-500" />)}</Table.Cell>
                              <Table.Cell>
                                 <span
                                    className="font-medium text-red-500 hover:underline cursor-pointer"
                                    onClick={() => {
                                       setShowModal(true)
                                       setUserIdToDelete(user._id)
                                    }}
                                 >Delete</span>
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
            <p>You have no users yet!</p>
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
                  <Button color='failure' onClick={handleDeleteUser}>
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

export default DashUsers