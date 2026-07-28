import React, { useEffect, useState } from "react";
import useAxiosNormal from "../../Hooks/useAxiosNormal";
import { useAuth } from "../../Hooks/useAuth";
import BlogList from "./BlogList";
import BlogDetails from "./BlogDetails";
import Comments from "./Comments";

const AllBlogs = () => {
  const { user } = useAuth();
  const axiosAllBlogs = useAxiosNormal();

  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  // ✅ LOAD BLOGS
  useEffect(() => {
    axiosAllBlogs.get("/blogs").then((res) => setBlogs(res.data));
  }, [axiosAllBlogs]);

  // ✅ LOAD COMMENTS
  useEffect(() => {
    if (selectedBlog?._id) {
      axiosAllBlogs
        .get(`/comments/${selectedBlog._id}`)
        .then((res) => setComments(res.data));
    }
  }, [selectedBlog, axiosAllBlogs]);

  // ✅ LIKE
  const handleLike = async (id) => {
    if (!user) return alert("Login first");

    const res = await axiosAllBlogs.patch(`/blogs/${id}/like`, {
      userId: user.email,
    });

    // update blogs list
    setBlogs((prev) =>
      prev.map((b) => (b._id === id ? { ...b, likes: res.data.likes } : b)),
    );

    // update selected blog
    if (selectedBlog?._id === id) {
      setSelectedBlog((prev) => ({
        ...prev,
        likes: res.data.likes,
      }));
    }
  };

  // ✅ ADD COMMENT
  const handleComment = async () => {
    if (!user) return alert("Login first");

    await axiosAllBlogs.post("/comments", {
      blogId: selectedBlog._id,
      text: commentText,
      userName: user.displayName,
      userEmail: user.email,
    });

    setCommentText("");

    // reload comments
    const res = await axiosAllBlogs.get(`/comments/${selectedBlog._id}`);
    setComments(res.data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#02140f] to-[#064e3b] p-6 text-white">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 🔹 LEFT: BLOG LIST */}
        <div className="space-y-4 col-span-1">
        
          <BlogList
            blogs={blogs}
            setSelectedBlog={setSelectedBlog}
            handleLike={handleLike}
            user={user}
          />
        </div>

        {/* 🔹 MIDDLE: BLOG DETAILS */}
        <div className="bg-white/10 p-4 rounded-xl col-span-2">
          <BlogDetails selectedBlog={selectedBlog} handleLike={handleLike} />
        </div>

        {/* 🔹 RIGHT: COMMENTS */}
        <div className="bg-white/10 p-4 rounded-xl col-span-1">
          <Comments
            selectedBlog={selectedBlog}
            comments={comments}
            commentText={commentText}
            setCommentText={setCommentText}
            handleComment={handleComment}
          />
        </div>
      </div>
    </div>
  );
};

export default AllBlogs;
