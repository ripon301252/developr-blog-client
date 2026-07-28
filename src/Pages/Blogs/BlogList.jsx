import React from "react";

const BlogList = ({ blogs, setSelectedBlog, handleLike, selectedBlog }) => {
  return (
    <div className="space-y-4 col-span-1 md:max-h-[572.9px] max-h-[320px] overflow-y-auto left-scroll">
      <h2 className="text-2xl font-bold text-center sticky top-0  py-2 z-10">
        Blog List
        {/* <div className="border-b-2 mt-2 mx-12"></div> */}
      </h2>
      
      {blogs.map((blog) => {
        const isActive = String(blog._id) === String(selectedBlog?._id);

        return (
          <div
            key={blog._id}
            onClick={() => setSelectedBlog(blog)}
            className={`p-3 rounded-xl cursor-pointer transition-all duration-200 border
              ${
                isActive
                  ? "bg-green-500/20 border-green-400 shadow-sm"
                  : "bg-white/10 border-transparent hover:bg-white/20"
              }
              `}
          >
            <h3 className="font-semibold text-gray-200">{blog.title}</h3>

            <p className="text-sm text-gray-400 line-clamp-2">
              {blog.content.slice(0, 20)}...
            </p>

            <span
              onClick={(e) => {
                e.stopPropagation();
                handleLike(blog._id);
              }}
              className="cursor-pointer text-sm text-gray-300 hover:text-red-400"
            >
              ❤️ {blog.likes?.length || 0}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default BlogList;
