import React, { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useRole = () => {
    const {user} = useAuth();

    const [roleLoading, setRoleLoading] = useState(true);
    const [role, setRole] = useState("user");

    const axiosUseRole = useAxiosSecure();

    useEffect(()=> {
        if(!user?.email) return;

        const fetchRole = async () => {
            setRoleLoading(true)
            try{
                const res = await axiosUseRole.get(`/users/${user.email}`)
                const roleData = res.data;
                setRole(roleData?.role || "user")
                console.log("Fetched role:", roleData?.role || "user");
            }catch(error){
                console.error(error);
                setRole("user");
            }finally{
                setRoleLoading(false)
            }
        }

        fetchRole()

    }, [user?.email, axiosUseRole, setRoleLoading])

    return { role, roleLoading };
};

export default useRole;