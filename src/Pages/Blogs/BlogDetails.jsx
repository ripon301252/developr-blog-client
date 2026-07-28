import React, { useEffect, useState } from "react";
import { useAuth } from "../../Hooks/useAuth";
import Swal from "sweetalert2";

const BlogDetails = ({
  selectedBlog,
  handleLike,
  setBlogs,
  setSelectedBlog,
  axiosAllBlogs,
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

  if (!selectedBlog) {
    return (
      <p className="text-gray-400/40 text-3xl text-center mt-10">
        {" "}
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
        "warning"
      );

      return;
    }

    const res = await axiosAllBlogs.patch(
      `/blogs/${selectedBlog._id}`,
      editData
    );

    setBlogs((prev) =>
      prev.map((b) =>
        b._id === selectedBlog._id ? res.data : b
      )
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
    Swal.fire(
      "Error!",
      "Update failed",
      error
    );
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
        text: "Blog removed successfully 🗑️",
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
      <div className="mt-4 max-h-[400.9px] overflow-y-auto pr-2">
        <p className="text-gray-200 leading-7 text-sm md:text-base whitespace-pre-wrap break-words text-justify">
          {selectedBlog.content}
        </p>
      </div>

      {/* ❤️ ACTION BAR */}
      <div className="mt-5 flex justify-between items-center border-t border-white/10 pt-3">
        {/* LIKE */}
        <button
          onClick={() => handleLike(selectedBlog._id)}
          className="flex items-center gap-1 text-sm text-gray-300 hover:text-red-400 transition"
        >
          ❤️ <span>{selectedBlog.likes?.length || 0}</span>
        </button>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-3">
          <button
            onClick={handleDeleteBlog}
            disabled={!isOwner}
            className={`px-4 py-1 rounded-lg text-sm transition
      ${
        isOwner
          ? "bg-red-500/30 hover:bg-red-500/50 text-white"
          : "bg-gray-500/20 text-gray-400 cursor-not-allowed"
      }`}
          >
            Delete
          </button>

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
            className={`px-4 py-1 rounded-lg text-sm transition
      ${
        isOwner
          ? "bg-green-500/30 hover:bg-green-500/50 text-white"
          : "bg-gray-500/20 text-gray-400 cursor-not-allowed"
      }`}
          >
            Edit
          </button>
        </div>
      </div>

      {/* 🔥 MODAL */}
      <dialog id="edit_modal" className="modal modal-middle">
        <div className="modal-box bg-white text-black rounded-xl">
          <h3 className="font-bold text-lg mb-3">✏️ Edit Blog</h3>

          <input
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
            className="w-full p-2 border rounded-md mb-2"
            placeholder="Title"
          />

          <textarea
            value={editData.content}
            onChange={(e) =>
              setEditData({ ...editData, content: e.target.value })
            }
            className="w-full p-2 border rounded-md"
            rows="5"
            placeholder="Content"
          />

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => {
                handleUpdate();
                document.getElementById("edit_modal").close();
              }}
              className="px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Save
            </button>

            <button
              className="px-4 py-1 bg-gray-300 rounded-md"
              onClick={() => {
                // setIsEditing(false);
                document.getElementById("edit_modal").close();
              }}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default BlogDetails;
