import { Link } from "react-router";
import { FaLock } from "react-icons/fa";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="p-6 rounded-full bg-pink-100 text-pink-500">
          <FaLock className="text-5xl" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-red-600 text-center mb-3">
        You Are Forbidden to Access This Page
      </h1>

      {/* Subtitle */}
      <p className="text-gray-600 text-center mb-8">
        Please contact the administrator if you believe this is an error.
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        <Link
          to="/"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-md transition"
        >
          Go to Home
        </Link>
      {/* 
        <Link
          to="/dashboard"
          className="bg-[#073b4c] hover:bg-[#065061] text-white px-6 py-3 rounded-lg shadow-md transition"
        >
          Go to Dashboard
        </Link> */}
      </div>
    </div>
  );
};

export default Forbidden;
