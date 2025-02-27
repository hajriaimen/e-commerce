import React from "react";

export interface Comment {
  id: string;
  content: string;
  status: string
}

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {

  const renderedComments = comments.map((comment) => {
    let content;
    switch (comment.status) {
      case "pending":
        content = "This comment is awaiting moderation.";
        break;
      case "rejected":
        content = "This comment has been rejected.";
        break;
      case "approved":
      default:
        content = comment.content;
        break;
    }
    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;};

export default CommentList;