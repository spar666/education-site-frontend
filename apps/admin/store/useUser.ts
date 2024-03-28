"use client";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserDetails, updateUserDetails } from "./userSlice";
const GET_ME_URL = `${process.env.NEXT_PUBLIC_API_URL}  + "user/profile"`

async function fetchUserDetails() {
  try {
    const response = await axios.get(GET_ME_URL);

    console.log(response, "hello world checking")
    console.log(response.data, "from home")
    return response.data 
  } catch (error) {
    throw error;
  }
}

function useUser() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname()

  const { isAuthenticated, user } = useSelector(selectUserDetails);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAuthenticated) {
          const userDetails = await fetchUserDetails();
          dispatch(updateUserDetails(userDetails));
        }
      } catch (error) {
        // Handle error
        console.error("Error fetching user details:", error);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/") {
      router.push("/");
    }
  }, [isAuthenticated]);

  return {
    data: user,
    user,
    isAuthenticated,
    userRole: user?.role,
    isSuperAdmin: user?.role === "superadmin",
    isAdmin: user?.role === "admin",
  };
}

export default useUser;
