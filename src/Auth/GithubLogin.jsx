// import React from "react";
// import useAxiosNormal from "../Hooks/useAxiosNormal";
// import { useAuth } from "../Hooks/useAuth";
// import { useLocation, useNavigate } from "react-router";
// import Swal from "sweetalert2";
// import { fetchSignInMethodsForEmail } from "firebase/auth";
// import { auth } from "../firebase.init";

// const GithubLogin = () => {
//   const axiosGithubLogin = useAxiosNormal();
//   const { signInGitHub, loading } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleGithubLogin = async () => {
//     try {
//       const res = await signInGitHub();
//       const user = res.user;

//       const email =
//         user.email || user.providerData[0]?.email || `${user.uid}@github.com`;

//       let dbUser = null;

//       try {
//         const response = await axiosGithubLogin.get(`/users/${email}`);
//         dbUser = response.data;
//       } catch (err) {
//         // যদি user না থাকে → ignore (new user)
//         if (err.response?.status !== 404) {
//           throw err;
//         }
//       }

//       // 🔥 SOFT WARNING (block না)
//       if (dbUser && !dbUser.providers?.includes("github")) {
//         await Swal.fire({
//           icon: "warning",
//           title: "Different Login Method",
//           text: "Previously you used Google. You can still continue with GitHub.",
//         });
//       }

//       const userInfo = {
//         email,
//         name: user.displayName,
//         photoURL: user.photoURL,
//         uid: user.uid,
//         provider: "github",
//       };

//       await axiosGithubLogin.post("/users", userInfo);

//       Swal.fire({
//         icon: "success",
//         title: "Login successful",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       navigate(location?.state?.from || "/");
//     } catch (err) {
//       if (err.code === "auth/account-exists-with-different-credential") {
//         Swal.fire({
//           icon: "warning",
//           title: "Account Exists",
//           text: "You already signed up with another method. Try that login.",
//         });
//         return; // 🔥 important
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Login Failed",
//           text: err.message,
//         });
//       }
//     }
//   };

//   return (
//     <button
//       onClick={handleGithubLogin}
//       disabled={loading}
//       className={`google-btn ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
//     >
//       <img
//         src="https://www.svgrepo.com/show/512317/github-142.svg"
//         alt="github"
//         className="w-5 h-5"
//       />
//       Continue with GitHub
//     </button>
//   );
// };

// export default GithubLogin;
