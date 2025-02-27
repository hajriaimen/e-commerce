import { useState, useEffect } from "react";
import axios from "axios";
import CommentCreate from "./CommentCreate";
import CommentList, {Comment} from "./CommentList";

interface Post {
  id: string;
  title: string;
  comments: Comment[]
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<{ [key: string]: Post }>({});

  const fetchPosts = async () => {
    const response = await axios.get<{ [key: string]: Post }>("http://localhost:4002/posts");
    console.log(response.data);
    setPosts(response.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderedPosts = Object.values(posts).map((post) => {
    return (
      <div className="card" style={{ width: "30%", marginBottom: "20px" }} key={post.id}>
        <h3 className="card-body">{post.title}</h3>
        <CommentList comments={post.comments}/>
        <CommentCreate postID={post.id} />
      </div>
    );
  });

  return <div className="d-flex flex-row flex-wrap justify-content-between">{renderedPosts}</div>;
};

export default PostList;
