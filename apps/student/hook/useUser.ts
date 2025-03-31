import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCookie } from 'cookies-next';
import { selectUserDetails, updateUserDetails } from '../store/userSlice';

async function fetchUserDetails(token: string): Promise<any> {
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
      throw error; // Re-throw the error to handle it in the hook
    }
    console.error('An unexpected error occurred:', error);
    throw new Error('An unexpected error occurred');
  }
}

function useUser() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const token = getCookie('accessToken') as string | undefined;

  const { isAuthenticated, user } = useSelector(selectUserDetails);

  const userRoleInfo = useMemo(() => ({
    userRole: user?.role,
    isSuperAdmin: user?.role === 'superadmin',
    isAdmin: user?.role === 'admin',
  }), [user?.role]);

  useEffect(() => {
    let isMounted = true;

    const validateAuth = async () => {
      if (!token) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const userDetails = await fetchUserDetails(token);
        if (isMounted) {
          dispatch(updateUserDetails(userDetails));
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        if (isMounted) {
          setIsLoading(false);
          // Don't redirect here - let the second effect handle it
        }
      }
    };

    validateAuth();

    return () => {
      isMounted = false;
    };
  }, [token, dispatch]);

  useEffect(() => {
    if (isLoading) return;

    const publicPaths = ['/', '/auth/sign-in', '/auth/sign-up'];
    const isPublicPath = publicPaths.some(path => 
      pathname.startsWith(path) // Match paths that start with public paths
    );

    if (!token && !isPublicPath) {
      router.push('/');
    }
  }, [token, pathname, router, isLoading]);

  return {
    user,
    isLoading,
    isAuthenticated: !!token || isAuthenticated,
    ...userRoleInfo
  };
}

export default useUser;