import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserDetails, updateUserDetails } from "./userSlice";

// Define the API endpoint URL for fetching user details
const GET_ME_URL = `${process.env.NEXT_PUBLIC_API_URL}/user/profile`;

// Asynchronous function to fetch user details from the API
async function fetchUserDetails() {
  try {
    const response = await axios.get(GET_ME_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Custom hook to manage user authentication state and fetch user details
function useUser() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  // Select user details and authentication state from Redux store
  const { isAuthenticated, user } = useSelector(selectUserDetails);

  // Effect hook to fetch user details when authentication state changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAuthenticated) {
          const userDetails = await fetchUserDetails();
          dispatch(updateUserDetails(userDetails));
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchData();
  }, [isAuthenticated, dispatch]);

  // Effect hook to redirect to login page if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated && pathname !== "/") {
      router.push("/");
    }
  }, [isAuthenticated, pathname, router]);

  // Return user data and authentication state
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