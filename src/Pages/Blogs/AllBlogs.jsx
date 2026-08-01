import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useAuth } from "../../Hooks/useAuth";
import BlogList from "./BlogList";
import BlogDetails from "./BlogDetails";
import Comments from "./Comments";
import Swal from "sweetalert2";
import { Info } from "lucide-react";

const AllBlogs = () => {
  const { user, loading } = useAuth();
  const axiosAllBlogs = useAxiosSecure();
  const [blogLoading, setBlogLoading] = useState(true);

  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [viewedBlogs, setViewedBlogs] = useState(() => {
    const saved = localStorage.getItem("viewedBlogs");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ LOAD BLOGS
  useEffect(() => {
    const fetchData = async () => {
      if (loading || !user) return;

      try {
        setBlogLoading(true);

        const res = await axiosAllBlogs.get("/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setBlogLoading(false);
      }
    };

    fetchData();
  }, [user, loading, axiosAllBlogs]);

  // ✅ LOAD COMMENTS
  useEffect(() => {
    if (selectedBlog?._id) {
      axiosAllBlogs
        .get(`/comments/${selectedBlog._id}`)
        .then((res) => setComments(res.data));
    }
  }, [selectedBlog, axiosAllBlogs]);

  useEffect(() => {
    const savedId = localStorage.getItem("selectedBlogId");

    if (savedId && blogs.length > 0) {
      const found = blogs.find((b) => String(b._id) === String(savedId));

      if (found) {
        setSelectedBlog(found);
      }
    }
  }, [blogs]);

  // ✅ LIKE
  const handleLike = async (id) => {
    if (!user) {
      return Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to like blogs",
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
        text: "Please login to comment ",
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

  // handle mark blog
  const handleMarkedBlog = (blog) => {
    setSelectedBlog(blog);

    localStorage.setItem("selectedBlogId", blog._id); // ✅ ADD THIS

    let updated;

    if (viewedBlogs.includes(blog._id)) {
      updated = viewedBlogs.filter((id) => id !== blog._id);
    } else {
      updated = [...viewedBlogs, blog._id];
    }
    setViewedBlogs(updated);
    localStorage.setItem("viewedBlogs", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto py-10 text-white">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 🔹 LEFT: BLOG LIST */}
        <div className="space-y-4 col-span-1 bg-white/10 p-5 rounded-xl">
          <BlogList
            blogs={blogs}
            handleLike={handleLike}
            selectedBlog={selectedBlog}
            viewedBlogs={viewedBlogs}
            handleMarkedBlog={handleMarkedBlog}
          />
        </div>

        {/* 🔹 MIDDLE: BLOG DETAILS */}
        <div className="bg-white/10 p-4 rounded-xl md:col-span-2">
          <h2
            className="
    text-xl md:text-2xl lg:text-3xl
    font-bold text-center mb-6

    flex justify-center items-center gap-3

    bg-gradient-to-r from-green-400 via-emerald-400 to-green-600
    bg-clip-text text-transparent

    backdrop-blur-md
    px-5 py-3 rounded-xl

    border border-green-400/20
    shadow-[0_0_25px_rgba(34,197,94,0.2)]

    w-fit mx-auto
  "
          >
            <span className="p-2 rounded-lg bg-green-500/10 border border-green-400/20 backdrop-blur-md">
              <Info size={24} className="text-green-400" />
            </span>

            <span className="tracking-wide">Blog Details</span>
          </h2>

          <BlogDetails
            selectedBlog={selectedBlog}
            handleLike={handleLike}
            setBlogs={setBlogs}
            setSelectedBlog={setSelectedBlog}
            axiosAllBlogs={axiosAllBlogs}
            loading={blogLoading} 
          />
        </div>

        {/* 🔹 RIGHT: COMMENTS */}
        <div className="bg-white/10 p-4 rounded-xl col-span-1 md:max-h-[799.9px] max-h-[319.9px] overflow-y-auto">
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
