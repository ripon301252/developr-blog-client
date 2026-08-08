import axios from "axios";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    // reqInterceptor
    const reqInterceptor = axiosSecure.interceptors.request.use( async (config) => {
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // resInterceptor
    const resInterceptor = axiosSecure.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.log(error);

       const statusCode = error.response?.status;
        if (statusCode === 401) {
          signOutUser().then(() => {
            navigate("/login");
          });
        }
        return Promise.reject(error);
      },
    );
    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [navigate, signOutUser, user]);

  return axiosSecure;
};

export default useAxiosSecure;



