import React, { useState } from "react";
import { useAuth } from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import { MessageCircleMore, MessageSquareMore, PenLine, Trash2, User } from "lucide-react";

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

  // ✅ CHECK OWNER
  const isOwner = (email) => user?.email === email;

  // ✅ DELETE COMMENT
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

  // ✅ START EDIT
  const handleEditComment = (comment) => {
    setEditingComment(comment._id);
    setEditText(comment.text);
    setOldCommentText(comment.text);
  };

  // ✅ UPDATE COMMENT
  const handleUpdateComment = async (id) => {
    if (!editText.trim()) {
      return Swal.fire("Error", "Comment cannot be empty!", "error");
    }

    // ✅ no change check
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
      <h2
        className="
    flex items-center gap-3
    text-lg md:text-xl font-semibold

    bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-700/10
    backdrop-blur-md

    border border-green-400/20
    rounded-xl

    px-4 py-3 mb-4

    shadow-[0_4px_20px_rgba(34,197,94,0.15)]
  "
      >
        <span className="p-2 rounded-lg bg-green-500/10 border border-green-400/20">
          <MessageSquareMore size={20} className="text-green-400" />
        </span>

        <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-600 bg-clip-text text-transparent">
          Comments
        </span>
      </h2>

      {/* ➕ ADD COMMENT */}
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
            className="bg-green-500/50 hover:bg-green-600/50 px-4 py-2 mt-2 rounded w-full text-white transition cursor-pointer"
          >
            Post
          </button>
        </>
      )}

      {/*  COMMENT LIST */}
      <div className="mt-4 space-y-3 max-h-[400px] overflow-y-auto pr-1 hide-scrollbar">
        {comments.map((c) => {
          const owner = isOwner(c.userEmail);

          return (
            <div
              key={c._id}
              className="bg-white/10 p-3 rounded-lg border border-white/10"
            >
              {/* ✏️ EDIT MODE */}
              {editingComment === c._id ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="input input-class"
                  />

                  <div className="flex items-center gap-2 mt-3">
                    {/* SAVE */}
                    <button
                      onClick={() => handleUpdateComment(c._id)}
                      className="
      flex items-center justify-center
      px-4 py-1.5 rounded-md
      text-sm font-medium
      bg-gradient-to-r from-green-400 to-emerald-500
      hover:from-green-500 hover:to-emerald-600
      text-white
      shadow-md shadow-green-500/30
      hover:shadow-green-500/50
      hover:scale-105 active:scale-95
      transition duration-300 cursor-pointer
    "
                    >
                      Save
                    </button>

                    {/* CANCEL */}
                    <button
                      onClick={() => setEditingComment(null)}
                      className="
      flex items-center justify-center
      px-4 py-1.5 rounded-md
      text-sm font-medium
      bg-white/10 backdrop-blur-md
      border border-white/20
      text-gray-200
      hover:bg-white/20
      hover:scale-105 active:scale-95
      transition duration-300 cursor-pointer
    "
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-200 text-sm flex items-center gap-2">
                    {/* <MessageCircleMore size={16} /> */}
                    {c.text}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <User size={16} />
                    {c.userName}
                  </p>

                  {/* 🔥 ACTIONS */}
                  <div className="flex items-center gap-2 mt-2">
                    {/* DELETE */}
                    <button
                      disabled={!owner}
                      onClick={() => handleDeleteComment(c._id)}
                      className={`
      flex items-center justify-center
      w-8 h-8 rounded-md
      backdrop-blur-md border
      transition duration-300

      ${
        owner
          ? "bg-red-500/10 border-red-400/30 text-red-400 hover:bg-red-500/20 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:scale-110 active:scale-95 cursor-pointer"
          : "bg-gray-500/10 border-gray-400/20 text-gray-400 cursor-not-allowed"
      }
    `}
                    >
                      <Trash2 size={14} />
                    </button>

                    {/* EDIT */}
                    <button
                      disabled={!owner}
                      onClick={() => handleEditComment(c)}
                      className={`
      flex items-center justify-center
      w-8 h-8 rounded-md
      backdrop-blur-md border
      transition duration-300

      ${
        owner
          ? "bg-green-500/10 border-green-400/30 text-green-400 hover:bg-green-500/20 hover:shadow-[0_0_10px_rgba(34,197,94,0.5)] hover:scale-110 active:scale-95 cursor-pointer"
          : "bg-gray-500/10 border-gray-400/20 text-gray-400 cursor-not-allowed"
      }
    `}
                    >
                      <PenLine size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Comments;
