import { Alert, Button, Modal, TextInput } from "flowbite-react"
import useAuth from "../zustand/useAuth"
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { Link } from "react-router-dom";

interface IForm {
   username?: string,
   password?: string,
   email?: string,
   profilePicture?: string,
}

const DashProfile = () => {
   const { currentUser, setLoading, setErrorMessage, setCurrentUser, errorMessage, loading } = useAuth();
   const [imageFile, setImageFile] = useState<File | null>(null);
   const [imageFileUrl, setImageFileUrl] = useState<string | null>('');
   const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState<number | null>(null);
   const [imageFileUploadingError, setImageFileUploadingError] = useState<string | null>(null);
   const [imageFileUploading, setImageFileUploading] = useState<boolean>(false);
   const [updateUserSuccess, setUpdateUserSuccess] = useState<null | string>(null);
   const [updatedUserError, setUpdateUserError] = useState<string | null>(null);
   const [formData, setFormData] = useState<IForm>({})
   const [showModal, setShowModal] = useState<boolean>(false);

   const filePickerRef = useRef<HTMLInputElement | null>(null);

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
         const file = e.target.files[0];
         setImageFile(file);
         setImageFileUrl(URL.createObjectURL(file));
      }
   }

   const handleDeleteUser = async () => {
      setShowModal(false);
      try {
         setLoading(true);
         setErrorMessage(null);
         const res = await fetch(`/api/user/delete/${currentUser?._id}`, {
            method: "DELETE",
         })

         const data = await res.json();

         if (!res.ok) {
            setErrorMessage(data)
         } else {
            setCurrentUser(null)
            setErrorMessage(null)
         }

      } catch (error) {
         if (error instanceof Error) {
            setErrorMessage(error.message)
         }
      } finally {
         setLoading(false)
      }
   };

   useEffect(() => {
      if (!imageFile) return;

      const uploadImage = () => {
         setImageFileUploading(true);
         setImageFileUploadingError(null);
         const storage = getStorage(app);
         const fileName = new Date().getTime() + imageFile!.name;
         const storageRef = ref(storage, fileName);
         const uploadTask = uploadBytesResumable(storageRef, imageFile!);
         uploadTask.on(
            "state_changed",
            (snapshot) => {
               const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
               setImageFileUploadingProgress(Number(progress.toFixed(0)));
            },
            (error) => {
               setImageFileUploadingError(`Could not upload image (File must be less than 2MB). \n ${error}`);
               setImageFileUploadingProgress(null);
               setImageFile(null);
               setImageFileUrl(null);
               setImageFileUploading(false);
            },
            () => {
               getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  setImageFileUrl(downloadURL);
                  setFormData({ ...formData, profilePicture: downloadURL })
                  setImageFileUploading(false);
               })
            }
         )
      }

      uploadImage();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [imageFile])

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.id]: e.target.value })
   }

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

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setUpdateUserError(null);
      setUpdateUserSuccess(null);

      if (imageFileUploading) {
         setUpdateUserError('Please wait for image to upload')
         return;
      }

      if (Object.keys(formData).length === 0) {
         setUpdateUserError('No changes made')
         return;
      }

      try {
         setLoading(true);
         setErrorMessage(null);

         if (formData.username?.trim() === '' || formData.email?.trim() === '' || formData.password?.trim() === '') {
            setErrorMessage('Fields cannot be empty')
            setUpdateUserError('Fields cannot be empty')
            return
         }

         const res = await fetch(`/api/user/update/${currentUser?._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
         })

         const data = await res.json()


         if (!res.ok) {
            setErrorMessage(data.message)
            setUpdateUserError(data.message)
            console.log(data)
         } else {
            setCurrentUser(data)
            setErrorMessage(null)
            setUpdateUserSuccess("User's profile updated successfully")
         }

      } catch (error) {
         setErrorMessage(String(error))
         setUpdateUserError(String(error))
      }
      finally {
         setLoading(false);
      }
   }

   return (
      <div className="max-w-lg mx-auto p-3 w-full">
         <h1 className="my-7 text-center font-semibold text-3xl">profile</h1>
         <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
            <div
               className="w-32 h-32 self-center cursor-pointer shadow-xl overflow-hidden rounded-full relative"
               onClick={() => filePickerRef.current?.click()}
            >
               {imageFileUploadingProgress && (
                  <CircularProgressbar
                     value={imageFileUploadingProgress || 0}
                     text={`${imageFileUploadingProgress}%`}
                     strokeWidth={5}
                     styles={{
                        root: {
                           width: '100%',
                           height: "100%",
                           position: 'absolute',
                           top: 0,
                           left: 0,
                        },
                        path: {
                           stroke: `rgba(62,152,199, ${imageFileUploadingProgress / 100})`
                        }
                     }}
                  />
               )}
               <img
                  src={imageFileUrl || currentUser?.profilePicture}
                  alt="user"
                  className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover ${imageFileUploadingProgress && imageFileUploadingProgress < 100 && 'opacity-60'}`} />
            </div>
            {imageFileUploadingError && (
               <Alert color="failure">
                  {imageFileUploadingError}
               </Alert>
            )
            }
            <TextInput
               type='text'
               id='username'
               placeholder="username"
               defaultValue={currentUser?.username}
               onChange={handleChange}
            />
            <TextInput
               type='email'
               id='email'
               placeholder="email"
               defaultValue={currentUser?.email}
               onChange={handleChange}
            />
            <TextInput
               type='password'
               id='password'
               placeholder="password"
               onChange={handleChange}
            />
            <Button type='submit' gradientDuoTone='purpleToBlue' disabled={loading || imageFileUploading}>
               {loading || imageFileUploading ? "Loading..." : "Update"}
            </Button>
            {
               currentUser?.isAdmin && (
                  <Link to={'/create-post'}>
                     <Button
                        type="button"
                        gradientDuoTone={'pinkToOrange'}
                        className="w-full"
                     >
                        Create a post
                     </Button>
                  </Link>
               )
            }
         </form>
         <div className="text-red-500 flex justify-between mt-5">
            <span onClick={() => setShowModal(true)} className="cursor-pointer">Delete Account</span>
            <span onClick={handleSignout} className="cursor-pointer">Sign Out</span>
         </div>
         {updateUserSuccess && (
            <Alert color={'success'} className="mt-5">
               {updateUserSuccess}
            </Alert>
         )}
         {
            updatedUserError && (
               <Alert color="failure" className="mt-5">
                  {updatedUserError}
               </Alert>
            )
         }
         {
            errorMessage && (
               <Alert color="failure" className="mt-5">
                  {errorMessage}
               </Alert>
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
                  <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure you want to delete your account ?</h3>
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
      </div>
   )
}

export default DashProfile
