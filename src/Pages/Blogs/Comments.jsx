import React, { useState } from "react";
import { useAuth } from "../../Hooks/useAuth";
import Swal from "sweetalert2";

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
        text: "Comment updated successfully ✨",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Error!", "Update failed", error);
    }
  };
  return (
    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl col-span-1 border border-white/10">
      <h2 className="text-xl font-semibold mb-3 text-white">💬 Comments</h2>

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
            className="bg-green-500 hover:bg-green-600 px-4 py-2 mt-2 rounded w-full text-white transition"
          >
            Post
          </button>
        </>
      )}

      {/* 📜 COMMENT LIST */}
      <div className="mt-4 space-y-3 max-h-[400px] overflow-y-auto pr-1">
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

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleUpdateComment(c._id)}
                      className="text-xs bg-green-900 px-2 py-1 rounded text-white cursor-pointer"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingComment(null)}
                      className="text-xs bg-gray-400 px-2 py-1 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-200 text-sm">{c.text}</p>
                  <p className="text-xs text-gray-400 mt-1">✍️ {c.userName}</p>

                  {/* 🔥 ACTIONS */}
                  <div className="flex gap-2 mt-2">
                    <button
                      disabled={!owner}
                      onClick={() => handleDeleteComment(c._id)}
                      className={`text-xs px-2 py-1 rounded transition
                        ${
                          owner
                            ? "bg-red-500/30 hover:bg-red-500/50 text-white cursor-pointer"
                            : "bg-gray-500/80 text-white cursor-not-allowed"
                        }`}
                    >
                      Delete
                    </button>

                    <button
                      disabled={!owner}
                      onClick={() => handleEditComment(c)}
                      className={`text-xs px-2 py-1 rounded transition 
                        ${
                          owner
                            ? "bg-green-500/30 hover:bg-green-500/50 text-white cursor-pointer"
                            : "bg-gray-500/80 text-white cursor-not-allowed"
                        }`}
                    >
                      Edit
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
