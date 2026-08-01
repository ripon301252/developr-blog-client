import axios from "axios";

const axiosPublic = axios.create({
    baseURL: "https://developr-blog-server.onrender.com"
});

const useAxiosNormal = ()=>{
    return axiosPublic;
} 

export default useAxiosNormal;