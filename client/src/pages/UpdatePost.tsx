import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { Alert, Button, Select, TextInput } from "flowbite-react"
import { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import useAuth from "../zustand/useAuth";
interface FormData {
   _id?: string;
   image?: string;
   title?: string;
   category?: string;
   content?: string;
}

const UpdatePost = () => {
   const [file, setFile] = useState<File>();
   const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(null);
   const [imageUploadError, setImageUploadError] = useState<string | null>(null);
   const [formData, setFormData] = useState<FormData>({
      title: '',
      category: 'uncategorized',
      content: '',
      image: ''
   });
   const [publishError, setPublishError] = useState<string | null>(null);
   const { postId } = useParams();

   const { currentUser } = useAuth()

   useEffect(() => {
      try {
         const fetchPost = async () => {
            const res = await axios.get(`/api/post/getposts?postId=${postId}`)
            const data = res.data
            if (res.statusText == "OK") {
               setFormData(data.posts[0])
            } else {
               console.log(data.message)
               setPublishError(data.message)
               return;
            }
         }
         fetchPost();
      } catch (e) {
         e instanceof Error && console.log(e.message)
      }
   }, [postId]);

   const navigate = useNavigate();

   const handleUploadImage = async () => {
      try {
         if (!file) {
            setImageUploadError('Please select an image');
            return;
         }
         setImageUploadError(null)
         const storage = getStorage(app);
         const fileName = new Date().getTime() + "-" + file.name;
         const storageRef = ref(storage, fileName)
         const uploadTask = uploadBytesResumable(storageRef, file)

         uploadTask.on(
            'state_changed',
            (snapshot) => {
               const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
               setImageUploadProgress(Number(progress.toFixed(0)));
            },
            (error) => {
               setImageUploadError('Image upload failed');
               setImageUploadProgress(null);
               console.log(error)
            },
            () => {
               getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  setImageUploadProgress(null);
                  setImageUploadError(null);
                  setFormData({ ...formData, image: downloadURL })
               })
            }
         )
      } catch (error) {
         setImageUploadError("Image upload failed")
         setImageUploadProgress(null)
         console.log(error)
      }
   }

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
         const response = await axios.put(`/api/post/updatepost/${formData._id}/${currentUser!._id}`, formData, {
            headers: {
               'Content-Type': 'application/json'
            }
         });

         if (response.status === 200) {
            setPublishError(null);
            navigate(`/post/${response.data.slug}`);
         } else {
            setPublishError(response.data.message);
         }
      } catch (error) {
         if (axios.isAxiosError(error) && error.response) {
            setPublishError(error.response.data.message);
         } else {
            setPublishError("Something went wrong");
         }
      }
   }

   return (
      <div className="p-3 max-w-3xl mx-auto min-h-screen">
         <h1 className="text-center text-3xl my-7 font-semibold">Update post</h1>
         <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
         >
            <div className="flex flex-col gap-4 justify-between">
               <TextInput
                  type="text"
                  placeholder="Title"
                  required id='title'
                  className="flex-1"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  value={formData.title}
               />
               <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
               >
                  <option value="uncategorized">Select a category</option>
                  <option value="javascript">JavaScript</option>
                  <option value="reactjs">React.js</option>
                  <option value="nextjs">Next.js</option>
               </Select>
               <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                  <input
                     type="file"
                     className="file-input file-input-bordered file-input-sm w-full max-w-xs"
                     onChange={(e) => e.target.files && e.target.files.length ? setFile(e.target.files[0]) : null}
                  />
                  <Button
                     type="button"
                     gradientDuoTone={"purpleToBlue"}
                     size="sm" outline
                     onClick={handleUploadImage}
                     disabled={imageUploadProgress !== null}
                  >
                     {
                        imageUploadProgress
                           ? (
                              <div className="w-16 h-16">
                                 <CircularProgressbar
                                    value={imageUploadProgress}
                                    text={`${imageUploadProgress || 0}%`}
                                 />
                              </div>
                           )
                           : "Upload Image"
                     }
                     Upload image
                  </Button>
               </div>
               {imageUploadError && (
                  <Alert color='failure'>
                     {imageUploadError}
                  </Alert>
               )}
               {
                  formData.image && (
                     <img
                        src={formData.image}
                        alt="upload"
                        className="w-full h-72 object-cover"
                     />
                  )
               }
               <ReactQuill
                  theme="snow"
                  value={formData.content}
                  placeholder="Write something..."
                  className="h-72 mb-12"
                  onChange={(value) => {
                     setFormData({ ...formData, content: value })
                  }}
               />
               <Button
                  type="submit"
                  gradientDuoTone={'purpleToPink'}
               >
                  Update
               </Button>
               {
                  publishError && <Alert className="mt-5" color='failure'>{publishError}</Alert>
               }
            </div>
         </form>
      </div>
   )
}

export default UpdatePost