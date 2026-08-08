import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useRole from "../../Hooks/useRole";
import {
  Eye,
  PencilLine,
  PenLine,
  SaveCheck,
  StepBack,
  StepForward,
  Trash2,
  Users,
} from "lucide-react";

const UserManagement = () => {
  const { role } = useRole();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [loading, setLoading] = useState(true);
  const axiosUserManagement = useAxiosSecure();
  // search
  const [searchText, setSearchText] = useState("");
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 5;
  const totalPages = Math.ceil(totalUsers / limit);

  // search & pagination
  const fetchUsers = async (search = "", page = 1) => {
    try {
      setLoading(true); // ✅ start loading

      const res = await axiosUserManagement.get(
        `/users?search=${search}&page=${page}&limit=${limit}`,
      );

      setUsers(res.data.users);
      setTotalUsers(res.data.total);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // ✅ stop loading (MOST IMPORTANT)
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers(searchText, currentPage);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchText, currentPage]);

  const handleSearch = (e) => {
    const value = e.target.value.trimStart();
    setSearchText(value);
    setCurrentPage(1);
  };

  // all get
  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const res = await axiosUserManagement.get("/users");
  //       setUsers(res.data);
  //     } catch (err) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Oops...",
  //         text: err.message || "Failed to load users!",
  //       });
  //     }
  //   };
  //   fetchUsers();
  // }, [axiosUserManagement]);

  // single details
  const handleView = async (id) => {
    try {
      const res = await axiosUserManagement.get(`/users/${id}`);
      setSelectedUser(res.data);
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
        const res = await axiosUserManagement.delete(`/users/${id}`);

        if (res.data?.success) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "User has been deleted.",
            timer: 1500,
            showConfirmButton: false,
          });

          // ✅ UI update without reload
          setUsers((prev) => prev.filter((user) => user._id !== id));
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

  // patch
  const handleUpdate = async (e) => {
    e.preventDefault();

    document.getElementById("edit_modal").close();
    const form = e.target;

    const updatedUser = {
      name: form.name.value,
      email: form.email.value,
      photoURL: form.photoURL.value,
      role: form.role.value,
    };

    // 🔥 check if anything changed
    const isChanged =
      updatedUser.name !== selectedUser.name ||
      updatedUser.email !== selectedUser.email ||
      updatedUser.photoURL !== selectedUser.photoURL ||
      updatedUser.role !== selectedUser.role;

    if (!isChanged) {
      return Swal.fire({
        icon: "info",
        title: "No Changes",
        text: "You didn't change anything 😅",
      });
    }

    try {
      // ✅ Confirm
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to update this user?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#22c55e",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Yes, update it!",
      });

      if (!confirm.isConfirmed) return;

      // 🔄 Loading
      Swal.fire({
        title: "Updating...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await axiosUserManagement.patch(
        `/users/${selectedUser._id}`,
        updatedUser,
      );

      const updated = res.data;

      // ✅ UI update
      setUsers((prev) =>
        prev.map((user) =>
          user._id === selectedUser._id ? { ...user, ...updated } : user,
        ),
      );

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "User updated successfully",
        timer: 1500,
        showConfirmButton: false,
      });
      document.getElementById("edit_modal").close();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.response?.data?.error || err.message,
      });
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    document.getElementById("edit_modal").showModal();
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-cyan-400/20 shadow-lg">
        {/* Left side */}

        <h1 className="text-3xl font-bold text-cyan-300 tracking-wide flex items-center gap-1">
          <Users size={32} />
          <span>Users <span className="text-xs">({totalUsers})</span> </span> 
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-bars loading-xl"></span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white/5 backdrop-blur-xl border border-cyan-400/20 shadow-xl p-4">
          <table className="table text-white">
            <thead>
              <tr className="text-cyan-300 text-sm uppercase">
                <th>No.</th>
                <th>Name</th>
                <th>Role</th>
                <th>Create-Date</th>
                <th>Update-Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
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
                          <img src={user.photoURL} alt="User" />
                        </div>
                      </div>

                      <div>
                        <div className="font-semibold text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {user.email}
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
                          : "bg-cyan-400/10 text-cyan-400 border-cyan-400/30"
                      }`}
                    >
                      {user.role}
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
                          {/* Edit */}
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 backdrop-blur-md border border-cyan-400/30 text-cyan-300 transition cursor-pointer hover:scale-105 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                          >
                            <PencilLine size={16} />
                          </button>

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
          className="px-3 py-2 rounded-xl bg-white/10 text-cyan-300 
    hover:bg-cyan-400/20 backdrop-blur-md border border-cyan-400/30 
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
            backdrop-blur-md border border-cyan-400/30
            
            ${
              isActive
                ? "bg-cyan-500/80 text-white shadow-lg shadow-cyan-500/30 scale-105"
                : "bg-white/10 text-cyan-300 hover:bg-cyan-400/20 hover:text-white hover:scale-105"
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
          className="px-3 py-2 rounded-xl bg-white/10 text-cyan-300 
    hover:bg-cyan-400/20 backdrop-blur-md border border-cyan-400/30 
    disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <StepForward size={16} />
        </button>
      </div>

      {/* View Modal */}
      <dialog id="view_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-gradient-to-br from-cyan-900/40 to-black/40 backdrop-blur-lg border border-cyan-400/30 shadow-xl rounded-2xl text-white">
          {/* Profile Section */}
          <div className="flex flex-col items-center text-center">
            <img
              src={selectedUser?.photoURL}
              alt="user"
              className="w-24 h-24 rounded-full border-4 border-cyan-400 shadow-lg mb-3"
            />

            <h3 className="text-xl font-bold text-cyan-300">
              {selectedUser?.name}
            </h3>

            <p className="text-sm text-gray-300">{selectedUser?.email}</p>

            <span
              className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold
        ${
          selectedUser?.role === "admin"
            ? "bg-blue-500/20 text-blue-300 border border-blue-400 "
            : "bg-cyan-500/20 text-cyan-300 border border-cyan-400"
        }`}
            >
              {selectedUser?.role}
            </span>
          </div>

          {/* Info Section */}
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 whitespace-nowrap">Created</span>
              <div className="flex-1 border-b border-dashed border-cyan-400/30"></div>
              <span className="text-right">
                {new Date(selectedUser?.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400 whitespace-nowrap">Updated</span>
              <div className="flex-1 border-b border-dashed border-cyan-400/30"></div>
              <span className="text-right">
                {new Date(selectedUser?.updatedAt).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400 whitespace-nowrap">User ID</span>
              <div className="flex-1 border-b border-dashed border-cyan-400/30"></div>
              <span className="text-xs text-gray-500 break-all text-right">
                {selectedUser?._id}
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

      {/* Edit Modal */}
      <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-gradient-to-br from-cyan-900/40 to-black/40 backdrop-blur-xl border border-cyan-400/30 shadow-2xl rounded-2xl text-white">
          {/* Header */}
          <h3 className="text-2xl font-bold text-center text-cyan-300 mb-4 flex justify-center items-center gap-2">
            <PenLine />
            Update User
          </h3>

          {/* Form */}
          <form onSubmit={handleUpdate} className="space-y-3">
            {/* Name */}
            <div>
              <label className="text-sm text-cyan-300">Name</label>
              <input
                type="text"
                name="name"
                defaultValue={selectedUser?.name}
                className="input w-full bg-white/10 border border-cyan-400/30 focus:border-cyan-400 focus:outline-none text-white placeholder-gray-300"
                placeholder="Enter name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-cyan-300">Email</label>
              <input
                type="email"
                name="email"
                defaultValue={selectedUser?.email}
                className="input w-full bg-white/10 border border-cyan-400/30 focus:border-cyan-400 focus:outline-none text-white placeholder-gray-300"
                placeholder="Enter email"
              />
            </div>

            {/* Photo URL */}
            <div>
              <label className="text-sm text-cyan-300">Photo URL</label>
              <input
                type="text"
                name="photoURL"
                defaultValue={selectedUser?.photoURL}
                className="input w-full bg-white/10 border border-cyan-400/30 focus:border-cyan-400 focus:outline-none text-white placeholder-gray-300"
                placeholder="Enter photo URL"
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-sm text-cyan-300">Role</label>
              <select
                name="role"
                defaultValue={selectedUser?.role}
                className="select w-full bg-cyan-950 border border-cyan-400/30 focus:border-cyan-400 text-white"
              >
                <option value="user" className="text-white">
                  User
                </option>
                <option value="admin" className="text-white">
                  Admin
                </option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="btn flex-1 bg-cyan-500/50 hover:bg-cyan-600/50 border-none text-white rounded-full"
              >
                <SaveCheck />
                Update
              </button>

              <button
                type="button"
                onClick={() => document.getElementById("edit_modal").close()}
                className="btn flex-1 bg-red-500/50 hover:bg-red-600/50 border-none text-white rounded-full"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default UserManagement;
