import { Link } from "react-router-dom";
import useAuth from "../zustand/useAuth";
import { Alert, Button, Textarea } from "flowbite-react";
import { FormEvent, useEffect, useState } from "react";
import Comment from "./Comment";
import axios from "axios";
interface ICommentSection {
   postId: string;
}

interface IComment {
   _id: string;
   content: string;
   likes: string[];
   numberOfLikes: number;
   postId: string;
   userId: string;
}
const CommentSection = ({ postId }: ICommentSection) => {

   const { currentUser } = useAuth();
   const [comment, setComment] = useState<string>('');
   const [commentError, setCommentError] = useState<string | null>(null);
   const [comments, setComments] = useState([]);

   console.log(comments)

   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();

      if (comment.length > 200) {
         return;
      }

      try {
         console.log('вход в try')
         const res = await axios.post('/api/comment/create', { content: comment, postId, userId: currentUser?._id })
         console.log('не работает')
         if (res.statusText == "OK") {
            setComment('');
            setCommentError(null);
            console.log(res)
         }

      } catch (error) {
         if (error instanceof Error) {
            setCommentError(error.message)
         }
      }
      /* вариант без axios      try {
              const res = await fetch('/api/comment/create', {
                 method: "POST",
                 headers: {
                    'Content-Type': "application/json"
                 },
                 body: JSON.stringify({
                    content: comment,
                    postId,
                    userId: currentUser?._id,
                 })
              });
     
              if (res.ok) {
                 setComment('');
                 setCommentError(null);
              }
           } catch (error) {
              if (error instanceof Error) {
                 setCommentError(error.message)
              }
     
           } */
   }

   useEffect(() => {
      const getComments = async () => {
         try {
            const res = await axios.get(`/api/comment/getPostComments/${postId}`)
            const data = res.data;
            setComments(data);

         } catch (error) {
            error instanceof Error && console.log(error.message)
         }
      }
      getComments();
   }, [postId])

   return (
      <div className="max-w-2xl mx-auto w-full p-3">
         {
            currentUser
               ? (
                  <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
                     <p>Signed in as:</p>
                     <img className={"h-5 w-5 object-cover rounded-full"} src={currentUser.profilePicture} alt="" />
                     <Link to={'/dashboard?tab=profile'} className="text-xs text-cyan-600 hover:underline">
                        @{currentUser.username}
                     </Link>
                  </div>
               )
               : (
                  <div className="text-sm text-teal-500 my-5 flex gap-1">
                     You must be signed in to comment.
                     <Link className="text-blue-500 hover:underline" to={'/sign-in'}>
                        Sign In
                     </Link>
                  </div>
               )
         }
         {
            currentUser && (
               <form onSubmit={handleSubmit} className="border border-teal-500 rounded-md p-3">
                  <Textarea
                     className="resize-none p-4 outline-none focus:border-teal-500 focus:border-2"
                     placeholder="Add a comment..."
                     rows={3}
                     maxLength={200}
                     onChange={(e) => {
                        setComment(e.target.value)
                        commentError !== null && setCommentError(null)
                     }}
                     value={comment}
                  />
                  <div className="flex justify-between items-center mt-5">
                     <p className="text-gray-500 text-xs">{200 - comment.length} characters remaining</p>
                     <Button outline gradientDuoTone={'purpleToBlue'} type='submit'>
                        Submit
                     </Button>
                  </div>
                  {commentError && <Alert color={"failure"} className="mt-5">
                     {commentError}
                  </Alert>
                  }
               </form>

            )
         }
         {
            comments.length === 0
               ? (
                  <p className="text-sm my-5">
                     No comments yet!
                  </p>
               )
               : (
                  <>
                     <div className="text-sm my-5 flex items-center gap-1">
                        <p>Comments</p>
                        <div className="border border-gray-400 py-1 px-2 rounder-sm">
                           <p>{comments.length}</p>
                        </div>
                     </div>
                     {comments.map((comment: IComment) => (
                        <Comment
                           key={comment._id}
                           comment={comment}
                        />
                     )
                     )}
                  </>
               )
         }
      </div>
   )
}

export default CommentSection