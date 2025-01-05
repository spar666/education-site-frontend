import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCookie } from 'cookies-next';
import { selectUserDetails, updateUserDetails } from './userSlice';

const token = getCookie('accessToken');
async function fetchUserDetails(): Promise<any> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to fetch user details:', error.message);
      throw new Error(error.message);
    } else {
      console.error('An unexpected error occurred:', error);
      throw new Error('An unexpected error occurred');
    }
  }
}
// Custom hook to manage user authentication and user details
function useUser() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const token = getCookie('accessToken') as string | undefined;

  // Select user details and authentication state from Redux store
  const { isAuthenticated, user } = useSelector((state: any) =>
    selectUserDetails(state)
  );

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const userDetails = await fetchUserDetails();
          dispatch(updateUserDetails(userDetails));
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchData();
  }, [token, dispatch]);

  useEffect(() => {
    // Redirect to login page if not authenticated
    if (!isAuthenticated && pathname !== '/') {
      router.push('/');
    }
  }, [isAuthenticated, pathname, router]);

  // Return user-related data and flags
  return {
    user,
    isAuthenticated,
    userRole: user?.role,
    isSuperAdmin: user?.role === 'superadmin',
    isAdmin: user?.role === 'admin',
  };
}

export default useUser;
