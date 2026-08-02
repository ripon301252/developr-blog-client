import { NotebookTabs, ThumbsUp } from "lucide-react";
import React from "react";

const BlogList = ({
  blogs,
  handleLike,
  selectedBlog,
  viewedBlogs,
  handleMarkedBlog,
}) => {
  return (
    <div className="space-y-4 col-span-1 md:max-h-[572.9px] max-h-[319.9px] overflow-y-auto hide-scrollbar">
      <h2
        className="
    sticky top-0 z-20
    w-full

    flex justify-center items-center gap-3

    text-lg md:text-xl lg:text-2xl font-bold

    bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-700/10
    backdrop-blur-xl

    border-b border-green-400/20
    py-3 px-4

    shadow-[0_4px_25px_rgba(34,197,94,0.15)]
  "
      >
        <span className="p-2 rounded-lg bg-green-500/10 border border-green-400/20 backdrop-blur-md">
          <NotebookTabs size={22} className="text-green-400" />
        </span>

        <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-600 bg-clip-text text-transparent tracking-wide">
          Blog List {<span className=" text-xs">({blogs.length})</span>}
        </span>
      </h2>

      {blogs.map((blog) => {
        const isActive = String(blog._id) === String(selectedBlog?._id);
        const isViewed = viewedBlogs.includes(blog._id);

        return (
          <div
            key={blog._id}
            onClick={() => handleMarkedBlog(blog)}
            className={`p-3 rounded-xl cursor-pointer transition-all duration-200 border
              ${
                isActive
                  ? "bg-green-500/20 border-green-400 shadow-sm"
                  : isViewed
                    ? "bg-blue-500/10 border-blue-300"
                    : "bg-white/10 border-transparent hover:bg-white/20"
              }
              `}
          >
            <h3 className="font-semibold text-gray-200">{blog.title}</h3>

            <p className="text-sm text-gray-400 line-clamp-2">
              {blog.content.slice(0, 30)}...
            </p>

            <div className="flex justify-between items-center mt-3">
              <div>
               <img src= {blog.image} alt="" className="w-10 h-10 rounded-full border-3 border-green-500/50" />
              </div>

              <div className="flex items-center gap-2">
                {/* LIKE BUTTON */}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(blog._id);
                  }}
                  className="
      flex items-center gap-1.5
      px-3 py-1 rounded-full
      bg-white/5 backdrop-blur-md
      border border-white/10
      text-gray-300 text-sm
      hover:shadow-[0_0_10px_rgba(248,113,113,0.4)]
      transition duration-300 cursor-pointer
    "
                >
                  <ThumbsUp size={14} />
                  <span>{blog.likes?.length || 0}</span>
                </button>

                {/* READ STATUS */}
                <span
                  className={`
      flex items-center gap-1.5
      px-3 py-1 rounded-full
      text-xs font-semibold
      backdrop-blur-md border
      transition duration-300
      
      ${
        isViewed
          ? "bg-green-500/10 border-green-400/30 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
          : "bg-red-500/10 border-red-400/30 text-red-400"
      }
    `}
                >
                  {isViewed ? (
                    <>
                      ✔ <span>Read</span>
                    </>
                  ) : (
                    <>
                      ○ <span>Unread</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BlogList;
