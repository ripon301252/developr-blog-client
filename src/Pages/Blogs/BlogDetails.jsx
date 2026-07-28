import React from "react";

const BlogDetails = ({ selectedBlog, handleLike }) => {
  if (!selectedBlog) {
    return <p>Select a blog 👈</p>;
  }

  return (
    <div className="bg-white/10 p-4 rounded-xl col-span-2">
      <h2 className="text-2xl font-bold">{selectedBlog.title}</h2>

      <img
        src={selectedBlog.image}
        className="w-full h-60 object-cover rounded mt-3"
      />

      <p className="mt-3 text-gray-300 break-words whitespace-pre-line overflow-y-auto max-h-[400px] pr-2">
        {selectedBlog.content}
      </p>

      <div className="mt-3 flex justify-between">
        <span>❤️ {selectedBlog.likes?.length || 0}</span>

        <button
          onClick={() => handleLike(selectedBlog._id)}
          className="bg-red-500 px-3 py-1 rounded"
        >
          Like
        </button>
      </div>
    </div>
  );
};

export default BlogDetails;
