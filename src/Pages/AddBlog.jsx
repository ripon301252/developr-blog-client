import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../Hooks/useAuth";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import logoImg from "../assets/logo.png";
import { PenLine, Send } from "lucide-react";


const AddBlog = () => {
  const { user, loading, setLoading } = useAuth();
  const axiosAddBlog = useAxiosSecure();
  

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
  });

  // 🔥 Auto set image
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      image: user?.photoURL || "https://i.ibb.co/5Y3m33n/default-blog.jpg",
    }));
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      return Swal.fire({
        icon: "error",
        title: "Login Required",
        text: "Please login first!",
      });
    }

    if (!formData.title.trim()) {
      return Swal.fire("Error", "Title is required!", "error");
    }

    if (!formData.content.trim()) {
      return Swal.fire("Error", "Content is required!", "error");
    }

    // 🔥 Simple word count
    const words = formData.content.trim().split(" ");
    const wordCount = words.filter((word) => word !== "").length;

    if (wordCount < 150) {
      return Swal.fire(
        "Too Short",
        "Blog must be at least 150 words!",
        "warning",
      );
    }

    if (wordCount > 300) {
      return Swal.fire(
        "Limit Exceeded",
        "Blog must be within 600 words!",
        "warning",
      );
    }

    const blogData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      image: formData.image,
      authorName: user?.displayName || "Anonymous",
      authorEmail: user?.email,
      likes: [],
      comments: [],
      createdAt: new Date(),
    };

    try {
      setLoading(true);

      const res = await axiosAddBlog.post("/blogs", blogData);

      if (res.status === 200 || res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Published!",
          text: "Blog Published Successfully!",
          timer: 2000,
          showConfirmButton: false,
        });

        setFormData({
          title: "",
          content: "",
          image: user?.photoURL || "https://i.ibb.co/5Y3m33n/default-blog.jpg",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.error || "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  const words = formData.content.trim().split(" ").filter(Boolean);
  const wordCount = words.length;

  const maxWords = 300;
  const minWords = 150;

  const remaining = maxWords - wordCount;


  
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-white">
      <h2
        className="
    text-xl md:text-3xl lg:text-4xl
    font-bold mb-8
    flex justify-center items-center gap-3

    text-cyan-300
    bg-gradient-to-r from-cyan-400 via-cyan-400 to-cyan-600
    bg-clip-text text-transparent

    backdrop-blur-md
    px-6 py-3 rounded-xl

    border border-cyan-400/30
    shadow-[0_0_12px_rgba(20,184,166,0.35)]

    w-fit mx-auto
  "
      >
        <span className="p-2 rounded-lg bg-cyan-500/10 backdrop-blur-md border border-cyan-400/20">
          <PenLine size={26} className="text-cyan-400" />
        </span>

        <span className="tracking-wide">Create New Blog</span>
      </h2>

      <div className="flex md:flex-row flex-col-reverse  justify-between items-center gap-5">
        {/* LEFT - FORM */}
        <div
          className="
    bg-gradient-to-br from-cyan-500/10 via-cyan-500/10 to-cyan-700/10
    backdrop-blur-xl
    p-6 md:p-8
    rounded-2xl
    shadow-[0_0_12px_rgba(20,184,166,0.35)]
    border border-cyan-400/20
    flex-1
  "
        >
          {/* User Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <img
                src={user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 border-cyan-400 object-cover"
                alt="user"
              />
              <span className="absolute inset-0 rounded-xl bg-cyan-400/20 blur-md"></span>
            </div>

            <div>
              <p className="font-semibold text-base md:text-lg text-white">
                {user?.displayName || "Guest"}
              </p>
              <p className="text-xs md:text-sm text-gray-300">
                {user?.email || "Not logged in"}
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <input
              type="text"
              name="title"
              placeholder="Blog Title..."
              value={formData.title}
              onChange={handleChange}
              className="
        w-full p-3 rounded-xl
        bg-white/5
        border border-cyan-400/20
        text-white placeholder-gray-400
        focus:outline-none focus:border-cyan-400
        focus:shadow-[0_0_15px_rgba(34,197,94,0.3)]
        transition
      "
            />

            {/* Content */}
            <textarea
              name="content"
              placeholder="Write your blog..."
              value={formData.content}
              onChange={handleChange}
              rows="5"
              className="
        w-full p-3 rounded-xl
        bg-white/5
        border border-cyan-400/20
        text-white placeholder-gray-400
        focus:outline-none focus:border-cyan-400
        focus:shadow-[0_0_15px_rgba(34,197,94,0.3)]
        transition
      "
            />

            {/* Image */}
            <input
              type="text"
              name="image"
              value={formData.image}
              readOnly
              className="
        w-full p-3 rounded-xl
        bg-white/5 border border-gray-500/30
        text-gray-400 cursor-not-allowed
      "
            />

            <p
              className={`text-sm mt-1 ml-1 ${
                wordCount > maxWords
                  ? "text-red-400"
                  : wordCount < minWords
                    ? "text-yellow-400/80"
                    : "text-cyan-400/80"
              }`}
            >
              Words: {wordCount} / {minWords}–{maxWords} | Remaining:{" "}
              {remaining >= 0 ? remaining : 0}
              <span className="ml-2">
                {wordCount < minWords && "(Too short)"}
                {wordCount > maxWords && "(Too long)"}
                {wordCount >= minWords && wordCount <= maxWords && "(Perfect)"}
              </span>
            </p>

            {/* Button */}
            <button
              type="submit"
              disabled={loading || wordCount < minWords || wordCount > maxWords}
              className="
        w-full py-3 rounded-xl font-semibold
        bg-gradient-to-r from-cyan-400/40 to-cyan-600/40
        text-white cursor-pointer
        hover:scale-[1.02]
        hover:shadow-[0_0_12px_rgba(20,184,166,0.35)]
        transition-all duration-200
        flex justify-center items-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
      "
            >
              {loading ? (
                <span className="animate-pulse">Publishing...</span>
              ) : (
                <>
                  <Send />
                  Publish Blog
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT - IMAGE */}
        <div className="flex-[1.2] justify-center">
          <img
            src={logoImg}
            alt="logo"
            className="md:h-[550px] rounded-2xl object-center"
          />
        </div>
      </div>
    </div>
  );
};

export default AddBlog;
