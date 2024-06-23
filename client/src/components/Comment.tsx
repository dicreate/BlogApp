import React, { useEffect } from 'react';

interface IComment {
   _id: string;
   content: string;
   likes: string[];
   numberOfLikes: number;
   postId: string;
   userId: string;
}

interface ICommentProps {
   comment: IComment;
}

const Comment: React.FC<ICommentProps> = ({ comment }) => {
   useEffect(() => {

   }, [comment]);

   return (
      <div>{comment.content}</div>
   )
}

export default Comment