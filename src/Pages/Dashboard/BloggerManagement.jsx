import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useRole from "../../Hooks/useRole";
import { Eye, StepBack, StepForward, Trash2, Users } from "lucide-react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const BloggerManagement = () => {
  const { role } = useRole();
  const [bloggers, setBloggers] = useState([]);
  const [selectedBloggers, setSelectedBloggers] = useState();
  const [loading, setLoading] = useState(true);
  const axiosBloggerManagement = useAxiosSecure();

  const [searchText, setSearchText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalBloggers, setTotalBloggers] = useState(0);
  const limit = 3;
  const totalPages = Math.ceil(totalBloggers / limit);

  // get search & pagination
  useEffect(() => {
  const fetchBloggers = async () => {
    try {
      setLoading(true);
      const res = await axiosBloggerManagement.get(
        `/blogs?search=${searchText}&page=${currentPage}&limit=${limit}`,
      );

      setBloggers(res.data.blogs || []);
      setTotalBloggers(res.data.total);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Failed to load Blogger!",
      });
    } finally {
      setLoading(false);
    }
  };

  fetchBloggers();
}, [searchText, currentPage, axiosBloggerManagement]);

  const handleSearch = (e) => {
    const value = e.target.value.trimStart();
    setSearchText(value);
    setCurrentPage(1);
  };


    const handleView = async (id) => {
      try {
        const res = await axiosBloggerManagement.get(`/blogs/${id}`);
        setSelectedBloggers(res.data);
        document.getElementById("view_modal").showModal();
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    };

  //  Delete
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosBloggerManagement.delete(`/blogs/${id}`);

        if (res.data?.success) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "User has been deleted.",
            timer: 1500,
            showConfirmButton: false,
          });

          // ✅ UI update without reload
          setBloggers((prev) => prev.filter((user) => user._id !== id));
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: err.message,
        });
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-green-400/20 shadow-lg">
        {/* Left side */}

        <h1 className="text-3xl font-bold text-green-300 tracking-wide flex items-center gap-1">
          <Users size={32} />
          <span>
            Bloggers <span className="text-xs">({totalBloggers})</span>{" "}
          </span>
        </h1>

        {/* Right side (Search) */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="🔍 Search blogger..."
            value={searchText}
            onChange={handleSearch}
            className="w-full px-4 py-2 rounded-full bg-white/10 border border-green-400/30 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30 transition"
          />

          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-green-400/10 blur-xl opacity-30 pointer-events-none"></div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-bars loading-xl"></span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white/5 backdrop-blur-xl border border-green-400/20 shadow-xl p-4">
          <table className="table text-white">
            <thead>
              <tr className="text-green-300 text-sm uppercase">
                <th>No.</th>
                <th>Name</th>
                <th>Role</th>
                <th>Create-Date</th>
                <th>Update-Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {bloggers.map((user, index) => (
                <tr
                  key={user._id}
                  className="hover:bg-green-400/10 hover:rounded-xs  transition duration-300"
                >
                  <th className="text-green-400">
                    {(currentPage - 1) * limit + index + 1}
                  </th>

                  {/* User */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="h-12 w-12 rounded-xl ring ring-green-400/30 ring-offset-2 ring-offset-green-900/20">
                          <img src={user.image} alt="User" />
                        </div>
                      </div>

                      <div>
                        <div className="font-semibold text-white">
                          {user.authorName}
                        </div>
                        <div className="text-sm text-gray-400">
                          {user.authorEmail}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border ${
                        user.role === "admin"
                          ? "bg-blue-400/10 text-blue-400 border-blue-400/30"
                          : "bg-green-400/10 text-green-400 border-green-400/30"
                      }`}
                    >
                      {user.role || "blogger"}
                    </span>
                  </td>

                  {/* Dates */}
                  <td className="text-gray-300 text-sm">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>

                  <td className="text-gray-300 text-sm">
                    {new Date(user.updatedAt).toLocaleString()}
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="flex gap-2">
                      {/* View */}
                      <button
                        onClick={() => handleView(user._id)}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white transition cursor-pointer hover:scale-105 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                      >
                        <Eye size={16} />
                      </button>

                      {role === "admin" && (
                        <>
                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md border border-red-400/30 text-red-300 transition cursor-pointer hover:scale-105 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* pageination */}
      <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
        {/* 🔙 Prev */}
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-xl bg-white/10 text-green-300 
    hover:bg-green-400/20 backdrop-blur-md border border-green-400/30 
    disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <StepBack size={16} />
        </button>

        {(() => {
          const pages = [];
          const maxVisible = 5;

          let start = Math.max(currentPage - Math.floor(maxVisible / 2), 1);
          let end = start + maxVisible - 1;

          if (end > totalPages) {
            end = totalPages;
            start = Math.max(end - maxVisible + 1, 1);
          }

          for (let i = start; i <= end; i++) {
            pages.push(i);
          }

          return pages.map((page) => {
            const isActive = currentPage === page;

            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`
            px-3 py-1 rounded-xl text-sm font-medium transition-all duration-300
            backdrop-blur-md border border-green-400/30
            
            ${
              isActive
                ? "bg-green-500/80 text-white shadow-lg shadow-green-500/30 scale-105"
                : "bg-white/10 text-green-300 hover:bg-green-400/20 hover:text-white hover:scale-105"
            }
          `}
              >
                {page}
              </button>
            );
          });
        })()}

        {/* 🔜 Next */}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-xl bg-white/10 text-green-300 
    hover:bg-green-400/20 backdrop-blur-md border border-green-400/30 
    disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <StepForward size={16} />
        </button>
      </div>

      {/* View Modal */}
      <dialog id="view_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-gradient-to-br from-green-900/40 to-black/40 backdrop-blur-lg border border-green-400/30 shadow-xl rounded-2xl text-white">
          {/* Profile Section */}
          <div className="flex flex-col items-center text-center">
            <img
              src={selectedBloggers?.image}
              alt="user"
              className="w-24 h-24 rounded-full border-4 border-green-400 shadow-lg mb-3"
            />

            <h3 className="text-xl font-bold text-green-300">
              {selectedBloggers?.authorName}
            </h3>

            <p className="text-sm text-gray-300">{selectedBloggers?.authorEmail}</p>

            <span
              className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold
        ${
          selectedBloggers?.role === "admin"
            ? "bg-blue-500/20 text-blue-300 border border-blue-400 "
            : "bg-green-500/20 text-green-300 border border-green-400"
        }`}
            >
              {selectedBloggers?.role || "blogger"}
            </span>
          </div>

          {/* Info Section */}
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 whitespace-nowrap">Created</span>
              <div className="flex-1 border-b border-dashed border-green-400/30"></div>
              <span className="text-right">
                {new Date(selectedBloggers?.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400 whitespace-nowrap">Updated</span>
              <div className="flex-1 border-b border-dashed border-green-400/30"></div>
              <span className="text-right">
                {new Date(selectedBloggers?.updatedAt).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400 whitespace-nowrap">User ID</span>
              <div className="flex-1 border-b border-dashed border-green-400/30"></div>
              <span className="text-xs text-gray-500 break-all text-right">
                {selectedBloggers?._id}
              </span>
            </div>
          </div>

          {/* Action */}
          <div className="modal-action mt-6">
            <button
              onClick={() => document.getElementById("view_modal").close()}
              className="btn w-full md:w-20 bg-green-500/50 hover:bg-green-600/50 border-none text-white rounded-full px-6"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default BloggerManagement;
