import { useEffect, useState } from "react";
import useAxiosNormal from "../../Hooks/useAxiosNormal";
import Marquee from "react-fast-marquee";
import { PenLine } from "lucide-react";

const OurBlogger = () => {
  const axiosOurBlogger = useAxiosNormal();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axiosOurBlogger
      .get("/blogs")
      .then((res) => {
        // setBlogs(res.data.blogs || [])
        setBlogs(Array.isArray(res.data.blogs) ? res.data.blogs : []);
      })
      .catch((err) => console.log(err));
  }, [axiosOurBlogger]);

  return (
    <div className="py-16 max-w-7xl mx-auto px-4">
      <h2
        className="
    text-2xl md:text-3xl lg:text-4xl
    font-bold mb-8
    flex justify-center items-center gap-3

    text-teal-300
    bg-gradient-to-r from-teal-400 via-teal-400 to-teal-600
    bg-clip-text text-transparent

    backdrop-blur-md
    px-6 py-3 rounded-xl

    border border-teal-400/30
    shadow-[0_0_25px_rgba(34,197,94,0.25)]

    w-fit mx-auto
  "
      >
        <span className="p-2 rounded-lg bg-teal-500/10 backdrop-blur-md border border-teal-400/20">
          <PenLine size={26} className="text-teal-400" />
        </span>

        <span className="tracking-wide">
          Our Bloggers <span className=" text-xs">({blogs.length})</span>{" "}
        </span>
      </h2>

      {blogs.length === 0 ? (
        <div className="text-center text-gray-400">
          <div className="flex justify-center items-center gap-2">
            <span className="loading loading-bars loading-xl"></span>
          </div>
        </div>
      ) : (
        <Marquee
          direction="right"
          speed={25}
          pauseOnHover
          gradient={false}
          autoFill
        >
          {blogs.map((blog) => (
            <div key={blog._id} className="relative mx-4 min-w-[190px]">
              {/* Soft Glow (always subtle, no hover) */}
              <div
                className="
      absolute inset-0 rounded-2xl
      bg-gradient-to-r from-teal-400/10 via-teal-500/5 to-teal-600/10
      blur-lg opacity-70
    "
              ></div>

              {/* Card */}
              <div
                className="
      relative
      min-h-[190px]
      bg-white/5 backdrop-blur-2xl
      border border-white/10
      rounded-2xl
      p-5 text-center

      flex flex-col justify-center

      shadow-[0_0_12px_rgba(20,184,166,0.35)]
    "
              >
                {/* Image */}
                <div className="relative w-20 h-20 mx-auto">
                  <img
                    src={blog.authorPhoto || blog.image}
                    alt={blog.authorName}
                    className="
          w-20 h-20 rounded-full object-cover
          border-2 border-cyan-400
          shadow-[0_0_12px_rgba(20,184,166,0.35)]
        "
                  />

                  {/* Verified badge */}
                  <span
                    className="
          absolute -top-1 -right-1
          bg-teal-500 text-black text-[10px]
          px-1 rounded-full font-bold
        "
                  >
                    ✔
                  </span>
                </div>

                {/* Name */}
                <h2 className="mt-4 text-white font-semibold text-sm tracking-wide">
                  {blog.authorName}
                </h2>

                {/* Role */}
                <p className="text-gray-400 text-xs mt-1">Blogger</p>

                {/* Line */}
                <div className="mt-3 w-10 h-[2px] bg-gradient-to-r from-teal-400 to-teal-500 mx-auto opacity-60"></div>
              </div>
            </div>
          ))}
        </Marquee>
      )}
    </div>
  );
};

export default OurBlogger;
