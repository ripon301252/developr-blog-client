import React, { useEffect, useState } from "react";
import useAxiosNormal from "../../Hooks/useAxiosNormal";
import { useAuth } from "../../Hooks/useAuth";
import BlogList from "./BlogList";
import BlogDetails from "./BlogDetails";
import Comments from "./Comments";
import Swal from "sweetalert2";

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
    if (!user) {
      return Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to like blogs ❤️",
      });
    }

    try {
      const res = await axiosAllBlogs.patch(`/blogs/${id}/like`, {
        userId: user.email,
      });

      setBlogs((prev) =>
        prev.map((b) => (b._id === id ? { ...b, likes: res.data.likes } : b)),
      );

      if (selectedBlog?._id === id) {
        setSelectedBlog((prev) => ({
          ...prev,
          likes: res.data.likes,
        }));
      }
    } catch (error) {
      Swal.fire("Error!", "Like failed", error);
    }
  };

  // ✅ ADD COMMENT
  const handleComment = async () => {
    if (!user) {
      return Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to comment 💬",
      });
    }

    if (!commentText.trim()) {
      return Swal.fire("Error", "Comment cannot be empty!", "error");
    }

    try {
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

      Swal.fire({
        icon: "success",
        title: "Comment Posted!",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Error!", "Failed to post comment", error);
    }
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto  p-6 text-white">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 🔹 LEFT: BLOG LIST */}
        <div className="space-y-4 col-span-1 bg-white/10 p-5 rounded-xl">
          <BlogList
            blogs={blogs}
            setSelectedBlog={setSelectedBlog}
            handleLike={handleLike}
            user={user}
            selectedBlog={selectedBlog}
          />
        </div>

        {/* 🔹 MIDDLE: BLOG DETAILS */}
        <div className="bg-white/10 p-4 rounded-xl md:col-span-2">
          <h2 className="text-2xl font-bold text-center mb-5">Blog Details</h2>
          {/* <div className="border-b-2 my-2 mx-36"></div> */}
          <BlogDetails
            selectedBlog={selectedBlog}
            handleLike={handleLike}
            setBlogs={setBlogs}
            setSelectedBlog={setSelectedBlog}
            axiosAllBlogs={axiosAllBlogs}
          />
        </div>

        {/* 🔹 RIGHT: COMMENTS */}
        <div className="bg-white/10 p-4 rounded-xl col-span-1">
          <Comments
            selectedBlog={selectedBlog}
            comments={comments}
            commentText={commentText}
            setCommentText={setCommentText}
            handleComment={handleComment}
            setComments={setComments}
            axiosAllBlogs={axiosAllBlogs}
          />
        </div>
      </div>
    </div>
  );
};

export default AllBlogs;
