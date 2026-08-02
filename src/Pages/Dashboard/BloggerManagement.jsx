import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const BloggerManagement = () => {
    //  blogger requests
  const [requests, setRequests] = useState([]);
  const axiosBlogRequests = useAxiosSecure();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axiosBlogRequests.get("/blogger-requests");

      setRequests(res.data.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };
    return (
        <div>
            
        </div>
    );
};

export default BloggerManagement;