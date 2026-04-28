
interface CommentRepliesProps{
  parentId: string;
  videoId: string;
}

export const CommentReplies = ({parentId, videoId}: CommentRepliesProps) => {
    return(
        <div>
          Replies!
          </div>
    )
}