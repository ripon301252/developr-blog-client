import axios from "axios";

const axiosPublic = axios.create({
    baseURL: "http://localhost:5000"
});

const useAxiosNormal = ()=>{
    return axiosPublic;
} 

export default useAxiosNormal;