import { useState } from "react";
import axios from "axios";

interface CommentCreateProps {
  postID: string;
}

const CommentCreate: React.FC<CommentCreateProps> = ({ postID }) => {
  const [content, setContent] = useState<string>("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await axios.post(`http://localhost:4001/posts/${postID}/comments`, {
      content,
    });
    setContent("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>New Comment</label>
          <input
            type="text"
            value={content}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setContent(e.target.value)
            }
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Comment</button>
      </form>
    </div>
  );
};

export default CommentCreate;