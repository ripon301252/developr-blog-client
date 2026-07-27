import axios from "axios";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3000",
});

const useAxiosSecure = () => {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    // reqInterceptor
    const reqInterceptor = axiosSecure.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
      return config;
    });

    // resInterceptor
    const resInterceptor = axiosSecure.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.log(error);

        const statusCode = error.status;
        if (statusCode === 401) {
          signOutUser().then(() => {
            navigate("/login");
          });
        }
        return Promise.reject(error);
      },
    );
    return () => {
      axiosSecure.reqInterceptor.request.eject(reqInterceptor);
      axiosSecure.resInterceptor.response.eject(resInterceptor);
    };
  }, [navigate, signOutUser, user]);
};

export default useAxiosSecure;
