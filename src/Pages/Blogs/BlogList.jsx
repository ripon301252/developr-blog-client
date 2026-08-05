import { NotebookTabs, PenLine, ThumbsUp, Trash2 } from "lucide-react";
import React, { useState } from "react";
import Swal from "sweetalert2";

const BlogList = ({
  blogs,
  handleLike,
  selectedBlog,
  viewedBlogs,
  handleMarkedBlog,
  user,
  handleDeleteBlog,
  setBlogs,
  axiosAllBlogs,
  setSelectedBlog,
  blogLoading,
}) => {
  const [editingBlog, setEditingBlog] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    content: "",
  });

  const [expandedBlogs, setExpandedBlogs] = useState([]);
  const [updating, setUpdating] = useState(false);

  const toggleExpand = (id) => {
    setExpandedBlogs((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
    );
  };

  const handleUpdate = async () => {
    if (!editingBlog) return;

    setUpdating(true);
    try {
      if (
        editData.title === editingBlog.title &&
        editData.content === editingBlog.content
      ) {
        return Swal.fire(
          "No Changes!",
          "Please update something before saving.",
          "warning",
        );
      }

      const res = await axiosAllBlogs.patch(
        `/blogs/${editingBlog._id}`,
        editData,
      );

      setBlogs((prev) =>
        prev.map((b) => (b._id === editingBlog._id ? res.data : b)),
      );

      if (selectedBlog?._id === editingBlog._id) {
        setSelectedBlog(res.data);
      }

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Blog updated successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      setEditingBlog(null);
    } catch (error) {
      console.log(error);
      Swal.fire("Error!", "Update failed", "error");
    } finally {
      setUpdating(false);
      document.getElementById("edit_modal")?.close();
    }
  };

  return (
    <div className="space-y-4 max-h-[699.9px] overflow-y-auto hide-scrollbar">
      {/* HEADER */}
      <div
        className="
bg-green-500/10 backdrop-blur-md
px-6 py-3 rounded-xl
border border-green-400/20
shadow-[0_0_20px_rgba(34,197,94,0.2)]
w-full mx-auto sticky top-0 z-20
"
      >
        <h2
          className="
  text-2xl md:text-3xl lg:text-4xl
  font-bold flex justify-center items-center gap-3 py-1
  bg-gradient-to-r from-green-400 via-emerald-400 to-green-600
  bg-clip-text text-transparent
  "
        >
          <NotebookTabs size={26} className="text-green-400" />
          Blogs <span className="text-xs mt-4">({blogs.length})</span>
        </h2>
      </div>

      {/* BLOG LIST */}
      {blogLoading ? (
        <div className="flex justify-center items-center">
          <span className="loading loading-bars loading-xl"></span>
        </div>
      ) : (
        blogs.map((blog) => {
          const isOwner = user?.email === blog.authorEmail;
          const words = blog.content.split(" ");
          const isLong = words.length > 100;
          const isExpanded = expandedBlogs.includes(blog._id);
          const isLiked = blog.likes?.includes(user?.email);

          return (
            <div
              key={blog._id}
              onClick={() => {
                setSelectedBlog(blog);
                localStorage.setItem("selectedBlog", JSON.stringify(blog)); // ✅ ADD THIS
                document
                  .getElementById("comments-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }} // ✅ ADD THIS LINE
              className={`
              bg-gradient-to-br from-white/5 to-white/0
              border backdrop-blur-md rounded-xl p-4 shadow-md
              hover:bg-white/10 transition-all duration-300 cursor-pointer

              ${
                selectedBlog?._id === blog._id
                  ? "border-green-400 bg-green-500/10"
                  : "border-white/10"
              }
            `}
            >
              {/* TOP */}
              <div className="flex items-center gap-3 mb-3">
                {/* IMAGE */}
                <img
                  src={blog.image}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover border border-green-400/20"
                />

                {/* TEXT AREA */}
                <div className="flex-1 min-w-0">
                  {/* TITLE + BADGE */}
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-white text-sm md:text-base truncate">
                      {blog.title}
                    </h3>

                    {selectedBlog?._id === blog._id && (
                      <span
                        className="
            text-xs text-green-400
            bg-green-500/10
            px-3 py-1 rounded-full
            border border-green-400/20
            whitespace-nowrap
          "
                      >
                        Viewing
                      </span>
                    )}
                  </div>

                  {/* AUTHOR */}
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    {blog.authorName || "Unknown"}
                  </p>
                </div>
              </div>

              {/* CONTENT (🔥 SAME LINE SEE MORE) */}
              <p className="text-base text-gray-300 mt-2 text-justify mt-5">
                {isExpanded ? (
                  <>
                    {blog.content}
                    {isLong && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(blog._id);
                        }}
                        className="text-green-400 cursor-pointer ml-1 text-xs hover:underline"
                      >
                        {" "}
                        See Less
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    {words.slice(0, 100).join(" ")}
                    {isLong && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(blog._id);
                        }}
                        className="text-green-400 cursor-pointer ml-1 text-xs hover:underline"
                      >
                        ... See More
                      </span>
                    )}
                  </>
                )}
              </p>

              {/* ACTION BAR */}
              <div className="flex justify-between items-center mt-3 flex-wrap gap-2">
                {/* LEFT */}
                <div className="flex items-center gap-3">
                  {/* LIKE */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(blog._id);
                    }}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition cursor-pointer ${
                      isLiked
                        ? "bg-blue-500/20 text-blue-500"
                        : "bg-gray-500/50 text-gray-300 hover:bg-gray-500/20"
                    }`}
                  >
                    <ThumbsUp
                      size={14}
                      className={isLiked ? "fill-blue-400" : ""}
                    />
                    {blog.likes?.length || 0}
                  </button>

                  {/* READ / UNREAD */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkedBlog(blog);
                    }}
                    className={`text-sm px-3 py-1 rounded-full cursor-pointer ${
                      viewedBlogs.includes(blog._id)
                        ? "bg-red-500/10 text-red-400"
                        : "bg-green-500/10 text-green-400"
                    }`}
                  >
                    {viewedBlogs.includes(blog._id) ? "Unread" : "Read"}
                  </button>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-2">
                  {/* DELETE */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBlog(blog._id);
                    }}
                    disabled={!isOwner}
                    className={`
      group relative
      flex items-center justify-center
      w-9 h-9 rounded-xl
      backdrop-blur-md border
      transition-all duration-300

      ${
        isOwner
          ? "bg-red-500/10 border-red-400/30 text-red-400 hover:bg-red-500/20 hover:shadow-[0_0_12px_rgba(239,68,68,0.5)] hover:scale-110 active:scale-95 cursor-pointer"
          : "bg-gray-500/10 border-gray-400/20 text-gray-400 cursor-not-allowed"
      }
    `}
                  >
                    <Trash2 size={15} />

                    {/* tooltip */}
                    {isOwner && (
                      <span className="absolute -top-8 text-xs bg-black/70 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                        Delete
                      </span>
                    )}
                  </button>

                  {/* EDIT */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingBlog(blog);
                      setEditData({
                        title: blog.title,
                        content: blog.content,
                      });
                      document.getElementById("edit_modal").showModal();
                    }}
                    disabled={!isOwner}
                    className={`
      group relative
      flex items-center justify-center
      w-9 h-9 rounded-xl
      backdrop-blur-md border
      transition-all duration-300

      ${
        isOwner
          ? "bg-green-500/10 border-green-400/30 text-green-400 hover:bg-green-500/20 hover:shadow-[0_0_12px_rgba(34,197,94,0.5)] hover:scale-110 active:scale-95 cursor-pointer"
          : "bg-gray-500/10 border-gray-400/20 text-gray-400 cursor-not-allowed"
      }
    `}
                  >
                    <PenLine size={15} />

                    {/* tooltip */}
                    {isOwner && (
                      <span className="absolute -top-8 text-xs bg-black/70 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                        Edit
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* EDIT MODAL */}
      <dialog id="edit_modal" className="modal">
        <div className="modal-box bg-white/10 backdrop-blur-lg border border-green-400/30 shadow-2xl rounded-2xl w-11/12 max-w-lg">
          <h3 className="font-bold text-xl text-green-400 mb-4 flex justify-center items-center gap-2">
            <PenLine size={28} />
            Edit Blog
          </h3>

          {/* Title */}
          <input
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
            placeholder="Enter blog title..."
            className="w-full mb-3 p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-green-400/30 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          {/* Content */}
          <textarea
            value={editData.content}
            onChange={(e) =>
              setEditData({ ...editData, content: e.target.value })
            }
            placeholder="Write your blog..."
            rows={5}
            className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-green-400/30 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          {/* Buttons */}
          <div className="mt-5 flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="px-5 py-2 rounded-xl bg-green-500 hover:bg-green-600 transition text-white font-semibold disabled:opacity-50 cursor-pointer"
            >
              {updating ? "Saving..." : "Save"}
            </button>

            <button
              onClick={() => {
                setEditingBlog(null);
                setEditData({ title: "", content: "" });
                document.getElementById("edit_modal").close();
              }}
              className="px-5 py-2 rounded-xl border border-red-400 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default BlogList;
