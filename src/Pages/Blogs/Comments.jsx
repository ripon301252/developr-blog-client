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
    flex justify-center items-center gap-3
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

      {/* {selectedBlog ? (
        <h3 className="text-sm text-green-400 mb-2">
          💬 Comments for:{" "}
          <span className="font-semibold">{selectedBlog.title}</span>
        </h3>
      ) : (
        <p className="text-gray-400 text-sm">Select a blog to see comments</p>
      )} */}

      {selectedBlog && (
        <div
          className="
      flex items-center gap-3 mb-3
      bg-gradient-to-r from-green-500/10 to-emerald-500/5
      border border-green-400/20
      backdrop-blur-md
      rounded-xl px-3 py-2
      shadow-md shadow-green-500/10
    "
        >
          {/* IMAGE */}
          <img
            src={selectedBlog.image}
            alt=""
            className="
        w-10 h-10 rounded-lg
        object-cover
        border border-green-400/30
      "
          />

          {/* TEXT */}
          <div className="flex flex-col">
            <span className="text-sm text-green-400 font-medium">
              {selectedBlog.title.slice(0, 35)}...
            </span>

            <span className="text-xs text-gray-400">
              {selectedBlog.authorName} • Blog
            </span>
          </div>
        </div>
      )}

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
      <div className="mt-4 space-y-4 max-h-[420px] overflow-y-auto pr-1 hide-scrollbar">
        {comments.map((c) => {
          const owner = isOwner(c.userEmail);

          return (
            <div
              key={c._id}
              className="
          group
          relative
          bg-gradient-to-br from-white/10 via-white/5 to-transparent
          backdrop-blur-xl
          border border-white/10
          rounded-2xl
          p-4
          shadow-lg
          hover:shadow-green-500/10
          transition-all duration-300
        "
            >
              {/* subtle glow */}
              <div className="absolute inset-0 rounded-2xl bg-green-500/0 group-hover:bg-green-500/5 transition duration-300"></div>

              {/* ✏️ EDIT MODE */}
              {editingComment === c._id ? (
                <div className="relative z-10">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="
                w-full px-3 py-2 rounded-lg
                bg-white/10 border border-white/20
                text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-green-400/50
              "
                  />

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => handleUpdateComment(c._id)}
                      className="
                  px-4 py-1.5 rounded-md text-sm font-medium
                  bg-gradient-to-r from-green-400 to-emerald-500
                  hover:from-green-500 hover:to-emerald-600
                  text-white
                  shadow-md shadow-green-500/30
                  hover:shadow-green-500/50
                  hover:scale-105 active:scale-95
                  transition duration-300
                "
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingComment(null)}
                      className="
                  px-4 py-1.5 rounded-md text-sm font-medium
                  bg-white/10 border border-white/20
                  text-gray-200
                  hover:bg-white/20
                  transition duration-300
                "
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative z-10">
                  {/* USER */}
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={c.userImage}
                      alt=""
                      className="
                  w-10 h-10 rounded-full
                  border border-green-400/30
                  shadow-md shadow-green-500/20
                "
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

                  {/* COMMENT TEXT */}
                  <p className="text-gray-200 text-sm leading-relaxed ml-13">
                    {c.text}
                  </p>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-2 mt-3 ml-13">
                    {/* DELETE */}
                    <button
                      disabled={!owner}
                      onClick={() => handleDeleteComment(c._id)}
                      className={`
                  w-8 h-8 flex items-center justify-center
                  rounded-lg border backdrop-blur-md
                  transition duration-300

                  ${
                    owner
                      ? "bg-red-500/10 border-red-400/30 text-red-400 hover:bg-red-500/20 hover:scale-110"
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
                  w-8 h-8 flex items-center justify-center
                  rounded-lg border backdrop-blur-md
                  transition duration-300

                  ${
                    owner
                      ? "bg-green-500/10 border-green-400/30 text-green-400 hover:bg-green-500/20 hover:scale-110"
                      : "bg-gray-500/10 border-gray-400/20 text-gray-400 cursor-not-allowed"
                  }
                `}
                    >
                      <PenLine size={14} />
                    </button>
                  </div>
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
