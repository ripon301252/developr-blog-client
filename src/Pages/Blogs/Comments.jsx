import React, { useState } from "react";
import { useAuth } from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import { format } from "timeago.js";
import {
  MessageCircleMore,
  MessageSquareMore,
  PenLine,
  Trash2,
  User,
} from "lucide-react";

const Comments = ({
  selectedBlog,
  comments,
  setComments,
  commentText,
  setCommentText,
  handleComment,
  axiosAllBlogs,
}) => {
  const { user } = useAuth();
  console.log(user);

  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [oldCommentText, setOldCommentText] = useState("");

  const isOwner = (email) => user?.email === email;

  const handleDeleteComment = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This comment will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosAllBlogs.delete(`/comments/${id}`, {
        data: { userEmail: user.email },
      });

      setComments((prev) => prev.filter((c) => c._id !== id));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Your comment has been removed.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error!", err.message, "error");
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment._id);
    setEditText(comment.text);
    setOldCommentText(comment.text);
  };

  const handleUpdateComment = async (id) => {
    if (!editText.trim()) {
      return Swal.fire("Error", "Comment cannot be empty!", "error");
    }

    if (editText.trim() === oldCommentText.trim()) {
      return Swal.fire(
        "No Changes!",
        "Please update your comment before saving.",
        "warning",
      );
    }

    try {
      const res = await axiosAllBlogs.patch(`/comments/${id}`, {
        text: editText,
        userEmail: user.email,
      });

      setComments((prev) => prev.map((c) => (c._id === id ? res.data : c)));

      setEditingComment(null);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Comment updated successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Error!", "Update failed", error);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl col-span-1 border border-white/10">
      <h2 className="flex justify-center items-center gap-3 text-lg md:text-xl font-semibold bg-gradient-to-r from-cyan-500/10 via-cyan-500/10 to-cyan-700/10 backdrop-blur-md border border-cyan-400/20 rounded-xl px-4 py-3 mb-4 shadow-[0_0_12px_rgba(20,184,166,0.35)]">
        <span className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/20">
          <MessageSquareMore size={20} className="text-cyan-400" />
        </span>

        <span className="bg-gradient-to-r from-cyan-400 via-cyan-400 to-cyan-600 bg-clip-text text-transparent">
          Comments
        </span>
      </h2>

      {selectedBlog && (
        <div className="flex items-center gap-3 mb-3 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border border-cyan-400/20 backdrop-blur-md rounded-xl px-3 py-2 shadow-md shadow-cyan-500/10">
          <img
            src={selectedBlog.image}
            alt=""
            className="w-10 h-10 rounded-lg object-cover border border-cyan-400/30"
          />

          <div className="flex flex-col">
            <span className="text-sm text-cyan-400 font-medium">
              {selectedBlog.title.slice(0, 35)}...
            </span>

            <span className="text-xs text-gray-400">
              {selectedBlog.authorName} • Blog
            </span>
          </div>
        </div>
      )}

      {selectedBlog && (
        <>
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write comment..."
            className="w-full p-2 rounded-md text-white outline-none"
          />
          <button
            onClick={handleComment}
            className="bg-cyan-500/50 hover:bg-cyan-600/50 px-4 py-2 mt-2 rounded w-full text-white transition cursor-pointer"
          >
            Post
          </button>
        </>
      )}

      <div className="mt-4 space-y-4 max-h-[420px] overflow-y-auto pr-1 hide-scrollbar">
        {comments.map((c) => {
          const owner = isOwner(c.userEmail);

          return (
            <div
              key={c._id}
              className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-6 shadow-lg hover:shadow-green-500/10 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-2xl bg-green-500/0 hover:bg-cyan-500/5 transition duration-300"></div>

              {editingComment === c._id ? (
                <div className="relative z-10">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  />

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => handleUpdateComment(c._id)}
                      className="px-4 py-1.5 rounded-md text-sm font-medium bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white cursor-pointer shadow-md shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 transition duration-300"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingComment(null)}
                      className="px-4 py-1.5 rounded-md text-sm font-medium bg-white/10 border border-white/20 text-gray-200 cursor-pointer hover:bg-white/20 transition duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="z-10">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={c.userImage}
                        alt=""
                        className="w-10 h-10 rounded-full border border-cyan-400/30 shadow-md shadow-green-500/20"
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {c.userName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {format(c.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ">
                      {/* DELETE */}
                      <div className="relative group">
                        <button
                          disabled={!owner}
                          onClick={() => handleDeleteComment(c._id)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg border backdrop-blur-md transition duration-300 ${
                            owner
                              ? "bg-red-500/10 border-red-400/30 text-red-400 hover:bg-red-500/20 hover:scale-110 cursor-pointer"
                              : "bg-gray-500/10 border-gray-400/20 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <Trash2 size={14} />
                        </button>

                        {owner && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-black/70 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition tooltip tooltip-bottom ">
                            Delete
                          </div>
                          
                        )}
                      </div>

                      {/* EDIT */}
                      <div className="relative group">
                        <button
                          disabled={!owner}
                          onClick={() => handleEditComment(c)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg border backdrop-blur-md transition duration-300 ${
                            owner
                              ? "bg-cyan-500/10 border-cyan-400/30 text-cyan-400 hover:bg-cyan-500/20 hover:scale-110 cursor-pointer"
                              : "bg-gray-500/10 border-gray-400/20 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <PenLine size={14} />
                        </button>

                        {owner && (
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-black/70 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition tooltip-bottom">
                            Edit
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-cyan-600 "></div>

                  <p className="text-gray-200 text-sm leading-relaxed ">
                    {c.text}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Comments;
