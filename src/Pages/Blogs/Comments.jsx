import React from "react";

const Comments = ({
  selectedBlog,
  comments,
  commentText,
  setCommentText,
  handleComment,
}) => {
  return (
    <div className="bg-white/10 p-4 rounded-xl col-span-1">
      <h2 className="text-xl mb-3">💬 Comments</h2>

      {selectedBlog && (
        <>
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write comment..."
            className="w-full p-2 rounded text-black"
          />

          <button
            onClick={handleComment}
            className="bg-green-500 px-4 py-2 mt-2 rounded w-full"
          >
            Post
          </button>
        </>
      )}

      <div className="mt-4 space-y-2">
        {comments.map((c) => (
          <div key={c._id} className="bg-white/10 p-2 rounded">
            <p>{c.text}</p>
            <p className="text-xs text-gray-400">{c.userName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
