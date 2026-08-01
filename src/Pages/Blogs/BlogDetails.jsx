import React, { useEffect, useState } from "react";
import { useAuth } from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import { PenLine, Trash2, ThumbsUp, PenLineIcon } from "lucide-react";

const BlogDetails = ({
  selectedBlog,
  handleLike,
  setBlogs,
  setSelectedBlog,
  axiosAllBlogs,
  loading,
}) => {
  const { user } = useAuth();

  const [editData, setEditData] = useState({
    title: "",
    content: "",
  });

  const isOwner = user?.email === selectedBlog?.authorEmail;

  useEffect(() => {
    if (selectedBlog) {
      setEditData({
        title: selectedBlog.title,
        content: selectedBlog.content,
      });
    }
  }, [selectedBlog]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-bars loading-xl"></span>
      </div>
    );
  }

  if (!selectedBlog) {
    return (
      <p className="text-gray-400/40 text-3xl text-center mt-10">
        Select a blog
      </p>
    );
  }

  // ✅ UPDATE BLOG
  const handleUpdate = async () => {
    try {
      // ✅ Check no changes
      if (
        editData.title === selectedBlog.title &&
        editData.content === selectedBlog.content
      ) {
        Swal.fire(
          "No Changes!",
          "Please update something before saving.",
          "warning",
        );

        return;
      }

      const res = await axiosAllBlogs.patch(
        `/blogs/${selectedBlog._id}`,
        editData,
      );

      setBlogs((prev) =>
        prev.map((b) => (b._id === selectedBlog._id ? res.data : b)),
      );

      setSelectedBlog(res.data);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Blog updated successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Error!", "Update failed", error);
    } finally {
      document.getElementById("edit_modal")?.close();
    }
  };

  // ✅ DELETE BLOG
  const handleDeleteBlog = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This blog will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosAllBlogs.delete(`/blogs/${selectedBlog._id}`);

      setBlogs((prev) => prev.filter((b) => b._id !== selectedBlog._id));

      setSelectedBlog(null);

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Blog removed successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Error!", "Delete failed", error);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl col-span-2 border border-white/10 shadow-lg">
      {/* 🔥 HEADER */}
      <div className="flex md:flex-row flex-col items-center gap-4 mb-4">
        {/* 🖼 AVATAR IMAGE */}
        <img
          src={selectedBlog.image}
          alt=""
          className="w-10 h-10 rounded-full object-cover ring-2 ring-green-400 ring-offset-2 ring-offset-black"
        />

        {/* TITLE */}
        <div>
          <h2 className="text-lg md:text-xl text-center md:text-left font-semibold text-white">
            {selectedBlog.title}
          </h2>
          <p className="md:text-sm md:text-left text-center text-gray-400">
            {selectedBlog.authorName || "Unknown"}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-4 max-h-[400.9px] overflow-y-auto pr-2 hide-scrollbar">
        <p className="text-gray-200 leading-7 text-sm md:text-base whitespace-pre-wrap break-words text-justify">
          {selectedBlog.content}
        </p>
      </div>

      {/* ❤️ ACTION BAR */}
      <div className="mt-5 flex justify-between items-center border-t border-white/10 pt-3">
        {/* LIKE */}
        <button
          onClick={() => handleLike(selectedBlog._id)}
          className="
    flex items-center gap-2
    px-4 py-1.5
    rounded-full
    bg-white/10 backdrop-blur-md
    border border-white/20
    text-gray-200 text-sm
    hover:shadow-[0_0_12px_rgba(248,113,113,0.5)]
    hover:scale-105 active:scale-95
    transition duration-300 cursor-pointer
  "
        >
          <ThumbsUp size={16} />
          <span className="font-medium">{selectedBlog.likes?.length || 0}</span>
        </button>

        {/* BUTTONS */}
        <div className="flex items-center gap-2">
          {/* DELETE BUTTON */}
          <button
            onClick={handleDeleteBlog}
            disabled={!isOwner}
            className={`
      flex items-center justify-center
      w-9 h-9 rounded-lg
      backdrop-blur-md border
      transition duration-300
      
      ${
        isOwner
          ? "bg-red-500/10 border-red-400/30 text-red-400 hover:bg-red-500/20 hover:shadow-[0_0_12px_rgba(239,68,68,0.5)] cursor-pointer"
          : "bg-gray-500/10 border-gray-400/20 text-gray-400 cursor-not-allowed "
      }
    `}
          >
            <Trash2 size={16} />
          </button>

          {/* EDIT BUTTON */}
          <button
            onClick={() => {
              if (!isOwner) {
                return Swal.fire(
                  "Oops!",
                  "You can't edit this blog",
                  "warning",
                );
              }

              document.getElementById("edit_modal").showModal();
            }}
            disabled={!isOwner}
            className={`
      flex items-center justify-center
      w-9 h-9 rounded-lg
      backdrop-blur-md border
      transition duration-300 

      ${
        isOwner
          ? "bg-green-500/10 border-green-400/30 text-green-400 hover:bg-green-500/20 hover:shadow-[0_0_12px_rgba(34,197,94,0.5)] cursor-pointer"
          : "bg-gray-500/10 border-gray-400/20 text-gray-400 cursor-not-allowed"
      }
    `}
          >
            <PenLine size={16} />
          </button>
        </div>
      </div>

      {/* 🔥 MODAL */}
      <dialog id="edit_modal" className="modal modal-middle">
        <div
          className="
      modal-box 
      w-full max-w-lg
      bg-white/10 backdrop-blur-xl
      border border-green-400/20
      shadow-[0_0_40px_rgba(34,197,94,0.25)]
      text-white 
      rounded-2xl
    "
        >
          {/* Title */}
          <h3 className="font-bold text-xl mb-4 flex items-center gap-3 text-green-400">
            <PenLineIcon />
            <span className="">Edit Blog</span>
          </h3>

          {/* Title Input */}
          <input
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
            className="
        w-full p-3 mb-3
        bg-white/10
        border border-green-400/20
        rounded-lg
        focus:outline-none
        focus:ring-2 focus:ring-green-400
        placeholder-gray-300
      "
            placeholder="Enter blog title..."
          />

          {/* Content */}
          <textarea
            value={editData.content}
            onChange={(e) =>
              setEditData({ ...editData, content: e.target.value })
            }
            rows="5"
            className="
        w-full p-3
        bg-white/10
        border border-green-400/20
        rounded-lg
        focus:outline-none
        focus:ring-2 focus:ring-green-400
        placeholder-gray-300
      "
            placeholder="Write your content..."
          />

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
            {/* Save */}
            <button
              onClick={() => {
                handleUpdate();
                document.getElementById("edit_modal").close();
              }}
              className="
          px-5 py-2
          bg-gradient-to-r from-green-400 to-emerald-500
          hover:from-green-500 hover:to-emerald-600
          text-white font-semibold
          rounded-lg
          shadow-lg shadow-green-500/30
          transition duration-300 cursor-pointer
        "
            >
              Save Changes
            </button>

            {/* Close */}
            <button
              onClick={() => document.getElementById("edit_modal").close()}
              className="
          px-5 py-2
          bg-white/10
          border border-white/20
          hover:bg-white/20
          rounded-lg
          transition duration-300 cursor-pointer
        "
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default BlogDetails;
