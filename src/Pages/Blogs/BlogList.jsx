import React from "react";

const BlogList = ({ blogs, setSelectedBlog, handleLike }) => {
  return (
    <div className="space-y-4 col-span-1">
      <h2 className="text-2xl font-bold text-center">📚 Blogs</h2>

      {blogs.map((blog) => (
        <div
          key={blog._id}
          onClick={() => setSelectedBlog(blog)}
          className="bg-white/10 p-3 rounded-xl cursor-pointer hover:scale-105 transition"
        >
          <h3 className="font-semibold">{blog.title}</h3>

          <p className="text-sm text-gray-300 line-clamp-2">
            {blog.content.slice(0, 45)}....
          </p>

          <span
            onClick={(e) => {
              e.stopPropagation();
              handleLike(blog._id);
            }}
            className="cursor-pointer"
          >
            ❤️ {blog.likes?.length || 0}
          </span>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
