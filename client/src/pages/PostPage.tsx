import axios from "axios";
import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface IPost {
   image?: string;
   title?: string;
   category?: string;
   content?: string;
   createdAt?: string;
}

const PostPage = () => {
   const { postSlug } = useParams();
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(false);
   const [post, setPost] = useState<IPost | null>(null);

   useEffect(() => {
      const fetchPost = async () => {
         try {
            setLoading(true);
            const res = await axios.get(`/api/post/getposts?slug=${postSlug}`)
            const data = res.data;

            if (res.statusText === "OK") {
               setPost(data.posts[0]);
               setError(false);
               return;
            } else {
               setError(true);
               return;
            }
         } catch (error) {
            if (error instanceof Error) {
               console.log(error)
               setError(true);
            }
         } finally {
            setLoading(false)
         }

      }
      fetchPost();

   }, [postSlug])

   if (loading) return (
      <div className="flex justify-center items-center min-h-screen">
         <Spinner size="xl" />
      </div>
   )
   return (
      !error
         ?
         <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
            <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">{post && post.title}</h1>
            <Link
               to={`/search?category=${post && post.category}`}
               className="self-center mt-5"
            >
               <Button color="gray" pill size="xs">{post && post.category}</Button>
            </Link>
            <img
               src={post && post.image ? post.image : undefined} alt={post && post.title ? post.title : undefined}
               className="mt-10 p-3 max-h-[600px] w-full object-cover"
            />
            <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-4xl text-xs">
               <span>{post && post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}</span>
               <span className="italic">{post && post.content && Math.ceil(post.content.length / 1000)} mins read</span>
            </div>
            <div className="p-3 max-w-4xl mx-auto w-full post-content" dangerouslySetInnerHTML={{ __html: post?.content || '' }}>
            </div>
         </main>
         : <div>Something went wrong!</div>
   )
}

export default PostPage