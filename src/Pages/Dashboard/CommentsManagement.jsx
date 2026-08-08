import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Eye, Trash2, StepBack, StepForward, Users } from "lucide-react";
import useRole from "../../Hooks/useRole";

const CommentsManagement = () => {
  const { role } = useRole();
  const axiosCommentsManagement = useAxiosSecure();

  const [comments, setComments] = useState([]);
  const [selectedComment, setSelectedComment] = useState();
  const [loading, setLoading] = useState(true);

  // 🔍 search
  const [searchText, setSearchText] = useState("");

  // 📄 pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const limit = 5;

  const totalPages = Math.ceil(totalComments / limit);

  // 🔥 fetch comments
  const fetchComments = async (search = "", page = 1) => {
    try {
      setLoading(true);

      const res = await axiosCommentsManagement.get(
        `/comments?search=${search}&page=${page}&limit=${limit}`,
      );
      console.log(res.data);

      setComments(res.data.comments);
      setTotalComments(res.data.total);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchComments(searchText, currentPage);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchText, currentPage]);

  // 🔍 search handler
  const handleSearch = (e) => {
    const value = e.target.value.trimStart();
    setSearchText(value);
    setCurrentPage(1);
  };

  // 👁 view
  const handleView = async (id) => {
    try {
      const res = await axiosCommentsManagement.get(`/comments/id/${id}`); // ✅ FIX
      setSelectedComment(res.data);
      document.getElementById("view_modal").showModal();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // 🗑 delete
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Delete this comment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosCommentsManagement.delete(`/comments/${id}`);

        if (res.data?.success) {
          Swal.fire("Deleted!", "Comment removed", "success");

          setComments((prev) => prev.filter((comment) => comment._id !== id));

          // 🔥 important line
          setTotalComments((prev) => prev - 1);
        }
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    }
  };

  return (
    <div className="p-5 text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-cyan-400/20 shadow-lg">
        {/* Left side */}

        <h1 className="text-3xl font-bold text-cyan-300 tracking-wide flex items-center gap-1">
          <Users size={32} />
          <span>
            Comments <span className="text-xs">({totalComments})</span>{" "}
          </span>
        </h1>

        {/* Right side (Search) */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="🔍 Search user..."
            value={searchText}
            onChange={handleSearch}
            className="w-full px-4 py-2 rounded-full bg-white/10 border border-cyan-400/30 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition"
          />

          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-xl opacity-30 pointer-events-none"></div>
        </div>
      </div>

      {/* 📋 Table */}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-bars loading-xl"></span>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center text-gray-400 py-6">No comments found</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white/5 backdrop-blur-xl border border-cyan-400/20 shadow-xl p-4">
          <table className="table text-white">
            <thead>
              <tr className="text-cyan-300 text-sm uppercase">
                <th>No.</th>
                <th>Name</th>
                <th>Comments</th>
                <th>Create-Date</th>
                <th>Update-Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {comments.map((user, index) => (
                <tr
                  key={user._id}
                  className="hover:bg-cyan-400/10 hover:rounded-xs  transition duration-300"
                >
                  <th className="text-cyan-400">
                    {(currentPage - 1) * limit + index + 1}
                  </th>

                  {/* User */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="h-12 w-12 rounded-xl ring ring-cyan-400/30 ring-offset-2 ring-offset-cyan-900/20">
                          <img src={user.userImage} alt="User" />
                        </div>
                      </div>

                      <div>
                        <div className="font-semibold text-white">
                          {user.userName}
                        </div>
                        <div className="text-sm text-gray-400">
                          {user.userEmail}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Comments */}
                  <td>
                    <span className="">{user.text}</span>
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

      {/* 📄 Pagination */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="btn btn-sm"
        >
          <StepBack />
        </button>

        <span>
          {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="btn btn-sm"
        >
          <StepForward />
        </button>
      </div>

      {/* 👁 Modal */}
      <dialog id="view_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-gradient-to-br from-cyan-900/40 to-black/40 backdrop-blur-lg border border-cyan-400/30 shadow-xl rounded-2xl text-white">
          {/* Profile Section */}
          <div className="flex flex-col items-center text-center">
            <img
              src={selectedComment?.userImage}
              alt="user"
              className="w-24 h-24 rounded-full border-4 border-cyan-400 shadow-lg mb-3"
            />

            <h3 className="text-xl font-bold text-cyan-300">
              {selectedComment?.userName}
            </h3>

            <p className="text-sm text-gray-300">
              {selectedComment?.userEmail}
            </p>
          </div>

          {/* Info Section */}
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 whitespace-nowrap">Comment</span>
              <div className="flex-1 border-b border-dashed border-cyan-400/30"></div>
              <span className="text-right">{selectedComment?.text}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400 whitespace-nowrap">Created</span>
              <div className="flex-1 border-b border-dashed border-cyan-400/30"></div>
              <span className="text-right">
                {new Date(selectedComment?.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400 whitespace-nowrap">Updated</span>
              <div className="flex-1 border-b border-dashed border-cyan-400/30"></div>
              <span className="text-right">
                {new Date(selectedComment?.updatedAt).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400 whitespace-nowrap">User ID</span>
              <div className="flex-1 border-b border-dashed border-cyan-400/30"></div>
              <span className="text-xs text-gray-500 break-all text-right">
                {selectedComment?._id}
              </span>
            </div>
          </div>

          {/* Action */}
          <div className="modal-action mt-6">
            <button
              onClick={() => document.getElementById("view_modal").close()}
              className="btn w-full md:w-20 bg-cyan-500/50 hover:bg-cyan-600/50 border-none text-white rounded-full px-6"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default CommentsManagement;
