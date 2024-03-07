import { Alert, Button, TextInput } from "flowbite-react"
import useAuth from "../zustand/useAuth"
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
const DashProfile = () => {
   const { currentUser } = useAuth();
   const [imageFile, setImageFile] = useState<File | null>(null);
   const [imageFileUrl, setImageFileUrl] = useState('');
   const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState<string | null>(null);
   const [imageFileUploadingError, setImageFileUploadingError] = useState<string | null>(null);
   console.log(imageFileUploadingProgress, imageFileUploadingError)
   const filePickerRef = useRef<HTMLInputElement | null>(null);

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
         const file = e.target.files[0];
         setImageFile(file);
         setImageFileUrl(URL.createObjectURL(file));
      }
   }

   useEffect(() => {
      if (!imageFile) return;

      const uploadImage = () => {
         const storage = getStorage(app);
         const fileName = new Date().getTime() + imageFile!.name;
         const storageRef = ref(storage, fileName);
         const uploadTask = uploadBytesResumable(storageRef, imageFile!);
         uploadTask.on(
            "state_changed",
            (snapshot) => {
               const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
               setImageFileUploadingProgress(progress.toFixed(0));
            },
            (error) => {
               setImageFileUploadingError(`Could not upload image (File must be less than 2MB). \n ${error}`);
            },
            () => {
               getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  setImageFileUrl(downloadURL);
               })
            }
         )
      }

      uploadImage();
   }, [imageFile])



   return (
      <div className="max-w-lg mx-auto p-3 w-full">
         <h1 className="my-7 text-center font-semibold text-3xl">profile</h1>
         <form className="flex flex-col gap-4">
            <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
            <div
               className="w-32 h-32 self-center cursor-pointer shadow-xl overflow-hidden rounded-full"
               onClick={() => filePickerRef.current?.click()}
            >
               <img src={imageFileUrl || currentUser?.profilePicture} alt="user" className="rounded-full w-full h-full border-8 border-[lightgray] object-cover" />
            </div>
            {imageFileUploadingError && (
               <Alert color="failure">
                  {imageFileUploadingError}
               </Alert>
            )
            }
            <TextInput type='text' id='username' placeholder="username" defaultValue={currentUser?.username} />
            <TextInput type='email' id='email' placeholder="email" defaultValue={currentUser?.email} />
            <TextInput type='password' id='password' placeholder="password" />
            <Button type='submit' gradientDuoTone='purpleToBlue'>
               Update
            </Button>
         </form>
         <div className="text-red-500 flex justify-between mt-5">
            <span className="cursor-pointer">Delete Account</span>
            <span className="cursor-pointer">Sign Out</span>
         </div>
      </div>
   )
}

export default DashProfile
