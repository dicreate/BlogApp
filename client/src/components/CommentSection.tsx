interface ICommentSection {
   postId: string;
}
const CommentSection = ({ postId }: ICommentSection) => {

   console.log(postId)

   return (
      <div>CommentSection</div>
   )
}

export default CommentSection